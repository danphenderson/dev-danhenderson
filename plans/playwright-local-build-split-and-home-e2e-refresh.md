# Playwright Build Split And Home E2E Refresh

## Goal

Update the Playwright coverage so the Home E2E tests assert the current settings and terminal-hero behavior, while local E2E workflows run production smoke checks against a production build and gated browser coverage against the test-runtime build.

## Why

The current Home E2E suite still expects an older settings control and an older terminal steady state, which causes false negatives. Separately, the local `npm run test:e2e` flow runs both the `chromium` and `smoke` projects against whichever build artifact happens to exist, so the smoke blog-gating assertions conflict with the test-runtime build required by gated blog coverage.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and direct-link behavior.
- Do not change the current Home hero state machine implementation.
- Keep the changes narrowly scoped to Playwright tests, test commands, and supporting docs.
- Do not regress the existing CI split where `chromium` uses the test-runtime build and `smoke` uses the production build.

## Affected files and responsibilities

- `test/e2e/home.spec.ts`: Home-route Playwright assertions and shared steady-state helper.
- `test/e2e/navigation.spec.ts`: cross-route Climbing readiness coverage.
- `test/e2e/smoke.spec.ts`: production smoke Climbing readiness coverage.
- `package.json`: local Playwright command shapes for split build/project execution.
- `.github/workflows/build.yml`: CI commands aligned with the split local Playwright script names.
- `README.md`: top-level build/test command guidance.
- `docs/engineering/testing-strategy.md`: canonical validation matrix and Playwright command guidance.
- `scripts/runPlaywrightSuite.js`: sequential local Playwright runner that rebuilds between projects.
- `test/e2e/home.spec.ts-snapshots/`: Home screenshot expectations for the current hero state.

## Proposed approach

Refresh the Home spec to assert the current settings popover control shape and replace the stale fixed-output helper with a helper that waits for the current steady-state loop in a way that matches the implemented hero behavior. Then add explicit local scripts for the `chromium` and `smoke` Playwright projects, plus a composite full-suite command that runs each project against the correct build artifact in sequence. Update the testing docs to make the split local workflow the canonical full-suite path while preserving existing targeted command forms.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Refresh `test/e2e/home.spec.ts` to match the current settings popover and terminal-hero steady state.
3. Add local package scripts that run `chromium` against `build:e2e`, `smoke` against `build`, and a full local E2E command that sequences both.
4. Update `README.md` and `docs/engineering/testing-strategy.md` so the documented full-suite and project-specific Playwright commands match the new split workflow.
5. Run targeted Playwright validation for Home and the production smoke suite against the correct build variants.

## Validation plan

- `npm run build:e2e`
- `npm run test:e2e:chromium -- test/e2e/home.spec.ts`
- `npm run build`
- `npm run test:e2e:smoke`

## Risks and rollback

- The Home helper could still overfit to one transient loop frame if it is not tied to a true steady-state condition.
- Updating the top-level Playwright command shapes affects local contributor workflow, so docs and scripts must stay aligned.
- If the split local command proves confusing or unstable, revert the script/doc changes independently from the Home spec changes.

## Progress notes

- 2026-03-19: Confirmed the Home E2E failures come from stale settings and stale steady-state assumptions, while the smoke blog failures only reproduce when the smoke project is served from the test-runtime build.
- 2026-03-19: Updated the Home settings assertion, switched the steady-state helper to the current server-tab plus loop-output contract, and refreshed the Home screenshot snapshots for the current `brew` frame.
- 2026-03-19: Replaced the brittle Climbing subtitle locator in navigation and smoke coverage with the `Overview` heading plus grid readiness.
- 2026-03-19: Added split local Playwright scripts, aligned CI commands with the new script names, and verified the full local suite via `npm run test:e2e`.
- 2026-03-20: Replaced the remaining timing-dependent Home screenshot wait with fake-clock advancement to the target loop frame, simplified the blog index readiness helper to direct content visibility checks, and added a reusable photography category-page helper so recovery and legacy-slug navigation wait for the rendered album contract rather than transient route timing.
- 2026-03-20: Verified the follow-up fixes with `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/blog.spec.ts test/e2e/photography.spec.ts` and a full `npm run build:e2e && npm run test:e2e:chromium` pass.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
