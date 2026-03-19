---
applyTo: 'src/constants/**/*.ts'
---

These files define build-time stable route, feature-flag, command-palette, and recovery configuration. Preserve route authority, derived-data boundaries, and pure recovery logic.

- Keep route path literals centralized in `siteRoutes.ts`; use route metadata instead of scattering hardcoded paths.
- Use `featureFlags.ts` and `isFeatureEnabled()` for gated behavior; do not hand-roll runtime-environment checks in pages or components.
- Treat `routeActions.ts` and `commandPaletteActions.ts` as derived registries; update their source modules instead of patching derived entries directly.
- Keep route metadata, gating, navigation, and recovery behavior expressed through `siteRoutes.ts` and related constants so routes, nav, and command-palette entries stay in sync.
- Keep `recoveryContext.ts` pure and framework-agnostic.
- Keep types defined here local to this configuration layer unless broader reuse clearly belongs in `src/types/`.

For more detail, follow `src/constants/AGENTS.md`.
