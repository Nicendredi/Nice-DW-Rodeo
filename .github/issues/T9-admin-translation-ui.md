Title: T9 — Admin translation UI and missing-translation reporting

Description:
Build a small admin UI to view and fix missing translations reported by the backend. Allow admins to edit translations for moves and UI strings.

Tasks:
- Create admin pages to list `translation_missing` strings
- Provide edit forms for translations and persist changes
- Add audit logging when translations are updated

Acceptance Criteria:
- Admin can view all missing translations and provide French translations which become available to users
- Changes are audited and visible in audit logs

Estimate: 1-2 days
Labels: frontend, admin, 2d
Depends on: T8
Assignees: @TODO

Notes:
- Consider permissions: only GMs or site admins should see this UI. Add RBAC checks.