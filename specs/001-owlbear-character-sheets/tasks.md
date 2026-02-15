# Implementation Tasks: Owlbear Rodeo Character Sheet Manager

This file breaks the implementation plan into GitHub-issue-sized tasks with acceptance criteria and rough estimates. Use these to create issues or work items.

Priority order: MVP tasks first, then i18n, real-time, and optional 3D features.

## Task Status

- [x] T1 — Scaffold frontend (Vite + React + TypeScript)
- [x] T2 — Scaffold backend (Node + Express + TypeScript)
- [x] T3 — Implement database models & migrations
 - [x] T4 — Implement sheet CRUD and move definition UI
- [ ] T5 — Integrate dice parser client and server
- [ ] T6 — Implement server-side roll auditing and anti-cheat
- [ ] T7 — Add WebSocket real-time broadcasts
- [ ] T8 — Integrate i18n in frontend and API
- [ ] T9 — Admin translation UI and missing-translation reporting
- [ ] T10 — Tests and CI
- [ ] T11 — Three.js + Rapier dice animation component (optional)
- [ ] T12 — Security review and production readiness

---

## T1 — Scaffold frontend (Vite + React + TypeScript)
- Estimate: 1 day
- Description: Initialize a Vite + React + TypeScript project, add ESLint/Prettier configs, TypeScript base tsconfig, and a small component structure (Pages: Home, Sheets, Campaign, CharacterSheet).
- Acceptance Criteria:
  - `package.json`, `vite.config.ts`, `tsconfig.json` present
  - `src/main.tsx`, `src/App.tsx`, `src/pages/CharacterSheet.tsx` exist and compile
  - Lint and build pass locally

## T2 — Scaffold backend (Node + Express + TypeScript)
- Estimate: 1 day
- Description: Initialize Node + TypeScript backend with Express, basic routing, and CORS. Add DB connection scaffolding and environment config.
- Acceptance Criteria:
  - `package.json`, `tsconfig.json` for backend present
  - Basic `/api/health` endpoint returns 200
  - Backend starts locally and connects to configured DB (or a mocked DB)

## T3 — Implement database models & migrations
- Estimate: 1-2 days
- Description: Implement DB schema for Users, Campaigns, CharacterSheets, Moves, RollHistory, Translations, SharePermissions, AuditLogs. Provide migrations (e.g., with Knex or TypeORM).
- Acceptance Criteria:
  - Migration scripts exist and run against a local DB
  - Tables/collections created match sketch in `plan.md`

## T4 — Implement sheet CRUD and move definition UI
- Estimate: 2-3 days
- Description: CRUD for character sheets and moves in frontend + backend. Moves should support localized fields (en/fr) in the model.
- Acceptance Criteria:
  - Create/Read/Update/Delete endpoints for sheets and moves
  - Frontend pages/forms to create and edit sheets and moves
  - Localized fields (`name.en`, `name.fr`, `description.en`, `description.fr`) persisted

## T5 — Integrate dice parser client and server
- Estimate: 2 days
- Description: Add a vetted dice parser library or implement a parser that supports Roll20 notation (XdY±Z, k, !, advantage/disadvantage, dice pools). Clamp max dice and validate input.
- Acceptance Criteria:
  - Client can execute a roll and display individual die results + total
  - Server exposes a `/api/moves/:id/roll` endpoint that returns authoritative roll results and stores them in RollHistory
  - Parser validates input and rejects malformed expressions with clear error messages

## T6 — Implement server-side roll auditing and anti-cheat
- Estimate: 1-2 days
- Description: Server reproduces/validates rolls, optionally using seeds or signed client payloads to verify client-side rolls.
- Acceptance Criteria:
  - RollHistory persisted with full metadata
  - Server verifies/replicates client roll when a client-provided seed is present

## T7 — Add WebSocket real-time broadcasts
- Estimate: 1-2 days
- Description: Add WebSocket (Socket.IO or ws) integration. Broadcast sheet updates and `move:executed` events to session participants.
- Acceptance Criteria:
  - Clients can subscribe to session channels and receive move executions in real-time
  - Tests show broadcast arrival for multiple simulated clients

## T8 — Integrate i18n in frontend and API
- Estimate: 2 days
- Description: Add `react-i18next` to the frontend with `src/locales/en/*.json` and `src/locales/fr/*.json`. Backend should return localized fields and expose missing-translation flags.
- Acceptance Criteria:
  - UI strings switch when `language_preference` is changed
  - API returns localized move descriptions based on `lang` query or `Accept-Language` header, with `translation_missing` flagged when falling back to English

## T9 — Admin translation UI and missing-translation reporting
- Estimate: 1-2 days
- Description: Add a small admin UI to view and edit missing translations and a report view listing strings needing translation.
- Acceptance Criteria:
  - Admin can view all `translation_missing` entries and add a `fr` translation that is persisted
  - New translations take effect in UI without full redeploy (or documented workflow)

## T10 — Tests and CI
- Estimate: 1-2 days
- Description: Add unit tests for dice parser, i18n fallback behavior, permission checks, and integration tests for roll API + WebSocket broadcasting. Add CI pipeline (GitHub Actions) to run tests.
- Acceptance Criteria:
  - Automated tests cover critical paths and pass in CI
  - PRs are validated by CI

## T11 — Three.js + Rapier dice animation component (optional)
- Estimate: 2-3 days
- Description: Implement a lazy-loaded 3D dice animation component that uses Three.js and Rapier for physics. Provide a non-3D fallback for low-power devices.
- Acceptance Criteria:
  - Dice animation can be triggered and produces a deterministic result matching the authoritative roll
  - Component is lazy-loaded and does not increase initial bundle size significantly

## T12 — Security review and production readiness
- Estimate: 1-2 days
- Description: Penetration checklist, rate-limiting for roll endpoints, DoS protections (max dice), auditing and logging configuration, secrets management, and secure deployment pipeline.
- Acceptance Criteria:
  - Rate limits in place for roll endpoints
  - Secrets are not stored in repo
  - Logging and audit trails configured and tested

---

## Creating GitHub Issues
For each task above, create a GitHub issue with title `Tn — <short title>`, copy the description and acceptance criteria, set an estimate label (e.g., `1d`, `2d`) and any dependencies.


---

If you'd like, I can now:
- Create these tasks as Markdown issue templates or directly create GitHub issues (I can prepare the issue bodies for you to paste)
- Or scaffold the frontend (option from previous step)

Which do you want next?

---

## Additional work (implementation note)

- [x] T3b — Rework client HTML to match `docs/semantic-example.html` (integrated semantic layout into `client/src/App.tsx` and updated `client/index.html`)
