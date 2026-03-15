# Sub ExecPlan: Climbing E2E Animation-Readiness Hardening

## Goal

Restore visibility-first Playwright assertions for the climbing route by introducing a reusable animation-readiness wait pattern so the tests assert what users can actually see, not just what has been attached to the DOM.

## Why

The current climbing E2E checks in `test/e2e/climbing.spec.ts` were relaxed to count-based and attached assertions because animated route content can exist in the DOM before the route transition and section-card reveal have fully completed in headless runs. That lowers confidence in UX-level behavior and diverges from the stronger visible-state checks used on more stable route surfaces.

## Constraints

- Keep the app fully client-side and preserve SPA behavior.
- Do not change route behavior or user-facing animation design just to satisfy tests.
- Keep the change narrowly scoped to E2E reliability for animated route content.
- Reuse existing Playwright style and helper patterns from `test/e2e`.
- Avoid fixed sleeps; wait on deterministic, user-observable readiness signals.

## Affected files and responsibilities

- `test/e2e/climbing.spec.ts`: restore strict visible-state assertions after readiness waits.
- `test/e2e/helpers/routeReadiness.ts`: shared helper for waiting until an animated section anchor is visible and has stopped moving.
- `test/e2e/photography.spec.ts`: optional second consumer if the helper remains route-agnostic and low-friction.
- `playwright.config.ts`: only touch if existing timeouts prove insufficient after the helper lands.
- `plans/v1-stretch-goals-integration.md`: record this as a follow-up hardening pass on execution step 6 after validation is complete.

## Proposed approach

Add a small shared E2E helper that waits for an above-the-fold animated section anchor to become visible and layout-stable across animation frames, then layer route-specific visible assertions on top of that helper. Apply it to the climbing route immediately after navigation, then restore strict visibility checks for section headings, metrics, chips, and freshness text. Keep the route-link tooltip validation focused on visible link behavior plus stable metadata rather than hover-only UI timing.

## Execution steps

1. Identify deterministic readiness signals on the climbing route that indicate the initial route transition and section-card reveal have completed.
2. Add a shared E2E helper that waits for those signals without relying on fixed delays.
3. Update climbing spec setup to call the helper immediately after navigation.
4. Replace count-based and attached assertions in climbing analytics tests with strict visibility assertions.
5. Revisit the link tooltip check by keeping strict visible link assertions and retaining the metadata assertion unless a hover assertion is stable after the readiness wait.
6. Run focused Playwright validation for climbing, including repeated runs, and confirm no new flakes.
7. If the helper remains clearly route-agnostic, adopt it in one additional animated route test as proof of reuse.

## Validation plan

- `npx playwright test test/e2e/climbing.spec.ts`
- `npx playwright test test/e2e/climbing.spec.ts --repeat-each=3`
- `npm run build`
- Optional reuse validation if step 7 lands: `npx playwright test test/e2e/photography.spec.ts`

## Risks and rollback

- Risk: readiness conditions may overfit current markup and fail after benign UI tweaks.
- Risk: stricter visibility checks may still flake if the anchor never enters the viewport in headless mode.
- Mitigation: prefer semantic, above-the-fold anchors and keep the helper small, explicit, and reusable.
- Rollback: revert the climbing spec to the prior relaxed assertions while keeping production climbing analytics behavior unchanged.

## Progress notes

- Status: Complete
- This hardening pass remained test-only and did not alter production runtime behavior.
- The shared helper settled on a small route-agnostic pattern: trigger intersection-based reveals with a raw DOM `scrollIntoView()`, then wait for the anchor to become visible and layout-stable across consecutive animation frames.
- `test/e2e/climbing.spec.ts` now restores strict `toBeVisible()` assertions for the climbing intro, analytics headings, destination headings, grade chips, freshness copy, and the first visible Mountain Project link.
- `test/e2e/photography.spec.ts` now reuses the same helper for its existing above-the-fold route readiness wait instead of maintaining a route-local implementation.
- Validation actually run: `npm run build`, `npx playwright test test/e2e/climbing.spec.ts`, `npx playwright test test/e2e/climbing.spec.ts --repeat-each=3`, and `npx playwright test test/e2e/photography.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
