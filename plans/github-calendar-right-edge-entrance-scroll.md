# GitHub Calendar Right-Edge Entrance Scroll

## Goal

Make the `/cv` GitHub contribution calendar enter from the oldest weeks and settle on the newest weeks, while keeping the existing SPA, client-side GitHub calendar setup, and current card/layout presentation intact.

## Why

The current calendar rests on the leftmost portion of the contribution history, which hides the newest weeks unless the user manually scrolls. The `/cv` page should still reveal that horizontal range, but it needs to do so in a way that respects reduced-motion preferences, only runs once per page load, and stays component-local.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and `PUBLIC_URL` compatibility.
- Keep the change narrowly scoped to the requested calendar behavior.
- Do not change route wiring, exported types, or shared component APIs.
- Keep `GitHubContributionCalendarProps` unchanged.
- Use the existing `usePrefersReducedMotion` hook and the observer patterns already used by animated components.
- Do not add dependencies or introduce a reusable generic scroll hook.
- Keep existing visual styling and card layout unchanged except for any minimal wrapper ownership needed for the behavior.

## Affected files and responsibilities

- `src/components/cv/GitHubContributionCalendar.tsx`: own the wrapper ref, detect the internal third-party scroll container, trigger a one-time entrance reveal, respect reduced motion, and keep the final resting position aligned on resize.
- `src/components/cv/GitHubContributionCalendar.test.tsx`: replace the simple calendar mock with a realistic scroll-container DOM shape and add deterministic coverage for entrance animation, reduced-motion snapping, and resize re-alignment.
- `src/components/cv/CVGitHubSection.test.tsx`: remain green as the existing consumer coverage for the calendar section.

## Proposed approach

Wrap the third-party calendar in a component-owned element that can be observed and queried after mount. Once the wrapper first intersects the viewport, resolve the library’s `.react-activity-calendar__scroll-container`, compute whether horizontal overflow exists, and either:

- snap directly to the right edge when `prefers-reduced-motion` is enabled, or
- run a component-local `requestAnimationFrame` tween from `scrollLeft = 0` to `scrollWidth - clientWidth`.

Track whether the entrance reveal has already completed so it only runs once per page load. After the initial run, register resize handling that keeps the resting position aligned to the current right edge without replaying the animation. Keep all logic local to the calendar component so no route composition or shared component contracts change.

## Execution steps

1. Add the ExecPlan and confirm the smallest affected file set for the component-local implementation.
2. Update `GitHubContributionCalendar` with a wrapper ref, delayed scroll-container lookup, one-time `IntersectionObserver` trigger, reduced-motion handling, and post-run resize alignment.
3. Replace the calendar test mock with a scrollable DOM shape and add deterministic tests for render smoke, animated entrance, reduced-motion snap, and resize re-alignment.
4. Run the requested targeted Jest suites and `npm run build`.
5. Validate `/cv` in the browser on mobile and desktop, including before/after screenshots, reduced-motion behavior, and manual scrolling after the reveal.

## Validation plan

- `npm test -- --watch=false --runTestsByPath src/components/cv/GitHubContributionCalendar.test.tsx src/components/cv/CVGitHubSection.test.tsx`
- `npm run build`
- Browser validation on `/cv` at one mobile viewport and one desktop viewport:
- verify the calendar first appears at the left/start position
- verify the automatic slide moves to the newest weeks once the section enters view
- verify the final resting position matches the right-aligned state
- verify reduced-motion behavior by forcing `prefers-reduced-motion` and confirming it lands on the right without the slide
- verify manual horizontal scrolling still works after the reveal
- capture before/after screenshots for comparison

## Risks and rollback

- The third-party calendar DOM may not expose the internal scroll container immediately after first render. The implementation should query after mount and retry through normal effect timing rather than assuming the node exists synchronously.
- JSDOM does not calculate layout metrics for the calendar, so tests must stub `clientWidth`, `scrollWidth`, animation timing, and observer callbacks explicitly.
- Resize handling can fight user scrolling if it stays active beyond the initial alignment use case. Keep the logic focused on maintaining the completed resting position instead of replaying motion.
- If the behavior regresses, rollback is isolated to the calendar component and its focused tests.

## Progress notes

- Implemented the calendar-local reveal in `src/components/cv/GitHubContributionCalendar.tsx` with a wrapper ref, delayed lookup of `.react-activity-calendar__scroll-container`, a one-time `IntersectionObserver` trigger, a post-intersection viewport check, a fixed-duration RAF tween to the right edge, reduced-motion snapping, and resize re-alignment that avoids clobbering later manual scrolling.
- Expanded `src/components/cv/GitHubContributionCalendar.test.tsx` with a realistic calendar DOM mock, deterministic `IntersectionObserver` and `requestAnimationFrame` control, explicit scroll metrics, resize coverage, and a regression test that prevents observer-driven re-pinning after a user scroll.
- Fixed an unrelated existing build blocker in `src/components/cv/GitHubContributions.tsx` by restoring the missing `BodyText` import so `npm run build` could complete.
- Validation completed:
- `CI=true npm test -- --watch=false --runTestsByPath src/components/cv/GitHubContributionCalendar.test.tsx src/components/cv/CVGitHubSection.test.tsx`
- `npm run build`
- Browser validation against the local production build on `http://127.0.0.1:3100/cv` with mocked GitHub/calendar network responses:
- desktop `1440x1200`: initial left/start state confirmed, intermediate slide confirmed, final right-edge state confirmed, manual horizontal scrolling persisted after the reveal
- mobile `390x844`: first visible left/start state confirmed, intermediate slide confirmed, final right-edge state confirmed, manual horizontal scrolling persisted after the reveal once the animation fully settled
- reduced motion `390x844`: snapped directly to the right edge without sliding
- Screenshot artifacts were captured at `/tmp/github-calendar-desktop-before.png`, `/tmp/github-calendar-desktop-after.png`, `/tmp/github-calendar-mobile-before.png`, `/tmp/github-calendar-mobile-after.png`, and `/tmp/github-calendar-mobile-reduced.png`.
