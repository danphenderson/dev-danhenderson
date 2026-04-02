# Home Customize Auto Dismiss

## Goal

Restore the first-visit home onboarding behavior so the customize modal automatically advances to the settings hint after 2250 ms while still allowing the user to dismiss it immediately with the OKAY button.

## Why

The current welcome flow no longer auto-advances the customize step. The only live transition to the settings hint is the manual OKAY dismissal path, and both unit and Playwright tests currently enforce that elapsed time alone must not advance the flow. That leaves the home onboarding behavior out of sync with the intended choreography and the documented UX expectation.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and direct-link behavior.
- Keep the change narrowly scoped to the home welcome sequence.
- Preserve the existing manual OKAY dismissal path.
- Reuse the current welcome-sequence state machine instead of introducing a parallel onboarding controller.
- Avoid broad Playwright helper changes that would add a 2250 ms delay to unrelated route coverage.

## Affected files and responsibilities

- `src/hooks/useHomeWelcomeSequence.ts`: Owns the home welcome sequence state machine and will own the auto-dismiss timer.
- `src/components/FirstVisitCustomizeModal.tsx`: Existing OKAY button consumer of the dismissal callback; should remain behaviorally unchanged.
- `test/unit/hooks/useHomeWelcomeSequence.test.ts`: Hook-level timer expectations currently assert that elapsed time must not advance the modal.
- `test/unit/hooks/useHomeWelcomeSequence.test.tsx`: Provider-backed welcome-sequence coverage that should reflect the restored timing behavior.
- `test/e2e/home.spec.ts`: Route-level timing test currently asserts the dialog stays open until manual click.

## Proposed approach

Implement the 2250 ms auto-dismiss in `useHomeWelcomeSequence.ts`, because that hook already owns the transition from audio consent to customize modal to settings hint. Add a single timeout constant and effect that starts when `showCustomizeModal` becomes true, advances via the same state transition as the manual dismissal path, and clears on dependency change or unmount. Keep the modal component itself dumb so the timing behavior remains in the route-orchestration layer.

Update the targeted unit and Playwright tests to assert boundary behavior: the modal remains open before 2250 ms and advances at or after that delay. Keep the shared Playwright dismissal helper manual so the wider suite stays fast.

## Execution steps

1. Add a named 2250 ms auto-dismiss constant and timeout effect in `useHomeWelcomeSequence.ts`.
2. Ensure the existing `handleCustomizeDismiss()` path still advances immediately and cannot race with the timeout.
3. Replace the hook unit test that forbids elapsed-time advancement with positive timer coverage.
4. Update the provider-backed hook integration test to verify the modal auto-advances to the settings hint.
5. Replace the dedicated home Playwright test with an auto-dismiss timing check using the page clock.

## Validation plan

- `CI=true npm test -- --watchAll=false --runTestsByPath test/unit/hooks/useHomeWelcomeSequence.test.ts test/unit/hooks/useHomeWelcomeSequence.test.tsx`
- `npm run build`
- `npm run build && npm run test:e2e:chromium -- test/e2e/home.spec.ts`

## Risks and rollback

- The main regression risk is double-advancing the onboarding state if the timeout is not cleared when the user clicks OKAY manually.
- The hook already coordinates multiple onboarding phases, so the timer must stay narrowly scoped to `showCustomizeModal` to avoid affecting audio prompt or settings-hint behavior.
- If the timer causes unexpected state churn, rollback is isolated to the hook effect and the updated tests.

## Progress notes

- [2026-04-02] Confirmed the current regression surface: `useHomeWelcomeSequence.ts` has no auto-dismiss timer, `FirstVisitCustomizeModal.tsx` only advances via manual OKAY, and both hook and Playwright tests encode the broken behavior.
- [2026-04-02] Chose hook ownership for the timer so the welcome-sequence orchestration remains centralized.
- [2026-04-02] Added a 2250 ms timeout in `useHomeWelcomeSequence.ts` that advances the customize step while preserving the manual OKAY dismissal path.
- [2026-04-02] Updated hook unit coverage and provider-backed hook integration coverage to assert boundary timing behavior before and at the 2250 ms threshold.
- [2026-04-02] Replaced the dedicated home Playwright timing test with an auto-dismiss assertion and validated it with the chromium project.
- [2026-04-02] Validation completed: `CI=true npm test -- --watchAll=false --runTestsByPath test/unit/hooks/useHomeWelcomeSequence.test.ts test/unit/hooks/useHomeWelcomeSequence.test.tsx`, `npm run build`, and `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
