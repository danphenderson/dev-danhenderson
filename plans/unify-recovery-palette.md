# Unify Recovery Palette

## Goal

Refactor recovery CTA flows so the provider-backed global command palette is the only searchable dialog surface, while the shared recovery panel remains responsible only for contextual recovery metadata and entry CTAs.

## Why

The current recovery slice landed a working seeded-search experience, but it duplicates palette filtering, dialog rendering, and selection behavior inside the recovery panel. That duplication increases drift risk between keyboard-driven and recovery-driven entry points, and it makes the current step-4 behavior harder to preserve as the palette evolves.

## Constraints

- Preserve the fully client-side React + TypeScript SPA architecture.
- Preserve BrowserRouter basename behavior and direct navigation compatibility.
- Preserve PUBLIC_URL-compatible asset resolution.
- Keep the provider-backed global palette as the single dialog surface.
- Preserve the staged step-4 recovery behavior: explicit CTA entry, seeded recovery queries, shared route/action registries, legacy photography slug redirects, no-index metadata, and photography above-the-fold rendering.
- Keep keyboard shortcuts, route-close behavior, and hash-fragment scrolling in the global palette.
- Keep changes narrowly scoped to recovery/palette unification without broad route or styling refactors.

## Affected files and responsibilities

- `src/CommandPaletteProvider.tsx`: own global palette open state, query state, and seeded open API.
- `src/components/GlobalCommandPalette.tsx`: remain the sole command palette dialog and selection surface.
- `src/components/RouteRecoveryPanel.tsx`: reduce to recovery metadata, CTA entry point, and shared recovery route presentation.
- `src/constants/commandPaletteActions.ts`: remain the authoritative action registry consumed by palette filtering.
- `src/constants/recoveryContext.ts`: continue deriving seeded query and contextual suggestions.
- `src/utils/commandPaletteSearch.ts`: shared palette search normalization and matching helper for palette-related consumers.
- `src/pages/NotFound.tsx`: continue consuming the shared recovery panel with contextual data.
- `src/pages/PhotographyCategory.tsx`: continue consuming the shared recovery panel for invalid album slugs.
- `test/e2e/not-found.spec.ts`: assert the recovery CTA opens the single global palette with the expected seeded query.
- `test/e2e/photography.spec.ts`: assert invalid album recovery uses the same global palette surface.
- `plans/contextual-not-found-recovery.md`: record that recovery no longer owns a separate dialog.
- `plans/v1-stretch-goals-integration.md`: update the parent stretch-goals record after validation.

## Proposed approach

Keep the provider as the single source of truth for palette visibility and query text, and teach the recovery CTA to call `openPalette(initialQuery)` at interaction time. Extract search normalization and action matching into a small shared helper so filtering semantics remain identical anywhere palette-aware results are rendered. Simplify the recovery panel into a contextual wrapper around shared route suggestions plus a seeded CTA, while leaving selection, hash scrolling, and route-aware closing in the global palette.

## Execution steps

1. Add a small shared search helper for command palette filtering and update the global palette to consume it.
2. Extend the provider API only as needed so recovery CTAs can open the global palette with a seeded query without owning local dialog state.
3. Remove the recovery panel's local dialog, query state, filtering logic, and navigation logic, replacing them with provider-backed CTA behavior.
4. Update affected route consumers only as needed to fit the slimmer recovery panel contract while preserving existing recovery copy and metadata.
5. Update the targeted Playwright specs to assert a single palette dialog and seeded query behavior from recovery CTAs.
6. Run build, targeted Playwright coverage, and browser validation for `/unknown` and `/photography/landscap` on desktop and mobile viewports.
7. Update the recovery slice plan and parent stretch-goals plan with the new single-surface behavior and the validation that actually ran.

## Validation plan

- `npm run build`
- `npx playwright test test/e2e/not-found.spec.ts`
- `npx playwright test test/e2e/photography.spec.ts`
- Browser validation on `/unknown` and `/photography/landscap` at one desktop and one mobile viewport
- Verify a hash-fragment action such as a CV section still scrolls correctly after opening the palette from a recovery CTA

## Risks and rollback

- The provider can accidentally seed query state at render time instead of interaction time, causing stale recovery queries.
- Removing the local recovery dialog can break invalid photography recovery if the CTA/provider handoff is incomplete.
- Global palette close timing remains sensitive to route transitions and hash navigation.
- Roll back by restoring the local recovery dialog in `RouteRecoveryPanel.tsx` and removing the provider-backed CTA integration if the single-surface approach regresses recovery flows.

## Progress notes

- Status: Complete.
- Added `src/utils/commandPaletteSearch.ts` so command-palette search normalization and match semantics live in one shared helper instead of being duplicated across palette surfaces.
- Removed the local recovery dialog, local query state, local filtering logic, and local navigation logic from `src/components/RouteRecoveryPanel.tsx`; the recovery CTA now opens the provider-backed global palette with `openPalette(suggestedPaletteQuery)` at interaction time.
- Kept `src/components/GlobalCommandPalette.tsx` as the sole searchable dialog surface, preserving keyboard shortcuts, pathname-based close behavior, and same-route hash-fragment scrolling.
- Route consumers did not need API changes because the recovery panel remained CTA-plus-metadata focused after the dialog removal.
- Updated `test/e2e/not-found.spec.ts` and `test/e2e/photography.spec.ts` to assert a single `Command palette` dialog and seeded recovery queries.
- Adjusted the general photography-card assertion to scroll the page before checking the final album card, because that card still mounts on view and the previous assertion tried to scroll to a node that was not yet rendered.
- Validation actually run: `npm run build`, `npx playwright test test/e2e/not-found.spec.ts`, `npx playwright test test/e2e/photography.spec.ts`, plus browser validation on `/unknown` and `/photography/landscap` at desktop `1440x1200` and mobile `390x844`, including seeded palette open, Escape close, and recovery-driven navigation to `/cv#cv-about` with hash scrolling intact.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
