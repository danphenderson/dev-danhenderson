# CV Floating Section Dial

## Goal
Replace the current `/cv` inline section navigator and route-level back-to-top control with a single floating section dial that feels less obtrusive on desktop and mobile while preserving section-jump behavior.

## Why
The inline section rail competes with CV content in both breakpoints, and the separate back-to-top control adds another floating action. A single floating section dial keeps navigation available without reserving persistent page space.

## Constraints
- Keep the change `/cv`-only; other routes continue using `BackToTopButton`.
- Preserve existing section anchors, scroll offsets, and SPA route behavior.
- Keep the work narrowly scoped to the CV route, the existing navigator, the style maps that support it, and the tests needed to validate behavior.
- Prefer the existing `AppSpeedDial` and style hooks over new shared abstractions unless they block the implementation.

## Affected files and responsibilities
- `src/pages/CV.tsx`: remove inline navigator placement and the route-level back-to-top usage; render one floating navigator at the route root.
- `src/components/cv/CVSectionNavigator.tsx`: replace the chip rail with a floating speed dial that handles section jumps, back-to-top, active-section detection, and idle visibility.
- `src/styles/appStyleBuilders.ts`: add CV floating dial placement and trigger styling alongside the existing floating action styles.
- `src/styles/componentStyleBuilders.ts`: add small icon/trigger styling helpers for the navigator state.
- `src/pages/CV.test.tsx`: update `/cv` composition assertions for the floating dial.
- `src/components/cv/CVSectionNavigator.test.tsx`: cover dial visibility, hover/focus persistence, and action behavior.
- `e2e/cv.github.spec.ts`: validate the `/cv` dial in browser coverage.

## Proposed approach
Keep `CVSectionNavigator` as the single owner of section navigation behavior, but change its rendering from an inline rail to a floating `AppSpeedDial`. Reuse the existing active-section scroll tracking and header offset metrics, prepend a back-to-top action, and layer on dial-local visibility management so it appears after the shared scroll threshold, stays available while hovered or focused, and fades after scroll idle.

## Execution steps
1. Remove inline navigator placement from `CV.tsx` and render one floating navigator for the route.
2. Rebuild `CVSectionNavigator` around `AppSpeedDial`, adding the action icon map, scroll handlers, active-section tinting, and idle visibility control.
3. Add route and component style-map entries for the floating dial placement and highlighted trigger/icon states.
4. Update focused unit tests and `/cv` Playwright coverage to match the new behavior.
5. Run targeted tests, build, and browser validation.

## Validation plan
- `npm test -- --watch=false --runInBand src/pages/CV.test.tsx src/components/cv/CVSectionNavigator.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation of `/cv` at one desktop and one mobile viewport, confirming threshold-gated visibility, idle hide/reappearance, and section jump usability.

## Risks and rollback
- The dial can become frustrating if the idle-hide logic fights hover/focus, so those interaction states need explicit coverage.
- Floating speed dial placement can collide with safe-area or existing floating controls if the shared style tokens are not reused carefully.
- Roll back by restoring the current inline navigator and route-level `BackToTopButton` if the dial proves too hard to discover or operate.

## Progress notes
- Initial exploration confirmed the current navigator is already non-sticky and route-owned, so this change is primarily a behavior shift from inline to floating.
- Baseline tests passed before edits:
  - `npm test -- --watch=false --runInBand src/pages/CV.test.tsx`
  - `npm test -- --watch=false --runInBand src/components/AppSpeedDial.test.tsx src/components/BackToTopButton.test.tsx`
