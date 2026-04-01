# Static Data Hook Simplification Batch D

## Goal

Simplify the blog and photography static-data hooks so they read like thin adapters over immutable TypeScript data modules, while keeping blog and photography route behavior, feature gating, and rendered outputs unchanged.

## Why

The current blog and photography data hooks wrap immutable module data in `useMemo` and `useCallback`, then some consuming pages add another round of `useMemo` around trivial filters and lookups. That adds ceremony without buying meaningful runtime behavior because the underlying data is already bundled, static, and synchronous. Batch D should move static derivations closer to module scope, keep stable outputs, and leave the page consumers easier to follow.

## Constraints

- Preserve SPA routing, direct-link behavior, static-hosting compatibility, and `PUBLIC_URL`-safe asset handling.
- Keep the app fully client-side and continue sourcing blog and photography content from existing TypeScript data modules.
- Preserve blog feature gating and do not change route wiring.
- Do not change blog post content, photography metadata, or user-visible route structure.
- Keep tag ordering in `useBlogData.ts` as descending frequency with alphabetical tie-breaking.
- Keep this batch limited to blog and photography hooks, pages, and tightly related focused tests.
- Avoid touching shared blog components, shared text primitives, sx helpers, Home / IDE files, recovery logic, CV, or climbing.

## Affected files and responsibilities

- `src/hooks/useBlogData.ts`: Static blog post ordering, metadata derivation, featured-post selection, tag counts, and blog lookup helpers.
- `src/pages/Blog.tsx`: Blog index route composition and local tag-filter wiring.
- `src/pages/BlogPost.tsx`: Blog detail route composition, recovery wiring, and adjacent or related post lookup usage.
- `src/hooks/usePhotographyData.ts`: Static photography category and album summary derivation.
- `src/pages/Photography.tsx`: Photography index route composition and category presentation.
- `src/pages/PhotographyCategory.tsx`: Photography detail route composition, recovery wiring, and category lookup usage.
- `test/unit/hooks/useBlogData.test.ts`: Hook-level coverage for sorted posts, tag ordering, lookups, and stable static outputs.
- `test/unit/hooks/usePhotographyData.test.ts`: Hook-level coverage for static category and album summary outputs.
- `test/unit/pages/Blog.test.tsx`: Blog index route behavior coverage if page-local data derivation expectations change.
- `test/unit/pages/BlogPost.test.tsx`: Blog detail route behavior coverage if page-local lookup expectations change.
- `test/unit/pages/Photography.test.tsx`: Photography index route behavior coverage and current-page copy expectations.
- `test/unit/pages/PhotographyCategory.test.tsx`: Photography detail route behavior coverage if page-local lookup expectations change.

## Proposed approach

Precompute blog and photography derivations at module scope, then have each hook return those stable static values and helper functions directly instead of creating React memo or callback wrappers for every render.

For blog:

1. Sort `blogPosts` once at module scope.
2. Derive metadata, featured post, and tag counts once from that sorted list.
3. Keep `getPostBySlug`, `getRelatedPosts`, and `getAdjacentPosts` as plain functions over the precomputed array.
4. Return a stable hook result built from those static values.

For photography:

1. Derive album metadata, total photo count, and featured category once at module scope.
2. Return the static category collection and summary values directly from the hook.

For pages:

1. Remove page-level `useMemo` around trivial filtering and route recovery derivations where plain synchronous expressions are clearer.
2. Keep route-level state and behavior unchanged.
3. Only touch page tests when the simplified implementation changes what needs to be mocked or when an existing expectation is stale relative to current route output.

This fits the current architecture because hooks remain data adapters, pages remain declarative route composition, and the immutable data still lives in `src/data/`.

## Execution steps

1. Add the ExecPlan and confirm the current blog and photography hook and page contracts from the focused tests.
2. Refactor `src/hooks/useBlogData.ts` to compute static blog derivations once and export a simpler hook result.
3. Refactor `src/hooks/usePhotographyData.ts` to compute static photography derivations once and export a simpler hook result.
4. Remove unnecessary page-level memoization in `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`, and `src/pages/PhotographyCategory.tsx`, and keep `src/pages/Photography.tsx` aligned only where needed.
5. Update focused hook or page tests to reflect the simplified static-data contracts and any stale expectations in the touched route tests.
6. Run `npm run build`, focused Jest coverage for touched blog and photography hooks or pages, and browser validation for `/blog`, one `/blog/:slug`, `/photography`, and one `/photography/:slug` in desktop and narrow viewports.

## Validation plan

- `npm run build`
- Focused Jest coverage for `test/unit/hooks/useBlogData.test.ts`
- Focused Jest coverage for `test/unit/hooks/usePhotographyData.test.ts`
- Focused Jest coverage for touched blog page suites under `test/unit/pages/`
- Focused Jest coverage for touched photography page suites under `test/unit/pages/`
- Browser validation for `/blog` and one `/blog/:slug` route in one desktop and one narrow viewport
- Browser validation for `/photography` and one `/photography/:slug` route in one desktop and one narrow viewport
- If route behavior changes materially, run the narrowest relevant Playwright blog or photography spec after the correct build variant

## Risks and rollback

- The main regression risk is accidentally changing the sorted post order, featured-post fallback, related-post ranking, adjacent navigation order, or tag ordering while moving logic out of React memo wrappers.
- A second risk is changing page render behavior by removing memoization around values that tests or downstream consumers implicitly depend on.
- Keep the change isolated to the targeted hooks, pages, and focused tests so rollback is straightforward.
- If the simplified static derivation approach introduces a route regression, revert the module-scope precomputation while keeping any useful focused tests that document the intended behavior.

## Progress notes

- Initial inspection shows `useBlogData.ts` and `usePhotographyData.ts` are adapting immutable module data with `useMemo` and `useCallback` even though the underlying collections are static imports.
- `Blog.tsx` and `BlogPost.tsx` add another layer of memoization around simple filters and lookup calls over already memoized hook outputs.
- `PhotographyCategory.tsx` memoizes recovery context and route-action labels even though they can be derived synchronously from current route state and static route metadata.
- `Photography.tsx` already has straightforward route-level data wiring, so any edit there should stay minimal.
- Implemented module-scope precomputation for blog post ordering, metadata, featured-post selection, tag counts, photography album metadata, and photography summary totals; both hooks now return stable static results without React memo wrappers.
- Removed page-level memoization from `Blog.tsx`, `BlogPost.tsx`, and `PhotographyCategory.tsx` where the values are direct synchronous derivations from route state and static hook results.
- Updated focused hook tests to assert stable static hook results, and updated the Photography page test to match the current route subtitle copy instead of changing route output.
- Validation completed with `npm run build`, focused Jest coverage for the touched blog and photography hook/page suites, and direct browser validation of `/blog`, one `/blog/:slug`, `/photography`, and one `/photography/:slug` at desktop and narrow widths. Browser checks showed no horizontal overflow on the validated routes; console noise was limited to existing `manifest.json` and `favicon.ico` dev-server asset misses.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
