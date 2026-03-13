# Sitewide Appearance Presets

## Goal
Promote the existing `atlas`, `evergreen`, and `ember` appearance presets from `/cv` into the global app theme so every route uses the same appearance state, controlled from a header speed dial while keeping the light/dark toggle separate.

## Why
The richer accent-role and surface treatment work now exists only on `/cv`, which creates duplicated theme state, duplicated controls, and route-local styling behavior. Moving the appearance model into the app theme makes the styling system coherent and lets users change appearance from one consistent header control.

## Constraints
- Keep the app fully client-side and preserve existing SPA routing.
- Keep the change narrowly scoped to theme state, shared style consumption, header controls, and `/cv` cleanup.
- Preserve the current appearance preset keys: `atlas`, `evergreen`, `ember`.
- Keep the existing light/dark toggle as a separate control.
- Remove the in-page `/cv` appearance selector in the same rollout.
- Read the legacy `danhenderson-cv-appearance` storage key as migration fallback, but only persist the new global appearance key.

## Affected files and responsibilities
- `src/theme/appAppearance.ts`: app-wide appearance preset definitions, treatment resolution, and storage constants.
- `src/theme/createAppTheme.ts` and `src/theme/mui.d.ts`: global theme creation and theme augmentation rename from `cvTreatment` to `appearanceTreatment`.
- `src/ThemeProvider.tsx`: source of truth for persisted `mode` and `appearance`.
- `src/styles/appStyleBuilders.ts` and `src/styles/componentStyleBuilders.ts`: shared style maps consuming the app-wide appearance treatment.
- `src/components/header/*` and `src/components/Header.tsx`: header appearance speed dial wiring and header action layout.
- `src/pages/CV.tsx`: remove nested theme and route-local appearance selector/state.
- `README.md`: document the app-wide appearance state and persisted keys.
- Targeted tests in `src/ThemeProvider.test.tsx`, `src/components/Header.test.tsx`, `src/components/header/*.test.tsx`, `src/pages/CV.test.tsx`, and the style-builder tests.

## Proposed approach
Create an app-wide appearance module by lifting the current CV preset model into `src/theme/appAppearance.ts`, then thread the selected appearance through `ThemeProvider` and `createAppTheme(mode, appearance)` for all routes. Rename the theme field to `appearanceTreatment` and update the shared style builders so support-accent styling is governed by the global theme rather than a CV-only gate. Add a reusable `HeaderAppearanceDial` that uses `AppSpeedDial` and the current preset set, render it from `HeaderActions`, and remove the route-local `/cv` selector and nested theme provider.

## Execution steps
1. Add the new app-wide appearance module and rename theme augmentation/consumers from `cvTreatment` to `appearanceTreatment`.
2. Expand `ThemeProvider` to initialize, persist, and expose global appearance state with migration from the legacy `/cv` storage key.
3. Update `/cv` to consume the global theme directly and remove the in-page appearance selector/state.
4. Add `HeaderAppearanceDial`, wire it into `HeaderActions` and `Header`, and keep the existing page dial and light/dark toggle behavior intact.
5. Update tests and README to match the new theme API, global appearance persistence, and removed `/cv` selector.

## Validation plan
- `CI=true npm test -- --watch=false --runInBand src/ThemeProvider.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/components/header/HeaderActions.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/components/header/HeaderAppearanceDial.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/components/Header.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/pages/CV.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/styles/componentStyleBuilders.test.ts`
- `CI=true npm test -- --watch=false --runInBand src/styles/appStyleBuilders.test.ts`
- `npm run build`
- `npx playwright test e2e/home.spec.ts`
- `npx playwright test e2e/cv.github.spec.ts`
- `npx playwright test e2e/climbing.spec.ts`
- `npx playwright test e2e/photography.spec.ts`
- Browser validation on `/`, `/cv`, `/climbing`, and `/photography` at desktop and mobile widths using the local browser tooling.

## Risks and rollback
- Global typography and accent changes may shift layouts on non-CV routes, especially shared cards and dense route content.
- Renaming `cvTreatment` to `appearanceTreatment` affects shared theme and style infrastructure, so the rename must land atomically.
- Header controls may become crowded on mobile when both the page dial and appearance dial are visible.
- Rollback path: revert the global appearance state wiring and restore the `/cv` nested theme and selector while keeping the preset definitions intact.

## Progress notes
- Starting from an already dirty worktree that contains the earlier `/cv` appearance preset work; the sitewide change will build on top of that state rather than revert it.
- Moved the preset model into `src/theme/appAppearance.ts`, left `src/theme/cvAppearance.ts` as a legacy storage-key shim, and renamed the theme field to `appearanceTreatment`.
- Expanded `ThemeProvider` to own persisted global appearance state with fallback migration from `danhenderson-cv-appearance`.
- Added `HeaderAppearanceDial`, removed the in-page `/cv` selector and nested theme provider, and updated the header tests to mount under a concrete MUI theme because `useAppTheme` is mocked there.
- Validation completed: targeted unit/component suites, `npm run build`, Playwright route specs for home/CV/climbing/photography, and manual browser checks on `/`, `/cv`, `/climbing`, and `/photography` at desktop and mobile widths.
