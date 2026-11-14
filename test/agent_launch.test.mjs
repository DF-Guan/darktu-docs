import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { parseLaunchArgs, launchAgent } from "../scripts/agent-launch.mjs";

test("launcher parses multiple paths and agent arguments without a shell", () => {
  assert.deepEqual(
    parseLaunchArgs(["--paths", "src/index.js", "--paths", "src/styles", "--", "codex", "--model", "gpt-6"]),
    { paths: ["src/index.js", "src/styles"], base: "main", command: ["codex", "--model", "gpt-6"] }
  );
  assert.throws(() => parseLaunchArgs(["--paths", "src/index.js", "codex"]), /Usage/);
  assert.throws(() => parseLaunchArgs(["--", "codex"]), /--paths/);
});

test("blocked preflight never launches agent", async () => {
  let launched = false;
  const messages = [];
  const code = await launchAgent({
    paths: ["src/index.js"], command: ["codex"],
    checker: async () => ({
      ready: false,
      blocking: ["REMOTE_PR_OVERLAP: PR #2 modifies src/index.js"],
      warnings: ["Other uncommitted work remains invisible"],
    }),
    spawnImpl: () => { launched = true; throw new Error("must not launch"); },
    write: (message) => messages.push(message),
  });
  assert.equal(code, 2);
  assert.equal(launched, false);
  assert.match(messages.join(""), /REMOTE_PR_OVERLAP/);
});

test("clean preflight launches exactly the requested executable and propagates exit code", async () => {
  const calls = [];
  const child = new EventEmitter();
  const codePromise = launchAgent({
    cwd: "/tmp/project",
    paths: ["docs/agent-sync.md"], command: ["opencode", "--print", "hello"],
    checker: async ({ cwd, paths, base }) => {
      assert.equal(cwd, "/tmp/project");
      assert.deepEqual(paths, ["docs/agent-sync.md"]);
      assert.equal(base, "main");
      return { ready: true, repo: "DF-Guan/darktu-docs", blocking: [], warnings: [] };
    },
    spawnImpl: (name, args, options) => {
      calls.push({ name, args, options });
      return child;
    },
    write: () => {},
  });
  queueMicrotask(() => child.emit("exit", 7, null));
  assert.equal(await codePromise, 7);
  assert.deepEqual(calls[0].args, ["--print", "hello"]);
  assert.equal(calls[0].name, "opencode");
  assert.equal(calls[0].options.shell, false);
  assert.equal(calls[0].options.stdio, "inherit");
});

test("clean preflight failing to spawn reports error instead of claiming success", async () => {
  const child = new EventEmitter();
  const p = launchAgent({
    paths: ["."], command: ["missing-agent"],
    checker: async () => ({ ready: true, blocking: [], warnings: [] }),
    spawnImpl: () => child,
    write: () => {},
  });
  queueMicrotask(() => child.emit("error", Object.assign(new Error("not found"), { code: "ENOENT" })));
  assert.equal(await p, 1);
});
