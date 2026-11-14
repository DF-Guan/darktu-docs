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

**Privacy when sharing results:** The CLI now omits the local absolute repository root and individual dirty/untracked filenames from output, substituting `local.dirtyCount`; absolute scope arguments and raw Git inspection diagnostics are redacted. Internal safety checks still use the complete local snapshot. Public Issue/PR comments must never include raw IDE/terminal transcripts, local usernames or paths, tokens, environment variables, private repository metadata, or information from unrelated projects. Review attachments and screenshots separately: no CLI sanitizer can guarantee that free-form Agent narratives or images are safe.

The checker:
1. Reads current branch, HEAD SHA, dirty/untracked changes, recognized project rules, and GitHub repository identity from `origin` (without printing credential-bearing origin URLs).
2. Executes `git fetch --no-tags --prune origin` to refresh **remote Git references only**; no pull/merge/reset/clean and no change to project files.
3. Compares current HEAD against `origin/main` (or `--base <branch>`); blocks if behind or when working directly on the base branch.
4. Fetches open PRs and their changed-file lists via GitHub REST; blocks if another PR overlaps the declared paths. Matches the current PR by branch or exact HEAD SHA (for renamed local review worktrees); a mismatch between the local and published head of the same PR blocks. Displays open Issues for review.
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

## Opt-in launcher for terminal-capable agents (stage two)

This is a **universal command wrapper**, not an automatic plugin installation. It works for CLI tools that are installed locally, and starts the executable **only after** the same preflight returns READY. It uses direct process spawning (`shell: false`) and forwards the agent's exit code. It changes no system shell configuration and never overwrites an IDE's existing hooks/settings.

First create or switch to a clean **working branch/worktree**. Starting from `main` will be intentionally blocked. Then, from the repository root:

```bash
node scripts/agent-launch.mjs --paths src/index.js -- codex
node scripts/agent-launch.mjs --paths docs/agent-sync.md -- opencode
node scripts/agent-launch.mjs --paths src/styles/sidebar.css -- claude
```

For additional CLI tools, replace only the executable after `--`. Additional flags for that tool follow its executable as usual.

**Windows CLI limitation:** Node's direct spawn supports native executables (such as `node.exe`), but npm-installed tools often expose `.cmd` shims, which may not start without a command processor. This launcher intentionally does **not** fall back to `shell: true` (which would require careful quoting and could expose command-injection risks). If an Agent is installed only as a `.cmd` shim, run `node scripts/agent-sync.mjs preflight --paths <scope>` first, then launch it through your normal trusted terminal until a separately tested Windows adapter is available. Windows CI validates native executable launch, **not** every third-party CLI shim. `--paths` may be repeated; the scope must describe every intended target. An IDE that is already running (Cursor/Antigravity etc.) **will not** be intercepted by this launcher. Such tools must explicitly execute the preflight via their supported project instruction or session hook; do not assume every agent follows `AGENTS.md` automatically. For Claude Code a `SessionStart` hook exists, but hook installation should be done separately after reviewing existing settings and security implications.

The launcher is an **intake gate**, not a continuous lock or synchronization engine. Run the checker again before submitting a PR. Dirty state on a continuing working session should be assessed and handed off, not automatically wiped.

## Proposed GitHub branch protection (NOT YET INSTALLED)

`.github/main-ruleset.json` is a **reviewable intended policy**, not an active GitHub setting simply because the file is committed. It targets the default branch, requires pull requests and the existing `verify` CI job, disallows force pushes and deletion, and requires **zero separate approvals** so a solo maintainer is not locked out. It adds no bypass actors. Strict up-to-date status checking is disabled to avoid rerunning the complete build for unrelated base changes; maintainers should still check the diff and compatibility.

This ChatGPT GitHub connector lacks the GitHub **Administration: write** operation, so it cannot create the Ruleset. A user with repository-admin access can activate it **once**, after verifying the job name in the PR Checks tab:

```bash
gh auth status
gh api repos/DF-Guan/darktu-docs/rulesets --jq '.[] | {id,name,enforcement}'
# Only if agent-sync-main-required-ci does not already exist:
gh api --method POST repos/DF-Guan/darktu-docs/rulesets --input .github/main-ruleset.json
gh api repos/DF-Guan/darktu-docs/rulesets --jq '.[] | {id,name,enforcement}'
```

Run these only from a trusted admin environment and only after reviewing the JSON. The REST API needs repository `Administration: write` authorization. To confirm enforcement, view the GitHub repository Settings → Rules → Rulesets and inspect `main`'s effective rules; the JSON file alone is **not proof**. Enabling a required check could block pre-existing PRs until that check is present on their current commit. No deployment, branch-protection write, or secret/token provisioning is performed by this repository code.

The shared PR CI currently runs on `pull_request` targeting `main`, not scheduled, and uses read-only permissions. Changes to the Ruleset should be separately reviewed and manually activated; do not silently turn a staged proposal into an active rule.
