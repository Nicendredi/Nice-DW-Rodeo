---
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
tools: ['github/github-mcp-server/issue_write']
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").
1. From the executed script, extract the path to **tasks**.
1. Get the Git remote by running:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> ONLY PROCEED TO NEXT STEPS IF THE REMOTE IS A GITHUB URL

1. For each task in the list, use the GitHub MCP server to create a new issue in the repository that is representative of the Git remote.

> [!CAUTION]
> UNDER NO CIRCUMSTANCES EVER CREATE ISSUES IN REPOSITORIES THAT DO NOT MATCH THE REMOTE URL

---

Agent local fallback

This agent supports a local fallback mode when a GitHub MCP server is not available. If present, the agent reads `.github/agents/speckit.taskstoissues/config.yaml` to determine `preferred_method` and fallback policy. Local helper scripts live in `.github/agents/speckit.taskstoissues/scripts/` and can be used to create issues directly with the `gh` CLI.

Behavior summary:
- If `preferred_method: mcp` the agent will try MCP first (short timeout).
- If MCP fails and `auto_fallback: true` the agent validates local prerequisites (`gh` + PowerShell/`pwsh`) and either runs the local scripts automatically when `auto_run_local: true` or prints exact commands for the user to run.

The presence of `config.yaml` enables this fallback; when absent the agent keeps the original MCP-only behaviour.
