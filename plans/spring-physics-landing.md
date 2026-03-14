# Spring Physics Landing Animations

## Goal

Add spring-physics easing to all entry/landing motion animations site-wide so that elements overshoot their target position slightly and settle back, creating a physically satisfying "landing" feel. The change centralizes spring easing constants in a single module and wires them into every animated entry surface: MUI Zoom cards, MUI Zoom chip reveals, MUI Slide staggered lists, the Motion-powered hero spiral entrance, the header hide-on-scroll Slide, and CSS hover transitions.

## Why

The current animations use `ease`, `ease-in-out`, or linear CSS easing. While smooth, these lack the micro-bounce that communicates a sense of physical weight when elements arrive at rest. Spring-like overshoot-and-settle on landing is a widely recognized polish pass that makes UI feel more alive without changing content timing or layout.

## Constraints

- App remains fully client-side
- SPA routing and direct-link behavior remain intact
- `prefers-reduced-motion` handling is preserved—spring easing is skipped along with the animations it decorates
- No new runtime dependencies—spring easing is achieved via CSS `cubic-bezier()` and the motion library's existing easing support
- Motion tokens (`itemOffsetMs`, `sectionStaggerMs`, etc.) are not changed; only the easing curves are updated
- Existing test assertions on timing, delay values, and reduced-motion bypasses remain valid
- The Hero motion-path keyframe structure (50 samples, hold fraction, spiral geometry) is not altered; only the final transition easing is enhanced

## Affected files and responsibilities

| File | Role |
|---|---|
| `src/styles/springEasing.ts` (new) | Single source of truth for spring easing constants |
| `src/components/AnimatedContentCard.tsx` | Card-style entry Zoom—receives spring easing prop |
| `src/components/AnimatedZoomList.tsx` | Accordion chip Zoom—receives spring timing function via `style` |
| `src/components/AnimatedSlideList.tsx` | Staggered Slide list—receives spring easing prop |
| `src/components/HeroMotionPath.tsx` | Hero spiral entrance—transition easing updated to spring cubic-bezier |
| `src/components/Header.tsx` | Hide-on-scroll Slide—receives spring easing prop |
| `src/styles/componentStyleBuilders.ts` | Shared CSS `transition` declarations for hover effects—`ease` replaced with spring easing |
| `src/styles/appStyleBuilders.ts` | Page-level CSS `transition` declarations—`ease` replaced with spring easing |
| `test/unit/components/HeroMotionPath.test.tsx` | Update transition easing assertion |
| `README.md` | Document spring easing module and behavior |

## Proposed approach

1. **Centralized spring easing module** — A new `src/styles/springEasing.ts` exports:
   - `SPRING_EASING_CSS` — a CSS `cubic-bezier(0.175, 0.885, 0.32, 1.275)` string (classic ease-out-back: slight overshoot, smooth settle) used in CSS `transition` shorthand and MUI `easing` props.
   - `SPRING_EASING_MOTION` — the same curve as a `[number, number, number, number]` tuple for use in the `motion` library's `ease` option.

2. **MUI Zoom** (AnimatedContentCard, AnimatedZoomList) — pass the spring easing via the `easing` prop (enter only, keep default linear exit so cards don't bounce out).

3. **MUI Slide** (AnimatedSlideList, Header HideOnScroll) — pass the spring easing via `easing.enter`.

4. **Motion library HeroMotionPath** — replace `ease: 'easeInOut'` with `ease: SPRING_EASING_MOTION` so the spiral's overall progress curve overshoots and settles at the end.

5. **CSS transitions** — replace `ease` in `transition` shorthand with `SPRING_EASING_CSS` for transform and box-shadow hover effects in the style builders.

6. **Tests** — update the HeroMotionPath test that asserts `ease: 'easeInOut'` to expect the new spring easing array. All other tests mock the transition components and don't assert on easing.

## Execution steps

1. Create `src/styles/springEasing.ts` with the easing constants.
2. Wire spring easing into `AnimatedContentCard.tsx` (`Zoom` `easing` prop).
3. Wire spring easing into `AnimatedZoomList.tsx` (`Zoom` `style.transitionTimingFunction`).
4. Wire spring easing into `AnimatedSlideList.tsx` (`Slide` `easing` prop).
5. Wire spring easing into `HeroMotionPath.tsx` (motion `transition.ease`).
6. Wire spring easing into `Header.tsx` (`Slide` `easing` prop).
7. Replace `ease` with the spring constant in `componentStyleBuilders.ts` CSS transitions.
8. Replace `ease` with the spring constant in `appStyleBuilders.ts` CSS transitions.
9. Update `HeroMotionPath.test.tsx` assertion on `ease`.
10. Update `README.md` animation section to mention spring easing module.
11. Run `npm run build` and `CI=true npm test -- --watch=false`.
12. Run dev server and take browser screenshots for visual verification.

## Validation plan

- `npm run build` — compiles without errors
- `CI=true npm test -- --watch=false` — all existing tests pass with updated easing assertion
- Browser screenshot of `/cv` and `/` routes showing spring animation landing
- Confirm `prefers-reduced-motion` bypass remains intact (no spring easing visible when reduced-motion is true)

## Risks and rollback

- **Visual regression**: spring overshoot on Zoom can cause momentary layout shift if elements have constrained parent overflow. Mitigated by the low overshoot factor of `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (≈27.5% max overshoot in time-domain, translating to much smaller visual overshoot for scale/translate values).
- **HeroMotionPath timing**: changing the progress-curve easing shifts the perceived speed distribution of the spiral. The keyframe time-stamps remain linear, so the spring curve accelerates early and overshoots at the end. This is the desired "landing" emphasis.
- **Rollback**: revert the PR. All changes are additive easing constant wiring; no data model, route, or layout changes.

## Progress notes

- [ ] Not started
- [ ] In progress
- [x] Complete
