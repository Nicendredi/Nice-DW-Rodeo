# Feature Specification: Owlbear Rodeo Character Sheet Manager

**Feature Branch**: `001-owlbear-character-sheets`  
**Created**: 2026-02-14  
**Status**: Draft  
**Input**: User description: "Build an Owlbear Rodeo extension. This extension will be a website on which users can create and manage Dungeon World character sheets, based on the Dungeon World SRD and the french wiki of Dungeon World. The sheets will be assigned to a player, but can be shared with other players. The sheets will be editable by the assigned player and the GM. Each move will have the option to throw the adequate dies to resolve the action and show everyone the text associated with the result. The actions will be divided between a trigger, a description, the text corresponding to each resolution, and an additionnal text that will be added after each resolution"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Player Creates and Manages Character Sheet (Priority: P1)

A player visits the Owlbear Rodeo website and creates a new Dungeon World character sheet. They fill in character details (name, class, abilities) based on Dungeon World SRD and can save the sheet to their account.

**Why this priority**: This is the foundation MVP - without character creation, no other features work. Players need an immediate, self-service way to get started.

**Independent Test**: Can be fully tested by: Create a character sheet from scratch → Verify all Dungeon World character fields are populated correctly → Confirm sheet persists in player's account.

**Acceptance Scenarios**:

1. **Given** player is logged in, **When** player clicks "Create New Character", **Then** player sees form with Dungeon World character fields (name, class, attributes, moves, equipment)
2. **Given** player has filled character form, **When** player clicks "Save", **Then** character sheet is created and assigned to player's account
3. **Given** player owns a character sheet, **When** player modifies any character field, **Then** changes are saved immediately or on explicit save action
4. **Given** player is on character sheet page, **When** player views the sheet, **Then** all character details from Dungeon World SRD are displayed correctly

---

### User Story 2 - GM and Player Execute Moves with Dice Rolling (Priority: P1)

A player clicks on a character move (e.g., "Hack and Slash"). The system displays the move's trigger and description, allows the player to roll the required dice (e.g., 2d6+mod), and displays the result text corresponding to the dice outcome. The result is shown to all players in the session.

**Why this priority**: This is core gameplay - moves with dice resolution are the heart of Dungeon World. Without this, the sheet is just a static document. This directly enables play.

**Independent Test**: Can be fully tested by: Select a move → Roll dice → See result text displayed to all session participants → Verify result corresponds to dice roll outcome.

**Acceptance Scenarios**:

1. **Given** player is viewing a character sheet move, **When** player clicks on the move name, **Then** system displays: trigger, description, and resolution outcomes
2. **Given** a move requires a dice roll with Roll20 notation (e.g., 2d6+5, 4d6k3), **When** player clicks "Roll", **Then** system rolls dice according to Roll20 syntax, calculates modifiers, and displays result
3. **Given** dice have been rolled, **When** result is determined, **Then** system displays both individual die results (with visual breakdown showing each die value) and total result, mapped to outcome text (e.g., 10+ success, 7-9 partial, 6- failure)
4. **Given** a move has been executed, **When** move result is displayed with Roll20 metadata (who rolled, when, visibility settings), **Then** all players in the session see the result in real-time with proper permission enforcement
5. **Given** a move has additional text (aftermath/consequence text), **When** result is displayed, **Then** the additional text is appended to the result
6. **Given** a move supports Advantage/Disadvantage mechanics, **When** player rolls with advantage or disadvantage, **Then** system rolls twice and uses appropriate result (highest for advantage, lowest for disadvantage)

---

### User Story 3 - Player Shares Sheet with Other Players (Priority: P2)

A player owns a character sheet and shares it with another player or the GM. The recipient can view the sheet and, if given permission, edit it.

**Why this priority**: Enables multiplayer coordination and GM oversight. Not critical for MVP but essential for collaborative gameplay. Separates read/edit permissions.

**Independent Test**: Can be fully tested by: Share sheet with another player → Recipient views sheet → Verify permissions (view-only or edit) are enforced.

**Acceptance Scenarios**:

1. **Given** player owns a character sheet, **When** player clicks "Share", **Then** player can enter email/username of other players
2. **Given** sheet is shared with another player, **When** recipient accepts share, **Then** recipient can view the sheet
3. **Given** sheet is shared as "view-only", **When** recipient attempts to edit, **Then** edit is blocked with "read-only" message
4. **Given** sheet is shared as "editable", **When** recipient makes changes, **Then** changes are saved and owner is notified of edits

---

### User Story 4 - GM Has Full Control Over Player Sheets (Priority: P2)

The GM (Game Master) can view and edit any character sheet in their campaign, override moves, and manage game state.

**Why this priority**: Essential for GM workflow but secondary to basic player sheet management. GMs need oversight but players manage their own sheets primarily.

**Independent Test**: Can be fully tested by: GM views player sheet → GM can edit any field → GM can override dice rolls or moves → Changes persist.

**Acceptance Scenarios**:

1. **Given** user is a GM, **When** GM views campaign, **Then** GM can see all character sheets in the campaign
2. **Given** GM is viewing a player's sheet, **When** GM clicks "Edit", **Then** GM can modify any character field
3. **Given** GM has edited a player's sheet, **When** changes are saved, **Then** player sees updated sheet in real-time
4. **Given** player executes a move, **When** GM overrides the result, **Then** the override result is displayed and logged

---

### User Story 5 - Session Shared View and Notifications (Priority: P3)

Players in the same campaign/session see character sheet updates, move results, and dice rolls in real-time. Notifications inform players of changes to sheets they're sharing.

**Why this priority**: Enhances collaborative experience but not required for MVP. Initial version can use manual refresh; real-time sync can be added later.

**Independent Test**: Can be fully tested by: Multiple players in session → Player 1 updates sheet → Player 2 sees update immediately → Move results broadcast to all.

**Acceptance Scenarios**:

1. **Given** multiple players are in a campaign session, **When** one player updates their sheet, **Then** other players in session see the update in real-time
2. **Given** a move is executed, **When** result is determined, **Then** all session participants receive a notification
3. **Given** player is not actively viewing the sheet, **When** sheet is updated by GM, **Then** player receives notification of change
4. **Given** multiple moves are executed in sequence, **When** each move is executed, **Then** results are displayed chronologically in a session log

---

### Edge Cases

- What happens when a player modifies a sheet while another player is editing it (concurrent edits)?
- How does the system handle invalid dice rolls (e.g., rolling negative dice)?
- What if a move has no result text for a particular outcome (incomplete move definition)?
- How does the system handle invalid Roll20 notation syntax (e.g., malformed dice expressions)?
- What happens when a dice pool modifier would result in rolling zero or negative dice?
- How are exploding dice (d20!) handled—do they continue until a non-max roll or stop after one extra roll?
- What is the maximum number of dice that can be rolled in a single expression (DoS protection)?
- How does the system behave if a move is edited by the GM while a player is viewing it?
- What happens when a shared sheet is unshared (should editing be revoked immediately)?
- How are dice roll histories stored and accessed (audit trail)?
- What if a player loses connection mid-move (partial state recovery)?
- How do permissions cascade when a sheet is shared indirectly (A shares with B, B shares with C)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated players to create a new Dungeon World character sheet
- **FR-002**: System MUST allow players to view character sheets assigned to them
- **FR-003**: System MUST persist character sheet data including: character name, class, attributes (STR, DEX, CON, INT, WIS, CHA), hit points, armor, moves, equipment, and other DW-specific fields
- **FR-004**: System MUST allow players to edit their own character sheets
- **FR-005**: System MUST allow players to view their character's moves with trigger, description, and resolution outcomes
- **FR-006**: System MUST implement dice rolling mechanism where moves can require 2d6, 1d6, 1d8, 1d10, 1d12, or custom dice combinations
- **FR-007**: System MUST calculate move results based on dice outcome (success on 10+, partial on 7-9, failure on 6-) with modifiers applied from character attributes
- **FR-008**: System MUST display result text corresponding to dice outcome (success, partial, failure paths)
- **FR-009**: System MUST display additional text (aftermath/consequence) appended to move result
- **FR-010**: System MUST show move results to all participants in a session in real-time
- **FR-010a**: System MUST support Roll20 dice notation (e.g., `2d6+5`, `4d6k3`, `d20!`) for flexible dice expressions
- **FR-010b**: System MUST display individual die roll results with visual breakdown (e.g., "[4][6]+2 = 12") before showing final total
- **FR-010c**: System MUST support Advantage/Disadvantage mechanics (roll multiple dice pools and select best or worst outcome)
- **FR-010d**: System MUST support inline rolls in move descriptions using Roll20-style syntax (e.g., `/roll 2d6+mod`)
- **FR-010e**: System MUST track roll metadata (who rolled, when, result visibility setting) for audit and replay purposes
- **FR-010f**: System MUST support dice pool mechanics (e.g., Vampire: The Masquerade style) where players roll X dice and count successes
- **FR-011**: System MUST allow players to share their character sheet with specific other players or GMs
- **FR-012**: System MUST enforce share permissions (view-only vs. editable)
- **FR-013**: System MUST allow GMs to view and edit any character sheet in their campaign
- **FR-014**: System MUST allow GMs to override move results and character sheet values
- **FR-015**: System MUST support multiple campaigns/sessions per user
- **FR-016**: System MUST use Dungeon World SRD as the canonical source for classes, moves, and mechanics
- **FR-017**: System MUST support French wiki of Dungeon World content in addition to SRD
- **FR-018**: System MUST log all changes to character sheets (who changed what, when) with archival of records older than 1 year
- **FR-019**: System MUST persist dice roll history and associated move results with archival mechanism for historical records
- **FR-020**: System MUST prevent unauthorized access to private character sheets
- **FR-021**: System MUST allow players to create custom moves with auto-approval and trigger auto-save of new moves
- **FR-022**: System MUST detect concurrent edits and present conflict resolution UI allowing players to choose conflicting versions or merge changes manually

### Non-Functional Requirements

- **NFR-001**: Character sheet loads in less than 2 seconds
- **NFR-002**: Dice roll results are displayed within 1 second
- **NFR-003**: Sheet changes persist within 500ms of save/auto-save
- **NFR-004**: System detects concurrent edits by up to 5 players per sheet and presents conflict resolution UI showing conflicting changes
- **NFR-005**: System implements archival mechanism for character sheets and dice roll history older than 1 year (archived data remains accessible but not in active queries)
- **NFR-006**: Share permissions are enforced consistently across all views
- **NFR-007**: Sensitive user data (passwords, emails) are encrypted at rest
- **NFR-008**: Session data accessible by authorized users only
- **NFR-009**: Players can create custom moves with auto-approval; system can flag or quarantine moves that violate balance guidelines for admin review
- **NFR-010**: Roll20 notation parser MUST handle standard XdY±Z format, modifiers, exploding dice (d20!), keep-highest (4d6k3), and dice pool mechanics with clear error messages for invalid syntax

### Key Entities

- **Character Sheet**: Represents a Dungeon World character; contains name, class, attributes, moves, equipment, HP, armor, and links to player/GM assignments
  - Attributes: name, class (Fighter, Thief, Cleric, etc.), STR, DEX, CON, INT, WIS, CHA, HP, armor, status (active, archived, deleted)
  
- **Move**: Represents a Dungeon World move that can be triggered during play; contains trigger, description, and resolution outcomes
  - Attributes: name, trigger (what prompts the move), description, dice_formula (e.g., 2d6+mod), roll20_notation (e.g., 2d6+5, 4d6k3, d20!), notation_style (roll20_standard, advantage_disadvantage, dice_pool), outcomes (success/partial/failure text), aftermath_text
  
- **Dice Roll Result**: Represents the outcome of executing a move with full Roll20 metadata
  - Attributes: move_id, character_sheet_id, dice_rolled, individual_die_results (e.g., [3, 4] for 2d6), modifiers_applied, total_result, result_type (success/partial/failure), result_text, aftermath_text, roll20_notation_used, timestamp, executed_by (player or GM), visibility (public/private/gm_only), advantage_disadvantage_applied (if applicable)
  
- **Player**: System user who creates and plays characters
  - Attributes: user_id, email, name, campaigns (list of campaigns they're in)
  
- **Game Master (GM)**: System user who manages a campaign and has elevated permissions over all sheets
  - Attributes: user_id, email, name, campaigns_run (list of campaigns they GM)
  
- **Campaign/Session**: Container for a group of character sheets and associated players
  - Attributes: campaign_id, name, gm_id, player_ids (list of players), character_sheet_ids, created_date, status (active, paused, completed)
  
- **Share Permission**: Manages access rules for shared sheets
  - Attributes: sheet_id, shared_with_user_id, permission_type (view_only, editable), shared_date, revoked_date (if applicable)

## Success Criteria *(mandatory)*

### Functional Success Indicators

- Player can create a complete Dungeon World character sheet in fewer than 5 minutes
- Player can execute a move with dice roll and see result displayed to all participants
- Character sheets persist correctly when edited and re-loaded
- Share permissions are respected: view-only users cannot edit, editable users can save changes
- GM can override any move result and change persists for all viewers
- All Dungeon World classes, moves, and mechanics from SRD are correctly represented
- Dice roll outcomes correctly map to result text (10+ = success, 7-9 = partial, 6- = failure)

### Performance Success Indicators

- 95th percentile load time for character sheet < 2 seconds
- Dice roll execution and result display < 1 second
- Changes auto-save within 500ms
- Support concurrent edits without data corruption

### User Experience Success Indicators

- Player reports character sheet creation is intuitive (no tutorial required for basic operations)
- Players find move results clear and unambiguous
- GMs report ease of managing multiple character sheets
- Share/permission workflow is discoverable without documentation

### Data Integrity Success Indicators

- Zero data loss during concurrent edits (conflict resolution succeeds)
- Dice roll history is auditable (can replay move sequence)
- All changes logged with user attribution
- Unauthorized access attempts are logged and blocked

## Clarifications

### Session 2026-02-14

- Q1: How should concurrent edits be handled? → A: Conflict resolution UI - show players conflicting changes and allow them to choose which version to keep
- Q2: How long should character sheets and dice roll history be retained? → A: Archive logs of previous sessions (implement archival system rather than indefinite retention or deletion)
- Q3: Should players be able to create custom moves? → A: Yes, players can create moves auto-approved (no admin approval required; system can flag problematic moves for review)
- Q4: Which Roll20 dice conventions should be supported? → A: All 6 - Dice Notation, Roll Result Display, Advantage/Disadvantage, Inline Rolls, Roll Metadata, Dice Pool

## Assumptions

1. Users have a valid account and are authenticated before accessing sheets
2. Dungeon World SRD is publicly available and can be referenced/incorporated
3. French Dungeon World wiki content is publicly available
4. Initial MVP does not require real-time collaboration (can use polling or manual refresh initially)
5. Dice mechanics follow standard Dungeon World rules (2d6 base for most moves)
6. Character sheets are created by players; GMs review/approve (or override as needed)
7. Campaign structure is flexible enough to support one-shots and ongoing campaigns
8. Mobile responsiveness is desired but not required for MVP
9. Move definitions can be authored by admins (SRD moves) or players (custom moves with auto-approval)

## Out of Scope (for MVP)

- Mobile app (web-only for MVP)
- Voice/video integration
- Campaign marketplace or sharing moves across campaigns
- Campaign scheduling/calendar integration
- Character advancement/leveling (static sheets only)
- Inventory management beyond simple equipment list
- Encounter builder or monster manager
- Custom character classes beyond DW SRD classes
- User-generated content moderation (assume all users are trusted)
- Payment processing or subscription management

## Next Steps

1. **Clarify** the three [NEEDS CLARIFICATION] items above
2. **Plan** the technical architecture and implementation phases
3. **Define** the data model and API contracts
4. **Identify** priority tasks for development
