# T13 — Customize speckit.taskstoissues agent for repo

Description:

Personalize the `speckit.taskstoissues` agent to support local fallback behavior, add `config.yaml`, and move helper scripts under `.github/agents/speckit.taskstoissues/`. This task is independent of feature implementation tasks and is intended to improve agent ergonomics for future specs.

Acceptance Criteria:

- The agent spec (`.github/agents/speckit.taskstoissues.agent.md`) documents the fallback behaviour and references `config.yaml` and local scripts.
- `config.yaml` exists at `.github/agents/speckit.taskstoissues/config.yaml` with sane defaults (`preferred_method`, `auto_fallback`, `auto_run_local`, `local_script_dir`).
- Helper scripts are present under `.github/agents/speckit.taskstoissues/scripts/` and are referenced by the agent spec.
- A README with usage instructions is present at `.github/agents/speckit.taskstoissues/README.md` describing how to run the local scripts and how to switch between MCP and local modes.

Estimate: 1 day

Notes:

This is an agent-maintenance task unrelated to the feature user stories; it improves the agent tooling and developer experience.
