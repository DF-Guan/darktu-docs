# Agent-neutral preflight · Pilot v0.1

This repository is the **pilot**, not a central service and not a global install. The same `scripts/agent-sync.mjs` command can be invoked by any agent that can execute Node.js and Git, including Codex, OpenCode, Cursor, Claude Code, WorkBuddy, ZCode, and other tools. ChatGPT without a local terminal can inspect the same GitHub PR/Issue records through its connector, **but cannot see local uncommitted files**.

## Authority boundaries

- **Committed code baseline:** GitHub's existing default/base branch, not an agent's chat transcript.
- **Local work:** local Git working tree and index. Do not reset, clean, or auto-merge it.
- **Shared in-flight work:** open GitHub PRs, and Issues for advisory coordination. An Issue/PR is not an atomic distributed lock.
- **Project governance:** existing `agent.md`, `docs/feature_map.md`, and tests are the authority for this project. `AGENTS.md` is only a discovery pointer. Modern Web Guidance is advisory, not a replacement.
- **Release:** explicit user approval remains required.

## Usage in a local clone

Requirements: Node.js 18+, Git, access to `origin`, network access to `api.github.com`. No `gh` CLI or extra npm package is required. For a private repo, supply `GH_TOKEN` / `GITHUB_TOKEN` with read-only repository access; the token is not printed.

Run **from the repository root**, before editing, with paths relative to that root (from a subdirectory, invoke the script via its correct relative or absolute path):

```bash
node scripts/agent-sync.mjs preflight --paths src/index.js --paths src/styles/sidebar.css
node scripts/agent-sync.mjs preflight --paths src/index.js --json
```

Expected exit codes: `0` = checks passed; `2` = blocked or unverified. Even when green, the agent must still review relevant Issues, follow project rules, and re-check immediately before the PR.

The checker:
1. Reads current branch, HEAD SHA, dirty/untracked changes, recognized project rules, and GitHub repository identity from `origin` (without printing credential-bearing origin URLs).
2. Executes `git fetch --no-tags --prune origin` to refresh **remote Git references only**; no pull/merge/reset/clean and no change to project files.
3. Compares current HEAD against `origin/main` (or `--base <branch>`); blocks if behind or when working directly on the base branch.
4. Fetches open PRs and their changed-file lists via GitHub REST; blocks if another PR overlaps the declared paths. Displays open Issues for review.
5. Fails closed on unavailable remote/API, unknown origin, missing scope, or incomplete API pagination rather than claiming an all-clear.

Path overlap is intentionally **file/directory based**: it cannot prove semantic independence when two changes affect shared behavior in different files. It does not claim a lock or reveal another machine's uncommitted code. At the moment it only handles GitHub remotes, with `main` as the default base (override with `--base`).

## Agent workflow / handoff

- **Preflight:** share the checked path scope and current branch SHA; resolve blockers instead of suppressing them.
- **Start:** register the task on a GitHub Issue and create a separate branch; prefer an early draft PR so other agents can see the intended file scope.
- **Work:** preserve the local working tree and existing rules, tests, and published behavior.
- **Handoff:** in the PR description/comment, report task number, exact changed files, head commit SHA, tests executed, evidence, and next owner.
- **Close:** after approval and merging, local agents compare their HEAD with the new base SHA and safely reconcile their *own* local branch; there is no automatic sync to other devices.

## Actual pilot demonstration

- Existing unrelated PR: [sidebar accessibility #2](https://github.com/DF-Guan/darktu-docs/pull/2), touching `src/index.js` and `src/styles/sidebar.css`.
- `preflight --paths src/index.js` on a separate pilot branch must exit **2** with `REMOTE_PR_OVERLAP` and identify PR #2.
- `preflight --paths docs/agent-sync.md` must exit **0** (assuming a clean tree and current base); the pilot's **own** PR is excluded from the conflict list.
- With an untracked file, `preflight --paths docs/agent-sync.md` must exit **2** with `DIRTY_WORKTREE`, without deleting that file.
- CI runs these scenarios and existing project tests; a failing CI result means the demonstration has not passed.

This is **stage one**. No task-claim API, permanent agent scheduler, automatic branch merge, GitHub Ruleset installation, or cross-device real-time sync has been implemented.
