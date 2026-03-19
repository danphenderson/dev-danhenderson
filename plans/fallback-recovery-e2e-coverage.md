# Fallback Recovery E2E Coverage

## Goal

Extend the existing Playwright route specs so the built app has browser-level regression coverage for the shared fallback and recovery surfaces on the catch-all not-found route, invalid blog slugs, invalid photography album slugs, and optionally the Home welcome-audio prompt copy.

## Why

The recent design-system cleanup normalized these fallback flows onto shared headings, text primitives, and recovery panels. Unit tests now protect the component composition, but the missing layer is real browser validation that direct navigation, route rendering, recovery copy, suggested destinations, and prefilled command-palette recovery still work after build-time feature gating and route transitions.

## Constraints

- Keep the change limited to the existing Playwright specs and helpers; do not add a new broad suite.
- Preserve the current user-facing copy and route behavior.
- Prefer accessible selectors and visible-text assertions over brittle DOM-shape checks.
- Use `npm run build:e2e` before Playwright validation so the feature-gated blog routes remain enabled.
- Reuse `test/e2e/helpers/routeReadiness.ts` if fallback-route animation settling needs explicit readiness handling.

## Affected files and responsibilities

- `plans/fallback-recovery-e2e-coverage.md`: ExecPlan for this E2E fallback coverage task.
- `test/e2e/not-found.spec.ts`: strengthen the catch-all recovery assertions beyond the palette flow.
- `test/e2e/blog.spec.ts`: strengthen the invalid-slug fallback coverage for shared recovery intro and prefilled palette query.
- `test/e2e/photography.spec.ts`: strengthen the invalid-album fallback coverage for shared recovery intro and suggested album rows.
- `test/e2e/home.spec.ts`: optional narrow assertion for the welcome-audio prompt body copy before dismissal.
- `test/e2e/helpers/routeReadiness.ts`: only touched if route-level motion settling needs an additional reusable helper.

## Proposed approach

Patch the existing route specs in place. For each fallback flow, assert the normalized shared heading/body/recovery text that should be visible before opening the command palette, then keep the existing recovery interactions and strengthen them with prefilled textbox assertions. Scope the suggested-destination checks to accessible link names that uniquely identify contextual suggestions (`Open Blog:` and `Open Album:`) so the assertions stay resilient without depending on brittle layout containers. If fallback animations make the tests flaky, use `waitForAnimatedSectionReadiness()` on the recovery heading/body before asserting the rest of the content.

## Execution steps

1. Add the ExecPlan and inspect the current fallback copy, recovery component output, and existing Playwright helpers.
2. Extend `not-found.spec.ts` with assertions for the shared recovery overline, title, subtitle, helper caption, and recovery section headings.
3. Extend the invalid-slug tests in `blog.spec.ts` and `photography.spec.ts` with fallback-copy, suggested-destination, and prefilled command-palette assertions while keeping the current navigation recovery flow.
4. If the Home prompt addition stays deterministic, add one small prompt-body assertion to `home.spec.ts` before dismissal.
5. Run the E2E build variant and the narrowest relevant Playwright specs, then update this plan with validation results and any flake-handling changes.

## Validation plan

- `npm run build:e2e`
- `npx playwright test test/e2e/not-found.spec.ts test/e2e/blog.spec.ts test/e2e/photography.spec.ts`
- `npx playwright test test/e2e/home.spec.ts` if `test/e2e/home.spec.ts` changes

## Risks and rollback

- Motion-driven route reveals can make fallback assertions race; contain that risk by reusing `waitForAnimatedSectionReadiness()` instead of introducing ad hoc sleeps.
- Blog coverage depends on the test build variant; running against a normal production build would create false failures because the gated routes disappear.
- Suggested-destination assertions could become brittle if they overfit container structure; prefer unique accessible link names and visible headings.
- Rollback is straightforward: revert the touched spec assertions, and revert helper changes separately if extra readiness logic is not needed.

## Progress notes

- 2026-03-18: Reviewed `PLANS.md`, `docs/engineering/testing-strategy.md`, the existing route specs, and the live fallback copy in `NotFound`, `BlogPost`, `PhotographyCategory`, `RouteRecoveryPanel`, and `Home`.
- 2026-03-18: Confirmed the feature-gated blog route must be validated with `npm run build:e2e` and that the existing `waitForAnimatedSectionReadiness()` helper is available if fallback animation settling needs explicit waits.
- 2026-03-18: Extended `test/e2e/not-found.spec.ts` to assert the shared route-recovery overline, 404 title/subtitle, reopen-palette helper caption, recovery headings, and the visible contextual `Open CV: About` suggestion before opening the palette.
- 2026-03-18: Extended the invalid-slug fallback coverage in `test/e2e/blog.spec.ts` and `test/e2e/photography.spec.ts` to assert the shared fallback intro copy, suggested-destination rows, shared recovery routes heading, and prefilled command-palette values.
- 2026-03-18: Added one deterministic welcome-audio prompt body-copy assertion to `test/e2e/home.spec.ts` before dismissal.
- 2026-03-18: Reused `waitForAnimatedSectionReadiness()` directly from the existing helper module inside the fallback specs; no changes to `test/e2e/helpers/routeReadiness.ts` were needed.
- 2026-03-18: Validation completed with `npm run build:e2e`, `npx playwright test test/e2e/not-found.spec.ts test/e2e/blog.spec.ts test/e2e/photography.spec.ts`, and `npx playwright test test/e2e/home.spec.ts`. The build produced a successful compiled bundle; the terminal wrapper reported exit code `130` after the successful build output, but the generated build served cleanly for the passing Playwright runs.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
