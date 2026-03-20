# CI Review Followups

## Goal

Clear the merge regressions that currently block CI so the branch passes build, unit-test, smoke, and browser validation again.

## Why

The latest onboarding merge introduced two confirmed CI failures and one likely follow-on Playwright mismatch:

- the build job fails because `HeaderSettingsPopover.tsx` still imports removed types
- the test job fails because `Header.test.tsx` still asserts the deleted hint-popover callback
- the updated home Playwright spec expects an `Audio` label, while the merged settings popover now renders `Welcome audio`

## Constraints

- Keep the change narrowly scoped to CI fallout from the merge.
- Preserve the current first-visit modal architecture and header settings behavior.
- Do not refactor unrelated onboarding, theme, or motion code.
- Validate with the narrowest relevant Jest and Playwright commands plus the production build.

## Affected files and responsibilities

- `src/components/header/HeaderSettingsPopover.tsx`: remove stale imports that break CI builds.
- `test/unit/components/Header.test.tsx`: align the header unit test with the new onboarding API.
- `test/e2e/home.spec.ts`: align the home Playwright assertion with the current settings-popover copy.

## Proposed approach

Remove the dead type imports left behind when the settings popover hint wiring was deleted, update the stale header unit test to validate the new behavior directly, and correct the home E2E expectation to the current settings section label. Then rerun the exact build, unit, chromium browser, and smoke checks that map to these failures.

## Execution steps

1. Remove the unused imports from `HeaderSettingsPopover.tsx` so `CI=true npm run build` can succeed.
2. Update `Header.test.tsx` to stop referencing the deleted hint callback and assert only the surviving theme-toggle behavior.
3. Update `home.spec.ts` to assert the current `Welcome audio` section label.
4. Run targeted Jest coverage, a CI-mode build, targeted Chromium route coverage, and the smoke suite.

## Validation plan

- `export CI=true && npm run build`
- `npm test -- --watchAll=false --runInBand --runTestsByPath test/unit/WelcomeOnboardingProvider.test.tsx test/unit/hooks/useHomeWelcomeSequence.test.ts test/unit/components/Header.test.tsx test/unit/pages/Home.test.tsx`
- `npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/navigation.spec.ts`
- `npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`

## Risks and rollback

- The E2E label assertion may have changed intentionally in another consumer; confirm against the live popover text before finalizing.
- Playwright route coverage can fail for unrelated baseline browser issues; if that happens, separate them from these merge regressions.
- Rollback is contained to the three files above.

## Progress notes

- Confirmed from PR 75 status logs that the build failure is caused by unused imports in `HeaderSettingsPopover.tsx`.
- Confirmed from PR 75 status logs that the only failing Jest suite is `Header.test.tsx` because `dismissDarkModeHint` no longer exists.
- Confirmed from the merged source that the settings popover label is now `Welcome audio`, so the E2E `Audio` assertion is stale.
- Implemented: removed the dead MUI/React type imports from `HeaderSettingsPopover.tsx`.
- Implemented: removed the stale `dismissDarkModeHint` assertion from `Header.test.tsx`.
- Implemented: aligned the home Playwright spec with the current `Welcome audio` label.
- Validated: `export CI=true && npm run build` passed.
- Validated: `npm test -- --watchAll=false --runInBand --runTestsByPath test/unit/WelcomeOnboardingProvider.test.tsx test/unit/hooks/useHomeWelcomeSequence.test.ts test/unit/components/Header.test.tsx test/unit/pages/Home.test.tsx` passed.
- Validated: `npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/navigation.spec.ts` passed.
- Validated: `npm run test:e2e:smoke -- test/e2e/smoke.spec.ts` passed.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
