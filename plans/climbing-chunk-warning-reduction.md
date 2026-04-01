# Climbing Chunk Warning Reduction

## Goal

Remove the production Vite large-chunk warning driven by the Climbing route bundle while preserving existing SPA routing, direct-link behavior, and the current Climbing page UX.

## Why

The production build currently emits a large-chunk warning because the lazy-loaded Climbing route bundles `@mui/x-data-grid`, `fuse.js`, and `src/data/climbs.ts` into a single emitted file above 500 kB. The route is already lazily loaded, so the debt is in bundle composition rather than route wiring.

## Constraints

- Preserve the existing route-level lazy-loading contract in `src/App.tsx`.
- Preserve `PUBLIC_URL`-safe build behavior in `vite.config.ts`.
- Do not redesign the Climbing page or replace DataGrid as part of this fix.
- Keep `src/data/climbs.ts` as the source of truth and avoid schema/content changes.
- Run production and route validation sequentially; do not run `build` and `build:e2e` in parallel.

## Affected files and responsibilities

- `vite.config.ts`: Add targeted Rollup manual chunking for Climbing-heavy dependencies.
- `src/App.tsx`: Reference-only; the existing route lazy-loading behavior should remain unchanged.
- `src/pages/Climbing.tsx`: Fallback-only target if build-level chunking is insufficient.
- `src/hooks/useClimbingData.ts`: Reference-only seam for the climbs dataset boundary.
- `test/e2e/climbing.spec.ts`: Route-level validation for `/climbing`.
- `test/e2e/smoke.spec.ts`: Production direct-navigation validation.

## Proposed approach

Add an `output.manualChunks` function in `vite.config.ts` that isolates:

- `@mui/x-data-grid`
- `fuse.js`
- `src/data/climbs.ts`

This keeps the current Climbing route implementation intact while splitting the emitted payload across smaller on-demand chunks. Only if the warning remains should the implementation introduce a route-local lazy component boundary in `src/pages/Climbing.tsx`.

## Execution steps

1. Add the ExecPlan.
2. Update `vite.config.ts` with targeted manual chunk rules for Climbing-heavy modules.
3. Run `npm run build` and inspect the emitted chunk output.
4. If the warning is gone, stop and keep the fix build-config only.
5. Validate `/climbing` via Playwright and smoke coverage.
6. If the warning remains, revisit with a route-local lazy split as a follow-up iteration.

## Validation plan

- `npm run build`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/climbing.spec.ts`
- `npm run build && npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`

## Risks and rollback

- Manual chunking can create too many small requests if chunk boundaries are too granular.
- Build-level changes can affect route chunk loading if misconfigured, so `/climbing` direct navigation must be revalidated.
- Rollback is straightforward: remove the targeted `manualChunks` rules from `vite.config.ts`.

## Progress notes

- Initial inspection showed routes are already lazily loaded in `src/App.tsx`.
- Initial inspection showed the Climbing route eagerly imports `@mui/x-data-grid`, `useFuzzySearch`, and `useClimbingData`, with the dataset coming from `src/data/climbs.ts`.
- The initial `manualChunks` change split the original Climbing bundle, but the extracted `vendor-data-grid` chunk still exceeded 500 kB, so build-only chunking was not sufficient on its own.
- The final fix replaced the Climbing page's DataGrid usage with a feature-local `ClimbingRouteTable` component built from lightweight MUI table primitives, preserving the existing route tables, search inputs, pagination, and Mountain Project links without the oversized DataGrid dependency.
- Updated the Climbing-specific production smoke expectations from `grid` to semantic `table` roles after the table replacement.
- Validation passed with `npm run build` showing no large-chunk warning, focused Jest coverage for `test/unit/pages/Climbing.test.tsx`, `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/climbing.spec.ts`, and targeted production smoke coverage for the two Climbing-related smoke cases.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
