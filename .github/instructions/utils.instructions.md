---
applyTo: 'src/utils/**/*.ts,src/utils/**/*.tsx'
---

These files are pure, framework-agnostic helpers. Preserve purity and reuse the existing canonical helpers for assets, dates, and command-palette search.

- Keep this layer pure and framework-agnostic: no React, hooks, MUI, or component imports.
- Reuse canonical helpers such as `resolvePublicAssetPath` instead of rebuilding the same logic elsewhere.
- Keep CSS easing constants in `src/styles/` and shared cross-layer types in `src/types/`.
- Use `src/utils/AGENTS.md` for helper ownership and edge-case rules.

For more detail, follow `src/utils/AGENTS.md`.
