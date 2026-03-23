---
applyTo: 'src/pages/**/*.ts,src/pages/**/*.tsx'
---

These files own route-level composition for the portfolio SPA. Preserve the documented page scaffold patterns, stable route behavior, page composition boundaries, and static-hosting compatibility.

- Prefer small, local page edits over broad restructuring.
- Standard content routes should compose `PageFrame` with `SectionHeading` and `SectionCard` / `CVSectionCard`; reserve `BackgroundPaper` for the documented full-bleed exceptions.
- Keep pages declarative: pages compose content, components render reusable UI, and hooks provide data adaptation.
- Keep page-level state focused on orchestration concerns like filters, search, layout mode, or section timing; let feature components own local interaction state.
- Do not silently change route semantics, section ordering intent, navigation affordances, or breakpoint behavior without validating downstream impact.
- Use existing hooks and data modules instead of introducing ad hoc page-local data structures or fetch patterns.
- For route-level UI changes, validate the changed route directly and use `src/pages/AGENTS.md` plus `docs/engineering/testing-strategy.md` for the scoped browser-validation expectations, build variants, and repo-standard command shapes.

For more detail, follow `src/pages/AGENTS.md` and `docs/frontend/page-choreography.md`.
