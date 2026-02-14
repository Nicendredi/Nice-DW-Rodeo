Title: T12 — Security review and production readiness

Description:
Perform a security review and implement production readiness items: rate-limiting, secrets management, DoS protections on roll endpoints, logging and monitoring.

Tasks:
- Add rate-limiting for roll endpoints and other high-frequency APIs
- Ensure secrets are stored securely and not checked in
- Implement DoS protections (max dice, request throttling)
- Add logging/monitoring and health checks

Acceptance Criteria:
- Production readiness checklist passed
- Rate-limits configured and tested
- Secrets not present in repo and CI uses secure secrets

Estimate: 1-2 days
Labels: security, ops, 2d
Depends on: T1-T7
Assignees: @TODO

Notes:
- Add Sentry or similar for error tracking; add Prometheus/Grafana for monitoring where needed.