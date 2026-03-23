# ESLint Preset Modernization

## Goal

Replace the repository's remaining dependency on `eslint-config-react-app` with an explicit modern ESLint plugin stack while keeping the lint scope narrow and the contributor-facing lint workflow unchanged.

## Why

Phase 3 made ESLint repo-owned through `.eslintrc.cjs`, but the config still inherits the opaque CRA-era `react-app` preset. After the TypeScript 5.6 floor raise in Phase 4, that preset is now the stale part of the lint toolchain. This slice removes that dependency and makes the lint surface explicit without expanding into broader lint-policy cleanup.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep the existing `npm run lint` command surface unchanged unless implementation forces a concrete fix.
- Keep the lint surface intentionally narrow: `src`, `scripts`, `test/e2e`, and the existing config-file targets only.
- Do not expand linting into `test/unit/`.
- Preserve the text-system `no-restricted-imports` enforcement and its exemptions for `src/components/text/Text.tsx` and `src/components/text/UNSAFE_Typography.tsx`.
- Preserve Playwright-specific lint behavior without continuing to depend on Jest or Testing Library rules from the `react-app` preset.
- User-facing docs remain unchanged because config ownership stays in `.eslintrc.cjs` and the `npm run lint` contract does not change.

## Affected files and responsibilities

- `package.json`: remove `eslint-config-react-app` and add the explicit ESLint plugins required by the new config.
- `package-lock.json`: refresh the dependency graph after the package swap.
- `.eslintrc.cjs`: replace the `react-app` preset usage with explicit base config and scoped overrides.
- `plans/eslint-preset-modernization.md`: track the implementation, validation, and final status of this slice.

## Proposed approach

Move from preset inheritance to explicit ESLint ownership with a small direct plugin set: `@typescript-eslint`, `react`, `react-hooks`, and `playwright`. Keep the config narrow by using a simple root TypeScript-aware parser setup plus scoped overrides for React source files, Node-side scripts/config files, `src/setupTests.ts`, and Playwright specs. Preserve the existing typography restriction rule exactly and remove the prior Playwright exceptions that only existed because the `react-app` preset leaked Jest and Testing Library rules into `test/e2e/`.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Replace `eslint-config-react-app` in `package.json` with the explicit plugin packages required by the new config.
3. Rewrite `.eslintrc.cjs` to use explicit base config and scoped overrides while preserving the existing text-system lint rule.
4. Run `npm install` to refresh `package-lock.json` after the dependency swap.
5. Validate `npm run lint`, `npm run typecheck`, and `npm run build`.
6. Update this ExecPlan with the implementation outcome and mark completion status accordingly.

## Validation plan

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Risks and rollback

- Risk: the explicit plugin stack can surface new lint findings that were previously hidden by the preset defaults.
- Risk: a mis-scoped override could reintroduce false positives in Playwright specs or break Node-side config/script linting.
- Risk: replacing the preset with too many new rules would turn this slice into broad lint cleanup instead of toolchain modernization.
- Rollback is contained to `package.json`, `package-lock.json`, and `.eslintrc.cjs`; restoring the old preset dependency and extends list returns the previous behavior.

## Progress notes

- 2026-03-22: Started a dedicated follow-on slice to remove `eslint-config-react-app` after the completed Vite/Jest/TS 5.6 migration work.
- 2026-03-22: Replaced `eslint-config-react-app` with explicit `@typescript-eslint`, `react`, `react-hooks`, and `playwright` ownership in `.eslintrc.cjs`.
- 2026-03-22: Used `plugin:react-hooks/recommended-legacy` because `eslint-plugin-react-hooks@6.1.1` exposes a flat-config `recommended` entry that ESLint 8 `.eslintrc` mode rejects.
- 2026-03-22: Dropped the initial `jsx-a11y` extension and removed `eslint-plugin-jsx-a11y` after validation showed it expanded policy far beyond the repo's prior lint surface; kept the slice focused on preset modernization rather than broad accessibility cleanup.
- 2026-03-22: Preserved underscore-prefixed ignored values via `@typescript-eslint/no-unused-vars` options and made three narrow source cleanups for truly unused imports/parameters.
- 2026-03-22: Validated with `npm run lint`, `npm run typecheck`, and `npm run build`. Lint now passes with 11 existing Playwright warnings in `test/e2e/home.spec.ts` and no errors.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
