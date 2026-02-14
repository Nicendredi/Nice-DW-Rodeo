# Nice Dungeon World Constitution

## Core Principles

### I. Clear, Maintainable Code
- Keep modules small, single-responsibility, and independently testable.
- Prefer readable names, explicit contracts, and comprehensive inline documentation.
- Enforce static checks, linting, and unit tests as gate requirements.
- Design public APIs to be stable and well-documented; internal APIs allowed to change with clear migration notes.

### II. Simple, Accessible User Interfaces (HTML/CSS Best Practices)
- Use semantic HTML and progressive enhancement; UI must work without JavaScript for basic flows.
- Follow responsive design: mobile-first CSS, fluid layout, and breakpoints for common viewports.
- Ensure accessibility: ARIA roles where necessary, keyboard navigation, focus management, and sufficient color contrast.
- Encapsulate styles (BEM/utility tokens/CSS Modules) and centralize design tokens (colors, spacing, typography).

### III. Consistent User Experience
- Provide a shared component library and design tokens to ensure visual and behavioral consistency.
- Keep interactions predictable: consistent affordances, error messaging, and loading states.
- Localize UI strings and formatting consistently across components (see i18n section).
- Version UI patterns and document intended usage and examples.

### IV. Performance & Resource Efficiency
- Prioritize perceived performance: fast first paint, skeletons/placeholders, and minimal blocking scripts.
- Lazy-load non-critical resources, defer heavy computations, and memoize expensive results.
- Optimize assets: compress images, use modern image formats, and serve scalable vector icons where appropriate.
- Monitor runtime performance and set measurable budgets (e.g., TTI, LCP, bundle size targets).

### V. Bilingual Support (English / Français)
- All UI text must support English and French with full translations; avoid concatenating strings with variables.
- Detect locale via user preference, browser settings, or explicit switcher; provide clear fallback to English.
- Use pluralization and gender-aware patterns where necessary; keep translations in resource files (JSON/PO).
- Ensure layouts tolerate longer French strings and RTL if future languages added.

### VI. Dice Notation & Simulation (Roll20 Standards)
- Adopt Roll20-style dice notation as the canonical input format: NdM with optional modifiers (e.g., 3d6+2).
- Treat d% as d100 and accept common Roll20 operators and modifiers; preserve grouping and precedence.
- Simulations must use a deterministically-seedable RNG for tests; production RNG must be cryptographically suitable where required.
- Record roll breakdowns for transparency: individual die results, applied modifiers, and final total.
- Support common Roll20 operations users expect (keeps/drop, exploding, rerolls) following Roll20 naming where applicable; document exact subset implemented.

## Additional Constraints
- Prefer web standards and low-dependency stacks for UI; avoid large frameworks unless justified.
- Store translations, design tokens, and dice-rule definitions under version control and review for changes.
- Security: sanitize any user-provided macros or templates before evaluation; never execute arbitrary user code on the server.

## Development Workflow & Quality Gates
- Tests first: unit tests for logic (including dice parsing/simulation) and integration tests for UI flows.
- CI must run lint, unit tests, and a performance smoke check on PRs.
- PRs must include changelog entries for breaking contract or dice-rule changes and pass accessibility checks.

## Governance
- This constitution supersedes ad-hoc practices; amendments require documented rationale, migration steps, and a compatible test plan.
- All PRs must include verification of conformity to relevant principles (code clarity, accessibility, i18n, dice-spec compliance).

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
