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
- `src/pages/NotFound.tsx`: first recovery-path consumer of the shared route actions.
- `src/pages/CV.tsx`: first route-level consumer of normalized GitHub status metadata.
- `src/components/cv/CVGitHubSection.tsx`: provenance and freshness presentation for the GitHub slice.
- `test/unit/constants/*.test.ts`: shared action derivation coverage.
- `test/unit/hooks/*.test.ts`: status normalization coverage.
- `test/unit/pages/*.test.tsx`: recovery and route-level status presentation coverage.

## Proposed approach

Add shared status types, move route action metadata into the canonical route registry, derive shared route actions from that registry, extend existing hooks to return explicit status metadata alongside their current data payloads, and wire the first recovery and freshness consumers to prove the primitives are reusable.

## Execution steps

1. Add route-agnostic shared status types for source, freshness, fallback, and reason codes.
2. Extend the route registry with reusable action and status descriptors.
3. Derive shared route actions from the route registry and switch the command palette to consume them.
4. Normalize GitHub status metadata for initial fallback, live fetch, partial fallback, cache hits, and hard failures.
5. Add static-data status descriptors for climbing and photography hooks.
6. Add unit coverage for the shared route actions and normalized hook status surfaces.
7. Use shared recovery actions on the not-found route instead of hardcoded CTA buttons.
8. Surface normalized GitHub freshness and fallback provenance in the CV route.

## Validation plan

- `npm test -- --watch=false --runInBand test/unit/constants/commandPaletteActions.test.ts test/unit/hooks/useGithubProfile.test.ts test/unit/hooks/useClimbingData.test.ts test/unit/hooks/usePhotographyData.test.ts test/unit/components/cv/CVGitHubSection.test.tsx test/unit/components/cv/CVGitHubSectionOffsets.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CV.runtime.test.tsx test/unit/pages/NotFound.test.tsx`
- `npx playwright test test/e2e/not-found.spec.ts`
- `npx playwright test test/e2e/cv.github.spec.ts`
- `npm run build`

## Risks and rollback

- Route-action metadata can drift again if new route actions are added outside `siteRoutes.ts`.
- GitHub cache-state assertions can become brittle if tests couple to implementation timing.
- Roll back this slice by reverting the shared action module and hook status additions without affecting page layout or route composition.

## Progress notes

- Status: In progress
- Shared status types and route-action derivation are being introduced first so later not-found recovery and CV reliability UI can reuse them.
- Static routes intentionally expose bundled-content status instead of pretending to have live freshness.
- The shared route actions now power not-found recovery CTAs instead of a hardcoded button list.
- The CV GitHub section now presents freshness, source, and fallback provenance from the normalized hook status surface.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
