/**
 * Agent-neutral, read-only working-tree preflight.
 * Only "git fetch" changes Git metadata (remote-tracking refs), never working files.
 */
import { execFileSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const git = (cwd, ...args) => execFileSync("git", args, {
  cwd, encoding: "utf8", timeout: 30000, stdio: ["ignore", "pipe", "pipe"],
}).trim();

export function githubRepo(remote) {
  const match = remote.match(/^(?:https:\/\/(?:[^/@]+@)?github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return match?.[1] ?? null;
}

const normalize = (value) => value.replaceAll("\\", "/").replace(/^(\.\/)+/, "").replace(/\/+$/, "") || ".";
export function pathsOverlap(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  return left === "." || right === "." || left === right || left.startsWith(right + "/") || right.startsWith(left + "/");
}

export function localSnapshot(cwd = process.cwd()) {
  const root = git(cwd, "rev-parse", "--show-toplevel");
  const dirty = git(root, "status", "--porcelain=v1", "--untracked-files=all");
  return {
    root,
    branch: git(root, "branch", "--show-current"),
    head: git(root, "rev-parse", "HEAD"),
    repo: githubRepo(git(root, "remote", "get-url", "origin")),
    dirty: dirty ? dirty.split("\n") : [],
    rules: ["AGENTS.md", "agent.md", "CLAUDE.md", "docs/feature_map.md"]
      .filter((file) => existsSync(resolve(root, file))),
  };
}

export async function remoteWork({ repo, branch, headSha, paths, token, fetcher = fetch }) {
  const request = async (pathname) => {
    const response = await fetcher(`https://api.github.com/repos/${repo}${pathname}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "agent-sync-preflight",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status} for ${pathname}`);
    return response.json();
  };
  const prs = await request("/pulls?state=open&per_page=100");
  const issues = await request("/issues?state=open&per_page=100");
  if (prs.length === 100 || issues.length === 100) {
    throw new Error("100+ open PRs/issues: pagination required before safe preflight");
  }

  const conflicts = [];
  const ownPRHeadMismatches = [];
  for (const pr of prs) {
    const sameRepo = pr.head?.repo?.full_name === repo;
    if (sameRepo && pr.head?.ref === branch) {
      if (headSha && pr.head.sha && pr.head.sha !== headSha) {
        ownPRHeadMismatches.push({ number: pr.number, remoteHead: pr.head.sha });
      }
      continue;
    }
    // Local worktree review branches may have a different name but the same PR HEAD.
    if (sameRepo && headSha && pr.head?.sha === headSha) continue;
    const files = await request(`/pulls/${pr.number}/files?per_page=100`);
    if (files.length === 100) {
      throw new Error(`PR #${pr.number} has 100+ files: cannot verify overlap safely`);
    }
    const shared = [...new Set(files.flatMap(({ filename, previous_filename }) => [filename, previous_filename]
      .filter(Boolean)).filter((filename) => paths.some((path) => pathsOverlap(path, filename))))];
    if (shared.length) conflicts.push({ number: pr.number, url: pr.html_url, files: shared });
  }
  return {
    conflicts,
    ownPRHeadMismatches,
    openPRs: prs.map(({ number, title, html_url, head }) => ({
      number, title, url: html_url, branch: head?.ref,
    })),
    openIssues: issues.filter((issue) => !issue.pull_request)
      .map(({ number, title, html_url }) => ({ number, title, url: html_url })),
  };
}

export async function preflight({ cwd = process.cwd(), paths = [], base = "main", token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN, fetcher = fetch } = {}) {
  const blocking = [];
  const warnings = [];
  let local;
  try {
    local = localSnapshot(cwd);
  } catch (error) {
    return { ready: false, blocking: [`LOCAL_GIT_UNAVAILABLE: ${error.message}`], warnings };
  }

  const repo = local.repo;
  if (!repo) blocking.push("UNKNOWN_GITHUB_REMOTE: origin is not a recognized GitHub repository");
  if (!local.branch) blocking.push("DETACHED_HEAD: use an isolated named branch");
  if (local.branch === base) blocking.push("BASE_BRANCH: create a separate work branch");
  if (local.dirty.length) blocking.push(`DIRTY_WORKTREE: ${local.dirty.length} changed/untracked path(s)`);
  if (!paths.length) blocking.push("SCOPE_MISSING: pass --paths <path> for planned files");
  if (paths.some((p) => !p || p.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(p) || p.replaceAll("\\", "/").split("/").includes(".."))) {
    blocking.push("SCOPE_INVALID: paths must be relative to the repository root");
  }

  let baseHead = null;
  try {
    git(local.root, "fetch", "--no-tags", "--prune", "origin");
    baseHead = git(local.root, "rev-parse", `refs/remotes/origin/${base}`);
    const counts = git(local.root, "rev-list", "--left-right", "--count",
      `HEAD...refs/remotes/origin/${base}`).split(/\s+/).map(Number);
    if (counts[1] > 0) blocking.push(`STALE_BASE: local HEAD is missing ${counts[1]} commit(s) from origin/${base}`);
  } catch {
    blocking.push("REMOTE_BASE_UNVERIFIED: git fetch or base comparison failed; check origin and network");
  }

  let work = { conflicts: [], ownPRHeadMismatches: [], openPRs: [], openIssues: [] };
  if (repo) {
    try {
      work = await remoteWork({ repo, branch: local.branch, headSha: local.head, paths, token, fetcher });
      for (const mismatch of work.ownPRHeadMismatches) {
        blocking.push(`OWN_PR_HEAD_MISMATCH: local HEAD differs from PR #${mismatch.number} (${mismatch.remoteHead})`);
      }
      for (const conflict of work.conflicts) {
        blocking.push(`REMOTE_PR_OVERLAP: PR #${conflict.number} modifies ${conflict.files.join(", ")}`);
      }
      if (work.openIssues.length) warnings.push("Open issues are advisory; an Issue is not an atomic work lock");
    } catch (error) {
      blocking.push(`GITHUB_STATE_UNVERIFIED: ${error.message}`);
    }
  }
  warnings.push("Other agents' uncommitted local files cannot be detected remotely");
  return { ready: blocking.length === 0, repo, base, baseHead, paths, local, ...work, blocking, warnings };
}

/**
 * Public handoff output must never expose absolute workspace paths, untracked
 * local filenames, or raw CLI failure diagnostics. Internal preflight retains
 * the full snapshot for safety decisions.
 */
export function shareablePreflightReport(result) {
  const { local, ...rest } = result;
  return {
    ...rest,
    paths: (result.paths ?? []).map((path) => {
      const normalized = path.replaceAll("\\", "/");
      return normalized.startsWith("/") || /^[A-Za-z]:/.test(normalized) || normalized.split("/").includes("..")
        ? "<REDACTED_ABSOLUTE_PATH>" : path;
    }),
    blocking: (result.blocking ?? []).map((reason) => {
      if (reason.startsWith("LOCAL_GIT_UNAVAILABLE:")) return "LOCAL_GIT_UNAVAILABLE: local Git inspection failed";
      if (reason.startsWith("GITHUB_STATE_UNVERIFIED:")) return "GITHUB_STATE_UNVERIFIED: GitHub state inspection failed";
      return reason;
    }),
    local: local ? {
      repo: local.repo, branch: local.branch, head: local.head,
      dirtyCount: local.dirty?.length ?? 0, rules: local.rules,
    } : local,
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.shift() !== "preflight") {
    console.error("Usage: node scripts/agent-sync.mjs preflight --paths src/file.js [--paths other/file] [--base main] [--json]");
    process.exitCode = 2;
    return;
  }
  let base = "main";
  let json = false;
  const paths = [];
  while (args.length) {
    const flag = args.shift();
    if (flag === "--paths" && args.length) paths.push(...args.shift().split(","));
    else if (flag === "--base" && args.length) base = args.shift();
    else if (flag === "--json") json = true;
    else {
      console.error("Unknown or missing preflight option; expected --paths, --base, or --json");
      process.exitCode = 2;
      return;
    }
  }
  const result = await preflight({ paths, base });
  const report = shareablePreflightReport(result);
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Agent preflight: ${report.ready ? "READY" : "BLOCKED"} | ${report.repo ?? "unknown repo"} | ${report.local?.branch ?? "unknown branch"}`);
    for (const item of report.blocking) console.log(`BLOCK: ${item}`);
    for (const item of report.warnings) console.log(`NOTE: ${item}`);
    for (const pr of report.openPRs ?? []) console.log(`OPEN PR #${pr.number}: ${pr.title} (${pr.url})`);
    for (const issue of report.openIssues ?? []) console.log(`OPEN ISSUE #${issue.number}: ${issue.title} (${issue.url})`);
  }
  process.exitCode = result.ready ? 0 : 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  await main();
}
