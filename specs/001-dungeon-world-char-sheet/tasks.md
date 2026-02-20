A# Tasks: Dungeon World Character Sheet

**Input**: Design documents and spec from `/specs/001-dungeon-world-char-sheet/`  
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, wireframes.md

**Mode**: Test-First (TDD). Tests are WRITTEN and MUST FAIL before implementation begins.

**Organization**: Tasks are grouped by user story (US) to enable independent development and testing.

## Format: `[ID] [P?] [US#] Description`

- **[P]**: Can run in parallel (different files, no dependencies on other tasks).
- **[US#]**: Which user story this belongs to (US1–US4).
- Include exact file paths for tests and implementation.
- **RED → GREEN → REFACTOR**: Tests fail → implement to pass → refactor.

---

## Phase 1: Foundational Infrastructure (Blocking Prerequisites)

**Purpose**: Core project setup that MUST be complete before any user story work begins.

⚠️ **CRITICAL**: No user story work starts until Phase 1 is complete.

**📌 Constitution Note**: Per "Test-First (TDD, NON-NEGOTIABLE)" principle, T001 includes a failing test before implementation. Infrastructure tasks T002–T005 and T009 (Vite init, directory structure, entry point) are one-time setup operations and may be completed without explicit RED→GREEN tests. Configuration tasks T006–T008 (i18n, CSS, etc.) do not require failing tests first but MUST be verified to work correctly after implementation (e.g., "verify i18n loads correctly" after T006 completes).

### Tests for Phase 1

- [ ] T000 Create PR draft for Phase 1 setup; link to plan.md and spec.md for reference.
- [x] T001 [P] Set up Vitest + React Testing Library; verify test runner works. Create test `tests/integration/app-setup.test.tsx` that checks: (a) React test environment is initialized, (b) test utilities are available (@testing-library/react), (c) at least one component can be rendered and assertions can be made. Test must fail before Vite setup (T002-T003) is complete.

### Implementation for Phase 1

- [x] T002 Initialize Vite project at repo root with `npm create vite@latest . -- --template react`.
- [x] T003 [P] Install dependencies: React, React DOM, react-i18next, TypeScript types.
- [x] T004 [P] Configure ESLint and Prettier for code style consistency.
- [x] T005 Create directory structure per plan.md: `src/components/`, `src/data/`, `src/i18n/`, `src/styles/`, `src/utils`, `src/pages/Character/`, `tests/`.
- [x] T006 [P] Create `src/localization/i18n.ts` with i18next config; set up language detection (en/fr), English fallback, and missing-key logging (console warning).
- [x] T007 [P] Copy the i18n JSON files from `docs/en/character-sheet/` and `docs/fr/character-sheet/` into `src/localization/en/` and `src/localization/fr/` respectively:
  - `src/localization/en/labels.json` (field labels, button text)
  - `src/localization/en/moves.json` (move names and descriptions)
  - `src/localization/fr/labels.json` (French translations)
  - `src/localization/fr/moves.json` (French move descriptions)
- [x] T008 [P] Set up CSS structure: `src/styles/CharacterSheet.css`, `src/styles/responsive.css`.
- [x] T009 Create base `src/App.tsx` and `src/main.tsx` entry point; confirm Vite dev server starts.

**Checkpoint**: Vite project running, dependencies installed, i18n configured, directory structure ready. Any developer can start writing tests for user stories.

---

## Phase 2: Setup Tests for Basic Utilities (Used by All User Stories)

**Purpose**: Core utility tests written first; implementations follow.

### Tests for Utilities

- [x] T011 [P] [UTIL] Create test file `tests/unit/calculateModifier.test.ts`:
  - Test: `calculateModifier(10)` returns `0`.
  - Test: `calculateModifier(16)` returns `+2`.
  - Test: `calculateModifier(9)` returns `0`.
  - Test: `calculateModifier(3)` returns `-3`.
  - Test: `calculateModifier(18)` returns `+3`.
  - **Uses DW SRD table, not D&D formula.**
  - **THESE TESTS MUST FAIL** before implementation.

- [x] T012 [P] [UTIL] Create test file `tests/unit/validation.test.ts`:
  - Test: `validateCharacterName("")` returns `{valid: false, error: "i18n:error.name-required"}`.
  - Test: `validateCharacterName("Valid Name")` returns `{valid: true}`.
  - Test: `validateHealth(0, 100)` returns `{valid: true}` (0 is valid).
  - Test: `validateHealth(101, 100)` returns `{valid: false, error: "i18n:error.health-exceeds-max"}`.
  - Test: `validateAttributeValue(5)` returns `{valid: true, value: 5}`.
  - Test: `validateAttributeValue(25)` returns `{valid: true, value: 18}` (clamped).
  - Test: `validateAttributeValue(0)` returns `{valid: true, value: 1}` (clamped).
  - **Localization**: All error messages use i18n keys; tests verify keys are resolved to English/French strings.
  - **THESE TESTS MUST FAIL** before implementation.

- [x] T012a [P] [UTIL] Create test file `tests/integration/ValidationErrorDisplay.test.tsx`:
  - Test: When CharacterName field receives focus and loses focus with empty value, an error message "Character name is required" appears below the field.
  - Test: Error message is translated to French when language is "Français".
  - Test: Error element has `aria-live="polite"` attribute; screen readers announce error when displayed.
  - Test: Error has `role="alert"` and associates with input via `aria-describedby`.
  - Test: Error displays in red or warning color per accessibility contrast (WCAG AA: 4.5:1 ratio).
  - Test: Correcting the value (entering text) removes the error immediately.
  - **THESE TESTS MUST FAIL** before implementation.

- [x] T013 [P] [UTIL] Create test file `tests/unit/moves.test.ts`:
  - Test: `getBasicMoves()` returns array of exactly 8 moves with id, name, description.
  - Test: `getSpecialMoves()` returns array of exactly 13 universal moves.
  - Test: Basic moves include: Hack and Slash, Volley, Defy Danger, Defend, Spout Lore, Discern Realities, Parley, Aid or Interfere.
  - Test: Special moves include: Last Breath, Encumbrance, Make Camp, Take Watch, Undertake a Perilous Journey, Level Up, End of Session, Carouse, Supply, Recover, Recruit, Outstanding Warrants, Bolster.
  - **All moves are universal; no class-specific filtering.**
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for Utilities

- [x] T014 Implement `src/utils/calculateModifier.ts`:
  - Export `calculateModifier(attribute: number): number`.
  - Formula: Use DW SRD lookup table (1–3 → -3, 4–5 → -2, 6–8 → -1, 9–12 → 0, 13–15 → +1, 16–17 → +2, 18 → +3).
  - Tests T011 MUST PASS after implementation.

- [x] T015 Implement `src/utils/validation.ts`:
  - Export `validateCharacterName(name: string): {valid: boolean; error?: string}`.
  - Export `validateHealth(current: number, max: number): {valid: boolean; error?: string}`.
  - Export `validateAttributeValue(value: number): {valid: boolean; value: number; error?: string}` (clamps to [1, 18]).
  - Return i18n error keys (e.g., `error: "i18n:error.name-required"`) for use in component error display.
  - Tests T012 and T012a MUST PASS after implementation.

- [x] T016 Implement `src/utils/moves.ts`:
  - Export `getBasicMoves(): Move[]` returning exactly 8 core DW moves (no filtering).
  - Export `getSpecialMoves(): Move[]` returning exactly 13 universal special moves (no filtering).
  - Moves include: id, name, description (translate via i18n at UI layer).
  - **No class-specific logic; all characters get all moves.**
  - Tests T013 MUST PASS after implementation.

**Checkpoint**: All utility functions tested and working. Any component can now use these helpers with confidence.

---

## Phase 3: User Story 1 — Display Basic Character Information (Priority: P1) 🎯 MVP

**Goal**: Character info form renders, all fields editable, data persists to local storage.

**Independent Test**: Fill out character info form, refresh page, verify data persists.

### Tests for US1

- [ ] T017 [P] [US1] Create test file `tests/integration/CharacterForm.test.tsx`:
  - Test: Form renders with fields: Character Name, Player Name, Campaign, Class, Health (current/max), Damage Die.
  - Test: Editing Character Name field updates the displayed value.
  - Test: Entering max health as 30 and current health as 27 displays "27 / 30".
  - Test: Changing damage die from "d6" to "d10" updates the display immediately.
  - Test: Class dropdown renders exactly 8 options (Fighter, Wizard, Thief, Cleric, Ranger, Paladin, Bard, Druid).
  - Test: Form displays placeholder text: Character Name = "Enter character name", Damage Die = "d6", etc. per FR-001d.
  - Test: Character Name, Player Name, and Campaign inputs enforce `maxLength=100`.
  - **THESE TESTS MUST FAIL** before implementation.

- [ ] T017a [P] [US1] Add test case to `tests/integration/CharacterForm.test.tsx`:
  - Test: Language selector renders in the top-right of the CharacterForm header.
  - Test: Clicking selector and choosing "Français" updates all visible labels to French.
  - Test: Switching back to "English" reverts labels correctly.
  - Test: Language preference persists after page refresh (stored in localStorage).
  - **THESE TESTS MUST FAIL** before implementation.

- [ ] T017b [P] [US1] Add accessibility tests to `tests/integration/CharacterForm.test.tsx`:
  - Test: All form inputs have associated `<label>` or `aria-label` attributes.
  - Test: Tab order navigates through fields in logical sequence (left-to-right, top-to-bottom).
  - Test: All inputs have visible focus indicators when focused (outline, border, or highlight).
  - Test: No keyboard traps; user can tab away from any field.
  - **Aligns with FR-010 (MANDATORY accessibility); tests during component development per constitution TDD requirement.**
  - **THESE TESTS MUST FAIL** before implementation.

- [ ] T018 [P] [US1] Create test file `tests/hooks/useCharacterStore.test.ts`:
  - Test: `useCharacterStore()` initializes with default character (empty name, default class, etc.).
  - Test: `updateCharacter()` updates the store and triggers re-render.
  - Test: Persisting to local storage: after `updateCharacter()`, refresh and verify data is restored.
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for US1

- [ ] T019 Implement `src/hooks/useCharacterStore.ts`:
  - Export `useCharacterStore()` hook that manages character state via React Context.
  - Persist to browser local storage on blur.
  - Restore from local storage on mount.
  - Tests T018 MUST PASS.

- [ ] T020 Implement `src/components/CharacterForm.tsx`:
  - Render form with fields: Character Name, Player Name, Campaign, Class (dropdown), Health (two inputs), Damage Die (dropdown).
  - Class dropdown restricted to 8 standard classes (Fighter, Wizard, Thief, Cleric, Ranger, Paladin, Bard, Druid).
  - All fields display placeholder text per FR-001d (e.g., "Enter character name", "d6" for Damage Die).
  - Enforce maxLength=100 on Character Name, Player Name, and Campaign inputs.
  - Include language selector dropdown in the form header (top-right position); enable on-the-fly language switching; persist selection to local storage.
  - Accessibility: All inputs have associated `<label>` elements with `htmlFor`; tab order is logical (top-to-bottom, left-to-right); all elements have visible focus indicators (outline or underline).
  - Use `useCharacterStore()` to get/set data.
  - Use i18n for labels.
  - Tests T017, T017a, and T017b MUST PASS.

- [ ] T021 Implement `src/pages/Character/CharacterSheet.tsx` (main container):
  - Render `<CharacterForm />` at the top.
  - Render placeholder sections for Attributes, Moves, Special Moves, Notes (to be implemented in later stories).
  - Tests covered by T017 (CharacterForm) and integration test.

- [ ] T022 [P] [US1] Update `src/App.tsx` to render the character page (`<CharacterSheet />`).

**Checkpoint**: At this point, User Story 1 is fully functional. Users can fill out character info and it persists. Proceed to US2 independently.

---

## Phase 4: User Story 2 — Display and Calculate Attributes (Priority: P1)

**Goal**: 6 attributes render with auto-calculated modifiers using DW SRD table; editing attribute updates modifier immediately.

**Independent Test**: Enter attribute values, verify modifiers calculate correctly per DW SRD; refresh page, verify values persist.

### Tests for US2

- [ ] T023 [P] [US2] Create test file `tests/integration/AttributesDisplay.test.tsx`:
  - Test: Attributes section renders 6 attribute columns (STR, DEX, CON, INT, WIS, CHA).
  - Test: Each column shows abbreviation, modifier, full attribute name, and value.
  - Test: Entering STR 16 displays modifier "+2" (per DW SRD, not D&D).
  - Test: Changing CON from 14 (mod: +1) to 9 (mod: 0) updates modifier display.
  - Test: Entering STR 25 clamps to 18 and displays modifier "+3".
  - Test: Modifier for STR 3 displays "-3" in red (negative).
  - Test: Modifier for STR 10 displays "0" in gray (neutral).
  - Test: Modifier for STR 16 displays "+2" in green (positive).
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for US2

- [ ] T024 Implement `src/components/AttributesDisplay.tsx`:
  - Render a single-row, 6-column grid (per wireframes).
  - Each column: abbreviation (top; read-only), modifier (middle, visually dominant; read-only), full name (below; read-only), value (bottom; editable).
  - Use `calculateModifier()` from utils; update on change.
  - Clamp attribute values to [1, 18] on blur before saving.
  - Apply color coding: positive (green), negative (red), zero (gray) for modifier row.
  - Use i18n for attribute labels.
  - Connect to `useCharacterStore()` to persist changes.
  - Tests T023 MUST PASS.

- [ ] T025 [P] [US2] Update `src/components/CharacterSheet.tsx` to include `<AttributesDisplay />` after `<CharacterForm />`.

**Checkpoint**: User Story 2 fully functional. Attributes display with correct DW SRD modifiers and persist. Proceed to US3.

---

## Phase 5: User Story 3 — View All Moves (Priority: P2)

**Goal**: Lists of basic and special moves display with descriptions; read-only reference.

**Independent Test**: Verify all moves render with full descriptions; refresh page; verify no state changes required.

### Tests for US3

- [ ] T026 [P] [US3] Create test file `tests/integration/MovesSection.test.tsx`:
  - Test: Basic moves section renders 8 moves with names and descriptions.
  - Test: Special moves section renders 13 moves with names and descriptions.
  - Test: Move lists are read-only (no checkboxes or inputs).
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for US3

- [ ] T027 Implement `src/components/MovesSection.tsx`:
  - Render list of basic moves (from `getBasicMoves()`) with name + description.
  - Render list of special moves (from `getSpecialMoves()`) with name + description.
  - Use i18n for move names and descriptions.
  - No selection or tracking state.
  - Tests T026 MUST PASS.

- [ ] T028 [P] [US3] Update `src/components/CharacterSheet.tsx` to include `<MovesSection />` after `<AttributesDisplay />`.

**Checkpoint**: User Story 3 fully functional.

---

## Phase 6: User Story 4 — Free-Form Notes Section (Priority: P3)

**Goal**: Large textarea for notes; text persists to local storage.

**Independent Test**: Type notes; refresh; verify notes persist.

### Tests for US4

- [ ] T029 [P] [US4] Create test file `tests/integration/NotesSection.test.tsx`:
  - Test: Notes section renders with a large textarea.
  - Test: Typing "Seeking the legendary axe" updates the field.
  - Test: Notes text persists to store and survives refresh (500+ chars tested).
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for US4

- [ ] T030 Implement `src/components/NotesSection.tsx`:
  - Render large textarea for free-form notes.
  - Connect to `useCharacterStore()` to persist changes.
  - Tests T029 MUST PASS.

- [ ] T031 [P] [US4] Update `src/components/CharacterSheet.tsx` to include `<NotesSection />` at the bottom.

**Checkpoint**: User Story 4 fully functional.

---

## Phase 7: Cross-Cutting Concerns & Polish

**Purpose**: Full-system accessibility audit, responsive design, cross-browser testing, documentation.

**Note**: Component-level accessibility testing (keyboard nav, focus indicators, ARIA labels) is performed in Phase 3 (T017b). Phase 7 focuses on integration-level audit and cross-browser compatibility.

### Integration & Accessibility Audit

- [ ] T032 [P] Full-system accessibility audit: test complete character sheet with NVDA (Windows screen reader) to ensure all content is screen-reader compatible and accessible.
  - Verify error messages are announced when displayed.
  - Verify attribute modifiers and dynamic content updates are announced (aria-live regions).
  - Verify move descriptions are readable and properly structured.
  - Document any issues found; rework components if needed.

- [ ] T033 [P] Accessibility integration check: ensure ARIA attributes and focus management work across all components (CharacterForm, AttributesDisplay, MovesSection, NotesSection).
  - Verify all form inputs have labels and error messages are associated (aria-describedby).
  - Verify alert notifications use role="alert" and are announced by screen readers.
  - Verify live regions (aria-live) work correctly when attributes or dynamic content updates.
  - Test on at least two browsers per SC-004.

### Responsive Design

- [ ] T034 [P] Implement `src/styles/responsive.css` for desktop viewports (1920px+).
   - Deferred: Tablet/iPad responsive layout (768px–1199px) deferred to Phase 2+ per platform scope exception.

### Cross-Browser Testing

- [ ] T035 [P] Test on Chrome, Firefox, Safari, and Edge (latest versions).
   - Verify form inputs and local storage work on all browsers.

### Documentation & Final Touches

- [ ] T036 Create `docs/en/character-sheet/instructions.md` (user guide in English).
- [ ] T037 Create `docs/fr/character-sheet/instructions.md` (user guide in French).
- [ ] T038 [P] Update root `README.md` with a "Character Sheet" section and link to instructions.
- [ ] T039 Final code review: check code style (Prettier/ESLint), test coverage, performance.
- [ ] T040 Run `npm run build` and verify production bundle size is reasonable (< 500 KB).
- [ ] T041 Run Lighthouse performance audit; verify load time < 2s per SC-001.
- [ ] T041a [P] Verify interactive feedback timing (modifier updates, validation messages) is <= 100 ms on desktop browser (SC-008).
- [ ] T042 Document platform scope exception: Create `docs/changes/001-platform-scope.md` explaining the MVP decision to run Windows-only development and defer cross-platform CI/testing (Linux, macOS) and tablet responsive design to Phase 2 or later. Include compliance note linking to constitution override and justification. Add a PR compliance statement referencing this document.

**Checkpoint**: Feature complete, tested, documented, and ready for production.

---

## Dependencies & Execution Order

### Critical Path (Blocking)

1. **Phase 1** (T001–T010): Foundation setup. **No story work until complete.**
2. **Phase 2** (T011–T016): Utility tests + implementation.
3. **Phase 3** (T017–T022): US1 (Character Info) – MVP foundation.

### Parallel Opportunities (After Phase 1 Complete)

- **Phase 2 & 3 can overlap**: Utilities can be developed in parallel with US1.
- **US2–US4** can proceed in any order after Phase 3 completes (independent stories).
- **Phase 7 (Polish)** runs after US1–US4 complete.

### Suggested Execution Timeline

- **Week 1**: Phase 1 (setup), Phase 2 (utilities), start Phase 3 (US1). Component-level accessibility testing (T017b) starts during Phase 3.
- **Week 2**: Finish US1; start US2 and US3 in parallel. Accessibility implementation in each component (T020, T024, T027, T030).
- **Week 3**: US4 (notes), Phase 7 (full-system accessibility audit, cross-browser testing, documentation).

---

## Testing Philosophy: TDD

- **RED**: Write test; watch it fail.
- **GREEN**: Implement code; watch test pass.
- **REFACTOR**: Clean up; ensure all tests still pass.

Example (US1):
1. Write test for CharacterForm rendering (RED).
2. Implement CharacterForm component (GREEN).
3. Refactor component for clarity (tests still pass).

---

## Notes

- **[P]** = parallel-safe (no file conflicts, independent).
- **[US#]** = user story label for traceability.
- Each user story is independently testable and deployable.
- Commit after each completed task or logical group.
- Use conventional commit format: `test(component): add test for X` or `feat(component): implement X`.
