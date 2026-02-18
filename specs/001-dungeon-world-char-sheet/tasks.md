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

### Tests for Phase 1

- [ ] T000 Create PR draft for Phase 1 setup; link to plan.md and spec.md for reference.
- [ ] T001 [P] Set up Vitest + React Testing Library; verify test runner works (create a test that checks if the Vite project has been initialized correctly : the test must fail initially).

### Implementation for Phase 1

- [ ] T002 Initialize Vite project with `npm create vite@latest -- --template react character-sheet`.
- [ ] T003 [P] Install dependencies: React, React DOM, react-i18next, TypeScript types.
- [ ] T004 [P] Configure ESLint and Prettier for code style consistency.
- [ ] T005 Create directory structure per plan.md: `src/components/`, `src/data/`, `src/i18n/`, `src/styles/`, `src/utils`, `tests/`.
- [ ] T006 [P] Create `src/localization/i18n.ts` with i18next config; set up language detection (en/fr).
- [ ] T007 [P] Copy the i18n JSON files from `docs/en/character-sheet/` and `docs/fr/character-sheet/` into `src/localization/en/` and `src/localization/fr/` respectively:
  - `src/localization/en/labels.json` (field labels, button text)
  - `src/localization/en/moves.json` (move names and descriptions)
  - `src/localization/fr/labels.json` (French translations)
  - `src/localization/fr/moves.json` (French move descriptions)
- [ ] T008 [P] Set up CSS structure: `src/styles/CharacterSheet.css`, `src/styles/responsive.css`.
- [ ] T009 Create base `src/App.tsx` and `src/main.tsx` entry point; confirm Vite dev server starts.

**Checkpoint**: Vite project running, dependencies installed, i18n configured, directory structure ready. Any developer can start writing tests for user stories.

---

## Phase 2: Setup Tests for Basic Utilities (Used by All User Stories)

**Purpose**: Core utility tests written first; implementations follow.

### Tests for Utilities

- [ ] T011 [P] [UTIL] Create test file `tests/unit/calculateModifier.test.ts`:
  - Test: `calculateModifier(10)` returns `0`.
  - Test: `calculateModifier(16)` returns `+2`.
  - Test: `calculateModifier(9)` returns `0`.
  - Test: `calculateModifier(3)` returns `-3`.
  - Test: `calculateModifier(18)` returns `+3`.
  - **Uses DW SRD table, not D&D formula.**
  - **THESE TESTS MUST FAIL** before implementation.

- [ ] T012 [P] [UTIL] Create test file `tests/unit/validation.test.ts`:
  - Test: `validateCharacterName("")` returns error.
  - Test: `validateCharacterName("Valid Name")` returns success.
  - Test: `validateHealth(0, 100)` returns success (0 is valid).
  - Test: `validateHealth(101, 100)` returns error (exceeds max).
  - Test: `validateAttributeValue(5)` returns success.
  - Test: `validateAttributeValue(25)` returns error.
  - **THESE TESTS MUST FAIL** before implementation.

- [ ] T013 [P] [UTIL] Create test file `tests/unit/moves.test.ts`:
  - Test: `getBasicMoves()` returns array of exactly 8 moves with id, name, description.
  - Test: `getSpecialMoves()` returns array of exactly 13 universal moves.
  - Test: Basic moves include: Hack and Slash, Volley, Defy Danger, Defend, Spout Lore, Discern Realities, Parley, Aid or Interfere.
  - Test: Special moves include: Last Breath, Encumbrance, Make Camp, Take Watch, Undertake a Perilous Journey, Level Up, End of Session, Carouse, Supply, Recover, Recruit, Outstanding Warrants, Bolster.
  - **All moves are universal; no class-specific filtering.**
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for Utilities

- [ ] T014 Implement `src/utils/calculateModifier.ts`:
  - Export `calculateModifier(attribute: number): number`.
  - Formula: Use DW SRD lookup table (1–3 → -3, 4–5 → -2, 6–8 → -1, 9–12 → 0, 13–15 → +1, 16–17 → +2, 18 → +3).
  - Tests T011 MUST PASS after implementation.

- [ ] T015 Implement `src/utils/validation.ts`:
  - Export `validateCharacterName(name: string): {valid: boolean; error?: string}`.
  - Export `validateHealth(current: number, max: number): {valid: boolean; error?: string}`.
  - Export `validateAttributeValue(value: number): {valid: boolean; error?: string}`.
  - Tests T012 MUST PASS after implementation.

- [ ] T016 Implement `src/utils/moves.ts`:
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
  - Use `useCharacterStore()` to get/set data.
  - Use i18n for labels.
  - Tests T017 MUST PASS.

- [ ] T021 Implement `src/components/CharacterSheet.tsx` (main container):
  - Render `<CharacterForm />` at the top.
  - Render placeholder sections for Attributes, Moves, Special Moves, Notes (to be implemented in later stories).
  - Tests covered by T017 (CharacterForm) and integration test.

- [ ] T022 [P] [US1] Update `src/App.tsx` to render `<CharacterSheet />`.

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
  - Test: Modifier for STR 3 displays "-3" in red (negative).
  - Test: Modifier for STR 10 displays "0" in gray (neutral).
  - Test: Modifier for STR 16 displays "+2" in green (positive).
  - **THESE TESTS MUST FAIL** before implementation.

### Implementation for US2

- [ ] T024 Implement `src/components/AttributesDisplay.tsx`:
  - Render a single-row, 6-column grid (per wireframes).
  - Each column: abbreviation (top; read-only), modifier (middle, visually dominant; read-only), full name (below; read-only), value (bottom; editable).
  - Use `calculateModifier()` from utils; update on change.
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

**Purpose**: Accessibility, responsive design, cross-browser testing, documentation.

### Integration & Accessibility

- [ ] T032 [P] Accessibility audit: test with NVDA (Windows) or VoiceOver (Mac) to ensure screen reader compatibility.
- [ ] T033 [P] Add ARIA labels to form fields and text areas for accessibility : aria-live="polite" for dynamic content like modifiers; role="alert" for error messages; ensure all inputs have associated labels.

### Responsive Design

- [ ] T034 [P] Implement `src/styles/responsive.css` for tablet (768px–1199px) and mobile (< 768px).
   - Test layout on iPad (landscape/portrait) and Android tablet.
   - Stack attributes into a 3x2 grid on smaller screens; allow moves sections to scroll.

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

- **Week 1**: Phase 1 (setup), Phase 2 (utilities), start Phase 3 (US1).
- **Week 2**: Finish US1; start US2 and US3 in parallel.
- **Week 3**: US4 (notes), Phase 7 (polish, accessibility, testing, documentation).

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
