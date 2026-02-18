# Data Model: Dungeon World Character Sheet

**Feature**: 001-dungeon-world-char-sheet  
**Date**: 2026-02-18  

---

## Root Entity: Character

Represents a single Dungeon World player character.

```json
{
  "character": {
    "name": "string (required, 1–100 chars)",
    "playerName": "string (optional, 0–100 chars)",
    "campaign": "string (optional, 1–100 chars)",
    "class": "enum (required)",
    "health": {
      "current": "integer (required, 0..max)",
      "max": "integer (required, 1+)"
    },
    "damageDie": "enum (required)",
    "attributes": {
      "strength": "integer (required, 1–20)",
      "dexterity": "integer (required, 1–20)",
      "constitution": "integer (required, 1–20)",
      "intelligence": "integer (required, 1–20)",
      "wisdom": "integer (required, 1–20)",
      "charisma": "integer (required, 1–20)"
    },
    "moves": "static resources (not persisted with character)",
    "notes": "string (optional, unlimited, for inventory, story notes, etc.)"
  },
  "settings": {
    "language": "enum (required, en|fr)"
  }
}
```

---

## Enums

### Class

Enumeration of Dungeon World classes (expandable).

```
"Fighter"
"Wizard"
"Thief"
"Cleric"
"Ranger"
"Paladin"
"Bard"
"Druid"
```

### Damage Die

Enumeration of damage dice options.

```
"d4"
"d6"
"d8"
"d10"
"d12"
```

---

## Static Resources

Moves are read-only reference data loaded from localized JSON files and are not persisted with the character.

```json
{
  "basicMoves": [
    {
      "id": "bm-001",
      "name": "Hack and Slash",
      "description": "When you attack an enemy in melee with a weapon, roll+STR..."
    }
  ],
  "specialMoves": [
    {
      "id": "sm-001",
      "name": "Make Camp",
      "description": "When you settle in to rest, consume a ration..."
    }
  ]
}
```

---

## Calculated Fields (Derived, Not Stored)

### Attribute Modifiers

For each attribute (e.g., **strength**), the **modifier** is determined by this table (from Dungeon World SRD):

```
Score   Modifier
1–3     -3
4–5     -2
6–8     -1
9–12    0
13–15   +1
16–17   +2
18      +3
```

**Examples:**
- Attribute 3 → Modifier -3
- Attribute 8 → Modifier -1
- Attribute 10 → Modifier 0
- Attribute 15 → Modifier +1
- Attribute 17 → Modifier +2
- Attribute 18 → Modifier +3

---

## Constraints & Validation

1. **Name length:** 1–100 characters (required).
2. **Player name:** 0–100 characters (optional, can be empty string).
3. **Campaign:** 0–100 characters (optional, can be empty string).
4. **Health:**
   - `current` ≥ 0 and ≤ `max`.
   - `max` ≥ 1.
5. **Attributes:** each in range [1, 20]; values are clamped to this range on input.
6. **Class:** must be one of the predefined enums.
7. **Damage die:** must be one of the predefined enums (d4–d12).
8. **Notes:** no character limit (practical: 5000+ chars supported).
9. **Language:** must be `en` or `fr`; fallback to English for missing keys.

---

## Relationships

- **Character** has one **Class** (enum).
- **Character** references **basic moves** and **special moves** (predefined universal set).

---

## Saving & Persistence

- Character data is saved as a single JSON object in browser local storage under the key `dw-character`.
- Language preference is saved under the key `dw-language`.
- On load, the app attempts to restore character and language from local storage; if not found, initializes with placeholder values.
- On field blur, the character data is validated and saved back to local storage.
- On language change, the preference is saved and the UI updates immediately without reload.

## Sample Payload

### Minimum Valid Character

```json
{
  "name": "Thorgrim Ironfoot",
  "playerName": "Alice",
  "campaign": "The Lost Valley",
  "class": "Fighter",
  "health": {
    "current": 27,
    "max": 30
  },
  "damageDie": "d10",
  "attributes": {
    "strength": 16,
    "dexterity": 10,
    "constitution": 14,
    "intelligence": 9,
    "wisdom": 13,
    "charisma": 11
  },
  "notes": "Thorgrim is seeking the legendary axe of Duranthax.\nCan speak Common, Dwarven, and Goblin."
}
```

---

## Deviations from Ruleset (Repository Documentation)

If the implementation deviates from this data model (e.g., adds extra fields, changes calculations, or stores derived values), document the changes in:

**Location:** `docs/changes/001-dungeon-world-datamodel.md`

**Example entries:**
- Field `experiencePoints` added (not in original model) to track character progression.
- Attribute calculation changed to `floor((attr - 10) / 2) + bonusModifier`.
- New enum value `"Mystic"` added to `Class`.

---

## Localization Notes

- **Moves** (both basic and special) are the same for all characters; no class-specific moves in this MVP.
- **Enum values** (Class, Damage Die, move names) are NOT localized in the data model itself.
- **Move descriptions** and **labels** are localized at the UI layer using i18n keys.
- Data model stores English canonical names/keys for consistency.

