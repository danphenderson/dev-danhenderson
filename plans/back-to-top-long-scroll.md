# Back-to-top for long-scroll pages

## Goal

Add a back-to-top control to the `/cv` route and photography album detail routes so long pages remain easy to navigate after the fixed header scrolls away.

## Why

The CV page and photography album pages can require substantial scrolling. Once the fixed header hides, there is no quick way to return to the top of the route.

## Constraints

- Keep the app fully client-side and preserve SPA routing behavior.
- Keep the change narrowly scoped to `/cv` and `/photography/:slug`.
- Do not widen `PageFrame` into a cross-route scroll-control abstraction.
- Preserve existing route composition and stable public data/module APIs.
- Keep the header hide trigger and back-to-top visibility aligned through shared configuration.
- Avoid disturbing unrelated dirty worktree changes in CV/typewriter files.

## Affected files and responsibilities

- `src/components/BackToTopButton.tsx`: shared floating action button behavior and scroll-to-top interaction.
- `src/components/Header.tsx`: consume the shared header scroll trigger options.
- `src/components/header/headerScroll.ts`: shared header hide threshold and trigger options.
- `src/pages/CV.tsx`: opt the CV route into the shared control.
- `src/pages/PhotographyCategory.tsx`: opt album detail routes into the shared control.
- `src/styles/appStyleBuilders.ts`: add reusable styling for the floating control.
- `src/components/BackToTopButton.test.tsx`: focused unit coverage for visibility and scroll behavior.
- `src/pages/CV.test.tsx`, `src/pages/PhotographyCategory.test.tsx`, `src/pages/Photography.test.tsx`: route-level scope coverage.
- `e2e/cv.github.spec.ts`, `e2e/photography.spec.ts`: browser verification of appearance and scroll-to-top behavior.

## Proposed approach

Create a route-level shared `BackToTopButton` component that uses the same `useScrollTrigger` options as the header. The button will render as a fixed-position MUI `Fab` with an up-arrow icon, use theme-derived floating-surface styling from the app style map, and scroll the window back to the top with smooth behavior unless reduced motion is enabled. The CV and photography album routes will opt into the control directly so the feature remains scoped to the requested pages.

## Execution steps

1. Add the ExecPlan and shared header scroll trigger module.
2. Build the `BackToTopButton` component and reusable app styles.
3. Render the component on `/cv` and `/photography/:slug` only.
4. Add unit coverage for the new component and route-composition coverage for scope.
5. Extend CV and photography E2E coverage to verify visibility and scroll-to-top behavior.
6. Run build, targeted tests, and browser validation on the affected routes.

## Validation plan

- `npm test -- --watch=false --runInBand src/components/BackToTopButton.test.tsx src/pages/CV.test.tsx src/pages/PhotographyCategory.test.tsx src/pages/Photography.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts e2e/photography.spec.ts`
- Desktop and mobile browser validation for `/cv` and `/photography/landscape`

## Risks and rollback

- If the threshold drifts from the header behavior, the control could appear too early or too late; sharing trigger options avoids this.
- Fixed-position UI can overlap content on narrow viewports; responsive offsets and browser validation are required.
- Route-level placement could accidentally spread to `/photography`; route tests should keep that scope locked.
- Rollback is isolated: remove the route usages and shared component without touching page content or data modules.

## Progress notes

- Initial plan recorded before implementation.
- Added a shared `BackToTopButton` component, centralized header scroll trigger options, and routed the control to `/cv` and `/photography/:slug` only.
- Targeted React tests passed: `src/components/BackToTopButton.test.tsx`, `src/pages/CV.test.tsx`, `src/pages/PhotographyCategory.test.tsx`, and `src/pages/Photography.test.tsx`.
- Production build passed with the new floating control in place.
- Playwright route coverage passed for `e2e/cv.github.spec.ts` and `e2e/photography.spec.ts`.
- Direct desktop/mobile viewport validation on the built app confirmed the fixed button stayed within the viewport on `/cv` and `/photography/landscape`.
