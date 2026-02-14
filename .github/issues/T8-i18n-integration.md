Title: T8 — Integrate i18n in frontend and API

Description:
Add `react-i18next` to the frontend and implement backend support to serve localized fields. Provide translation fallback behavior and API flags for missing translations.

Tasks:
- Add `react-i18next` and initialize `src/locales/en` and `src/locales/fr`
- Implement locale switcher wired to `language_preference`
- Update API to accept `lang` query param or `Accept-Language` and return localized fields with `translation_missing` flags
- Add simple admin reporting endpoint for missing translations

Acceptance Criteria:
- UI strings switch when `language_preference` is changed
- API returns localized move descriptions and flags missing translations
- Admin endpoint returns a list of missing translations

Estimate: 2 days
Labels: frontend, backend, i18n, 2d
Depends on: T1, T2
Assignees: @TODO

Notes:
- Use ICU message format for pluralization and gender support.