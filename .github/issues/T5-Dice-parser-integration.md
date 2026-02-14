Title: T5 — Integrate dice parser client and server

Description:
Add a dice parser that supports Roll20-style notation. Integrate it both client- and server-side for responsiveness and authoritative recording.

Tasks:
- Evaluate existing libraries (e.g., `rpg-dice-roller`) for feature fit
- Integrate chosen library or implement parser for supported features
- Client: display individual rolls + totals and nice visual breakdown
- Server: expose `/api/moves/:id/roll` that validates and persists roll results
- Add input validation and max-dice clamping

Acceptance Criteria:
- Client can execute a roll and display per-die values and total
- Server endpoint reproduces/validates roll and stores RollHistory
- Malformed expressions return clear errors

Estimate: 2 days
Labels: backend, frontend, dice, 2d
Depends on: T1, T2
Assignees: @TODO

Notes:
- Document limit values (max dice), and any differences between client/server parsing if necessary.