# First-visit settings handoff

## Goal

Change the first-visit onboarding on the home route so the existing customization modal ends with an `Okay` acknowledgment, then show a second anchored hint beneath the header settings trigger that reminds users they can always update motion and audio there. Only the second step's `Get started` button should release the hero animation.

## Why

The current flow uses a single customization modal whose `Get started` button immediately completes onboarding and starts the hero motion path. The requested UX adds an intermediate onboarding step that visually connects the first-visit choices to the persistent header settings control.

## Constraints

- Preserve the existing client-side SPA routing and static-hosting behavior.
- Keep page orchestration in the home route and its welcome hook rather than moving it into shared components.
- Keep the settings trigger behavior unchanged for normal use; only expose a stable anchor target for the onboarding hint.
- Do not change motion persistence or theme preference storage semantics.
- Keep the hero animation blocked until the final onboarding CTA is pressed.

## Affected files and responsibilities

- `src/WelcomeOnboardingProvider.tsx`: owns onboarding completion persistence and transient welcome-step visibility.
- `src/hooks/useHomeWelcomeSequence.ts`: coordinates the audio prompt, customize modal, settings hint, and hero readiness gate.
- `src/pages/Home.tsx`: composes the onboarding surfaces and home hero.
- `src/components/FirstVisitCustomizeModal.tsx`: first-step controls and `Okay` CTA.
- `src/components/FirstVisitSettingsHintPopover.tsx`: new second-step anchored onboarding hint.
- `src/components/header/HeaderSettingsPopover.tsx`: stable settings-trigger anchor id/test id.
- `test/unit/WelcomeOnboardingProvider.test.tsx`: provider state transition and persistence coverage.
- `test/unit/hooks/useHomeWelcomeSequence.test.ts`: hook sequencing and hero gating coverage.
- `test/unit/pages/Home.test.tsx`: page-level welcome-flow coverage.
- `test/e2e/helpers/header.ts`: shared welcome-sequence dismissal helper.
- `test/e2e/home.spec.ts`: route-level welcome flow and hero timing.
- `test/e2e/blog.spec.ts`: cross-route helper regression coverage.

## Proposed approach

Add a second transient onboarding step to `WelcomeOnboardingProvider`, keeping `onboardingCompleted` as the single persisted flag. Update `useHomeWelcomeSequence()` to advance from the customize modal to the anchored settings hint before calling `completeOnboarding()`. Add a small, page-consumed popover component for the second step, anchored to the existing header settings button via a stable DOM id. Keep the normal header settings popover API intact except for the non-breaking anchor attributes.

## Execution steps

1. Extend the onboarding provider so customize and settings-hint visibility are tracked separately and completion only occurs from the final CTA.
2. Update the home welcome sequence hook to expose the new step and keep `isHeroAnimationReady` false until the second step finishes.
3. Change the first modal CTA copy to `Okay` and add the new anchored settings hint component.
4. Wire the new hint into `Home.tsx` and expose a stable anchor on the header settings trigger.
5. Update unit and Playwright coverage for the new two-step onboarding sequence.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/WelcomeOnboardingProvider.test.tsx test/unit/hooks/useHomeWelcomeSequence.test.ts test/unit/pages/Home.test.tsx test/unit/components/FirstVisitCustomizeModal.test.tsx`
- `npm run build`
- `npm run build:e2e`
- `npm run test:e2e:chromium -- test/e2e/home.spec.ts`
- `npm run test:e2e:chromium -- test/e2e/blog.spec.ts`
- Browser validation on `/` at desktop and narrow widths plus a header settings sanity check on another route such as `/cv`

## Risks and rollback

- The main regression risk is releasing the hero animation too early if the provider and hook disagree about the active onboarding step.
- The shared header trigger is used across routes, so anchor changes must stay additive and not break normal settings interactions.
- The Playwright welcome helper is reused outside the home spec; missing an update there would cause unrelated E2E failures.
- Rollback path: remove the second transient step and popover component while keeping the original customize modal and persisted onboarding behavior.

## Progress notes

- Initial implementation will prefer a stable DOM anchor on the existing settings trigger instead of threading refs through the header layers.
- Requested behavior is to keep the second onboarding step anchored under the header settings trigger even on mobile.
- Implemented the second onboarding step as `FirstVisitSettingsHintPopover`, anchored to the shared header settings trigger via `header-settings-trigger`.
- Validation passed for the focused onboarding unit suites, the default build, the E2E build, Home Playwright coverage, Blog Playwright coverage, and manual browser checks on `/` and `/cv`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
