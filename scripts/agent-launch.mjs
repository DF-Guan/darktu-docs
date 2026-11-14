/**
 * Agent-neutral opt-in launcher. Runs a scoped preflight BEFORE spawning an agent.
 * No global settings, hooks, shell invocation, merge, reset, or deployment.
 */
import { spawn } from "node:child_process";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { preflight } from "./agent-sync.mjs";

export function parseLaunchArgs(args) {
  const delimiter = args.indexOf("--");
  if (delimiter === -1 || delimiter === args.length - 1) {
    throw new Error("Usage: node scripts/agent-launch.mjs --paths <file-or-dir> [--base main] -- <agent> [agent args...]");
  }

  const options = args.slice(0, delimiter);
  const command = args.slice(delimiter + 1);
  let base = "main";
  const paths = [];
  while (options.length) {
    const flag = options.shift();
    if (flag === "--paths" && options.length) {
      paths.push(...options.shift().split(","));
    } else if (flag === "--base" && options.length) {
      base = options.shift();
    } else {
      throw new Error(`Unknown or incomplete launch option: ${flag}`);
    }
  }
  if (!paths.length) throw new Error("At least one --paths scope is required");
  if (!command[0] || command[0].startsWith("-")) throw new Error("An executable must follow --");
  return { paths, base, command };
}

export async function launchAgent({
  cwd = process.cwd(), paths, base = "main", command,
  checker = preflight, spawnImpl = spawn, write = (s) => process.stderr.write(s),
}) {
  const result = await checker({ cwd, paths, base });
  for (const reason of result.blocking ?? []) write(`BLOCK: ${reason}\n`);
  for (const note of result.warnings ?? []) write(`NOTE: ${note}\n`);

  if (!result.ready) {
    write("Agent NOT started. Resolve preflight blockers without changing existing local work.\n");
    return 2;
  }

  write(`Preflight READY for ${result.repo ?? "repository"}; starting ${command[0]}.\n`);
  return new Promise((done) => {
    const child = spawnImpl(command[0], command.slice(1), {
      cwd, stdio: "inherit", shell: false,
    });
    child.once("error", (error) => {
      write(`Agent launch failed: ${error.code ?? error.message}\n`);
      done(1);
    });
    child.once("exit", (code, signal) => {
      done(signal ? 1 : (code ?? 1));
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    const { paths, base, command } = parseLaunchArgs(process.argv.slice(2));
    process.exitCode = await launchAgent({ paths, base, command });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
