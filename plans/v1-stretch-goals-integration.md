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
2. [ ] Normalize shared action/freshness primitives so the remaining recovery, analytics, and installability work can reuse the same sources instead of adding route-local one-offs.
3. [x] Implement the global command palette and shell-level accessibility upgrades.
4. [ ] Upgrade the not-found experience to use the shared route/action registry and command palette recovery paths, then validate direct navigation to an unknown route.
5. [ ] Add CV story mode and GitHub reliability surfacing, keeping fallback provenance and freshness copy in the same slice so the route stays coherent.
6. [ ] Add climbing analytics and freshness surfaces on top of `useClimbingData` without changing the source dataset shape.
7. [ ] Expand photography metadata first, then add immersive mode, map view, and slug-aware sharing in that order so schema changes land before UI features.
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
- Remaining work now depends on keeping shared registries authoritative: route actions should stay derived from the shared route model, and route-level follow-up work should extend those registries rather than reintroducing hardcoded route lists.
- The next coding slices should proceed in this order: not-found recovery, CV reliability/story mode, climbing freshness surfaces, photography metadata plus immersive features, then performance/PWA work.
- Each remaining slice should update this plan with the exact touched files and route-level validation actually run before moving on.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
