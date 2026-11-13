import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { githubRepo, pathsOverlap, localSnapshot, remoteWork } from "../scripts/agent-sync.mjs";

test("GitHub URL formats are recognized without guessing local paths", () => {
  assert.equal(githubRepo("git@github.com:DF-Guan/darktu-docs.git"), "DF-Guan/darktu-docs");
  assert.equal(githubRepo("https://github.com/DF-Guan/darktu-docs.git"), "DF-Guan/darktu-docs");
  assert.equal(githubRepo("ssh://git@github.com/DF-Guan/darktu-docs"), "DF-Guan/darktu-docs");
  assert.equal(githubRepo("file:///somewhere/repo.git"), null);
  assert.equal(githubRepo("https://user:secret@github.com/DF-Guan/darktu-docs.git"), "DF-Guan/darktu-docs");
});

test("file and directory overlaps are specific", () => {
  assert.equal(pathsOverlap("src/index.js", "src/index.js"), true);
  assert.equal(pathsOverlap("src", "src/index.js"), true);
  assert.equal(pathsOverlap("src/index.js", "src/other.js"), false);
  assert.equal(pathsOverlap("src/index.js", "docs/index.js"), false);
});

test("local snapshot preserves a dirty worktree", () => {
  const root = mkdtempSync(join(tmpdir(), "agent-sync-test-"));
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  try {
    git("init", "-b", "pilot");
    git("config", "user.name", "Test Agent");
    git("config", "user.email", "test@example.invalid");
    git("remote", "add", "origin", "https://github.com/DF-Guan/darktu-docs.git");
    writeFileSync(join(root, "agent.md"), "# existing project contract\n");
    git("add", "agent.md");
    git("commit", "-m", "baseline");

    const before = localSnapshot(root);
    assert.equal(before.branch, "pilot");
    assert.deepEqual(before.dirty, []);
    assert.deepEqual(before.rules, ["agent.md"]);
    assert.equal(before.repo, "DF-Guan/darktu-docs");

    git("remote", "set-url", "origin", "https://user:secret@github.com/DF-Guan/darktu-docs.git");
    const credentialSafe = localSnapshot(root);
    assert.equal(credentialSafe.repo, "DF-Guan/darktu-docs");
    assert.doesNotMatch(JSON.stringify(credentialSafe), /secret/, "remote credentials must never be exposed");

    writeFileSync(join(root, "uncommitted.txt"), "do not overwrite\n");
    const after = localSnapshot(root);
    assert.equal(after.dirty.length, 1);
    assert.match(after.dirty[0], /uncommitted\.txt/);
    assert.equal(after.head, before.head, "the checker must not commit or reset changes");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("remote conflict checker sees other PR files and excludes its own PR", async () => {
  const calls = [];
  const responses = {
    "/repos/DF-Guan/darktu-docs/pulls?state=open&per_page=100": [
      { number: 2, title: "sidebar fix", html_url: "https://github.com/DF-Guan/darktu-docs/pull/2",
        head: { ref: "codex/modern-web-sidebar-a11y", repo: { full_name: "DF-Guan/darktu-docs" } } },
      { number: 3, title: "preflight", html_url: "https://github.com/DF-Guan/darktu-docs/pull/3",
        head: { ref: "codex/agent-sync-preflight-pilot", repo: { full_name: "DF-Guan/darktu-docs" } } },
    ],
    "/repos/DF-Guan/darktu-docs/issues?state=open&per_page=100": [
      { number: 1, title: "modernize", html_url: "https://github.com/DF-Guan/darktu-docs/issues/1" },
      { number: 2, pull_request: { url: "https://api.github.com/..." } },
    ],
    "/repos/DF-Guan/darktu-docs/pulls/2/files?per_page=100": [
      { filename: "src/index.js" }, { filename: "src/styles/sidebar.css" },
    ],
  };
  const fetcher = async (url) => {
    const key = new URL(url).pathname + new URL(url).search;
    calls.push(key);
    if (!(key in responses)) throw new Error(`unexpected request: ${key}`);
    return { ok: true, json: async () => responses[key] };
  };
  const result = await remoteWork({
    repo: "DF-Guan/darktu-docs",
    branch: "codex/agent-sync-preflight-pilot",
    paths: ["src/index.js"],
    fetcher,
  });
  assert.deepEqual(result.conflicts.map((x) => x.number), [2]);
  assert.deepEqual(result.conflicts[0].files, ["src/index.js"]);
  assert.deepEqual(result.openIssues.map((x) => x.number), [1]);
  assert.equal(calls.some((c) => c.includes("/pulls/3/files")), false, "self PR is excluded");

  const clean = await remoteWork({
    repo: "DF-Guan/darktu-docs",
    branch: "codex/agent-sync-preflight-pilot",
    paths: ["docs/agent-sync.md"],
    fetcher,
  });
  assert.deepEqual(clean.conflicts, []);
});

test("GitHub API inspection failures are never silently treated as no PRs", async () => {
  await assert.rejects(
    remoteWork({
      repo: "DF-Guan/darktu-docs",
      branch: "pilot",
      paths: ["src/index.js"],
      fetcher: async () => ({ ok: false, status: 403 }),
    }),
    /GitHub API 403/,
  );
});
