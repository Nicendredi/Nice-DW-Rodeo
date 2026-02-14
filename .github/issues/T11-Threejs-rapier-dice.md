Title: T11 — Three.js + Rapier dice animation component (optional)

Description:
Create a lazy-loaded 3D dice animation component using Three.js and Rapier physics. Ensure deterministic results that match authoritative roll results.

Tasks:
- Create a lazy-loaded `DiceScene` React component with Three.js
- Integrate Rapier for physics; ensure deterministic behavior by driving animation via authoritative roll seed
- Provide non-3D fallback UI

Acceptance Criteria:
- Dice animation triggers and shows physics-based animation matching the server-provided roll
- Component is lazy-loaded and does not significantly increase initial bundle size

Estimate: 2-3 days
Labels: frontend, optional, 3d
Depends on: T1, T5
Assignees: @TODO

Notes:
- Consider using deterministic pseudo-random seeded physics or precomputed animation to match roll results.