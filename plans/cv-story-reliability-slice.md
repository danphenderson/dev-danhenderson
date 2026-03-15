# CV Story Reliability Slice

## Goal

Implement execution step 5 from `plans/v1-stretch-goals-integration.md` as a focused `/cv` slice: add a linkable story-mode variant inside the existing `/cv` route, make route metadata reflect the active mode, and deepen GitHub reliability surfacing by exposing freshness and partial-fallback detail.

## Why

The `/cv` route is the primary professional page. A story mode gives visitors a curated, narrative walk-through rather than a free-form exploratory CV. At the same time, the GitHub data section should clearly communicate data provenance — which sources succeeded, which fell back, and how fresh the cached data is.

## Constraints

- Story mode is part of `/cv` and URL-addressable via `?mode=story`.
- The default `/cv` exploratory experience remains the canonical baseline and must not regress.
- Route and command-palette extensions derive from existing registries.
- Shared data types stay generic enough for reuse beyond GitHub.

## Touched files

### Source
- `src/pages/CV.tsx` — query-param-driven mode branching, story-mode linear render path
- `src/data/cv.ts` — story chapter metadata, narrative copy, CTA labels
- `src/types/data.ts` — `SharedDataSourceDetail` type, `sourceDetail` on `SharedDataStatus`
- `src/hooks/githubProfileData.ts` — per-source tracking, stale computation from cache TTL
- `src/hooks/useGithubProfile.ts` — passthrough (unchanged)
- `src/constants/siteRoutes.ts` — `CVMode` type, `cvStoryModeMetadata` for story-mode document metadata
- `src/constants/commandPaletteActions.ts` — `cv-story-mode` palette action
- `src/components/cv/CVGitHubSection.tsx` — partial-fallback summary, freshness label, per-source failure detail
- `src/components/cv/CVStoryHeader.tsx` — mode chip, intro text, toggle button (new)
- `src/components/cv/CVStoryChapterHeading.tsx` — chapter number, title, narrative (new)

### Tests
- `test/unit/hooks/useGithubProfile.test.ts` — partial-fallback, sourceDetail, freshness assertions
- `test/unit/pages/CV.test.tsx` — story-mode layout, chapters, mode toggle, MemoryRouter wrapping
- `test/unit/pages/CV.runtime.test.tsx` — MemoryRouter wrapping for useSearchParams
- `test/unit/constants/commandPaletteActions.test.ts` — story-mode action assertion
- `test/e2e/helpers/github.ts` — `mockGitHubAPIPartialFailure` helper (new)
- `test/e2e/cv.github.spec.ts` — partial-failure messaging, story-mode rendering, default toggle E2E

### Plans
- `plans/v1-stretch-goals-integration.md` — step 5 marked complete with file/validation notes
- `plans/cv-story-reliability-slice.md` — this sub-plan

## Validation actually run

1. `npm run build` — passes
2. `CI=true npm test -- --watch=false --testPathPattern="useGithubProfile|pages/CV|commandPaletteActions"` — 29 tests pass
3. `npx playwright test test/e2e/cv.github.spec.ts` — 6 E2E tests pass (core sections, mocked success, full failure, partial failure, story mode, default toggle)

## Decisions

- Story mode uses `?mode=story` query param (not hash) because the CV hash space is used for section anchors.
- Story chapters are defined as metadata in `cv.ts` and mapped to existing section keys — no duplicate data model.
- `SharedDataSourceDetail` is a generic array of `{ id, label, ok }` objects, reusable for climbing/photography later.
- `isStale` is computed dynamically from `lastUpdated` vs `CACHE_TTL_MS` instead of being hardcoded to false.
- The story-mode layout is a single-column, linear chapter sequence with no free-jump navigator.
- The mode toggle (CVStoryHeader) appears in both modes for discoverability.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
