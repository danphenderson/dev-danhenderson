# V1 Stretch Goals Integration

## Goal

Integrate the proposed v1 stretch goals into the current v1 branch through a staged plan that preserves the existing client-side SPA architecture while adding faster navigation, richer route metadata, stronger resilience, photography and climbing enhancements, installability, and accessibility hardening before production.

## Why

The current v1 branch has a strong route and component foundation, but several differentiating product goals remain unimplemented:

- navigation is limited to the header and route-local controls
- route metadata and sharing remain generic
- CV GitHub sections degrade gracefully but do not explain freshness or fallback provenance
- climbing and photography routes do not yet surface richer insights or immersive interactions
- installability, build metadata, and public performance surfaces are missing
- keyboard recovery and not-found handling are functional but basic

The requested stretch goals reinforce the same product objective: ship a more intentional and credible portfolio experience without breaking the repository's static-hosted SPA model.

## Constraints

- Preserve the fully client-side React + TypeScript SPA architecture.
- Preserve BrowserRouter basename behavior and direct navigation compatibility.
- Preserve PUBLIC_URL-compatible asset resolution.
- Keep the work scoped to the current route model.
- Do not introduce backend infrastructure.
- Keep content in existing TypeScript data modules where possible.
- Avoid stable route/path/export renames.
- Treat all 12 stretch goals as targeted for v1 delivery.
- Implement share-card work in an SPA-safe way instead of assuming host changes for true dynamic OG previews.

## Affected files and responsibilities

- `src/App.tsx`: top-level route tree and shared providers
- `src/components/Header.tsx`: global navigation shell
- `src/components/header/HeaderNav.tsx`: header navigation consumer
- `src/components/AppSpeedDial.tsx`: reusable action-launcher pattern
- `src/constants/routeActions.ts`: shared route-action derivation for command palette and recovery consumers
- `src/pages/CV.tsx`: CV story mode and route metadata integration
- `src/components/cv/CVGitHubSection.tsx`: GitHub reliability indicators
- `src/hooks/useGithubProfile.ts`: freshness and provenance state
- `src/hooks/githubProfileData.ts`: cache and fallback logic
- `src/data/cv.ts`: source-of-truth CV content and fallback data
- `src/pages/Climbing.tsx`: climbing analytics and freshness surfaces
- `src/hooks/useClimbingData.ts`: derived climbing analytics
- `src/pages/Photography.tsx`: category-level freshness and share surfaces
- `src/pages/PhotographyCategory.tsx`: immersive mode, slug metadata, and share surfaces
- `src/components/PhotoAlbum.tsx`: immersive/lightbox behavior
- `src/hooks/usePhotographyData.ts`: derived photography metadata and recency helpers
- `src/data/photography.ts`: photography metadata expansion
- `src/types/data.ts`: photography schema additions
- `src/pages/NotFound.tsx`: contextual recovery UI
- `public/index.html`: default metadata and PWA linkage
- `package.json`: build metadata or PWA script wiring if needed
- `plans/shared-status-primitives.md`: completed sub-plan for the shared action/freshness foundation
- `test/e2e/*.spec.ts`: route-level validation coverage

## Proposed approach

Use a foundation-first execution model:

1. Add shared route/action and metadata infrastructure.
2. Expand photography schema only where map/freshness/recovery goals require real metadata.
3. Deliver route/domain features on top of those foundations.
4. Treat sharing as an SPA-safe enhancement rather than a server-rendered OG project.
5. Validate by affected route first, then by shared behavior.

## Execution steps

1. [x] Create a typed route/action registry and lightweight route metadata layer.
2. [x] Normalize shared action/freshness primitives so the remaining recovery, analytics, and installability work can reuse the same sources instead of adding route-local one-offs.
3. [x] Implement the global command palette and shell-level accessibility upgrades.
4. [x] Extend the not-found recovery baseline with more contextual routing assistance on top of the shared route/action registry and command palette recovery paths, then validate direct navigation to an unknown route.
5. [x] Add CV story mode and deepen GitHub reliability surfacing on top of the shared freshness/provenance baseline so the route reads as one coherent slice. See `plans/cv-story-reliability-slice.md`.
6. [x] Add climbing analytics and freshness surfaces on top of `useClimbingData` without changing the source dataset shape.
7. [x] Expand photography metadata first, then add immersive mode, map view, and slug-aware sharing in that order so schema changes land before UI features. See `plans/photography-immersive-sharing.md`.
8. [ ] Add performance scorecard and PWA basics only after route metadata and build-info plumbing are stable.
9. [ ] Run route-level validation after each completed slice, then finish with shared-browser validation and final documentation updates.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false`
- `npx playwright test test/e2e/home.spec.ts`
- `npx playwright test test/e2e/cv.github.spec.ts`
- `npx playwright test test/e2e/climbing.spec.ts`
- `npx playwright test test/e2e/photography.spec.ts`
- `npx playwright test test/e2e/not-found.spec.ts`
- Browser validation on `/`, `/cv`, `/climbing`, `/photography`, `/photography/:slug`, and an unknown route on mobile and desktop
- Re-run only the narrowest relevant Playwright spec and browser route checks after each slice instead of deferring all validation to the end

## Risks and rollback

- True per-route social OG previews remain constrained by static hosting.
- Photography schema expansion can create broad consumer coupling if done piecemeal.
- Global keyboard shortcuts can conflict with editable controls.
- PWA caching can misrepresent freshness if the offline shell becomes too aggressive.
- Roll back in phase-sized commits so command palette, PWA, photography, and analytics can be reverted independently.

## Progress notes

- Status: In progress
- Completed the shared route registry and route metadata wiring for the current routes.
- Completed the first global command palette implementation with keyboard shortcuts, route actions, album actions, and CV section jump actions.
- Completed shell-level skip links while the top-level app structure was already being touched.
- Completed execution step 2 through `plans/shared-status-primitives.md`, adding shared data-status types, route-derived recovery actions, and normalized freshness/fallback metadata for GitHub, climbing, and photography.
- The shared status slice also landed the first downstream consumers: `src/pages/NotFound.tsx` now derives recovery CTAs from the shared route-action source, and `src/components/cv/CVGitHubSection.tsx` now presents GitHub freshness, source, and fallback provenance from the normalized hook status.
- Execution step 2 validation actually run: targeted unit coverage for the shared status and route-action consumers, `npx playwright test test/e2e/not-found.spec.ts`, `npx playwright test test/e2e/cv.github.spec.ts`, and `npm run build`.
- Direct MCP browser inspection was partially blocked by a local Chrome session and the current integrated-browser tool permissions, so Playwright route coverage served as the browser-validation fallback for the shared-status slice.
- Remaining work now depends on keeping shared registries authoritative: route actions should stay derived from the shared route model, and route-level follow-up work should extend those registries rather than reintroducing hardcoded route lists.
- Completed execution step 4 through `plans/contextual-not-found-recovery.md`, adding `src/constants/recoveryContext.ts` for path-aware recovery ranking, `src/components/RouteRecoveryPanel.tsx` for shared recovery UI, and aligned invalid photography album slug handling in `src/pages/PhotographyCategory.tsx` with the catch-all `src/pages/NotFound.tsx` flow.
- The step 4 slice also widened `src/constants/commandPaletteActions.ts` with action kinds and route ids, added `src/CommandPaletteProvider.tsx`, and kept `src/components/GlobalCommandPalette.tsx` route-aware for the global keyboard palette.
- Direct recovery now uses an explicit seeded command-palette CTA from the recovery panel rather than an automatic dialog launch, because validation showed the route-transition and card-animation stack made auto-open unreliable across the affected routes.
- Follow-up refactor `plans/unify-recovery-palette.md` removed the recovery panel's temporary local dialog so the provider-backed global command palette is again the single searchable surface for both keyboard and recovery entry points, with shared matching semantics in `src/utils/commandPaletteSearch.ts`.
- `src/pages/Photography.tsx` and `src/pages/PhotographyCategory.tsx` now render their first above-the-fold section cards without waiting on intersection triggers so the photography flows remain stable in headless and browser validation.
- Execution step 4 validation actually run: `npm run build`, `npx playwright test test/e2e/not-found.spec.ts`, `npx playwright test test/e2e/photography.spec.ts`, and direct browser validation on `/unknown` and `/photography/landscap` at desktop `1440x1200` and mobile `390x844` with no console errors, one command palette dialog per recovery interaction, clean Escape close behavior, intact recovery-seeded queries, intact CV hash scrolling, and no horizontal overflow in the checked viewports.
- Completed execution step 6 by extending `src/hooks/useClimbingData.ts` with derived analytics (overview totals, normalized grade buckets, top destinations) while preserving the shared `SharedDataStatus` freshness contract, adding `src/components/climbing/ClimbingAnalytics.tsx`, wiring the analytics section into `src/pages/Climbing.tsx`, and extending the corresponding climbing unit and E2E tests.
- Follow-up hardening for execution step 6 landed through `plans/climbing-e2e-animation-readiness-hardening.md`, adding `test/e2e/helpers/routeReadiness.ts`, restoring strict visibility-first climbing assertions in `test/e2e/climbing.spec.ts`, and reusing the same animated-section readiness helper in `test/e2e/photography.spec.ts`.
- Step 6 follow-up validation actually run: `npm run build`, `npx playwright test test/e2e/climbing.spec.ts`, `npx playwright test test/e2e/climbing.spec.ts --repeat-each=3`, and `npx playwright test test/e2e/photography.spec.ts`.
- The next coding slices should proceed in this order: CV story mode and reliability refinement, climbing freshness surfaces, photography metadata plus immersive features, then performance/PWA work.
- Each remaining slice should update this plan with the exact touched files and route-level validation actually run before moving on.
- Completed execution step 7 through `plans/photography-immersive-sharing.md`: expanded `PhotoItem` and `PhotoCategory` schemas with optional `location`, `dateTaken`, `tags`, `coordinates`, `dateRange` fields; populated real metadata for all 4 albums; built `ImmersiveLightbox` (full-screen keyboard-navigable photo viewer), `AlbumLocationSummary` (per-album and per-photo location display), and `AlbumShareButton` (Web Share API + clipboard fallback); extended `usePhotographyData` with `albumMeta` and `totalPhotos` derived fields; enriched command palette photography actions with location and tag keywords; added location/date/count metadata to photography index cards.
- Step 7 touched files: `src/types/data.ts`, `src/data/photography.ts`, `src/hooks/usePhotographyData.ts`, `src/components/photography/ImmersiveLightbox.tsx` (new), `src/components/photography/AlbumShareButton.tsx` (new), `src/components/photography/AlbumLocationSummary.tsx` (new), `src/components/PhotoAlbum.tsx`, `src/pages/Photography.tsx`, `src/pages/PhotographyCategory.tsx`, `src/constants/commandPaletteActions.ts`, `test/unit/pages/PhotographyCategory.test.tsx`.
- Step 7 validation actually run: `npm run build` (compiled successfully), `CI=true npm test -- --watch=false` (photography suites all pass), `npx playwright test test/e2e/photography.spec.ts` (5/5 passed), browser validation on `/photography` and `/photography/landscape` at desktop viewport with lightbox open/close/navigate and share button verified.
- Completed execution step 5 through `plans/cv-story-reliability-slice.md`: query-param-driven story mode on `/cv`, extended GitHub status model with per-source detail and stale computation, richer partial-fallback and freshness messaging in CVGitHubSection, command palette story-mode entry.
- Step 5 touched files: `src/pages/CV.tsx`, `src/data/cv.ts`, `src/types/data.ts`, `src/hooks/githubProfileData.ts`, `src/hooks/useGithubProfile.ts`, `src/constants/siteRoutes.ts`, `src/constants/commandPaletteActions.ts`, `src/components/cv/CVGitHubSection.tsx`, `src/components/cv/CVStoryHeader.tsx` (new), `src/components/cv/CVStoryChapterHeading.tsx` (new).
- Step 5 validation actually run: `npm run build`, `CI=true npm test` for useGithubProfile/CV/commandPaletteActions (29 tests), `npx playwright test test/e2e/cv.github.spec.ts` (6 tests including partial-failure and story-mode specs).

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
