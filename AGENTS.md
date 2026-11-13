# Cross-agent development entry (additive)

This entry is for agents that automatically read `AGENTS.md`. **It does not replace, weaken, or reinterpret the existing `agent.md` contract.**

1. First read `agent.md` and `docs/feature_map.md`. Keep the Dune architecture, existing test gates, and release approvals.
2. Before editing files, identify the intended paths and run `node scripts/agent-sync.mjs preflight --paths <relative-path>`. Repeat `--paths` for multiple areas.
3. If preflight reports **BLOCKED**, preserve local state and inspect the existing GitHub issues/PRs; do not duplicate work or overwrite files. An unavailable remote is not a green light.
4. Use an isolated work branch/worktree; report PR, commit SHA, executed tests, and remaining uncertainties in the handoff.
5. Never auto-merge, deploy, `git reset --hard`, `git clean -fd`, or overwrite uncommitted changes.

The checker is read-only with respect to working files. It updates remote-tracking references via `git fetch`, queries GitHub, and does **not** reserve tasks or synchronize other machines. See `docs/agent-sync.md`.
