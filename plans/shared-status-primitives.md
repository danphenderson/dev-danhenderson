# Shared Status Primitives

## Goal

Normalize shared route-action and data-status primitives so later recovery, analytics, and installability slices can extend one canonical foundation instead of adding route-local registries.

## Why

The route registry exists, but action metadata still has a second source in command-palette assembly and only the GitHub hook exposes any notion of freshness or fallback provenance. Later work will multiply one-off logic unless those primitives are shared first.

## Constraints

- Preserve the client-side SPA architecture and BrowserRouter basename behavior.
- Keep `src/constants/siteRoutes.ts` as the canonical route registry.
- Do not change the source data shapes in `src/data/climbs.ts` or `src/data/photography.ts`.
- Avoid route-local fallback or recovery registries.
- Keep current page behavior stable while this foundation lands.

## Affected files and responsibilities

- `src/types/data.ts`: shared status primitives usable across route domains.
- `src/constants/siteRoutes.ts`: canonical route metadata plus reusable action/status descriptors.
- `src/constants/routeActions.ts`: shared route-action derivation for command palette and later recovery surfaces.
- `src/constants/commandPaletteActions.ts`: consumer of shared route actions.
- `src/hooks/githubProfileData.ts`: remote-data freshness, cache, and fallback provenance metadata.
- `src/hooks/useGithubProfile.ts`: hook-level status surface for CV consumers.
- `src/hooks/useClimbingData.ts`: static dataset status surface without changing the dataset.
- `src/hooks/usePhotographyData.ts`: static gallery status surface without inventing async state.
- `test/unit/constants/*.test.ts`: shared action derivation coverage.
- `test/unit/hooks/*.test.ts`: status normalization coverage.

## Proposed approach

Add shared status types, move route action metadata into the canonical route registry, derive shared route actions from that registry, and extend existing hooks to return explicit status metadata alongside their current data payloads. Preserve current pages as consumers; do not introduce new route UI in this slice.

## Execution steps

1. Add route-agnostic shared status types for source, freshness, fallback, and reason codes.
2. Extend the route registry with reusable action and status descriptors.
3. Derive shared route actions from the route registry and switch the command palette to consume them.
4. Normalize GitHub status metadata for initial fallback, live fetch, partial fallback, cache hits, and hard failures.
5. Add static-data status descriptors for climbing and photography hooks.
6. Add unit coverage for the shared route actions and normalized hook status surfaces.

## Validation plan

- `CI=true npm test -- --watch=false --runInBand test/unit/constants/routeActions.test.ts test/unit/constants/commandPaletteActions.test.ts test/unit/hooks/useGithubProfile.test.ts test/unit/hooks/useClimbingData.test.ts test/unit/hooks/usePhotographyData.test.ts`
- `npm run build`

## Risks and rollback

- Route-action metadata can drift again if new route actions are added outside `siteRoutes.ts`.
- GitHub cache-state assertions can become brittle if tests couple to implementation timing.
- Roll back this slice by reverting the shared action module and hook status additions without affecting page layout or route composition.

## Progress notes

- Status: In progress
- Completed shared status types in `src/types/data.ts`.
- Completed canonical route action metadata in `src/constants/siteRoutes.ts` and shared derivation in `src/constants/routeActions.ts`; the `not-found` route intentionally has no action block because it is a recovery surface rather than a destination.
- Completed status normalization in `useGithubProfile`, `useClimbingData`, and `usePhotographyData`, while keeping current route UIs behaviorally unchanged.
- Completed unit coverage for shared route-action derivation and the normalized hook status surfaces.
- Static routes intentionally expose bundled-content status instead of pretending to have live freshness.
- Remaining work in later slices is UI consumption: not-found recovery actions, CV reliability/freshness surfacing, climbing freshness copy, and photography freshness/share affordances still need to read the shared status payloads.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
