# Page Eyebrow Tilt Cards

## Goal

Add MotionTilt animation to the intro eyebrow cards on `/climbing`, `/photography`, and `/blog` so those page-entry surfaces respond like the `/cv` About card without changing route structure, content order, or existing card content.

## Why

These three route intro cards currently enter with the standard animated card treatment but do not participate in the hover tilt interaction used by the CV About surface. Adding the same tilt treatment aligns the route intro surfaces with an existing interaction pattern and makes the motion behavior feel more consistent across top-level pages.

## Constraints

- Preserve the current client-side SPA architecture and route behavior.
- Keep the change page-local unless a shared abstraction is clearly necessary.
- Do not alter existing intro copy, section ordering, or card layout.
- Reuse the existing `MotionTiltCard` primitive rather than introducing new motion wrappers.
- Preserve feature-gated blog behavior and current editorial component boundaries.
- Leave unrelated local changes in screenshots and Playwright helpers untouched.

## Affected files and responsibilities

- `src/pages/Climbing.tsx`: wrap the climbing intro card in a tilt surface while keeping deferred-content behavior intact.
- `src/pages/Photography.tsx`: wrap the photography intro card in a tilt surface while preserving existing featured/grid album card motion.
- `src/pages/Blog.tsx`: wrap the blog intro card in a tilt surface while preserving the intro typewriter timing and featured hero behavior.
- `test/unit/pages/Climbing.test.tsx`: update tilt-surface assertions for the new intro wrapper.
- `test/unit/pages/Photography.test.tsx`: add focused assertions that the intro card renders inside a tilt surface.
- `test/unit/pages/Blog.test.tsx`: add focused assertions that the intro card renders inside a tilt surface.

## Proposed approach

Apply `MotionTiltCard` directly around each route-local `SectionCard` intro surface, using the same `0.5` intensity as the CV About card for consistent feel. Keep the change local to the three pages instead of widening `SectionCard` with a new prop, which would create unnecessary multi-consumer risk. Update the page tests to assert the presence of the tilt wrappers and, where already covered, the expected tilt intensity or motion-disabled state.

## Execution steps

1. Wrap each affected page intro `SectionCard` in `MotionTiltCard` with CV-aligned intensity.
2. Update focused unit tests for `/climbing`, `/photography`, and `/blog` to assert the intro tilt wrappers.
3. Run compile, targeted unit, browser, and covered-route validation for the affected pages.
4. Update this plan with final progress notes and completion status.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false test/unit/pages/Climbing.test.tsx test/unit/pages/Photography.test.tsx test/unit/pages/Blog.test.tsx`
- Browser validation on `/climbing`, `/photography`, and `/blog` at one desktop and one narrow viewport
- Browser validation with motion intensity `off` for the touched intro cards
- `npm run test:e2e`

## Risks and rollback

- Wrapping the intro cards at the wrong layer could accidentally change spacing, focus behavior, or card width.
- Introducing a shared-card prop would broaden regression risk across routes that were not requested.
- Blog intro behavior is time-sequenced; the tilt wrapper must not interfere with the existing typewriter trigger.
- Rollback is straightforward: remove the three page-local wrappers and revert the focused test assertions.

## Progress notes

- Initial review shows climbing and photography already use `MotionTiltCard` for other surfaces, so the safest path is to wrap only the intro cards.
- Blog’s featured hero already has its own editorial hover treatment; this change is scoped to the page intro card unless implementation reveals a direct requirement to broaden scope.
- Implemented page-local `MotionTiltCard` wrappers around the intro `SectionCard` on `/climbing`, `/photography`, and `/blog` using `intensity={0.5}` to match the CV About card.
- Updated the focused page tests so the new intro tilt surfaces are asserted directly, while preserving the existing data-surface tilt expectations on climbing.
- `npm run build` passed.
- `CI=true npm test -- --watchAll=false test/unit/pages/Climbing.test.tsx test/unit/pages/Photography.test.tsx test/unit/pages/Blog.test.tsx` passed.
- Browser validation passed on `/climbing`, `/photography`, and `/blog` at `1440x1200` and `390x844`; intro tilt transforms changed under pointer movement in default motion and stayed flat with `danhenderson-motion=off`.
- `npm run test:e2e` completed with unrelated baseline failures in existing blog and photography specs that still expect older intro copy (`Technical writing on frontend architecture...` and `A selection of photo albums.`). Those failures were not introduced by this tilt-wrapper change.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
