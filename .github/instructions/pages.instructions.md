---
applyTo: "src/pages/**/*.ts,src/pages/**/*.tsx"
---

These files own route-level composition for the portfolio SPA. Preserve stable route behavior, page composition boundaries, and static-hosting compatibility.

- Prefer small, local page edits over broad restructuring.
- Keep pages declarative: pages compose content, components render reusable UI, and hooks provide data adaptation.
- Do not silently change route semantics, section ordering intent, navigation affordances, or breakpoint behavior without validating downstream impact.
- Use existing hooks and data modules instead of introducing ad hoc page-local data structures or fetch patterns.
- For route-level UI changes, validate the changed route directly and check navigation, responsive layout, and asset rendering as needed.

For more detail, follow `src/pages/AGENTS.md`.
