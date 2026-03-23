# Static Hook Status Narrowing

## Goal

Remove the stale remote-style status surface from the bundled blog, photography, and climbing hooks while preserving the real remote/fallback status flow used by the GitHub-backed CV section.

After this change, the static content hooks should expose only synchronous bundled data and selectors, and the climbing route should still show a bundled-data recency label without carrying a fake async status object through the hook API.

## Why

The current static content hooks model bundled data as though it were remote and failure-prone:

- `useBlogData()` returns a `SharedDataStatus` object that no page reads.
- `usePhotographyData()` returns the same style of `SharedDataStatus` object that no page reads.
- `useClimbingData()` returns the same abstraction even though only a single freshness label is consumed.

This adds API surface, duplicated boilerplate, and mental overhead without corresponding runtime behavior. The GitHub-backed CV flow still needs the richer status contract because it models loading, cache, fallback, and partial-failure states, so this patch should narrow the abstraction instead of deleting it wholesale.

## Constraints

- Preserve the client-side SPA architecture, direct-link routing behavior, and `PUBLIC_URL` compatibility.
- Keep the change narrowly scoped to static data hooks, shared data types, climbing consumers, and focused validation.
- Preserve the current GitHub-backed CV fallback behavior and tooltip messaging.
- Do not broaden this patch into adjacent cleanup such as removing unused photography metadata helpers unless required for correctness.
- Do not revert or overwrite unrelated in-progress work already present in the branch.

## Affected files and responsibilities

- `src/hooks/useBlogData.ts` — remove the dead bundled-status object from the blog selector hook.
- `src/hooks/usePhotographyData.ts` — remove the dead bundled-status object while keeping the rest of the bundled content API stable.
- `src/hooks/useClimbingData.ts` — remove `status` and keep climbing recency represented once through analytics data.
- `src/types/data.ts` — stop owning remote/fallback status primitives once static hooks no longer consume them.
- `src/types/cv.ts` — become the canonical home for `SharedDataStatus` and related GitHub/CV-only status primitives.
- `src/hooks/useGithubProfile.ts` — update the status-type import path.
- `src/hooks/githubProfileData.ts` — preserve the GitHub status helpers while switching to the new type home.
- `src/components/cv/CVGitHubStatusTooltip.tsx` — preserve runtime behavior while updating the status-type import path.
- `src/components/climbing/ClimbingAnalytics.tsx` — derive the bundled freshness copy from analytics instead of consuming a fake status prop.
- `src/pages/Climbing.tsx` — drop the extra `status` wiring from the climbing page.
- `test/unit/hooks/useBlogData.test.ts` — stop asserting on the removed fake status object.
- `test/unit/hooks/usePhotographyData.test.ts` — stop asserting on the removed fake status object.
- `test/unit/hooks/useClimbingData.test.ts` — validate climbing recency through analytics instead of fake status data.
- `test/unit/components/climbing/ClimbingAnalytics.test.tsx` — update the slimmer prop contract while preserving the visible freshness-label assertion.
- `test/unit/pages/Climbing.test.tsx` — update the mocked hook return shape.
- `test/unit/hooks/useGithubProfile.test.ts` — preserve GitHub status behavior while adjusting any imports affected by the type move.
- `test/unit/components/cv/CVGitHubStatusTooltip.test.tsx` — preserve GitHub status behavior while adjusting any imports affected by the type move.

## Proposed approach

Use the smallest change set that removes the stale abstraction at the root:

1. Collapse the static hooks to synchronous bundled-data selectors only.
2. Replace climbing's fake status prop with a locally derived caption based on `analytics.overview.mostRecentDate`.
3. Narrow `SharedDataStatus` and its helper types to the CV/GitHub domain by moving them from `src/types/data.ts` to `src/types/cv.ts` without renaming them.
4. Update focused tests to assert on real behavior instead of synthetic status scaffolding.

This keeps the hook/page/component layering intact: hooks still adapt bundled data, pages still compose route content, and components still render presentation.

## Execution steps

1. Add this ExecPlan and keep it updated as work progresses.
2. Remove `status` from `useBlogData()` and `usePhotographyData()`.
3. Remove `status` from `useClimbingData()` and keep recency data only in analytics.
4. Move `SharedDataStatus` and related types from `src/types/data.ts` to `src/types/cv.ts`.
5. Update GitHub/CV imports to use the relocated types.
6. Update climbing consumers to derive the bundled freshness label without a status prop.
7. Update focused unit and route tests for the new API shape.
8. Run focused validation plus build and relevant Playwright coverage.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runTestsByPath test/unit/hooks/useBlogData.test.ts test/unit/hooks/usePhotographyData.test.ts test/unit/hooks/useClimbingData.test.ts test/unit/pages/Climbing.test.tsx test/unit/components/climbing/ClimbingAnalytics.test.tsx test/unit/hooks/useGithubProfile.test.ts test/unit/components/cv/CVGitHubStatusTooltip.test.tsx`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts test/e2e/photography.spec.ts test/e2e/climbing.spec.ts`
- Browser validation on `/climbing` at mobile and desktop widths, then spot checks on `/blog` and `/photography` if browser tooling remains available.

## Risks and rollback

- Moving the shared status types could miss a lingering import and cause type errors in CV/GitHub code.
- Replacing climbing's `status` prop could accidentally change the displayed copy if the recency label logic drifts.
- Tests that mock hook return shapes may fail in multiple places once the stale `status` field disappears.

Rollback approach:

- If the type move causes unexpected coupling, keep the static hook cleanup and temporarily leave `SharedDataStatus` in `src/types/data.ts`.
- If climbing caption derivation proves disruptive, reintroduce a narrow `freshnessLabel` string prop rather than restoring the full fake status object.

## Progress notes

- Investigation confirmed that blog and photography pages do not consume static hook status at all.
- Investigation confirmed that climbing only consumes `status.freshness.label`, making a derived caption viable.
- Investigation confirmed that the GitHub-backed CV flow is the only place where the full `SharedDataStatus` contract remains meaningful.
- Static hooks now return only bundled data and selector helpers; `useBlogData()`, `usePhotographyData()`, and `useClimbingData()` no longer expose fake async status objects.
- `SharedDataStatus`, `SharedDataStatusReason`, `SharedDataFreshness`, and `SharedDataSourceDetail` moved into `src/types/cv.ts`; `SharedDataSourceKind` stayed in `src/types/data.ts` because route metadata in `src/constants/siteRoutes.ts` still uses the generic source-kind union.
- `ClimbingAnalytics` now derives its bundled freshness caption from `analytics.overview.mostRecentDate`, and the climbing page no longer passes hook status through the route/component boundary.
- Focused Jest validation passed for the changed hooks, climbing consumers, and GitHub status flow.
- `npm run build` and `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts test/e2e/photography.spec.ts test/e2e/climbing.spec.ts` passed.
- Browser validation passed for `/climbing` at desktop and mobile widths, including the derived freshness label and no horizontal overflow; `/blog` and `/photography` also rendered their expected content on the built app.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
