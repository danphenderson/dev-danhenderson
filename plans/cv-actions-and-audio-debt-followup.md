# CV actions and welcome-audio debt follow-up

## Goal

Make CV resume-menu and certificate actions reliable with touch, mouse, and keyboard, then remove the unused welcome-reset and consent-validation helpers identified during the audio repair.

## Why

Production browser checks previously found a mobile WebKit resume action that closes before its tap and an intermittent mobile Chromium certificate tap with no PDF request. The user explicitly requested fixes for these findings on 2026-11-04. Replacing SoundCloud also left an unused reset/runtime-resolver chain and consent validator.

## Constraints

- Preserve all earlier unstaged Home, audio, CV, and cleanup changes; do not stage or commit.
- Preserve native links, downloads, filenames, PDFs, SPA routes, PUBLIC_URL handling, and provider nesting.
- Keep audio paused on entry and explicit-play persistence unchanged.
- Use sandboxed Playwright with real PDF requests/downloads. Do not hide failures with forced clicks, arbitrary waits, or retries.
- Follow useMotionScale and keep shared component behavior accessible across its consumers.

## Affected files

- `src/components/AppSpeedDial.tsx`, its tests, and CV action consumers if needed: diagnose and repair open/close, focus, pointer, and motion behavior.
- `src/motion/components.tsx` and a focused MotionTiltCard suite: isolate mouse hover from touch compatibility events and reset disabled tilt; validate all routes that consume the shared primitive.
- CV certificate/list/motion components only where browser evidence establishes a cause.
- `test/e2e/cv-actions.spec.ts` and `test/e2e/asset-delivery.smoke.spec.ts`: preserve real download/content assertions and add meaningful regression coverage.
- `src/welcomeSequenceEnvironment.ts`, `src/constants/runtimeEnvironment.ts`, their tests, `src/utils/appEnvironment.ts`, and `src/theme/preferences.ts`: remove confirmed unreachable helpers and orphaned tests without removing live environment/storage behavior.
- Current architecture, testing, and README documentation: reflect the final behavior and removal.

## Approach and steps

1. Save the current tree outside the repository, inspect consumer/event paths, and reproduce the browser failures with event/layout evidence.
2. Fix the smallest responsible interaction boundary. Preserve native anchor semantics and keyboard/hover/touch behavior; add tests for the observed failure.
3. Recheck references and remove the isolated unused helper chain, validator, and tests; retain build-tool runtime configuration and live preference keys.
4. Run focused unit/static checks, repeated original failing browser cases, the full unit suite, production asset checks at root and /portfolio, and relevant CV/navigation/settings coverage. Run the full E2E workflow if changes affect shared route/motion behavior.
5. Review exact changes against the saved tree, retain evidence, update this plan, and report any limitations.

## Validation

- `npm run typecheck`, `npm run lint`, and `git diff --check`.
- Focused affected Jest suites, then `CI=true npm test -- --watchAll=false --runInBand`.
- `npm run build` and `npm run check:bundle`.
- Sandboxed repeated mobile resume/certificate tests with actual assets; root and subpath asset suites.
- Desktop keyboard navigation, mobile touch, reduced/off/default motion, and both AppSpeedDial consumers.
- Reference audit and hash comparison to ensure existing content/assets and unrelated dirty changes are preserved.

## Risks and rollback

- A touch-triggered synthetic hover/focus event may differ from mouse/keyboard behavior; validate all three rather than removing accessibility behavior broadly.
- Motion, focus, and click timing may share a cause across download actions. Establish the cause before changing tests.
- Remove only this follow-up's hunks if rollback is needed. Baseline files and hashes are under `/tmp/dev-danhenderson-cv-followup/`.

## Progress

- Re-anchored to `codex/cv-snorkel-presentation`, HEAD `be7dddfd89bda3eae1db08e9483563403a19dd34`; index is empty. Saved the dirty tree baseline.
- AppSpeedDial has two current CV consumers: About actions and section navigation. Its controlled close handler currently closes for every MUI close reason; browser diagnosis is pending.
- Reference audit confirmed the reset helper has no app callers; its runtime resolver and override reader are an isolated chain with only unit-test consumers. Removed those helpers and orphaned tests plus `isAudioConsent`, retaining live storage keys, consent writes, Node/public-URL/GitHub/build-metadata readers, and build scripts/configuration. Updated current documentation.
- Initial baseline repetition: both mobile browser projects passed both cases twice (8/8); native pointer/focus instrumentation is running to diagnose timing-dependent failure modes.
- Instrumented WebKit reproduced a menu failure: the touch gesture emitted compatibility mousemove, rotating the About card; the trigger then emitted mouseout and the menu closed before the action received pointerdown. Touch also emits compatibility mouse events on certificate cards. Fix the shared MotionTiltCard to react only to genuine mouse pointer events, including reset when disabled/cancelled; preserve mouse hover tilt and motion scaling. Keep focused menu controls open on mouse-leave, while retaining blur/Escape/toggle/action dismissal. This expands validation to the full route E2E suite because tilt is shared across routes.
- Implemented pointer-type filtering, pressed-mouse suppression, cancellation reset, immediate disabled/reduced-motion reset, and focus-aware menu mouse-leave behavior. Typecheck and 5 focused Jest suites / 39 tests pass, including touch/pen plus compatibility mouse events, retained mouse tilt, disable/reset, and menu focus behavior.
- Original real-PDF menu and certificate cases passed 5 repetitions in each mobile browser (20/20). Native post-fix WebKit captures show no card rotation or premature close in 3/3 menu runs. The original certificate timeout did not reproduce in the instrumented baseline; those captures did confirm touch-generated tilt on certificate cards, which the shared fix removes. Do not claim the timeout's exact event sequence was established.
- Manual desktop CV verification: keyboard focus survives pointer leave, Escape closes and returns focus, and a hover-only menu closes on pointer leave. Scoped the CV browser test to About actions because the section navigator also exposes a GitHub action. Added the focused-menu mouse-leave regression to that test.
- Full Jest initially exposed the photography TiltCard alias suite's old mouse-event/motion-value mocks (3 failures). Updated that suite to emit mouse pointer events and model the native MotionValue jump method; no source workaround was added for test mocks.

## Final validation and outcome

- Final full Jest: **130 suites / 1,010 tests passed**. Focused input/helper/audio suites: **39 passed**; photography tilt alias: **8 passed**.
- `npm run lint`, `npm run typecheck`, strict TypeScript unused-local/parameter checks, and `git diff --check` pass.
- Production build and its **305 asset** checks pass. Bundle budget passes at **883,711 bytes raw / 274,051 bytes gzip**. Vite's existing individual-chunk size warning remains; bundle splitting is outside these three requested fixes.
- Full `npm run test:e2e`: **149 passed**, with **88 Chromium route tests**, **21 production desktop tests**, **16 mobile production tests**, and **24 /portfolio asset tests**. This includes both CV PDF controls, certificate requests/bytes, all welcome-audio checks, shared card consumers, navigation, and service-worker tests. The normal production build was restored.
- Before that full run, the original resume-menu/certificate tests passed **20/20** repeated mobile cases. The original certificate timeout did not reproduce in isolation, so its exact cause is not proven; the observed touch-induced certificate-card movement has been removed, and all current certificate checks pass.
- No public component props, route/content data, PDFs, audio bytes, or build-tool runtime configuration changed. The existing paused-by-default local audio implementation and Home containment repair are unchanged. Reference checks found no remaining callers of the removed helpers in current source/tests/docs.
- Evidence is retained in `output/playwright/cv-followup/`, including the failed baseline menu event sequence, post-fix sequences, repeated/full test logs, and keyboard-menu screenshot. All browser/preview sessions were closed. Changes remain unstaged.

## Completion

- [x] Investigate both browser issues and reproduce the menu failure.
- [x] Implement and validate shared touch/focus fixes.
- [x] Remove unused helpers and update current documentation.
- [x] Complete final gates and scope review.
