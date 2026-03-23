---
applyTo: 'src/constants/**/*.ts'
---

These files define build-time stable route, feature-flag, command-palette, and recovery configuration. Preserve route authority, derived-data boundaries, and pure recovery logic.

- Keep route paths, gating, and route metadata centralized in `siteRoutes.ts` and `featureFlags.ts`; do not recreate them in pages or components.
- Treat `routeActions.ts` and `commandPaletteActions.ts` as derived registries; update their source modules instead of patching derived entries directly.
- Keep `recoveryContext.ts` pure and framework-agnostic.
- For file-by-file ownership and type-boundary rules, follow `src/constants/AGENTS.md`.

For more detail, follow `src/constants/AGENTS.md`.
