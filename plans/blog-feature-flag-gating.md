# Blog Feature Flag Gating

## Goal

Hide the blog from production builds while keeping it available in development and explicit test builds, and ensure every user-facing blog entry point follows the same feature-flag decision.

## Why

The repository needs a reusable feature-flag system for upcoming gated work. The blog is the first feature that should be enabled only in development and test contexts. Production users should not see blog navigation or command-palette entries, and direct blog URLs should fall through to the existing not-found experience.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and direct-link behavior.
- Keep changes narrowly scoped to feature gating, route discovery, test-build wiring, and focused regression coverage.
- Do not rename stable routes, exported types, or content fields outside the minimum needed to add reusable flag metadata.
- Keep the production build check distinct from browser E2E coverage.

## Affected files and responsibilities

- `src/constants/featureFlags.ts`: central environment-aware feature-flag registry.
- `src/constants/siteRoutes.ts`: canonical route registry with optional feature-flag metadata and enabled-route exports.
- `src/constants/routeActions.ts`: derives enabled route actions from filtered routes.
- `src/constants/commandPaletteActions.ts`: removes blog post actions when the blog flag is disabled.
- `src/App.tsx`: only registers blog routes when the feature is enabled so disabled blog URLs fall through to `NotFound`.
- `package.json`: adds a dedicated test-runtime build command for E2E.
- `.github/workflows/build.yml`: keeps production build validation while running Playwright against a test-runtime build.
- `README.md`: documents the runtime override and the difference between production and E2E builds.
- `test/unit/constants/*.test.ts`, `test/unit/App.test.tsx`: focused regression coverage for feature-flag behavior.

## Proposed approach

Add a small central flag registry keyed by runtime environment. Resolve the environment from `REACT_APP_RUNTIME_ENV` first and fall back to `NODE_ENV`. Mark the blog as enabled in `development` and `test`, disabled in `production`. Keep `siteRouteMap` as the full canonical registry, but derive `siteRoutes` and `primaryNavigationRoutes` from enabled routes only. Gate blog route registration and blog command-palette post actions behind the same flag. Preserve browser blog coverage by adding a separate test-runtime build for Playwright instead of weakening the production build behavior.

## Execution steps

1. Add the central feature-flag registry and environment resolution helpers.
2. Add route-level feature-flag metadata and export only enabled route collections.
3. Gate blog route registration in `App` and gate blog command-palette post actions.
4. Add a dedicated E2E build command and update CI so Playwright uses a test-runtime build.
5. Add focused unit coverage for environment resolution, route filtering, command-palette filtering, and production `/blog` fallback behavior.
6. Update README documentation and run focused validation.

## Validation plan

- `CI=true npm test -- --watch=false --runInBand test/unit/constants/featureFlags.test.ts test/unit/constants/siteRoutes.test.ts test/unit/constants/commandPaletteActions.test.ts test/unit/App.test.tsx`
- `npm run build`
- `npm run build:e2e`
- `npx playwright test test/e2e/blog.spec.ts`

## Risks and rollback

- Route filtering can accidentally remove metadata consumers if `siteRouteMap` is not kept as the full canonical registry.
- A pure production check would disable blog in Playwright because the browser tests currently serve a built bundle.
- Roll back by removing the new feature-flag registry, deleting route-level flag metadata, and reverting the E2E build split.

## Progress notes

- Plan created before source edits.
- Added `src/constants/featureFlags.ts` and threaded the blog flag through `siteRoutes`, `commandPaletteActions`, and `App`.
- Added `build:e2e`, updated the Playwright CI job to build a test-runtime bundle, and documented the runtime override in `README.md`.
- Focused Jest validation passed for `featureFlags`, `siteRoutes`, `commandPaletteActions`, and `App`.
- `npm run build` and `npm run build:e2e` both passed after the branch's concurrent style-system changes settled.
- Browser validation confirmed the production home route hides the Blog link and production `/blog` resolves to the existing not-found experience.
- `npx playwright test test/e2e/blog.spec.ts` passed against the test-runtime build, preserving blog browser coverage for E2E.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
