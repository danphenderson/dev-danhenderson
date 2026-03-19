---
applyTo: 'src/hooks/**/*.ts,src/hooks/**/*.tsx'
---

These files are the adaptation layer between raw data sources and the page/component layer. Keep hooks focused on derivation, normalization, and stable side-effect boundaries.

- Preserve graceful GitHub fallback behavior and avoid authenticated or server-side fetch patterns.
- Keep route orchestration, layout state, and page-level behavior out of hooks.
- Move shared exported types to `src/types/` instead of letting hook-local types spread across layers.
- Keep `useFuzzySearch` generic and preserve deterministic tag ordering when touching `useBlogData`.

For more detail, follow `src/hooks/AGENTS.md`.
