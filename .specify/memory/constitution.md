# Sync Impact Report
<!--
Version change: UNKNOWN -> 0.1.0

Modified principles (placeholders -> concrete):
- [PRINCIPLE_1_NAME] -> UI/UX First (Design & Wireframes)
- [PRINCIPLE_2_NAME] -> Explicit Data Models
- [PRINCIPLE_3_NAME] -> Test-First (TDD, NON-NEGOTIABLE)
- [PRINCIPLE_4_NAME] -> Small, Minimal Features
- [PRINCIPLE_5_NAME] -> Bilingual Documentation & PR-at-Start

Added sections:
- Additional Constraints (platform, license, security)
- Development Workflow (PR requirements, CI gating)

Removed sections: none

Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ missing (no commands directory)

Follow-up TODOs:
- None (ratified 2026-02-18)
-->

# Nice-DW-Rodeo Constitution

## Core Principles

### UI/UX First (Design & Wireframes)
Every new feature that includes a human-facing interface MUST start with a design document and, when practical, wireframes or mockups.
- Design artifacts MUST be stored under `docs/design/[feature-name]/` and linked from the feature spec.
- UI/UX decisions MUST be reviewed during the PR discussion; accessibility and clarity are primary concerns.
Rationale: design-first development reduces costly rework and ensures consistent, usable interfaces.

### Explicit Data Models
Every feature MUST define the data models it depends on before implementation.
- Data models MUST be stored in `specs/[feature]/data-model.md` or equivalent and include field names, types, and invariants.
- Any deviation from the documented data model in code or runtime behavior MUST be recorded in the repository (e.g., `docs/changes/[feature]-datamodel.md`).
Rationale: explicit data models make integration, testing, and maintenance predictable.

### Test-First (TDD, NON-NEGOTIABLE)
Unit tests MUST be written and checked into the feature branch before implementation begins; tests SHOULD fail initially (red) to validate the TDD cycle.
- CI MUST run unit tests on every push; failing tests MUST block merges.
- Contract and integration tests are REQUIRED for API or cross-module changes.
Rationale: TDD ensures clear acceptance criteria, reduces regressions, and documents expected behavior.

### Small, Minimal Features
Features MUST be as small as practical with minimal moving parts.
- Break work into independently testable increments; prefer several small PRs rather than a single large change.
- Keep public API surface minimal; add complexity only when required and justified.
Rationale: small changes are easier to review, test, and revert if necessary.

### Bilingual Documentation & PR-at-Start
All end-user documentation and human-facing UI strings MUST be available in English and French.
- Docs SHOULD live under `docs/en/` and `docs/fr/` (or feature-scoped equivalents) and be kept in sync.
- For UI text, internationalization patterns or files MUST be used to store translations.
Additionally, a pull request MUST be created at the start of any new feature implementation; the PR serves as the primary discussion and design record.
Rationale: bilingual support broadens accessibility; early PRs capture design discussions and decisions.

## Additional Constraints
- Platform support: development and CI MUST prioritize cross-platform compatibility (Windows, Linux). Platform-specific behavior MUST be documented.
- Licensing: Follow the repository `LICENSE` file for distribution and contribution rules.
- Security & Privacy: Do not add telemetry or data collection without explicit review and opt-in. Secrets MUST never be checked into the repo.

- Open-source dependencies: The project and its libraries SHOULD use dependencies that are open source and redistributable under permissive licenses (preferably MIT, Apache-2.0, or similarly permissive). Any dependency that is not open-source, not redistributable, or that has restrictive licensing MUST be explicitly documented in the feature spec and the repository.
	- Documentation MUST include: dependency name, version, license text or URL, reason for use, and a clear set of prerequisites and interface expectations required to replace it with an open alternative.
	- For such dependencies, authors MUST provide an abstraction/interface layer and a migration checklist describing how a replacement dependency could be swapped in.
	- The plan and spec gates (Constitution Check) MUST reference these documents so reviewers can evaluate replacement feasibility.

## Development Workflow
- Pull requests MUST include: a descriptive title, linked issue/spec, design artifacts (if UI), data model links, test changes (failing tests allowed at start), and a constitution compliance checklist.
- Code review: At least one maintainer or reviewer MUST approve changes that modify public APIs, data models, or user-facing interfaces.
- CI gating: All PRs MUST pass automated tests and linters before merge. For feature-start PRs where implementation is ongoing, a branch protection policy may allow draft PRs but tests and final approval are required before merge.
- Commit messages SHOULD follow conventional short form: `type(scope): short description`.

## Governance
- Constitution precedence: This document supersedes informal practices; deviations require explicit recorded exceptions.
- Amendment procedure:
	1. Open a proposal as a PR modifying this file and reference an issue describing the rationale.
	2. Discuss and iterate in the PR; reviewers MUST include at least one repository maintainer.
	3. A passed PR (merged) constitutes ratification of the amendment.
- Versioning policy: Bumps to `CONSTITUTION_VERSION` follow semantic rules:
	- MAJOR: removing or redefining principles in a backward-incompatible way.
	- MINOR: adding new principles or materially expanding guidance.
	- PATCH: clarifications, wording, typo fixes.
- Compliance review expectations: All changes that affect the constitution's scope (APIs, testing obligations, release process) MUST include a short compliance statement in the PR describing how the change adheres to or amends the constitution.

**Version**: 0.1.0 | **Ratified**: 2026-02-18 | **Last Amended**: 2026-02-18
