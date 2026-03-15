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

1. Create a typed route/action registry and lightweight route metadata layer.
2. Add shared date/freshness helpers and a build-info source.
3. Implement the global command palette and shell-level accessibility upgrades.
4. Upgrade the not-found experience to use route/action and recency data.
5. Add CV story mode and GitHub reliability surfacing.
6. Add climbing analytics and freshness surfaces.
7. Expand photography metadata, then add immersive mode, map view, and slug-aware sharing.
8. Add performance scorecard and PWA basics.
9. Run route-level validation, browser validation, and final documentation updates.

## Validation plan

- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`
- `npx playwright test test/e2e/cv.github.spec.ts`
- `npx playwright test test/e2e/climbing.spec.ts`
- `npx playwright test test/e2e/photography.spec.ts`
- `npx playwright test test/e2e/not-found.spec.ts`
- Browser validation on `/`, `/cv`, `/climbing`, `/photography`, `/photography/:slug`, and an unknown route on mobile and desktop

## Risks and rollback

- True per-route social OG previews remain constrained by static hosting.
- Photography schema expansion can create broad consumer coupling if done piecemeal.
- Global keyboard shortcuts can conflict with editable controls.
- PWA caching can misrepresent freshness if the offline shell becomes too aggressive.
- Roll back in phase-sized commits so command palette, PWA, photography, and analytics can be reverted independently.

## Progress notes

- Status: In progress
- Foundation work starts with a shared route registry and route metadata wiring.
- Added shared route metadata and client-side head updates for the existing routes.
- Added the first global command palette implementation with keyboard shortcuts, route actions, album actions, and CV section jump actions.
- Added shell-level skip links while the top-level app structure was already being touched.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
