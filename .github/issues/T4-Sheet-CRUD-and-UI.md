Title: T4 — Implement sheet CRUD and move definition UI

Description:
Implement end-to-end CRUD for character sheets and moves. Move data model must support localized fields. Provide frontend forms and backend endpoints.

Tasks:
- Backend: Create REST endpoints for sheets and moves (CRUD)
- Frontend: Implement forms/pages to create/edit sheets and moves, including localized fields
- Persist localized fields to DB

Acceptance Criteria:
- Create/Read/Update/Delete endpoints for sheets and moves work
- Frontend pages allow editing localized fields (`.en`/`.fr`) and persist changes
- Smoke tested locally

Estimate: 2-3 days
Labels: frontend, backend, 3d
Depends on: T1, T2, T3
Assignees: @TODO

Notes:
- Use form validation and clear UX for localized fields (tabs or locale selector in the move editor)."