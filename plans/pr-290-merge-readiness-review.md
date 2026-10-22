# PR #290 merge-readiness review and remediation

## Goal

Decide whether `fix/app-speed-dial-slot-props` (PR #290) can merge into `main`. Fix the blocking and well-supported findings within this PR's surfaces: CI browser launch, the welcome e2e race, keyboard/assistive-technology access to the Home preferences panel, audio-error announcement, service-worker asset delivery, and a dead test assertion. Visitors should be able to open, use, and leave the optional preferences panel by pointer, keyboard, or screen reader without racing its idle timer.

## Why

### Review baseline (2026-10-22)

- Base `main`: `900a0c0fe671ec209b5634913aeb9afb9abc753e`; merge base is the same commit.
- Reviewed head: `8f113d58acc9b1b85e744c4ae99f84400543eef2` (clean working tree).
- Branch commits: `13ed1bb` (speed-dial `slotProps`), `37c1e07` (welcome flow, GitHub stars), `3728808` (quality pass: accessibility, media delivery, first-visit UX), `8ec1f38` (merge), `5dd34d3`, `8f113d5` (CodeQL URL-host fix in `welcome.spec.ts`; review thread resolved).
- Hosted CI run `39715852498` at the head: build, CodeQL, and unit tests passed; **e2e (82 tests) and smoke (12 tests) failed at browser launch** before any test executed.

**Initial verdict: not ready to merge.** Required browser checks cannot run, one new e2e spec races the route transition, and the new preferences panel is effectively out of reach for keyboard and screen-reader users.

### Findings (ordered by severity, then confidence)

| ID | Severity / origin / confidence | Finding | Disposition |
| --- | --- | --- | --- |
| F1 | P1 blocker, introduced, high | `playwright.config.ts:20` enables `chromiumSandbox`. On Ubuntu 23.10+ runners (`kernel.apparmor_restrict_unprivileged_userns=1`), Chromium aborts with `No usable sandbox!`. Reproduced on Ubuntu 24.04.5 / AppArmor 4.0.1. | Fix in CI with a Chromium-only AppArmor `userns` profile; keep the sandbox enabled. |
| F2 | P2 test reliability, introduced, high | `welcome.spec.ts` clicks the opener during the ~570 ms `PageTransition`. Playwright retries an unstable target with alternate `scrollIntoView` alignments; `block: 'start'` plus `scroll-behavior: smooth` scrolls 223 px, the hide-on-scroll header leaves, and `Open settings` never resolves. Failed on the first attempt in a local full run; deterministic in a probe (12/12). Test-only: real clicks do not scroll. | Wait for the opener to settle without scrolling before clicking. |
| F3 | P2 accessibility, introduced, high | The opener exposes no expanded state. Keyboard activation leaves focus on the opener; the panel is portaled to the end of `<body>`, so reaching it took 14 Tab presses through IDE controls while the 5 s idle timer runs. The existing focus test uses programmatic `.focus()`, overstating reachability. | Add disclosure semantics and move focus into the panel for keyboard/AT activation. |
| F4 | P3 interaction, introduced, high | Clicking the opener while the panel is open triggers click-away dismissal on `mousedown`, then reopens it on `click`; Enter does nothing. With `aria-expanded`, activation must collapse. | Make the opener a true toggle and exclude it from click-away. |
| F5 | P3 accessibility, introduced, medium | The audio-error `aria-live` span mounts already populated, so many screen readers skip it. | Keep a persistent live region while the panel is open. |
| F6 | P3 performance, introduced, medium-high | `public/service-worker.js` `updateCache` awaits the serialized cache-write chain before returning. Every runtime image, script, style, and font response waits for its own body to download and all earlier writes to finish; one stalled write blocks later route chunks and loses progressive image rendering. | Return the network response immediately and extend the fetch event with `event.waitUntil` for the write. |
| F7 | P3 test integrity, introduced, high | `test/unit/pages/Climbing.test.tsx:484` queries the label text as a placeholder (`Route or location` is the placeholder), so the negative assertion cannot fail. | Query by label, matching the positive assertion at line 387. |
| F8 | P2 accessibility, introduced by the F3 fix, high (found by the post-fix code review) | `FirstVisitWelcome` rendered inside `BackgroundPaper`, which `shellWrapper` drops while the IDE is expanded, minimized, or closed. In those states the opener reported `aria-expanded="true"` with an `aria-controls` target that did not exist. If the pointer was over the panel when it unmounted, `isInteracting` stayed true and auto-dismiss never ran. On restore, Fade remounted with `in` already true and `onEnter` pulled focus back into the panel. | Render the panel outside the IDE shell; it portals to `<body>`, so the layout is unchanged. Make the focus request one-shot (cleared on dismiss). |
| F9 | P3 test integrity, introduced by the F3 test, high (found by the post-fix code review) | The keyboard e2e test's final "toggles closed" assertions used the 10 s expect timeout, longer than the 5 s auto-dismiss, so they could pass even if the toggle did nothing. | Assert `aria-expanded="false"` and the hidden panel within 2 s of the click. |

Verified without findings:
- The speed-dial fix matches MUI 7.3.9: `SpeedDial` merges `slotProps.fab` with its injected ref, while the legacy `FabProps` path was overridden.
- GitHub stars keep "unknown" distinct from zero.
- CV reveal and focus behave correctly.
- `index.html` favicon rebasing is subpath-safe.
- The `BackgroundPaper` `<main>` to `<div>` change removes a duplicate landmark.
- There is one `h1` per route.
- `scroll-behavior` respects Off and system-reduced motion through `effectiveMotionIntensity`.
- A3 does not occur: pressing Escape in the command palette while the panel is open closes only the palette, because MUI Modal stops propagation.

Deferred, P3 or optional (recorded, not implemented):
- `showSettingsHint` is always false, so these are dead wiring:
  - `Header` `forceVisible` and `data-highlighted`
  - `expandDotHighlighted`
  - the orphaned `hintPopover*Sx` builders

  The earlier plan kept the onboarding provider API compatible, so removal belongs in a separate cleanup.
- At `subtle` motion, the IDE status flash and cursor-blink keyframes still run; they gate on `motionScale`, not `cssAnimations`. This is the documented IDE exception and has improved relative to `main`.
- The 55 KB display-image manifest ships in the entry chunk through `HeaderNav` and `BackgroundPaper`. It is within the bundle budget.
- The 5 s idle close of an on-demand panel containing controls is a documented product decision (README, page choreography). Removing it would better satisfy WCAG 2.2.1. Focus-in now pauses it for keyboard and AT users.

## Constraints

- Preserve the SPA and static-hosting model, `PUBLIC_URL` safety, provider order, stored preferences, and GitHub fallbacks.
- Preserve the `useMotionScale()` contract, the Home IDE design exception, and the documented auto-dismiss behavior for pointer users.
- Keep `chromiumSandbox: true`. Grant user namespaces only to Playwright's Chromium binaries rather than disabling the kernel restriction globally.
- Avoid new dependencies, unrelated refactors, and history rewrites. Keep `FirstVisitWelcome`'s existing props compatible; new props are optional.

## Affected files and responsibilities

- `.github/actions/playwright-sandbox/action.yml` (new): idempotent AppArmor profile for Playwright Chromium on restricted runners.
- `.github/workflows/build.yml`: run that action in the `e2e` and `smoke` jobs after browser installation.
- `README.md` and `docs/engineering/testing-strategy.md`: document the runner requirement and how to apply it locally. Note the opener and focus behavior and the service-worker write strategy.
- `docs/frontend/page-choreography.md`: describe the opener toggle and keyboard focus behavior.
- `src/pages/Home.tsx`: opener `aria-expanded`/`aria-controls` and toggle; detects keyboard/AT activation (`event.detail === 0`); renders the panel outside the IDE shell (F8).
- `src/hooks/useHomeWelcomeSequence.ts`: `handleOpen({ moveFocus })` records whether focus should enter the panel; `handleDismiss` clears that request.
- `src/components/FirstVisitWelcome.tsx`:
  - exported panel id, focusable region, optional `focusOnOpen` focus move
  - opener excluded from click-away
  - persistent audio-error live region
- `src/styles/appStyleBuilders.ts`: visible `:focus-visible` treatment for the panel, matching existing floating-control focus rings.
- `public/service-worker.js`: non-blocking cache writes kept alive with `event.waitUntil`.
- Tests:
  - `test/e2e/welcome.spec.ts` and `test/e2e/helpers/routeReadiness.ts` (optional no-scroll readiness)
  - `test/unit/components/FirstVisitWelcome.test.tsx`
  - `test/unit/hooks/useHomeWelcomeSequence.test.tsx`
  - `test/unit/pages/Home.test.tsx`
  - `test/unit/serviceWorker.test.ts`
  - `test/unit/pages/Climbing.test.tsx`

## Proposed approach

1. CI: add a composite action that writes and loads the AppArmor profile only when the sysctl restriction is active. Call it from both browser jobs.
2. Welcome panel: treat the opener as a disclosure button.
   - Keyboard and AT activation focuses the labelled region (`tabIndex={-1}`); pointer opening keeps the idle timer.
   - The region announces its name, and Tab continues into its controls.
   - Focus inside already pauses the timer. Escape, the dismiss buttons, and toggling return focus to the opener.
   - The portal remains because the hero's transform would break `position: fixed`.
3. Live region: render an always-present `aria-live="polite"`, `aria-atomic` container beside the audio button, and change only its text.
4. Service worker: `updateCache(request, response, event)` queues the write, calls `event.waitUntil(write)`, and returns the response. Keep the serialization and entry bounds.
5. Tests:
   - Wait for opener stability without scrolling.
   - Add real-keyboard e2e and unit coverage, including the toggle.
   - Add a service-worker regression test with a never-settling `cache.put`.
   - Correct the Climbing query.

## Execution steps

1. Commit this plan.
2. Implement F1 and the docs; F2; F3 through F5 with unit tests; F6 with unit tests; F7.
3. Validate (below), update progress notes, and re-review the full diff.

## Validation plan

- Focused Jest:
  - `FirstVisitWelcome`
  - `useHomeWelcomeSequence`
  - `Home`
  - `serviceWorker`
  - `Climbing`

  Then the full Jest suite.
- `npm run lint -- --max-warnings=0`, `npm run typecheck`, `npm run media:check`, `npm run build`, `npm run check:bundle`.
- `npm run build:e2e`, then the Chromium Playwright project. Also run `welcome.spec.ts` with `--repeat-each=10 --retries=0`.
- `npm run build`, then the smoke project, including the service-worker smoke spec.
- Sandboxed browser checks on `/`:
  - 390 px and 1440 px viewports
  - light and dark modes, with two presets
  - Off and system-reduced motion
  - keyboard open, Tab, Escape, and toggle
  - screenshots inspected
- Hosted CI on the pushed head: the composite action is only exercised there.

## Risks and rollback

- If the AppArmor syntax differs on future runner images, the action fails before tests rather than silently disabling the sandbox. To roll back, revert the action and the two workflow steps.
- Focus-on-open depends on `event.detail === 0` for keyboard and AT clicks. If a platform reports `detail >= 1` (some touch screen readers), it falls back to the previous behavior: the panel opens and focus stays on the opener.
- Keeping cache writes alive with `waitUntil` relies on the pending `respondWith` lifetime promise. Spec-valid, and covered by the service-worker smoke spec.
- Each fix is isolated by file, so any one can be reverted without the others.

## Progress notes

- 2026-10-22: Baseline and review complete.
  - Local sandboxed runs with the AppArmor profile: Chromium 81 passed, 1 flaky (F2); smoke 12/12.
  - Lint, typecheck, `media:check`, build, and `check:bundle` (896,703 B raw / 279,413 B gzip) pass.
  - Full Jest: 136 suites / 1007 tests pass.
- 2026-10-22: Implementation (time-boxed).
  - F1 done: `.github/actions/playwright-sandbox` loads an AppArmor userns profile only when `kernel.apparmor_restrict_unprivileged_userns=1`. Validated locally: launch failed without the profile, the action script loaded it, Chromium launched sandboxed, and a rerun was idempotent. Hosted CI must still confirm.
  - F2 done: under load (8 workers × 8 repeats), the HEAD build also failed `header navigation is usable during the welcome at 390px` 2/64 for the same reason (the click retry scrolled the page and hid the header). `openPreferences` now waits for a stable opener without scrolling (`scrollIntoView: false`, a new opt-out that defaults to the old behavior).
  - F3/F4/F5 done: the opener is a disclosure toggle with `aria-expanded`/`aria-controls`. Keyboard/AT activation (`event.detail === 0`) focuses the panel through Fade `onEnter` with `preventScroll`. Clicking the opener no longer counts as a click-away. The audio error region stays mounted and describes the button. Unit regressions: 24/24 focused tests pass.
  - Deferred at that point: F6, F7, and a real-keyboard Playwright test for F3 (all completed below).
- 2026-10-22: Remaining findings completed.
  - F6 done: `updateCache` returns the network response immediately and passes the serialized write to `event.waitUntil`. The unit harness records lifetime promises (`settleWrites`) and holds writes (`holdWrites`); the new regression test times out on the previous worker and passes now. The service-worker smoke spec polls the cache until it holds the original, then the redeployed, byte length instead of assuming writes finish before the image loads.
  - F7 done: the empty to-do assertion uses `queryByLabelText`.
  - F3 browser coverage done: `welcome.spec.ts` opens the panel with Enter and checks focus, `aria-expanded`/`aria-controls`, Tab order, the paused timer, Escape focus return, and the pointer toggle.
  - Validation on the final head (fresh environment, AppArmor profile loaded by running the action script verbatim, sandbox on):
    - `npm run lint -- --max-warnings=0`, `npm run typecheck`, `npm run media:check`, `npm run build`, and `npm run check:bundle` pass (896,793 B raw / 279,419 B gzip; +90 B / +6 B against the baseline).
    - Full Jest: 136 suites / 1013 tests pass (1007 baseline + 6 new).
    - `npm run build:e2e`, then the Chromium project: 83/83 with retries disabled. `welcome.spec.ts` with 8 repeats on 8 workers: 72/72.
    - `npm run build`, then the smoke project: 12/12; `service-worker.smoke.spec.ts` with 5 repeats: 10/10.
    - Keyboard-open state at 390 px dark + reduced motion and 1440 px light + motion Off: focus on the panel, focus-visible outline, no page scroll, header visible.
  - Final verdict: ready for human review, pending hosted CI on the pushed head (the sandbox action has only been proven locally).
- 2026-10-22: Post-fix code review (F8, F9).
  - F8 done: `FirstVisitWelcome` renders after the hero container instead of inside `BackgroundPaper`, so IDE window state no longer unmounts an open panel. `handleDismiss` clears `focusWelcomeOnOpen`, so a later remount cannot take focus.
    - Home regression test: minimize the IDE, then open from the keyboard. Asserts the panel exists, `aria-controls` resolves, and focus enters it. After restore, it asserts the same panel node is still there and does not have focus. The test fails against the previous placement (the panel is missing while minimized).
    - The hook test asserts that dismissal clears the focus request.
  - F9 done: the keyboard e2e test asserts the toggle closes the panel within 2 s, well inside the 5 s auto-dismiss.
  - Validation:
    - Focused Jest: 25/25.
    - `npm run lint -- --max-warnings=0` and `npm run typecheck` pass. Prettier drift in `Home.tsx` (top import block) and `welcome.spec.ts` predates this change.
    - Full Jest: 136 suites / 1014 tests pass.
    - `npm run build:e2e`, then the Chromium project: 83/83 with retries disabled. `welcome.spec.ts` with 8 repeats on 8 workers: 72/72.
    - Real-Chromium probe at 1440 px light + reduced motion and at 390 px dark + full motion:
      - Minimize the IDE, then open the panel with Enter: the panel shows, `aria-expanded="true"`, `aria-controls` resolves, and focus is inside the panel.
      - Restore the IDE with Enter: the panel stays open and does not take focus.
      - Press Enter on the opener: the panel closes.
    - Restoring moves focus to `<body>` because the restore control unmounts. That behavior predates this PR and is recorded as debt.
  - Verdict unchanged: ready for human review, pending hosted CI on the pushed head.
