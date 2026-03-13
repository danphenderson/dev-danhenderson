# Remove Legacy Appearance Compatibility

## Goal
Remove the last temporary appearance compatibility paths so the app uses exactly one persisted appearance key and one theme-construction path.

## Why
The current theme layer still carries a legacy `/cv` storage fallback and a no-appearance theme construction path that the runtime no longer uses. Removing them simplifies the contract, drops dead style branches, and makes tests reflect the real runtime behavior.

## Constraints
- Keep the app fully client-side.
- Preserve existing SPA routing and direct-link behavior.
- Do not change the preset set: `atlas`, `evergreen`, `ember`.
- Keep `ThemeProvider` as the only runtime source of truth for `appearance`.
- Do not add a new migration layer; users who only have `danhenderson-cv-appearance` may fall back to `evergreen`.
- Keep the change narrowly scoped to theme cleanup, direct callers, tests, and docs.

## Affected files and responsibilities
- `src/theme/appAppearance.ts`: remove the legacy storage key export, remove default treatment fallbacks, and require explicit appearance resolution.
- `src/theme/createAppTheme.ts`: require an appearance argument and construct palette, typography, and treatments only from the selected preset.
- `src/ThemeProvider.tsx`: read and write only `danhenderson-appearance`.
- `src/styles/componentStyleBuilders.ts`: remove branches that only existed for `appearanceTreatment.key === 'default'`.
- `src/styles/appStyleBuilders.ts`: align callers and tests with required appearance input.
- `src/theme/cvAppearance.ts`: delete the legacy shim module.
- `src/ThemeProvider.test.tsx`, `src/pages/CV.test.tsx`, `src/styles/appStyleBuilders.test.ts`, `src/styles/componentStyleBuilders.test.ts`: align tests with the single-key, explicit-appearance contract.
- `README.md`: document only the global appearance storage key.

## Proposed approach
Make `appearance` mandatory anywhere a theme is created, collapse `AppResolvedTreatment.key` to `AppAppearanceKey`, remove the legacy `/cv` storage fallback from `ThemeProvider`, and delete the shim module. Then remove shared-style branches that only supported callers omitting an appearance and update the focused tests and docs to match the simplified runtime contract.

## Execution steps
1. Update `src/theme/appAppearance.ts` and `src/theme/createAppTheme.ts` to require an explicit appearance key and remove legacy/default treatment branches.
2. Update `src/ThemeProvider.tsx` to stop reading the legacy `/cv` storage key and default missing or invalid values to `defaultAppAppearanceKey`.
3. Remove `src/theme/cvAppearance.ts` and update any direct callers/tests that still depend on implicit theme creation or the legacy key.
4. Simplify `src/styles/componentStyleBuilders.ts` and any related tests so support-accent styling always follows the selected preset.
5. Remove the legacy storage-key note from `README.md`.

## Validation plan
- `CI=true npm test -- --watch=false --runInBand src/ThemeProvider.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/pages/CV.test.tsx`
- `CI=true npm test -- --watch=false --runInBand src/styles/appStyleBuilders.test.ts`
- `CI=true npm test -- --watch=false --runInBand src/styles/componentStyleBuilders.test.ts`
- Re-run any additional targeted test that imports `createAppTheme(...)` directly if TypeScript or Jest exposes a missed caller.
- `npm run build`
- `npx playwright test e2e/home.spec.ts`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation on `/` and `/cv` at desktop and mobile widths.

## Risks and rollback
- Users who only still have `danhenderson-cv-appearance` will reset to `evergreen`.
- Requiring `appearance` in `createAppTheme` will break any forgotten direct caller until it is updated.
- Removing the `'default'` treatment branch can expose hidden assumptions in shared style tests.
- Rollback is straightforward: restore the shim file, restore the legacy storage read in `ThemeProvider`, and make the appearance argument optional again in theme construction.

## Progress notes
- Current repo scan shows the remaining runtime legacy-key usage in `src/ThemeProvider.tsx`.
- Current direct no-appearance callers are test-side `createAppTheme('light')` usages in the style-builder tests.
- The branch already contains unrelated edits in several touched files, so implementation must preserve concurrent changes.
