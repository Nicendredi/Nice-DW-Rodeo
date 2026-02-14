Title: T3 — Implement database models & migrations

Description:
Create DB schema and migration scripts for key entities: Users, Campaigns, CharacterSheets, Moves, RollHistory, Translations, SharePermissions, AuditLogs. Use chosen ORM/migration tool (Knex, TypeORM, or Prisma).

Tasks:
- Design schema per `plan.md`
- Implement migrations and seed minimal data
- Add migration run script and instructions

Acceptance Criteria:
- Migration scripts run against a local DB and create required tables/collections
- Sample seed data available for local development

Estimate: 1-2 days
Labels: backend, db, 2d
Depends on: T2
Assignees: @TODO

Notes:
- Consider JSON columns for localized fields (`name.en`, `name.fr`) or a separate `translations` table depending on DB choice.