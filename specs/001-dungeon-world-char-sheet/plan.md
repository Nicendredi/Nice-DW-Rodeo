# Implementation Plan: Dungeon World Character Sheet

**Branch**: `001-dungeon-world-char-sheet` | **Date**: 2026-02-18 | **Spec**: specs/001-dungeon-world-char-sheet/spec.md
**Input**: Feature specification from specs/001-dungeon-world-char-sheet/spec.md

## Summary

Build a Vite + React single-page character sheet with localized EN/FR labels and move descriptions, on-blur persistence to browser local storage, validation and clamping per DW SRD, and full keyboard/screen-reader accessibility.

## Technical Context

**Language/Version**: TypeScript (Vite + React)  
**Primary Dependencies**: Vite (MIT), React (MIT), i18next (MIT), Vitest (MIT), React Testing Library (MIT)  
**Storage**: Browser localStorage (single character record)  
**Testing**: Vitest + React Testing Library (TDD)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) on desktop/tablet; primary dev on Windows with VS Code and Firefox  
**Project Type**: Web application (single frontend)  
**Performance Goals**: Initial render under 2s (SC-001)  
**Constraints**: No backend, on-blur auto-save, bilingual UI strings, full a11y, open-source dependencies only  
**Scale/Scope**: Single character, single page, static moves data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- UI/UX First: Design doc exists at docs/design/001-dungeon-world-char-sheet/wireframes.md.
- Explicit Data Models: Data model defined at specs/001-dungeon-world-char-sheet/data-model.md.
- Test-First (TDD): Plan includes test cases before implementation; tests must be added before feature code.
- Bilingual Documentation: EN/FR i18n JSON required for labels and moves.
- PR-at-Start: ACTION REQUIRED - open a PR before implementation begins.
- Dependency license check: Vite (MIT), React (MIT), i18next (MIT), Vitest (MIT), React Testing Library (MIT). No non-OSS dependencies.

Mitigation: Create a draft PR prior to any implementation and link this plan and spec.

## Project Structure

### Documentation (this feature)

```text
specs/001-dungeon-world-char-sheet/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
public/

src/
├── components/
├── data/
│   ├── i18n/
│   ├── moves/
│   └── labels/
├── pages/
├── styles/
└── utils/

tests/
├── unit/
└── integration/
```

**Structure Decision**: Single web app using Vite with component/page separation and dedicated data folders for localized JSON resources.

## Phase 0: Research

Completed. See specs/001-dungeon-world-char-sheet/research.md.

## Phase 1: Design & Contracts

Completed:
- Data model updated at specs/001-dungeon-world-char-sheet/data-model.md.
- API contract drafted at specs/001-dungeon-world-char-sheet/contracts/character-sheet.openapi.yaml.
- Quickstart created at specs/001-dungeon-world-char-sheet/quickstart.md.

## Constitution Check (Post-Design)

- UI/UX First: Wireframes linked and unchanged.
- Explicit Data Models: Data model updated to match clarified validation rules.
- Test-First (TDD): Still required; to be satisfied in Phase 2 tasks before implementation.
- Bilingual Documentation: i18n contract and data-model require EN/FR strings.
- PR-at-Start: Still pending; must open before implementation.
- Dependency license check: No changes.

## Phase 2: Planning (Next Step)

Run /speckit.tasks to generate task breakdown and tests-first workflow.
