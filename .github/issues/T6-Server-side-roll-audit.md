Title: T6 — Implement server-side roll auditing and anti-cheat

Description:
Ensure roll results are authoritative and auditable. Implement server-side roll reproduction, optional seeding, and storage of full roll metadata.

Tasks:
- Design RollHistory schema to include seeds, client_provided_signature, and full metadata
- Implement server-side roll reproduction/verification
- Add endpoints for audit retrieval

Acceptance Criteria:
- RollHistory records contain full metadata and reproduce the result
- Server rejects tampered client roll payloads or records them with flags

Estimate: 1-2 days
Labels: backend, security, 2d
Depends on: T5
Assignees: @TODO

Notes:
- Decide on anti-cheat approach early (signed seeds vs server-only roll execution).