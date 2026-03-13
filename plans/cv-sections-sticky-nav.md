# CV Sections Sticky Nav

## Goal
Move the `/cv` section navigation out of the About card and into a sticky bar directly below the card, while keeping the About content unchanged and making the section pills reflect the current scroll position.

## Why
The About card should remain the focal point at the top of the CV page. The current inline "Jump to" navigator competes with that content and does not stay visible while moving through the page. A sticky bar below the card keeps section navigation available without crowding the About copy and makes it clearer which section is currently in view.

## Constraints
- Preserve the existing single-page-app `/cv` route behavior and section anchors.
- Keep the About card copy and actions unchanged.
- Keep the change narrowly scoped to `/cv` composition, the existing section navigator component, and the style/test surfaces needed to support the new behavior.
- Reuse the existing component style system and the CV/tab motion language rather than introducing route-specific ad hoc CSS.
- Preserve reduced-motion handling and keyboard-accessible navigation behavior.

## Affected files and responsibilities
- `src/pages/CV.tsx`: move navigator composition below the About card and place it in a sticky page-level container for mobile and desktop layouts.
- `src/components/cv/CVSectionNavigator.tsx`: shorten the lead label to "Sections", add current-section highlighting, and keep smooth-scroll section jumps.
- `src/styles/componentStyleBuilders.ts`: define the sticky bar, slim pill, active glow, and tab-consistent hover pulse styles used by the navigator.
- `src/pages/CV.test.tsx`: update route-level assertions around navigator placement and section-button behavior.
- `src/components/cv/CVSectionNavigator.test.tsx`: cover the updated label, layout, and active-state behavior.
- `e2e/cv.github.spec.ts` if needed: extend `/cv` route coverage only if the unit/browser checks reveal a gap in route-level behavior.

## Proposed approach
Keep the navigator as a shared CV component, but shift route ownership of its placement back to `src/pages/CV.tsx` so the page decides where the bar sits. The navigator will compute the active section from the current scroll position and section card bounds, using the sticky bar offset as the guide line for which pill should light up. Styling will stay in the shared component style map so the pills can reuse the same shimmer/pulse language as the tab panels while adding a more subdued active-state glow suitable for a sticky bar.

## Execution steps
1. Add page-level composition for the sticky section bar beneath the About card in both desktop and mobile `/cv` layouts, without changing the About card content itself.
2. Update `CVSectionNavigator` to render the new "Sections" lead, track the active section while scrolling, and apply the slim rounded-pill presentation and hover motion.
3. Adjust focused unit tests for the new placement, interactions, and active-state behavior.
4. Run targeted validation for `/cv`, then update this plan with any implementation discoveries or deviations.

## Validation plan
- `npm test -- --watch=false --runInBand src/pages/CV.test.tsx src/components/cv/CVSectionNavigator.test.tsx`
- `npm run build`
- Browser validation of `/cv` on one desktop viewport and one mobile viewport, confirming sticky behavior, active-section highlighting, hover pulse, and no overlap/clipping
- `npx playwright test e2e/cv.github.spec.ts`

## Risks and rollback
- Sticky positioning can conflict with the existing page padding or anchor scroll offsets, causing overlap or incorrect scroll targets.
- The active-section guide line can feel unstable if card heights or vertical rhythm shift significantly in future `/cv` layout work.
- Shared style-map changes could accidentally affect other chip/tab surfaces if selectors are too broad.
- Roll back by restoring the previous in-card navigator placement and removing the new sticky-bar styles if the active-state or sticky behavior proves unstable.

## Progress notes
- Initial read confirmed the current navigator is injected as the About card footer from `src/pages/CV.tsx`, so the placement change can stay route-owned.
- The existing tab hover shimmer and pill pulse are already available in `src/styles/componentStyleBuilders.ts`; the navigator can reuse those motion primitives instead of adding a new animation system.
- The sticky bar is composed at the page level in `src/pages/CV.tsx`, directly after the About card on mobile and desktop so it can remain sticky for the rest of the page rather than being constrained by the top card container.
- The first implementation kept MUI `Chip`, but browser validation showed the hover pseudo-element was not landing on the interactive surface. The navigator pills were switched to plain styled buttons so the shared shimmer/glow styling applies to the actual control.
- Validation run:
  - `npm test -- --watch=false --runInBand src/pages/CV.test.tsx src/components/cv/CVSectionNavigator.test.tsx`
  - `npm run build`
  - `npx playwright test e2e/cv.github.spec.ts`
  - temporary Chromium-only `/cv` sticky-nav checks on desktop and mobile via `npx playwright test e2e/cv.sections.nav.spec.ts` before removing the temporary spec
