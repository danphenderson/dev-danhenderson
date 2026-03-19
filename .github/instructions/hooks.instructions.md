---
applyTo: 'src/hooks/**/*.ts,src/hooks/**/*.tsx'
---

These files are the adaptation layer between raw data sources and the page/component layer. Keep hooks focused on derivation, normalization, and stable side-effect boundaries.

- Keep hooks focused on derivation, normalization, memoization, and stable side-effect boundaries.
- Preserve graceful GitHub fallback behavior and avoid authenticated or server-side fetch patterns.
- Keep route orchestration out of hooks and move cross-layer exported types to `src/types/`.
- For hook-specific exceptions such as `useFuzzySearch` and blog tag ordering, follow `src/hooks/AGENTS.md`.

For more detail, follow `src/hooks/AGENTS.md`.
