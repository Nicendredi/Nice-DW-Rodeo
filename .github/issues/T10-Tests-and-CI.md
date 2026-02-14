Title: T10 — Tests and CI

Description:
Add unit and integration tests plus CI pipeline to validate builds. Focus on dice parser, i18n fallback, and API security.

Tasks:
- Add unit tests for dice parser and i18n fallback
- Add integration tests for `/api/moves/:id/roll` and WebSocket broadcasts
- Add GitHub Actions workflow to run lint, build, and tests on PRs

Acceptance Criteria:
- Tests cover critical paths and run in CI
- CI workflow runs on PRs and blocks merges on failure

Estimate: 1-2 days
Labels: devops, tests, 2d
Depends on: T1-T7
Assignees: @TODO

Notes:
- Use Playwright or Cypress for small E2E smoke tests.