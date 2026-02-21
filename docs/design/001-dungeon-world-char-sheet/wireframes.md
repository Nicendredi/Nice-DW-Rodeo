# Dungeon World Character Sheet — UI/UX Design

**Feature**: 001-dungeon-world-char-sheet  
**Date**: 2026-02-18  
**Status**: Draft (Corrected)  

## Design Goals

- **Clarity**: Clean, uncluttered layout that displays all essential character information at a glance.
- **Accessibility**: High contrast, readable fonts, logical tab order for keyboard navigation.
- **Localization**: All labels support English and French; strings managed via i18n.
- **Digital-First**: Optimized for screen display; printing handled separately.

---

## Page Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  DUNGEON WORLD CHARACTER SHEET                                                │
│  ─────────────────────────────────────────────────────────────────────────   │
│  Name: _______________  Player: _______________  Campaign: ________________  │
│  Class: ______________  Health: ___/___  Damage Die: d___                   │
│                                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ATTRIBUTES (Full Width)                                                      │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                                │
│  STR          DEX          CON          INT          WIS          CHA         │
│   +2           +1           +0           +0           +1           +0         │
│  Strength     Dexterity    Constitution Intelligence Wisdom       Charisma    │
│  16           14           13           11           15           12          │
│                                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  BASIC MOVES                                                                  │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                                │
│  Hack and Slash                                                               │
│  When you attack an enemy in melee with a weapon, roll+STR. On a 10+, you   │
│  hit and deal your damage. On a 7–9, you hit but the enemy gets a free      │
│  attack against you or you have to choose: take the enemy's attack or deal  │
│  normal damage.                                                               │
│                                                                                │
│  Volley                                                                       │
│  When you attack an enemy at range with a projectile weapon, roll+DEX. On   │
│  a 10+, you hit and deal your damage. On a 7–9, you hit but you're in a    │
│  worse position; the GM says how.                                            │
│                                                                                │
│  [... additional moves with full descriptions ...]                           │
│                                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  SPECIAL MOVES                                                                │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                                │
│  Make Camp                                                                    │
│  When you settle in to rest and consume a ration, remove one Fatigue. If    │
│  you are somewhere dangerous, decide the watch order as well. When you wake  │
│  from at least a few uninterrupted hours of sleep, recover damage equal to  │
│  half your max HP.                                                            │
│                                                                                │
│  Take Watch                                                                   │
│  When you're on watch and something approaches the camp, roll+WIS. On a     │
│  10+, you're able to wake everyone and prepare a response, everyone takes   │
│  +1 forward. On a 7–9, you react just a moment too late; your companions    │
│  in camp are awake but haven't had time to prepare. On a miss, whatever     │
│  lurks outside the campfire's light has the drop on you.                    │
│                                                                                │
│  [... additional moves with full descriptions ...]                           │
│                                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  NOTES & INVENTORY                                                            │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                                │
│  [Large free-form text area for notes, inventory, character details, etc.]   │
│                                                                                │
│  ________________________________________________________________________    │
│  ________________________________________________________________________    │
│  ________________________________________________________________________    │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Sections

### 1. Header (Character Info) — Full-Width

```
┌────────────────────────────────────────────────────────────────────┐
│  DUNGEON WORLD CHARACTER SHEET                                     │
├────────────────────────────────────────────────────────────────────┤
│  Character Name: ________________________                           │
│  Player Name: ________________________                             │
│  Campaign / World: ________________________                         │
│  Class: ________________________  Health: ___/___  Die: d___       │
└────────────────────────────────────────────────────────────────────┘
```

**Input Fields:**
- Character Name (text)
- Player Name (text)
- Campaign (text)
- Class (dropdown of the 8 standard DW classes: Fighter, Wizard, Cleric, Thief, Ranger, Paladin, Druid, Bard)
- Current Health (number)
- Max Health (number, shows as current/max)
  - **Note**: Displayed as two separate number inputs with a "/" text separator between them. No additional display element needed.
- Damage Die (dropdown of the standard DW damage dice: d4, d6, d8, d10, d12)

**Notes:**
- Header spans the full width of the container.
- Single horizontal layout for all fields on one line when possible.
- Clear visual separation between Header and content below.

---

### 2. Attributes (Full-Width Row, Single Line)

```
┌────────────────────────────────────────────────────────────────────┐
│  ATTRIBUTES                                                        │
├────────────────────────────────────────────────────────────────────┤
│  STR       DEX       CON       INT       WIS       CHA              │
│   +2        +1        +0        +0        +1        +0              │
│  Strength  Dexterity Constitution Intelligence Wisdom   Charisma    │
│  16        14        13        11        15        12               │
└────────────────────────────────────────────────────────────────────┘
```

**Display Format:**
- Single-line, 6-column grid.
- Abbreviation shown above each attribute and visually distinct.
- Modifier shown below the abbreviation and visually dominant.
- Full attribute name on the third line and value on the fourth line.
- Example column: `STR` on top, `+2` in the middle, `Strength` below, `16` on the bottom.
- Modifiers auto-calculated using **DW SRD table**:
  - 1–3 → -3
  - 4–5 → -2
  - 6–8 → -1
  - 9–12 → 0
  - 13–15 → +1
  - 16–17 → +2
  - 18 → +3

**Color Coding (Optional):**
- Modifier (top row): high contrast, large font, color by sign.
- Attribute label/value (bottom row): muted color and smaller font.

---

### 3. Basic Moves (Full-Width, Read-Only List)

```
┌────────────────────────────────────────────────────────────────────┐
│  BASIC MOVES                                                       │
├────────────────────────────────────────────────────────────────────┤
│  Move Name (bold)                                                  │
│  Full move description and trigger. This is a reference list that │
│  displays the complete text from the DW SRD.                       │
│                                                                    │
│  [Next Move Name]                                                  │
│  Full description...                                               │
│                                                                    │
│  [Scrollable. All 8 basic moves listed]                           │
└────────────────────────────────────────────────────────────────────┘
```

**Features:**
- **No checkboxes or selection state** — moves are reference material only.
- Move name displayed in bold; description in regular text.
- All 8 basic moves always visible (no filtering).
- Scrollable container if content exceeds container height.
- Descriptions sourced from `docs/en/character-sheet/moves.json` (or `docs/fr/...` for French).

---

### 4. Special Moves (Full-Width, Universal List)

```
┌────────────────────────────────────────────────────────────────────┐
│  SPECIAL MOVES                                                     │
├────────────────────────────────────────────────────────────────────┤
│  Make Camp (bold)                                                  │
│  Full move description and trigger (reference).                   │
│                                                                    │
│  Take Watch (bold)                                                 │
│  Full move description and trigger (reference).                   │
│                                                                    │
│  Undertake a Perilous Journey (bold)                              │
│  Full move description and trigger (reference).                   │
│                                                                    │
│  [All 13 special moves listed, scrollable]                        │
└────────────────────────────────────────────────────────────────────┘
```

**Features:**
- **No class-specific filtering** — all 13 special moves displayed to all characters (MVP scope).
- **No checkboxes or selection state** — reference display only.
- Move name (bold) + full description.
- Scrollable container if needed.
- Descriptions from `docs/en/character-sheet/moves.json` (universal).

---

### 5. Notes & Inventory (Full-Width, Bottom)

```
┌────────────────────────────────────────────────────────────────────┐
│  NOTES & INVENTORY / GEAR                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Large free-form text area – multiline input box]                │
│                                                                    │
│  __(80+ characters wide, 5-8 rows tall)__                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Large `<textarea>` for free-form notes, inventory, equipment, story details, etc.
- No character limit (practical considerations for rendering/printing handled separately).
- Persists to browser Local Storage on every change.

---

## Color Scheme & Typography

| Element | Color | Font |
|---------|-------|------|
| Page Title | Dark gray (#333) | Bold, 20px |
| Section Headers | Dark gray (#333) | Bold, 14px |
| Labels | Dark gray (#666) | Normal, 12px |
| Input Fields Borders | Light gray (#ddd) | 1px solid |
| Move Names | Dark gray (#333) | Bold, 12px |
| Move Descriptions | Dark gray (#555) | Normal, 11px |
| Modifier (positive) | Green (#2ecc71) | Italic, 12px |
| Modifier (negative) | Red (#e74c3c) | Italic, 12px |
| Modifier (neutral) | Gray (#95a5a6) | Italic, 12px |
| Notes Text Area | Light gray background (#f9f9f9) | Normal, 11px |

---

## Responsive Behavior

- **Desktop (1200px+)**: Full layout, all sections visible with optimal spacing.
- **Tablet (768px–1199px)**: Attributes may stack into 3x2 grid; moves sections remain full-width, scrollable.
- **Mobile (< 768px)**: Single-column layout with collapsible sections for Attributes, Moves, Special Moves, Notes (optional tabs or accordions).

---

## Localization (English / French)

All labels, placeholders, section headers, and descriptions MUST support both English and French.

**Example String Mappings:**
- English: "Character Name" → French: "Nom du Personnage"
- English: "Attributes" → French: "Attributs"
- English: "Hack and Slash" → French: "Taillader et Trancher"
- English: "Make Camp" → French: "Faire Camp"

Strings managed via i18n JSON files:
- `docs/en/character-sheet/labels.json` — UI labels, field names, section headers
- `docs/en/character-sheet/moves.json` — Basic and Special move names and descriptions
- `docs/fr/character-sheet/labels.json` — French UI labels
- `docs/fr/character-sheet/moves.json` — French move names and descriptions

---

## Accessibility & UX

- **Tab Order**: Header fields → Attributes → Basic Moves (scrollable) → Special Moves (scrollable) → Notes → Exit.
- **Keyboard Navigation**: Full support for tab, enter, arrow keys in scrollable sections.
- **Screen Reader Support**: Semantic HTML5 (`<section>`, `<fieldset>`, `<label>`), ARIA labels where needed.
- **Focus Indicators**: Clear focus states on all interactive elements (input fields, scrollable areas).
- **Error Handling**: User-friendly validation messages for invalid character data (e.g., health > max health).

---

## Notes on Scope

- **Printing**: Handled separately (future feature); this MVP focuses on digital display only.
- **Character Selection/Tracking on Moves**: No interactive state for moves; reference display only.
- **Class-Specific Content**: All moves are universal in the MVP; class-specific moves are a future enhancement.
- **Persistence**: Character data persists via browser Local Storage; no backend synchronization in this release.
