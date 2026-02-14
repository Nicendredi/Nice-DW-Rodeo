Title: T1 — Scaffold frontend (Vite + React + TypeScript)

Description:
Initialize the frontend repository using Vite, React and TypeScript. Add basic project configuration, linting, formatting, and a minimal component/page structure to host the character sheet UI.

Tasks:
- Create `package.json` with scripts: dev, build, lint, test
- Create `vite.config.ts` and TypeScript `tsconfig.json`
- Add ESLint and Prettier configuration
- Add `src/main.tsx`, `src/App.tsx`, `src/pages/CharacterSheet.tsx`, and a sample route
- Add example locales folders `src/locales/en` and `src/locales/fr` with a small json file

Acceptance Criteria:
- `npm run dev` (or `pnpm`) starts the dev server without errors
- `npm run build` succeeds
- Lint passes on the created files
- Basic CharacterSheet page renders with placeholder data

Estimate: 1 day
Labels: frontend, scaffold, 1d
Depends on: none
Assignees: @TODO

Notes:
- Use React Router for pages. Keep the scaffold minimal; wire i18next later in T8.