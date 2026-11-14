/**
 * One-off live Github integration exercise for the cross-agent pilot branch.
 * Requires online GitHub access and an origin/main remote tracking ref.
 */
import assert from "node:assert/strict";
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { preflight, localSnapshot } from "../scripts/agent-sync.mjs";

const local = localSnapshot();
assert.equal(local.branch, "codex/agent-sync-preflight-pilot", "pilot test must run on its own branch");
assert.deepEqual(local.dirty, [], "start with a clean working tree");

const overlap = await preflight({ paths: ["src/index.js"] });
assert.equal(overlap.ready, false, "another open PR must block overlapping scope");
assert.ok(overlap.blocking.some((item) => item.includes("REMOTE_PR_OVERLAP: PR #2")), JSON.stringify(overlap.blocking));
console.log("✅ REMOTE_PR_OVERLAP: GitHub PR #2 detected for src/index.js");

const clear = await preflight({ paths: ["docs/agent-sync.md"] });
assert.equal(clear.ready, true, JSON.stringify(clear.blocking));
assert.ok(clear.openPRs.some((pr) => pr.number === 2));
assert.ok(clear.openIssues.some((issue) => issue.number === 1));
console.log("✅ CLEAN_SCOPE: unrelated path is ready and the open Issue is visible");

const dirtyPath = resolve(local.root, ".agent-sync-dirty-smoke");
try {
  writeFileSync(dirtyPath, "intentional uncommitted local work; must not be removed by preflight\n");
  const dirty = await preflight({ paths: ["docs/agent-sync.md"] });
  assert.equal(dirty.ready, false);
  assert.ok(dirty.blocking.some((item) => item.startsWith("DIRTY_WORKTREE:")), JSON.stringify(dirty.blocking));
  assert.equal(existsSync(dirtyPath), true, "dirty file must survive checker");
  console.log("✅ DIRTY_WORKTREE: uncommitted file blocked, preserved");
} finally {
  rmSync(dirtyPath, { force: true });
}
