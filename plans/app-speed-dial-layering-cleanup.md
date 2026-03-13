# App Speed Dial Layering Cleanup

## Goal
Remove the hidden coupling between the global `MuiSpeedDial` theme override and the header scroll animation so header and page-local speed dials can declare their intended stacking behavior explicitly.

## Why
The half-rendered header controls were caused by header `SpeedDial` instances living inside the sliding `AppBar` while the theme globally forced all speed dials below the app bar layer. That made a page-level default responsible for a header-specific interaction bug.

## Constraints
- Preserve the current SPA structure and route behavior.
- Keep the change narrowly scoped to shared speed-dial behavior and its existing consumers.
- Avoid breaking the existing `AppSpeedDial` public API unless an additive prop is enough.
- Preserve the current visual styling for both header and CV page speed dials.

## Affected files and responsibilities
- `src/components/AppSpeedDial.tsx`: own explicit speed-dial layering behavior.
- `src/components/AppSpeedDial.test.tsx`: verify the shared component forwards the intended layering props.
- `src/components/header/HeaderAppearanceDial.tsx`: opt the header appearance control into the header layer.
- `src/components/header/HeaderPageDial.tsx`: opt the header page dial into the header layer.
- `src/pages/CV.tsx`: keep the about-actions speed dial on the content layer.
- `src/styles/appStyleBuilders.ts`: remove header-only z-index workarounds once layering is owned by `AppSpeedDial`.
- `src/styles/appStyleBuilders.test.ts`: update coverage to assert only the remaining header layout styling.
- `src/theme/createAppTheme.ts`: remove the global `MuiSpeedDial` z-index override.

## Proposed approach
Add an additive layering prop to `AppSpeedDial` so each consumer can choose the appropriate stack level. Header dials will use a header layer above the app bar. The CV about-actions dial will use a content layer below the app bar. Then delete the theme-level z-index override and the header style-map workaround so the stacking decision lives with the component usage instead of a global theme side effect.

## Execution steps
1. Add explicit layering support to `AppSpeedDial` and cover it with unit tests.
2. Update header and CV consumers to declare the correct layer.
3. Remove the global theme z-index override and any redundant header style-map overrides.
4. Run targeted tests, build, and browser validation on `/cv` and `/`.

## Validation plan
- `CI=true npm test -- --watch=false --runInBand src/components/AppSpeedDial.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/styles/appStyleBuilders.test.ts src/components/Header.test.tsx src/components/header/HeaderAppearanceDial.test.tsx`
- `npm run build`
- Local Playwright browser validation on `/cv` and `/` with a scroll down/up cycle

## Risks and rollback
- A wrong default layer could cause the CV about-actions dial to overlap the fixed header unexpectedly.
- If the additive prop proves insufficient, rollback by restoring the theme override and header style override together.

## Progress notes
- Initial fix raised header speed dials above the app bar through `appStyleBuilders`, but the global theme override remained a coupling point.
- Added a `layer` prop to `AppSpeedDial` so consumers can opt into `header` or `content` layering explicitly.
- Updated the header appearance dial and header page dial to use the `header` layer, and the CV about-actions dial to use the `content` layer explicitly.
- Removed the global `MuiSpeedDial` z-index override from the theme and the temporary header z-index workaround from `appStyleBuilders`.
- Validation completed with targeted Jest coverage, a production build, and local Playwright checks on `/cv` and `/` after a scroll down/up cycle.
