# Onboarding Review Fixes

## Goal

Resolve the validated review findings on the first-visit modal orchestration branch so visitors who decline audio can still re-enable it later, the customize modal surfaces audio loading/error feedback, and obsolete onboarding hint state no longer lingers in the provider/header path.

## Why

The current branch leaves a real regression in the decline path: after onboarding, the header settings popover hides audio controls when consent is declined, which conflicts with the modal copy and blocks recovery. The customize modal also gives no visible feedback when audio initialization is pending or fails. In addition, the onboarding provider and header still carry the previous hint-popover state even though the new welcome flow no longer drives that chain.

## Constraints

- Keep the app fully client-side and preserve SPA routing behavior.
- Keep the change narrowly scoped to onboarding, header settings, and the home route.
- Preserve existing theme, motion, and welcome-audio provider patterns.
- Avoid widening shared component APIs beyond what the current consumers need.
- Validate the Home route in browser tooling because the change affects shared header behavior and page-level onboarding UI.

## Affected files and responsibilities

- `src/components/Header.tsx`: header settings wiring and obsolete hint-popover removal.
- `src/components/header/HeaderSettingsPopover.tsx`: audio controls in the shared settings popover.
- `src/WelcomeOnboardingProvider.tsx`: onboarding state ownership; remove unused hint state if safe.
- `src/hooks/useHomeWelcomeSequence.ts`: home onboarding orchestration contract after provider cleanup.
- `src/pages/Home.tsx`: pass audio loading/error state into the customize modal.
- `src/components/FirstVisitCustomizeModal.tsx`: render user-facing audio feedback and disable toggle while loading.
- `test/unit/components/Header.test.tsx`: regression coverage for settings audio availability.
- `test/unit/components/header/HeaderActions.test.tsx`: popover-level audio control behavior.
- `test/unit/pages/Home.test.tsx`: customize-modal loading/error feedback coverage.
- `test/unit/WelcomeOnboardingProvider.test.tsx`: provider coverage after hint-state cleanup.
- `test/unit/hooks/useHomeWelcomeSequence.test.ts`: hook coverage after provider contract changes.
- `test/e2e/home.spec.ts`: regression coverage for decline -> finish onboarding -> reopen settings.

## Proposed approach

Keep audio recovery available from the header settings popover regardless of current consent, using the existing provider `play()` path to upgrade consent when needed. Remove the unused pause/dark-mode hint state and hint-popover wiring from the onboarding provider and header, since the current home sequence no longer opens those hints. Reuse the existing welcome-audio provider loading and error state in the customize modal so the user sees the same failure/loading feedback that already exists in the welcome prompt.

## Execution steps

1. Remove obsolete hint state and consumers from the onboarding provider, hook-facing tests, and header wiring.
2. Update the header settings popover path so audio controls remain available after decline and add regression tests.
3. Thread audio loading/error state into the home customize modal and render accessible feedback there.
4. Run targeted unit tests, build validation, and a browser check on `/` with the decline path.

## Validation plan

- `npm test -- --watch=false --runInBand test/unit/components/Header.test.tsx test/unit/components/header/HeaderActions.test.tsx test/unit/pages/Home.test.tsx test/unit/WelcomeOnboardingProvider.test.tsx test/unit/hooks/useHomeWelcomeSequence.test.ts`
- `npm run build`
- `npm run test:e2e -- test/e2e/home.spec.ts`
- Browser validation on `/` in desktop and narrow viewports, including decline -> customize modal -> settings audio recovery.

## Risks and rollback

- Removing hint state could break any still-live consumer outside the home sequence; search and test coverage must confirm the provider API is no longer needed.
- Changing settings audio visibility affects a shared component; regression coverage should confirm the audio section still behaves correctly when granted or paused.
- Wiring loading/error state into the customize modal could create duplicate or stale messaging if the provider state is not reset correctly.
- Rollback is contained to the onboarding/header files above; no route or data-model changes are required.

## Progress notes

- Validated: `Header.tsx` currently passes `showAudioControl={audioConsent !== 'declined'}`, so the blocking review finding is real.
- Validated: `useHomeWelcomeSequence.ts` no longer opens pause/dark-mode hints, but `WelcomeOnboardingProvider.tsx` and `Header.tsx` still carry the old hint-popover state.
- Validated: `FirstVisitCustomizeModal.tsx` currently receives only `isAudioPlaying` and `onToggleAudio`, so audio loading/error feedback is absent from that modal.
- Implemented: header audio controls now remain available after onboarding completion even when the visitor previously declined audio.
- Implemented: obsolete hint-popover state and tests were removed from the live onboarding path.
- Implemented: customize modal now shows loading/error feedback for audio startup.
- Validated: targeted unit suites passed (6 suites, 77 tests), `npm run build` passed, `npm run test:e2e -- test/e2e/home.spec.ts` passed, and manual browser checks passed on desktop and narrow widths.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
