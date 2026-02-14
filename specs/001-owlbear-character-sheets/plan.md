# Implementation Plan: Owlbear Rodeo Character Sheet Manager

This plan targets the `001-owlbear-character-sheets` feature. It outlines a pragmatic architecture and tasks to implement the spec using Vite, React, TypeScript, Three.js, and Rapier for the frontend, with a minimal Node.js/Express backend.

## Tiny contract (inputs/outputs)

- Inputs: authenticated user actions (create/edit sheet, execute move, roll dice, set language preference), move definitions (localizable strings), and campaign/session events.
- Outputs: persisted character sheets, localized UI and move text, real-time session events (move results), roll history records and audit logs, and client-rendered UI including optional 3D/physics visuals for thematic effects.

## High-level architecture

- Frontend: Vite + React + TypeScript
  - Use React for UI, TypeScript for types, and Vite for fast dev server + production build.
  - Use React Router for sheets & campaign views.
  - i18n: i18next with react-i18next. Store translations in `src/locales/{en,fr}/...` and bundle with the app; support runtime updates from backend.
  - Dice parsing & execution: use a small, well-tested dice parser library or implement a dedicated parser supporting Roll20 notation. Keep parser client-side for responsiveness and also replicate server-side for auditability.
  - 3D / physics: optional scene using Three.js + Rapier for themed visual effects (e.g., dice rolling animation). The Three.js scene runs in a separate React component and communicates via props/events.

- Backend: Node.js + Express + TypeScript (minimal)
  - RESTful endpoints for CRUD operations and localized content fetches.
  - WebSocket (Socket.IO or ws) for real-time session broadcasts (move results, sheet updates).
  - Persistency: PostgreSQL (relational) or MongoDB depending on team preference; store localized fields in JSON columns or normalized i18n tables.
  - Roll validation & auditing: The server reproduces dice roll results for authoritative recording; server may re-roll or verify client roll signatures for anti-cheat.

- Storage
  - Tables/collections: Users, Campaigns, CharacterSheets, Moves, RollHistory, Translations, SharePermissions, AuditLogs.
  - CharacterSheets / Moves: fields to support i18n (e.g., `name: { en: string, fr?: string }`) or a Translations table keyed by string ID.

## Data model sketches (examples)

- CharacterSheet
  - id, owner_id, campaign_id, attributes (STR/DEX...), moves: [move_id], status

- Move
  - id, name: {en, fr}, description: {en, fr}, dice_formula, roll20_notation, outcomes: { success: {en, fr}, partial: {en, fr}, failure: {en, fr} }, aftermath: {en, fr}

- RollHistory
  - id, move_id, sheet_id, executed_by, dice_expression, individual_die_results, modifiers_applied, total_result, result_type, timestamp, visibility

- Translations (optional)
  - key, context, en, fr, updated_by, updated_at

## API surface (examples)

- GET /api/sheets/:id?lang=en
  - Returns the character sheet with localized strings in `lang` if available; falls back to English fields.
- POST /api/sheets
- PUT /api/sheets/:id
- POST /api/moves/:id/roll
  - Body: { expression: "2d6+3", client_seed?: string }
  - Response: { individual: [3,4], total: 10, result: "success", text: { en: "You hit.", fr: "Vous touchez." }, metadata }
- WS: `move:executed` broadcast with localized text (or keys + lang preference per client)

## i18n approach

- Use `i18next` with `react-i18next`.
- Store app/UI strings in `src/locales/en/*.json` and `src/locales/fr/*.json`.
- For user-generated content (moves, results): store localized text in DB per-field. API returns localized string for `Accept-Language` or `lang` query param.
- Fallback rule: missing `fr` → return `en` and set `translation_missing: true` in API response for logging and admin review.
- Provide an administrative UI to review and add missing translations.

## Dice parser and security

- Start with a vetted dice-parser library (e.g., `rpg-dice-roller` or similar) that supports Roll20 notation; if none fit, implement a focused parser for supported features:
  - XdY ± modifiers
  - keep-highest (k), exploding (`!`), advantage/disadvantage patterns
  - dice pools (success counting)
- Validate and clamp max dice per roll (e.g., max 100 dice) to prevent DoS.
- Server-side verification: server receives client's roll request, replays roll (with same seed if provided) and stores authoritative result.

## Three.js + Rapier integration

- Use Three.js for rendering a small dice scene (optional, lazy-loaded component).
- Use Rapier for physics-based bounce/exploding dice if the UX needs it.
- Keep physics in an isolated component; render only when user triggers an animation to avoid load for all users.
- Provide a non-3D fallback: text + simple animated UI for low-power devices.

## Tests

- Unit tests: dice parser, i18n fallback behavior, permission checks.
- Integration tests: roll API round-trip, localized responses, WebSocket broadcasting.
- UX tests: visual smoke test for both languages, verify string lengths and layout.

## Rollout plan

- Milestone 1: Basic sheets CRUD + Move execution (no i18n, minimal UI)
- Milestone 2: Roll20 parser + server-side auditing + real-time broadcasts
- Milestone 3: i18n for UI strings and moves (English + French) + admin translation UI
- Milestone 4: Three.js/Rapier optional dice animations + performance tuning

## Implementation tasks (high level)

1. Scaffold frontend with Vite + React + TypeScript
2. Scaffold backend (Node + Express + TypeScript) and DB
3. Implement models and migrations
4. Implement sheet CRUD and move definition UI
5. Integrate dice parser client + server
6. Add WebSocket broadcasting
7. Integrate i18n (i18next) and translation storage
8. Add admin translation UI and reporting
9. Implement Three.js/Rapier dice animation component (lazy-loaded)
10. Tests and CI

## Estimation & Risks

- Estimated MVP (Milestone 1+2): 2-4 weeks for a small team (1-2 devs)
- i18n & translations: +1 week to integrate and populate base translations
- 3D physics (Three.js + Rapier): +1-2 weeks (optional UX improvement)

## Deliverables

- `specs/001-owlbear-character-sheets/plan.md` (this file)
- Frontend scaffold + sample localized strings
- Backend scaffold + minimal API for sheets and roll
- Tests covering dice parsing and i18n fallback


---

If you'd like, I can now:
- Scaffold the Vite + React + TypeScript frontend (create `package.json`, `vite.config.ts`, basic `src/` files, and example locales) and run the dev server.
- Or generate a more detailed `/speckit.tasks` output that breaks this plan into GitHub-issue-sized tasks.

Which do you want me to do next?