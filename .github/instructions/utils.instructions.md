---
applyTo: 'src/utils/**/*.ts,src/utils/**/*.tsx'
---

These files are pure, framework-agnostic helpers. Preserve purity and reuse the existing canonical helpers for assets, dates, and command-palette search.

- Do not add React, hooks, MUI, or component imports here.
- Use `resolvePublicAssetPath` for local asset URLs instead of manual `PUBLIC_URL` concatenation.
- Keep CSS easing constants in `src/styles/springEasing.ts` and shared types in `src/types/`.
- Add only pure helpers here; anything stateful belongs in a hook or component layer instead.

For more detail, follow `src/utils/AGENTS.md`.
