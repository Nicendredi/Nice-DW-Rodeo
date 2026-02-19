# Platform Scope Exception: MVP 001-Dungeon-World-Character-Sheet

**Date**: 2026-02-19  
**Feature**: 001-Dungeon-World-Character-Sheet  
**Decision**: Forgo Linux and macOS CI/testing for MVP; prioritize Windows-only development  
**Status**: Documented exception to constitution platform support requirement

---

## Context

The project constitution (`.specify/memory/constitution.md`) mandates:

> "Platform support: development and CI MUST prioritize cross-platform compatibility (Windows, Linux). Platform-specific behavior MUST be documented."

For this MVP feature, the team has decided to defer cross-platform CI setup (Linux, macOS) and comprehensive multi-environment testing to a future phase to maintain MVP scope and velocity.

---

## Decision

**MVP Scope (Phase 0–7, PR #21)**:
- Development targets Windows environments only
- Cross-browser testing (Chrome, Firefox, Safari, Edge) on Windows (Task T035)
- Lighthouse performance audit (Task T041)
- Accessibility testing with NVDA (Windows screen reader) (Tasks T032–T033)
- Desktop-only viewport testing (1920px+); no tablet/iPad testing
- **No Linux CI environment setup**
- **No macOS CI environment setup**
- **No tablet/iPad-specific testing**

**Defer to Phase 2 or later**:
- Linux CI workflow (GitHub Actions, Docker, or native Linux runners)
- macOS CI environment and testing
- Native Linux/macOS browser testing
- Tablet/iPad environment setup and responsive testing (768px–1199px)
- Full cross-platform CI standardization and documentation
- Linux/macOS-specific environment constraints or workarounds (if any arise)

---

## Justification

1. **Small, Minimal Feature Principle**: Adding cross-platform CI/testing infrastructure (Linux, macOS runners) and multi-viewport responsive design (tablet/iPad) expands scope beyond the core MVP feature (Windows desktop character sheet display and persistence).
2. **Technology Stack**: Vite + React + i18next are cross-platform compatible; no platform-specific code required for MVP functionality.
3. **Risk**: MVP feature uses only open-source, cross-platform libraries (MIT licenses). Desktop-only, Windows-only scope reduces environmental complexity and CI infrastructure overhead.
4. **Timeline**: Focusing on Windows desktop MVP allows faster shipping and user feedback collection before investing in full cross-platform CI, multi-OS testing, and responsive tablet support.
5. **User Base**: Initial MVP targets desktop users on Windows; multi-platform and tablet support are addressed in Phase 2+ based on usage data and feature request priority.

---

## Compliance Note

This decision represents a deliberate trade-off against the constitution's platform support principle ("MUST prioritize... [cross-platform] compatibility"). It defers compliance to Phase 2+ and is justified by the "Small, Minimal Features" principle and documented here to satisfy transparency and governance requirements.

**For future phases**: When scaling the project beyond MVP or adding platform-dependent features (e.g., local file handling, system integrations), cross-platform CI (Linux, macOS) and responsive tablet design MUST be added and this decision MUST be re-evaluated. User feedback and feature requests will inform Phase 2+ prioritization.

---

## Related References

- Constitution: `.specify/memory/constitution.md` (Platform Support, Small Minimal Features)
- Feature Plan: `specs/001-dungeon-world-char-sheet/plan.md`
- Feature Tasks: `specs/001-dungeon-world-char-sheet/tasks.md`
- PR: [GitHub PR #21](https://github.com/Nicendredi/Nice-DW-Rodeo/pull/21)
