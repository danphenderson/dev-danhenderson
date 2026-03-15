# Contextual Not-Found Recovery

## Goal

Complete stretch-goals execution step 4 by turning the current generic 404 flow into a path-aware recovery experience that reuses the shared route/action registry, can hand users directly into the command palette, and applies the same recovery model to invalid photography album slugs.

## Why

The current not-found baseline proves that the shared route registry can drive generic recovery links, but it still leaves users with a dead-end experience:

- the 404 page does not interpret the failed URL
- the command palette is only hinted at, not directly integrated into recovery
- invalid photography album slugs still use a separate recovery branch
- existing tests do not verify command-palette-assisted recovery from an unknown route

This slice closes the next resilience gap without changing the app's client-side SPA architecture.

## Constraints

- Preserve the fully client-side React + TypeScript SPA architecture.
- Preserve BrowserRouter basename behavior and direct navigation compatibility.
- Preserve PUBLIC_URL-compatible asset resolution.
- Keep shared route/action registries authoritative.
- Do not introduce backend infrastructure or new remote lookups.
- Preserve legacy photography slug redirects before applying invalid-slug recovery.
- Keep the work narrowly scoped to step 4 of the parent v1 stretch-goals plan.

## Affected files and responsibilities

- `src/App.tsx`: host the command-palette controller/provider around the shared shell.
- `src/CommandPaletteProvider.tsx`: app-level palette state and programmatic open/query control.
- `src/components/GlobalCommandPalette.tsx`: consume shared palette state while preserving keyboard shortcuts and hash navigation.
- `src/components/RouteRecoveryPanel.tsx`: shared presentational recovery UI for catch-all and invalid-album states.
- `src/constants/commandPaletteActions.ts`: keep action metadata authoritative while exposing enough context for recovery ranking.
- `src/constants/recoveryContext.ts`: derive contextual recovery suggestions from the attempted path and shared action sources.
- `src/pages/NotFound.tsx`: render path-aware copy, contextual suggestions, and seeded recovery CTA handoff.
- `src/pages/PhotographyCategory.tsx`: align invalid album slug recovery with the same shared recovery model.
- `test/e2e/not-found.spec.ts`: verify direct unknown-route recovery, palette opening, and suggested navigation.
- `test/e2e/photography.spec.ts`: verify invalid album slug recovery and legacy slug redirect behavior.
- `plans/v1-stretch-goals-integration.md`: update the parent ExecPlan once the slice is implemented and validated.

## Proposed approach

Add a small deterministic recovery adapter on top of the existing shared route and command-palette registries instead of introducing route-local lists or server-driven suggestions. Expose command-palette open/query state through an app-level provider for the shared global palette, and use a seeded recovery-search CTA in the recovery panel so route pages can reliably hand users into search without depending on route-transition timing. Reuse a single presentational recovery panel in both the catch-all route and the invalid photography album branch so the slice lands as one coherent recovery model.

## Execution steps

1. Create a route-recovery adapter that inspects the attempted pathname and ranks existing route, CV section, and photography album actions.
2. Add a thin app-level command-palette provider that supports both keyboard-driven opening and programmatic opening with a seeded query.
3. Upgrade the catch-all not-found page to show contextual suggestions and a seeded recovery-search CTA for unmatched paths.
4. Align invalid photography album slug handling with the same recovery model while preserving legacy slug redirects.
5. Expand route-level Playwright coverage for both the catch-all route and the photography invalid-slug flow.
6. Run the narrowest relevant validation and update the parent ExecPlan with the exact touched files and checks actually performed.

## Validation plan

- `npm run build`
- `npx playwright test test/e2e/not-found.spec.ts`
- `npx playwright test test/e2e/photography.spec.ts`
- Browser validation on an unknown route and an invalid photography slug at one mobile viewport and one desktop viewport

## Risks and rollback

- Route-transition timing can make automatic recovery dialogs unreliable if they are mounted indirectly through animated shells.
- Recovery ranking can become opaque if fuzzy matching is too loose.
- Shared recovery UI can drift into a route-specific abstraction if page-owned copy is pushed into the shared component.
- Roll back by reverting the command-palette provider and recovery-context modules first; the route pages can then fall back to their previous independent recovery behavior.

## Progress notes

- Status: Complete
- Implemented `src/constants/recoveryContext.ts` to derive attempted-path labels, route hints, seeded search queries, and ranked recovery suggestions from the shared route and command-palette registries.
- Added `src/components/RouteRecoveryPanel.tsx` as the shared recovery surface for both the catch-all 404 page and invalid photography album slugs, then followed it with `plans/unify-recovery-palette.md` so the panel no longer owns a second searchable dialog.
- Wrapped the app shell in `src/CommandPaletteProvider.tsx` and kept `src/components/GlobalCommandPalette.tsx` keyboard-driven and route-aware. Recovery now uses the same global palette surface with an explicit seeded CTA instead of either automatic opening or a route-local fallback dialog.
- Updated `src/pages/NotFound.tsx`, `src/pages/PhotographyCategory.tsx`, and `src/pages/Photography.tsx` so contextual recovery renders reliably above the fold.
- Updated `test/e2e/not-found.spec.ts` and `test/e2e/photography.spec.ts` to cover contextual recovery, invalid album slugs, legacy slug redirects, and the single global palette surface against the current route structure.
- Validation actually run: `npm run build`, `npx playwright test test/e2e/not-found.spec.ts`, `npx playwright test test/e2e/photography.spec.ts`, plus browser checks on `/unknown` and `/photography/landscap` at desktop `1440x1200` and mobile `390x844` with no console errors, clean Escape close on the palette, intact seeded queries, intact recovery-driven CV hash scrolling, and no horizontal overflow in the checked viewports.
- This plan implements execution step 4 from `plans/v1-stretch-goals-integration.md`.
- Recovery suggestions continue to derive from shared registries rather than hardcoded route lists.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
