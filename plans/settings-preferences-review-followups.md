# Settings Preferences Review Follow-ups

## Goal

Resolve the validated follow-up issues from the current feature-branch review without changing the intended settings UX: align shared preference types with the existing type ownership model, move runtime preference persistence helpers out of `src/constants/`, remove dead validation drift, and add direct tests for the accessibility-critical settings popover behaviors.

## Why

The current branch is functionally close, but it introduced two ownership-boundary violations and left the most behavior-heavy accessibility branches under-tested. Cleaning those up now keeps future type and settings work discoverable and reduces regression risk around keyboard navigation and reduced-motion handling.

## Constraints

- Keep the change narrowly scoped to the validated review findings.
- Preserve the current client-side SPA architecture and existing persisted storage key values.
- Do not change the public behavior of theme, appearance, motion, or welcome-audio persistence.
- Keep shared types in existing canonical `src/types/` owners and avoid upward imports from `src/types/`.
- Keep runtime preference logic out of `src/constants/`, which is reserved for route/feature/recovery configuration.

## Affected files and responsibilities

- `src/types/ui.ts`: canonical home for shared cross-layer UI/runtime preference types.
- `src/types/preferences.ts`: temporary branch-introduced type file to remove once consumers move.
- `src/theme/preferences.ts`: new home for runtime preference storage keys, defaults, and validators shared by providers.
- `src/constants/preferences.ts`: branch-introduced misplaced module to remove after consumer migration.
- `src/ThemeProvider.tsx`: consume preference defaults/validators from the new runtime-owned module.
- `src/WelcomeAudioProvider.tsx`: consume the moved preference module and reuse the shared audio-consent validator.
- `src/theme/appAppearance.ts`: update deprecation guidance if the preference-module path changes.
- `test/unit/components/header/HeaderActions.test.tsx`: add focused tests for appearance radiogroup keyboard navigation and reduced-motion override behavior.

## Proposed approach

Move `AudioConsent` and `UserPreferences` into `src/types/ui.ts`, then delete the branch-only `src/types/preferences.ts` file. Move the preference storage/defaults/validators module into `src/theme/` so it sits next to the runtime settings boundary already owned by `ThemeProvider`, while keeping storage key strings unchanged. Reuse `isAudioConsent()` in `WelcomeAudioProvider` in a way that preserves the current legacy fallback behavior. Extend the existing focused popover test file with a lightweight `useReducedMotion()` mock and assertions for arrow-key roving focus plus disabled motion controls and the reduced-motion notice.

## Execution steps

1. Move shared preference types into `src/types/ui.ts` and update consumer imports.
2. Relocate runtime preference keys/defaults/validators into `src/theme/preferences.ts` and remove `src/constants/preferences.ts`.
3. Update provider consumers and doc comments to point at the new canonical modules while preserving storage-key behavior.
4. Add focused unit tests for the settings popover keyboard navigation and reduced-motion override branches.
5. Run targeted tests and a build check, then update this plan with the final status.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/ThemeProvider.test.tsx test/unit/WelcomeAudioProvider.test.tsx test/unit/components/header/HeaderActions.test.tsx test/unit/components/Header.test.tsx`
- `npm run build`

## Risks and rollback

- Import-path churn could break provider wiring if any consumer is missed.
- The audio-consent validator reuse could accidentally change the legacy dismissed-prompt fallback if the guard logic is widened incorrectly.
- Header popover tests rely on MUI/motion semantics; assertions should target stable ARIA behavior rather than implementation details.
- Rollback is straightforward: restore the previous module locations and revert the added test coverage if a hidden consumer surfaces.

## Progress notes

- Review findings validated before editing: new shared type file placement is inconsistent with `src/types/AGENTS.md`; runtime preference module placement is inconsistent with `src/constants/AGENTS.md`; `isAudioConsent` is currently unused; settings popover tests do not cover the radiogroup arrow-key or reduced-motion-disabled branches.
- Moved `AudioConsent` into `src/types/ui.ts` and deleted the branch-only `src/types/preferences.ts` file. `UserPreferences` now stays local to `src/theme/preferences.ts`, where it is only used to type persisted defaults.
- Moved runtime preference keys/defaults/validators into `src/theme/preferences.ts` and deleted `src/constants/preferences.ts`. Storage key values were preserved.
- `WelcomeAudioProvider` now uses the shared `isAudioConsent()` validator while still preserving the legacy dismissed-prompt fallback behavior.
- Validation completed successfully: `CI=true`-equivalent focused Jest run for provider/header tests passed (`test/unit/ThemeProvider.test.tsx`, `test/unit/WelcomeAudioProvider.test.tsx`, `test/unit/components/header/HeaderActions.test.tsx`, `test/unit/components/Header.test.tsx`), and `npm run build` compiled successfully.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
