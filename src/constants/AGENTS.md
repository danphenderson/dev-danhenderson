# AGENTS.md

## Scope

These instructions apply to files under `src/constants/`.

## Purpose

Build-time stable configuration: route definitions, feature flags, command palette action registry, and the not-found recovery scoring logic.

Files:

- `siteRoutes.ts` — `SiteRouteDefinition` records for every route (`home`, `cv`, `climbing`, `photography`, `blog`, `not-found`). Each entry carries the path, display label, document title, description, OG image, keywords, and optional command-palette and recovery metadata. This is the single authoritative source for route paths; do not scatter path literals in pages or components.
- `featureFlags.ts` — runtime-environment-aware feature flag resolution via `isFeatureEnabled(flagId)`. Currently gates blog so route rendering, navigation, and command-palette behavior stay disabled in production.
- `routeActions.ts` — derives `SharedRouteAction[]` from routes that have `action` metadata. Exports `sharedRouteActions` (palette-visible) and `recoveryRouteActions` (all, sorted by `recoveryPriority`).
- `commandPaletteActions.ts` — assembles the full `CommandPaletteAction[]` registry from route actions, CV section entries (using `cvSectionMetadata`), photography albums, and blog posts.
- `recoveryContext.ts` — pure function `buildRecoveryContext(pathname)` that tokenizes an unknown path and scores it against the command palette registry to produce ranked `RecoverySuggestion[]` for the not-found page.

## Rules

- Route paths live only in `siteRoutes.ts`. Do not hardcode `/cv`, `/climbing`, etc. anywhere else; use `siteRouteMap[id].path`.
- Feature-gated routes and navigation must use `isFeatureEnabled()` from `featureFlags.ts`. Do not duplicate runtime-environment checks in pages or components.
- Adding a new route requires an entry in `siteRoutes.ts` and, when the route should appear in the command palette, a corresponding `action` block with `includeInCommandPalette: true`.
- If a route is gated, express that through `siteRoutes.ts` metadata and `featureFlags.ts` so route JSX, primary navigation, command-palette entries, and not-found recovery all stay consistent.
- `commandPaletteActions.ts` is derived data; it consumes `cvSectionMetadata`, `photographyCategories`, `blogPosts`, and `sharedRouteActions`. Do not push content updates into it directly — update the source modules.
- Type definitions here (`SiteRouteId`, `CommandPaletteAction`, `RecoverySuggestion`, `RecoveryContext`) express the shape of this module's own data. They are consumed by pages and components that use these constants; they are not general domain types and do not belong in `src/types/`.
- `recoveryContext.ts` is pure logic: no React, no hooks, no direct imports from components. Keep it that way.
