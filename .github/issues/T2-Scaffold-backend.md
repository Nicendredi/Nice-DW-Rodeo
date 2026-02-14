Title: T2 — Scaffold backend (Node + Express + TypeScript)

Description:
Initialize a minimal Node + TypeScript backend with Express. Include environment configuration, basic routing, and DB scaffolding (connection placeholder). This will host the API and WebSocket server.

Tasks:
- Create `package.json` with scripts: dev, build, start, lint, test
- Initialize TypeScript `tsconfig.json` for backend
- Add `src/server.ts`, `src/app.ts`, and a `/api/health` route
- Add environment config (`.env.example`) and DB connection placeholder
- Add basic ESLint/Prettier config

Acceptance Criteria:
- `npm run dev` starts the backend and `/api/health` responds 200
- Lint passes on created files
- Clear README instructions for running locally

Estimate: 1 day
Labels: backend, scaffold, 1d
Depends on: none
Assignees: @TODO

Notes:
- Use Express + ws or Socket.IO for WebSocket support; choose pattern and document in plan.