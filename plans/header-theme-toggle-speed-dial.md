# Header Theme Toggle Speed Dial

## Goal

Move the header theme toggle into the existing palette speed dial so the header uses one consolidated appearance control across routes.

## Why

The header currently spends separate space on a dedicated theme toggle even though theme and appearance are related display controls. Consolidating them should reduce header clutter without changing the SPA structure or removing existing functionality.

## Constraints

- Keep the app fully client-side and preserve existing SPA route behavior.
- Keep the change narrowly scoped to header appearance controls.
- Preserve current theme and appearance behavior, including localStorage-backed preferences.
- Avoid breaking existing shared component consumers; preserve props where practical.
- Validate the shared header on at least one primary route and one additional route, including mobile and desktop checks.

## Affected files and responsibilities

- `src/components/header/HeaderAppearanceDial.tsx`: Add the theme action into the palette speed dial and support the onboarding anchor/highlight on the dial trigger.
- `src/components/header/HeaderActions.tsx`: Route theme-control props into the appearance dial and remove the standalone theme button.
- `src/components/Header.tsx`: Re-anchor the dark mode onboarding popover to the dial trigger and update hint copy for the consolidated control.
- `src/components/header/HeaderAppearanceDial.test.tsx`: Cover the added theme action and preserved responsive direction behavior.
- `src/components/header/HeaderActions.test.tsx`: Cover the consolidated control rendering and event forwarding.
- `src/components/Header.test.tsx`: Cover header-level theme toggling through the appearance dial mock.

## Proposed approach

Extend `HeaderAppearanceDial` with the consolidated theme-and-appearance contract it now owns directly, and collapse `HeaderActions` to a single `appearanceDial` prop instead of separate theme and appearance flags/handlers. In `Header`, keep the onboarding logic but anchor the popover and highlight to the palette trigger so the hint still points at a visible control.

## Execution steps

1. Add the plan and confirm the smallest component set that owns the current controls.
2. Update `HeaderAppearanceDial` to include an optional theme action and accept trigger ref/highlight props for the main speed dial button.
3. Update `HeaderActions` and `Header` to remove the standalone theme button and wire the onboarding popover to the consolidated dial trigger.
4. Update focused unit tests for the new button labels and event flow.
5. Run targeted tests, build the app, and do browser validation on affected routes and viewports.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath src/components/header/HeaderActions.test.tsx src/components/header/HeaderAppearanceDial.test.tsx src/components/Header.test.tsx`
- `npm run build`
- Browser validation on `/` and `/cv`
- Check one desktop viewport and one mobile viewport

## Risks and rollback

- The dark mode onboarding hint currently expects a persistent visible anchor; moving the theme control into a speed dial can break hint placement if the dial trigger is not used as the anchor.
- Consolidating controls into one dial can accidentally hide the theme toggle when only one of the controls is enabled; keep the render conditions explicit.
- Rollback is contained to the header components and tests above if the consolidated control introduces regressions.

## Progress notes

- Initial review confirmed the current theme button lives in `HeaderActions` while the palette speed dial lives in `HeaderAppearanceDial`.
- Implemented the consolidation by moving the theme switch into `HeaderAppearanceDial` as an optional action while keeping `HeaderActions` responsible for deciding which controls are enabled.
- Re-anchored the dark mode onboarding popover to the palette dial trigger and updated the hint copy to describe opening the palette menu.
- Validation used the production build served locally on port `49532` because port `3100` was already occupied in the workspace environment.
- Home-route browser validation required dismissing the welcome-audio dialog and the follow-up hint before interacting with the header controls.
- Follow-up cleanup is collapsing the remaining split theme-vs-appearance props into one `appearanceDial` configuration on `HeaderActions`, since `Header` is the only current consumer.
- The cleanup refactor kept behavior unchanged while narrowing the shared API to one dial config on `HeaderActions` and a direct theme-plus-appearance contract on `HeaderAppearanceDial`.
- Follow-up validation used the rebuilt production output served locally on port `49887` because port `3100` remained occupied in the workspace environment.
