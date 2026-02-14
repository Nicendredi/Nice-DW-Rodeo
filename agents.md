# Custom Agents

This repository defines the following custom agents for GitHub Copilot. These agents are designed to support the Spec Kit workflow for software specification and implementation.

## Available Agents

| Agent | Command | Description |
|-------|---------|-------------|
| speckit.clarify | `/speckit.clarify` | Identify underspecified areas in the current feature spec by asking targeted clarification questions and encoding answers back into the spec |
| speckit.specify | `/speckit.specify` | Create or update project specifications |
| speckit.plan | `/speckit.plan` | Build a technical plan from the feature specification |
| speckit.tasks | `/speckit.tasks` | Create project tasks based on the implementation plan |
| speckit.implement | `/speckit.implement` | Guidance for implementing features according to the plan |
| speckit.constitution | `/speckit.constitution` | Create or update the project constitution (core principles, constraints, and decision framework) |
| speckit.analyze | `/speckit.analyze` | Analyze and review specifications for completeness and clarity |
| speckit.checklist | `/speckit.checklist` | Create a project checklist or validation checklist |
| speckit.taskstoissues | `/speckit.taskstoissues` | Convert tasks from the plan into GitHub Issues |

## Usage

To use these agents in GitHub Copilot:

1. **In VS Code with Copilot Chat**: Type `/speckit.` to see available commands or type a full command like `/speckit.specify`
2. **On GitHub.com**: Reference the agent name when requesting Copilot assistance
3. **Agent Files**: Implementation details can be found in `.github/agents/` directory
4. **Prompts**: Associated prompt files are in `.github/prompts/` directory

## Workflow

The recommended workflow for using these agents:

```
1. /speckit.specify    → Create initial specification
   ↓
2. /speckit.clarify    → Ask clarification questions and refine spec
   ↓
3. /speckit.plan       → Generate implementation plan
   ↓
4. /speckit.tasks      → Break plan into discrete tasks
   ↓
5. /speckit.implement  → Get implementation guidance
   ↓
6. /speckit.taskstoissues → Convert tasks to GitHub Issues
```

## Additional Resources

- **Specification Templates**: See `.specify/templates/` for spec templates
- **Scripts**: Automation scripts in `.specify/scripts/powershell/` and `.specify/scripts/bash/`
- **VS Code Settings**: See `.vscode/settings.json` for Copilot configuration

## Notes

- These agents work with GitHub Copilot Free, Pro, and Pro+ plans
- Free plan includes 50 agent mode requests per month
- Pro and Pro+ plans include unlimited agent mode requests
- Custom instructions and agents are supported across all Copilot subscription tiers
