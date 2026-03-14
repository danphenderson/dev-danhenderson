# CV Section Nav Relocation Revision

## Goal

Move the `/cv` section navigation out of the obstructive sticky lane and into a less intrusive static placement, while keeping the About content unchanged and preserving the current pill interactions.

## Why

The sticky bar solved the original competition inside the About card, but it now obstructs content as the page scrolls. The revised placement should keep navigation available without covering CV section content.

## Constraints

- Preserve the existing single-page-app `/cv` route behavior and section anchors.
- Keep the About card copy and actions unchanged.
- Keep the change narrowly scoped to `/cv` composition, the existing section navigator component, and the style/test surfaces needed to support the new behavior.
- Reuse the existing component style system and the CV/tab motion language rather than introducing route-specific ad hoc CSS.
- Preserve reduced-motion handling and keyboard-accessible navigation behavior.

## Affected files and responsibilities

- `src/pages/CV.tsx`: move the navigator into the desktop sidebar stack and keep it inline after About on mobile.
- `src/components/cv/CVSectionNavigator.tsx`: preserve the public API and active-pill behavior while switching to header-only viewport offsets.
- `src/styles/componentStyleBuilders.ts`: tone the navigator container away from a floating overlay surface while keeping the pill styling and hover shimmer.
- `src/pages/CV.test.tsx`: assert the new desktop-sidebar and mobile-inline placement.
- `src/components/cv/CVSectionNavigator.test.tsx`: keep active-section coverage aligned with the header-only guide line.

## Proposed approach

Keep the navigator as a shared CV component, but make route-level composition decide its static location. On desktop it should be the first item in the left sidebar lane; on mobile it should remain directly after About. The navigator should still compute the active section from scroll position, but the guide line and scroll margins should be rebased to the fixed header only.

## Execution steps

1. Remove the page-level sticky wrapper and relocate the navigator into the desktop sidebar while keeping the mobile inline placement after About.
2. Replace sticky-specific viewport metrics with header-only offsets used by both scroll margins and active-section detection.
3. Tone the navigator container styling down to an in-flow surface while preserving pill visuals and hover behavior.
4. Update the focused `/cv` tests and run targeted validation.

## Validation plan

- `npm test -- --watch=false --runInBand src/pages/CV.test.tsx src/components/cv/CVSectionNavigator.test.tsx`
- `npm run build`
- Browser validation of `/cv` on one desktop viewport and one mobile viewport, confirming the navigator no longer obstructs content, active-section highlighting still works, and anchors land below the fixed header
- `npx playwright test e2e/cv.github.spec.ts`

## Risks and rollback

- Header-only scroll offsets can undershoot or overshoot if the fixed header height or `/cv` spacing changes later.
- The active-section guide line can feel unstable if card heights or vertical rhythm shift significantly in future `/cv` layout work.
- Shared style-map changes could accidentally affect other chip/tab surfaces if selectors are too broad.
- Roll back by restoring the previous sticky wrapper if the static placements prove too hard to discover, but only after confirming the obstruction issue cannot be solved by spacing or sidebar placement.

## Progress notes

- Initial read confirmed the current navigator is injected as the About card footer from `src/pages/CV.tsx`, so the placement change can stay route-owned.
- The existing tab hover shimmer and pill pulse are already available in `src/styles/componentStyleBuilders.ts`; the navigator can reuse those motion primitives instead of adding a new animation system.
- The current obstruction comes from a page-level sticky wrapper in `src/pages/CV.tsx`, so the relocation can stay narrowly scoped to route composition plus header-offset cleanup.
- The navigator already uses plain styled buttons, so the relocation revision only needs placement, offset, and container-surface adjustments rather than a new interaction model.
- Validation run:
  - `npm test -- --watch=false --runInBand src/pages/CV.test.tsx src/components/cv/CVSectionNavigator.test.tsx`
  - `npm run build`
  - `npx playwright test e2e/cv.github.spec.ts`
  - temporary Chromium-only `/cv` placement checks via `npx playwright test e2e/cv.nav-placement.spec.ts` before removing the temporary spec
