speckit.taskstoissues agent — Local fallback scripts and usage

Purpose

This folder contains helper scripts and a small config used by the `speckit.taskstoissues` agent to optionally create GitHub issues locally (via the `gh` CLI) when a GitHub MCP server is not available.

Files

- `config.yaml` — agent configuration (preferred_method, auto_fallback, auto_run_local, local_script_dir, dry_run)
- `scripts/create_issues.ps1` — create issues from `.github/issues/001-owlbear-tasks.json` using `gh`.
- `scripts/apply_issues_depencies.ps1` — post "Blocked by" comments to wire dependencies using a created-issues mapping file.

Quick usage

1. Ensure `gh` is authenticated and available, and `pwsh` (PowerShell Core) is installed and on PATH.

2. Create issues (this prints a temporary map file path):

```powershell
pwsh .\.github\agents\speckit.taskstoissues\scripts\create_issues.ps1
```

3. Apply dependencies (use the map path printed by the previous command):

```powershell
pwsh .\.github\agents\speckit.taskstoissues\scripts\apply_issues_depencies.ps1 -mapFile C:\path\to\map.json
```

Configuration

Edit `.github/agents/speckit.taskstoissues/config.yaml` to control agent behaviour. Example keys:

- `preferred_method`: `mcp` or `local` — which approach to try first
- `auto_fallback`: `true` — if MCP fails, fallback to local scripts
- `auto_run_local`: `false` — if true, agent runs local scripts automatically; if false, it prints commands for the user
- `local_script_dir`: path (relative to repo root) where the scripts live
- `dry_run`: `true|false` — whether scripts should run in dry-run mode (scripts respect this only if implemented)

Security

- Do not commit credentials. Use `gh auth login` or set a PAT in your environment when running scripts.
- Review the temporary map file before passing it to the apply script if you want to audit behavior.

Notes

- Scripts are intentionally simple and documented; if you prefer cross-platform sh wrappers or a different language, add them alongside these scripts and update `config.yaml` accordingly.
