import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("Junction/symlink CLI paths execute main instead of silently exiting 0", () => {
  const temp = mkdtempSync(join(tmpdir(), "agent-entry-junction-"));
  const alias = join(temp, "repo-alias");
  try {
    symlinkSync(resolve("."), alias, "junction");
    assert.notEqual(resolve(alias), realpathSync(alias), "test must exercise a real link");

    for (const script of ["scripts/agent-sync.mjs", "scripts/agent-launch.mjs"]) {
      let failure;
      try {
        execFileSync(process.execPath, [join(alias, script)], { encoding: "utf8", stdio: "pipe" });
      } catch (error) {
        failure = error;
      }
      assert.ok(failure, `${script} must not silently succeed without running CLI main`);
      assert.equal(failure.status, 2, `${script} must report an invalid invocation`);
      assert.match(failure.stderr, /Usage:/, `${script} must execute its CLI parser`);
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
