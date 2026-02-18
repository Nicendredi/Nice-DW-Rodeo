# Phase 0 Research: Dungeon World Character Sheet

## Decision: Vite + React + TypeScript frontend
- Rationale: Vite and React are required dependencies; TypeScript improves correctness for validation, i18n keys, and data models.
- Alternatives considered: Vite + React + JavaScript (less type safety for validation and i18n).

## Decision: i18next with JSON resource files (EN/FR)
- Rationale: i18next is already required and supports fallback-to-English, runtime language switching, and per-key localization for labels and move descriptions.
- Alternatives considered: Custom translation map without i18n library (would not meet dependency requirement).

## Decision: Local storage persistence with single character payload
- Rationale: Spec mandates single character storage, on-blur persistence, and no backend integration.
- Alternatives considered: IndexedDB (unnecessary complexity for single record).

## Decision: Validation model aligns with clarified constraints
- Rationale: Health and damage die constraints were clarified; attributes clamp to 1..20; name required; errors shown inline on blur.
- Alternatives considered: Allowing free-form values with warnings only (rejected by clarified requirements).

## Decision: Static moves and labels loaded from localized JSON
- Rationale: Moves are read-only reference data; storing them in local storage adds duplication and drift risk. Localized JSON keeps EN/FR strings in sync.
- Alternatives considered: Hardcoded strings in components (violates localization requirement).

## Decision: Testing with Vitest + React Testing Library
- Rationale: Both are required dependencies; supports TDD and accessible UI assertions.
- Alternatives considered: Jest (not required and adds extra config).
