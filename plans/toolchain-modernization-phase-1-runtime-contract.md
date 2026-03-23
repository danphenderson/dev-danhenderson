# Toolchain Modernization Phase 1 Runtime Contract

## Goal

Introduce a repo-owned runtime/build environment compatibility layer so the app no longer depends on scattered direct `process.env` reads across routes, hooks, utils, and shared components.

## Why

The current main app hardcodes CRA-era environment access patterns in multiple source files. That makes the later Vite cutover riskier because routing, asset resolution, feature gating, service worker registration, and build metadata all depend on hidden bundler globals. Centralizing those reads is the smallest useful first slice: it reduces coupling without changing the app's current runtime behavior.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Preserve the existing `REACT_APP_RUNTIME_ENV` feature-gating behavior.
- Preserve the existing build metadata contract for `build` and `build:e2e`.
- Preserve the current GitHub fallback behavior in development and test environments.
- Keep the scope limited to the environment compatibility layer and its immediate consumers; do not begin the Vite cutover in this slice.

## Affected files and responsibilities

- `src/utils/appEnvironment.ts`: new compatibility layer for app-level environment reads.
- `src/utils/assets.ts`: consume the shared public-base helper instead of reading `process.env.PUBLIC_URL` directly.
- `src/utils/buildInfo.ts`: build metadata now flows through the shared environment helper.
- `src/utils/serviceWorkerRegistration.ts`: service worker registration uses the shared env helper and canonical asset-path builder.
- `src/constants/featureFlags.ts`: runtime environment resolution uses the shared helper.
- `src/hooks/githubProfileData.ts`: dev/test GitHub API guard uses the shared helper.
- `src/App.tsx`: router basename comes from the shared helper.
- `src/components/photography/AlbumShareButton.tsx`: canonical album URLs use the shared public-base helper and route metadata.
- `src/components/text/UNSAFE_Typography.tsx`: development-only warning gate uses the shared helper.
- `src/utils/AGENTS.md`: document the new utility module.
- `test/unit/utils/appEnvironment.test.ts`: focused unit coverage for the new compatibility layer.

## Proposed approach

Add a small pure utility module under `src/utils/` that is the only source-level place allowed to read `process.env` for app runtime/build values. Update the current consumers to import explicit getters from that module while preserving their existing public exports and behavior. Keep the helper CRA-compatible for now so the current build still works unchanged; the later build-tool migration can then swap the helper implementation without revisiting all consumers.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Create a shared app-environment helper under `src/utils/` for `PUBLIC_URL`, `NODE_ENV`, `REACT_APP_RUNTIME_ENV`, `REACT_APP_ENABLE_GITHUB_API_IN_DEV`, and build metadata reads.
3. Update the direct env consumers in `src/utils/`, `src/constants/`, `src/hooks/`, and the touched shared components to use that helper.
4. Add focused unit coverage for the new helper and keep the existing consumer tests passing.
5. Run targeted validation for feature flags, asset resolution, build metadata, and the GitHub fallback path.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runInBand --testPathPattern=test/unit/utils/appEnvironment.test.ts test/unit/utils/assets.test.ts test/unit/utils/buildInfo.test.ts test/unit/constants/featureFlags.test.ts test/unit/constants/siteRoutes.test.ts test/unit/constants/commandPaletteActions.test.ts test/unit/hooks/useGithubProfile.test.ts`

## Risks and rollback

- Risk: changing env access in feature flags could accidentally alter blog gating between production and test builds.
- Risk: changing public-base handling could break `PUBLIC_URL`-aware asset paths or recovery links.
- Risk: service worker registration can regress if the generated root-relative URL changes.
- Rollback is contained to the files above; if this slice regresses behavior, revert the compatibility-layer patch without blocking later build-tool work.

## Progress notes

- 2026-03-22: Started implementation with a dedicated app-environment compatibility layer and a narrow migration of the current direct env consumers.
- 2026-03-22: Added `src/utils/appEnvironment.ts` so app-level `PUBLIC_URL`, `NODE_ENV`, and `REACT_APP_*` reads now flow through one compatibility surface instead of appearing inline across the app.
- 2026-03-22: Migrated the current direct env consumers in `src/utils/`, `src/constants/`, `src/hooks/`, `src/App.tsx`, and the touched shared components to the new helper while preserving their existing public exports and behavior.
- 2026-03-22: Added focused unit coverage in `test/unit/utils/appEnvironment.test.ts` and validated the touched env-driven paths with targeted Jest coverage plus a successful `npm run build`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
