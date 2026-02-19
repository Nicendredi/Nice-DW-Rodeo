# Feature Specification: Dungeon World Character Sheet

**Feature Branch**: `001-dungeon-world-char-sheet`  
**Created**: 2026-02-18  
**Status**: Draft  
**Design Record**: [GitHub PR #21](https://github.com/Nicendredi/Nice-DW-Rodeo/pull/21) (design discussion and acceptance)  
**Input**: User description: "Build a simple page that will display a Dungeon World Character Sheet using Vite. Display the character name, player name, campaign, class, health points, damage die, the 6 attributes with their modifiers (per DW SRD), all basic moves, all special moves, and a notes area."

---

## Design & Data Model Requirements (CONSTITUTION)

- Design document with wireframes: [docs/design/001-dungeon-world-char-sheet/wireframes.md](../../docs/design/001-dungeon-world-char-sheet/wireframes.md)
- Data model specification: [specs/001-dungeon-world-char-sheet/data-model.md](./data-model.md) (follows Dungeon World SRD v1.1)
- Localization requirements: All UI labels, descriptions, and move names available in **English and French**.
  - English strings: `docs/en/character-sheet/`
  - French strings: `docs/fr/character-sheet/`
- Dependency licensing: All dependencies are open-source (MIT, Apache-2.0, or similar). No restricted dependencies at this time.
- **Note**: This feature displays the digital character sheet only. Printing is out of scope and handled separately.

---

## Clarifications

### Session 2026-02-18

- Q: How should out-of-range attribute values be handled? → A: Clamp to range 1–18 automatically.
- Q: How should current health values above max health be handled? → A: Reject input and show inline validation error until corrected.
- Q: Should a character name be required or optional? → A: Required; empty name shows inline validation error.
- Q: What should happen when a translation key is missing? → A: Fall back to English.
- Q: Should the selected language persist across reloads? → A: Persist selected language in local storage.
- Q: Should the application support multiple characters or a single character? → A: Single character only (one character stored in local storage, can be edited/replaced).
- Q: Should auto-save happen on blur or another trigger? → A: On field blur (after user leaves field).
- Q: What level of accessibility support is required? → A: Full support (keyboard navigation, screen reader, ARIA labels, focus management).
- Q: How should validation errors be displayed to the user? → A: Inline errors beside/below each field, shown on blur or submit attempt.
- Q: What should the initial state be for a first-time user (no saved data)? → A: Empty fields with placeholders.
- Q: What are valid health ranges? → A: Current health is 0..Max (inclusive); Max health is >= 1.
- Q: What values are allowed for Damage Die? → A: Restrict to standard dice: d4, d6, d8, d10, d12.
- Q: Should move names and descriptions be localized? → A: Localize all move names and descriptions in EN/FR.
- Q: How should Class be selected? → A: Restrict to the 8 standard classes (dropdown only).

---

## User Scenarios & Testing (MANDATORY)

### User Story 1 — Display Basic Character Information (Priority: P1)

**Description:**
A player opens the character sheet page and sees a form header displaying the character's name, player name, campaign, class, health (current/max), and damage die. The player can view and edit each field.

**Why this priority:**
Foundation of the feature; all other sections depend on character info being visible and editable.

**Independent Test:**
The character sheet renders with all header fields populated and editable; saving any field update persists and re-renders correctly.

**Acceptance Scenarios:**

1. **Given** a first-time user with no saved data, **When** I load the page, **Then** I see a form with empty fields and placeholder text for Character Name, Player Name, Campaign, Class, Health, and Damage Die.
2. **Given** I fill in "Thorgrim Ironfoot" in Character Name, **When** I click elsewhere (blur), **Then** the name persists to local storage and displays at the top of the page.
3. **Given** I change the Class field, **When** I blur the field, **Then** the class name saves to local storage and displays correctly.
4. **Given** I open the page in English, **When** I click the language selector in the top-right and choose "Français", **Then** all labels, move names, and descriptions update to French without page reload.

**Pass/Fail Criteria:**
- All header fields render with labels and placeholders per FR-001d.
- Class and Damage Die are dropdowns restricted to allowed options.
- Blurring a valid field persists the change to local storage and reload restores it.
- Language selection updates UI strings immediately and persists across reloads.

---

### User Story 2 — Display and Calculate Attributes (Priority: P1)

**Description:**
The player sees the 6 core attributes (STR, DEX, CON, INT, WIS, CHA) displayed on a single line across the full width. Each attribute shows its full name as the label and value, with the three-letter abbreviation and auto-calculated modifier displayed separately according to the Dungeon World SRD table.

**Why this priority:**
Attributes are fundamental to gameplay mechanics and used in move resolution; must be accurate and always visible.

**Independent Test:**
Entering an attribute value (e.g., 16) automatically calculates and displays the correct modifier (+2 per DW SRD); entering another value updates the modifier instantly.

**Acceptance Scenarios:**

1. **Given** a character with Charisma 16, **When** I look at the attributes section, **Then** I see "CHA" above "+2", with "Charisma" and "16" below on the same column.
2. **Given** a character with Intelligence 9, **When** I look at the Intelligence column, **Then** I see "INT" above "-1" with the modifier in red (negative).
3. **Given** a character with Wisdom 13, **When** I look at the Wisdom column, **Then** I see "WIS" above "+1" with "Wisdom" and "13" below.
4. **Given** I edit an attribute from 12 to 15 in the form, **When** the field updates, **Then** the modifier changes from 0 to +1 automatically per DW SRD.

**Placeholder Values (First-Time User):**
For first-time users with no saved data, attributes display with placeholder values in order (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma): 8, 12, 15, 9, 13, 16. These values showcase the modifier range across the DW SRD table and provide a sensible starting point for players to edit.

**Pass/Fail Criteria:**
- Six attribute columns render in a single row at desktop widths (see FR-002).
- Modifiers update immediately when values change and match the DW SRD table.
- Out-of-range values clamp to [1, 18] on blur without error.

---

### User Story 3 — View All Available Moves (Priority: P2)

**Description:**
The player sees two sections: Basic Moves (all available to any character) and Special Moves (out-of-combat and special moves available to any character). Each move displays its name and full description/trigger. No checkboxes, selections, or filtering; moves are displayed for reference and reading during gameplay.

**Why this priority:**
Moves are core to gameplay; players need quick access to all available actions and their triggers to make informed decisions during play.

**Independent Test:**
Load the page; see all basic moves listed with descriptions; scroll through special moves and verify descriptions are readable and complete per Dungeon World SRD.

**Acceptance Scenarios:**

1. **Given** the character sheet page, **When** I scroll to Moves, **Then** I see all 8 basic moves (Hack and Slash, Volley, Defy Danger, Defend, Spout Lore, Discern Realities, Parley, Aid or Interfere) with descriptions.
2. **Given** I scroll further, **When** I see Special Moves section, **Then** I see all special moves (Last Breath, Encumbrance, Make Camp, Take Watch, Undertake a Perilous Journey, Level Up, End of Session, Carouse, Supply, Recover, Recruit, Outstanding Warrants, Bolster) with descriptions.
3. **Given** a move displayed, **When** I read the description, **Then** the trigger/condition matches the official Dungeon World SRD.
4. **Given** any move on the sheet, **When** I look for checkboxes or selection controls, **Then** I see none; moves are read-only reference material.

**Pass/Fail Criteria:**
- Basic Moves list renders exactly 8 moves.
- Special Moves list renders exactly 13 moves.
- Move entries are read-only and include localized name + description.

---

### User Story 4 — Free-Form Notes Section (Priority: P3)

**Description:**
The player has a large text area to record inventory, story notes, house rules, or other character details. Notes persist to browser local storage.

**Why this priority:**
Nice-to-have; doesn't block core gameplay. Provides space for players to track personal character information.

**Independent Test:**
Type text into the notes area; refresh the page; confirm the text persists (stored in browser local storage).

**Acceptance Scenarios:**

1. **Given** an empty notes section, **When** I type "Seeking the legendary axe of Duranthax", **Then** the text appears in the area.
2. **Given** typed notes, **When** I refresh the page, **Then** the notes persist exactly as entered.
3. **Given** a large block of notes (500+ chars), **When** I save and reload, **Then** the entire text is preserved.

**Pass/Fail Criteria:**
- Notes textarea renders and accepts multi-line input.
- Notes persist on blur and restore on reload.

---

### Edge Cases

- Attribute value outside 1–18: clamp to nearest bound on blur, update modifier, save clamped value, no error.
- Health current > max: reject input, show inline error, block save until corrected.
- Health max < 1: reject input, show inline error, block save until corrected.
- Name empty: show inline error, block save until corrected.
- Text fields > 100 chars: prevent further input (via maxLength); if persisted data exceeds 100, truncate on load and save truncated value.
- Damage Die outside allowed list: disallow selection; if persisted data is invalid, fall back to d6 and save.
- Missing translation keys: fall back to English for missing keys and log a console warning.
- Partial locale files: fall back to English per missing key; mixed-language UI is acceptable and expected during fallback.
- Navigation away: no warning; auto-save on blur only.
- Move ordering: moves render in the order defined in moves.json; updates to JSON order reflect in UI order.

---

## Requirements (MANDATORY)

### Functional Requirements

- **FR-001**: System MUST display a form header with the following character info fields: Character Name, Player Name, Campaign, Class (dropdown), Current Health, Max Health, Damage Die (dropdown). Header takes full width of the page. For first-time users with no saved data, all fields MUST be empty with helpful placeholder text.
- **FR-001d**: System MUST use the following placeholders: "Enter character name", "Enter player name", "Enter campaign", "Bard", "0", "1", "d6".
- **FR-001c**: System MUST present Class as a dropdown restricted to the 8 standard classes (Fighter, Wizard, Thief, Cleric, Ranger, Paladin, Bard, Druid).
- **FR-001b**: System MUST present Damage Die as a dropdown (select control) restricted to: d4, d6, d8, d10, d12. (See FR-001c for Class dropdown pattern precedent.)
- **FR-001a**: System MUST validate health ranges: Current Health is allowed from 0 to Max Health (inclusive); Max Health MUST be at least 1.
- **FR-001e**: Character Name is required and must be 1–100 characters. Player Name and Campaign are optional and must be 0–100 characters. Inputs MUST enforce a max length of 100 characters.
- **FR-001f**: Class selection MUST store canonical enum values (Fighter, Wizard, Thief, Cleric, Ranger, Paladin, Bard, Druid). Display labels may be localized, but stored values remain canonical.
- **FR-001g**: Damage Die selection MUST store canonical enum values (d4, d6, d8, d10, d12). Display labels may be localized, but stored values remain canonical.
- **FR-002**: System MUST display the 6 core attributes (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) on a single line across the full width at desktop widths (>= 1280px). Each attribute shows full name as label, value (1–18), three-letter abbreviation (STR, DEX, CON, INT, WIS, CHA), and calculated modifier. For first-time users, attribute values should be empty with placeholders; modifiers display when values are entered. For smaller widths, horizontal scrolling is acceptable; a 3x2 layout is not required for MVP.
- **FR-002a**: Attribute inputs MUST clamp to the range 1–18 on blur. The clamped value is saved and used to compute the modifier. No validation error is shown for out-of-range attribute input.
- **FR-002b**: Attribute placeholders MUST use the values (STR, DEX, CON, INT, WIS, CHA): 8, 12, 15, 9, 13, 16.
- **FR-003**: System MUST calculate and display attribute modifiers using the Dungeon World SRD table: 1–3 → -3, 4–5 → -2, 6–8 → -1, 9–12 → 0, 13–15 → +1, 16–17 → +2, 18 → +3.
- **FR-004**: System MUST display all 8 basic moves (per DW SRD) with names and full descriptions. NO checkboxes or selection controls.
- **FR-005**: System MUST display all 13 special moves (per DW SRD: Last Breath, Encumbrance, Make Camp, Take Watch, Undertake a Perilous Journey, Level Up, End of Session, Carouse, Supply, Recover, Recruit, Outstanding Warrants, Bolster) with names and full descriptions. These moves apply to all characters; no class-specific filtering.
- **FR-006**: System MUST provide a large text area for free-form notes (no character limit enforced; UI may scroll).
- **FR-007**: System MUST persist a single character's data to browser local storage so that refreshing the page retains all entered data. Only one character is supported; editing replaces the existing character. Changes MUST be saved automatically on field blur (when user leaves a field). **CRITICAL**: If a field is invalid, the save is blocked and an inline error message displays below the field until the user corrects the value. Valid data only is persisted.
- **FR-007a**: Persistence MUST apply to all editable fields: Character Name, Player Name, Campaign, Class, Current Health, Max Health, Damage Die, the six attributes, and Notes.
- **FR-008**: System MUST support English and French labels, move descriptions, and all UI strings; localization strings MUST be stored separately (i18n files); user can switch languages without page reload; missing translation keys MUST fall back to English; selected language MUST persist in local storage.
- **FR-008b**: Localization deliverables MUST include field labels, move names, move descriptions, validation error messages, and general UI strings.
- **FR-008c**: Missing translation keys MUST fall back to English and SHOULD log a console warning for debugging.
- **FR-008a**: System MUST provide a language selector control (dropdown or toggle button) in the top-right of the page header. Selecting "Français" or "English" updates all UI text, move names, and descriptions immediately without page reload. Selected language persists in local storage.
- **FR-009**: System MUST be built using Vite for development and production builds.
- **FR-010**: System MUST support full accessibility: keyboard navigation (tab order, focus indicators), screen reader compatibility (ARIA labels, roles, live regions for dynamic content), and proper focus management (no keyboard traps, logical tab order).
- **FR-010a**: Accessibility requirements MUST include: all inputs have associated labels; focus is clearly visible; error messages use `role="alert"` and `aria-live="polite"`; `aria-describedby` associates inputs with errors; and color contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
- **FR-011**: System MUST display validation errors inline (directly below or beside the invalid field) when the user leaves the field (on blur) or attempts to submit. Error messages MUST be localized and accessible to screen readers.

### Key Entities

- **Character**: central entity containing all player-facing data (name, player, campaign, class, attributes, health, damage die, notes).
- **Attribute**: represents one of the 6 core Dungeon World attributes with automatic modifier calculation per DW SRD table.
- **Move (Basic)**: predefined set of 8 core Dungeon World moves applicable to any character.
- **Move (Special)**: predefined set of special and out-of-combat moves applicable to any character.

---

## Success Criteria (MANDATORY)

### Measurable Outcomes

- **SC-001**: Character sheet loads in under 2 seconds using Lighthouse Desktop with throttling set to 10 Mbps download, 3 Mbps upload, 50 ms RTT.
- **SC-002**: All form fields are editable and persist changes automatically to browser local storage on field blur (no manual "Save" button required).
- **SC-003**: At least 90% of players (or reviewers) successfully enter a character's details, view attributes, and read all moves without documentation or training. There will be 3 testers who have never seen the sheet before; at least 2 must complete the tasks successfully. Test method: each tester completes (1) enter a character name, (2) set class and damage die, (3) set STR to 16 and verify modifier, (4) find and read "Hack and Slash", (5) add a note and reload. Success = completing all 5 steps without guidance.
- **SC-004**: The sheet displays correctly in the latest two major versions of Chrome, Firefox, and Edge, plus Safari 16+. Display criteria: no clipped labels, no overlapping fields, no horizontal overflow at 1280px+ width, and all localized labels fit without truncation.
- **SC-005**: All UI labels and move descriptions are available in both English and French; language can be switched without page reload.
- **SC-006**: Attribute modifiers are calculated correctly for all values 1–18 according to the DW SRD table (spot-checked: 3 → -3, 9 → 0, 15 → +1, 18 → +3).
- **SC-007**: All interactive elements are keyboard accessible (tab navigation works, focus visible); screen readers can navigate and announce all content correctly (tested with NVDA or JAWS); no WCAG 2.1 Level AA violations for SC 2.1.1 (Keyboard), 2.4.7 (Focus Visible), 1.4.3 (Contrast), 1.4.11 (Non-text Contrast), 4.1.3 (Status Messages).
- **SC-008**: Interactive feedback (modifier updates, validation messages) appears within 100 ms of user input on a desktop browser.

---

## Assumptions & Risks

- Initial deployment uses browser local storage for persistence; backend integration is out of scope for MVP. **Risk**: data loss if storage is cleared; **Mitigation**: users can re-enter data.
- Application supports a single character only; no character selection, creation, or deletion UI.
- All basic and special moves are hardcoded in the frontend (data in moves.json); no admin panel or CMS. **Risk**: SRD updates require redeploy; **Mitigation**: keep moves JSON in docs and sync into app.
- Moves displayed match the official Dungeon World SRD v1.1 (https://www.dungeonworldsrd.com/).
- The 8 standard Dungeon World classes are sufficient (Fighter, Wizard, Thief, Cleric, Ranger, Paladin, Bard, Druid); no class-specific moves in this MVP — all moves available to all classes.
- No class-specific filtering or restrictions on moves.
- Printing is out of scope; handled separately as a different feature.
- Tablet and small-screen responsive behavior is deferred; desktop-only layout is required for MVP.
- No user authentication or multi-user collaboration in MVP.

---

## Dependencies & Licensing

All dependencies MUST be open-source (MIT, Apache-2.0, or equivalent):

- **Vite** (MIT) – build tool and dev server.
- **React** (MIT) – UI framework.
- **i18next** (MIT) – internationalization (i18n).
- **Vitest** (MIT) – testing framework.
- **React Testing Library** (MIT) – component testing.

**None of the above have licensing restrictions; no replacement strategy documentation required.**

**Dependency validation process:** Before adding a new dependency, verify its license in package metadata, confirm it is permissive (MIT/Apache-2.0 or similar), and record the decision in the PR description. If a restrictive dependency is required, document it in `docs/changes/001-dungeon-world-dependencies.md` with a replacement strategy.

**Future non-OSS dependencies:** If any non-open-source or restrictive-license dependency is added, it MUST be documented in `docs/changes/001-dungeon-world-dependencies.md` with a replacement strategy and abstraction layer design.

