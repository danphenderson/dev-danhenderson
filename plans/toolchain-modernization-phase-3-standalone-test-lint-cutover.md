# Toolchain Modernization Phase 3 Standalone Test Lint Typecheck Cutover

## Goal

Replace the remaining `react-scripts`-owned Jest and ESLint plumbing with explicit repo-owned configuration, add a standalone `typecheck` command, and remove `react-scripts` from the main app toolchain.

## Why

Phase 2 moved dev/build to Vite, but `react-scripts` is still retained solely for unit tests and linting. That means the repository is still carrying the bulk CRA package and the hidden config it brings. This phase removes that last CRA dependency by making Jest, ESLint, and TypeScript checking first-class repo-owned tools.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Preserve the published `npm test` command shape so existing docs and workflows remain usable.
- Keep the current unit-test surface under `test/unit/` and preserve `src/setupTests.ts`.
- Preserve the current text-system lint restriction and add an override so Playwright specs are no longer mis-scoped under Testing Library lint rules.
- Do not mix the later TypeScript/Node version upgrade into this slice.

## Affected files and responsibilities

- `package.json`: remove `react-scripts`, add standalone test/lint/typecheck dependencies and scripts, and move config ownership out of the manifest.
- `package-lock.json`: dependency graph update for the standalone toolchain packages.
- `jest.config.cjs`: explicit repo-owned Jest configuration.
- `.eslintrc.cjs`: explicit repo-owned ESLint configuration.
- `test/unit/__mocks__/styleMock.cjs`: generic style import mock for Jest.
- `test/unit/__mocks__/fileMock.cjs`: generic asset import mock for Jest.
- `tsconfig.json`: keep the shared compiler baseline used by source and test files.
- `tsconfig.typecheck.json`: source-focused standalone typecheck surface for the app and toolchain config.
- `README.md`: update stack/tooling notes and command guidance now that `react-scripts` is gone.
- `AGENTS.md`: update the repo stack/runtime note so it no longer treats `react-scripts` as retained plumbing.
- `docs/engineering/testing-strategy.md`: document the standalone Jest configuration ownership.
- `docs/project/overview.md`: align the project tooling description with the completed cutover.

## Proposed approach

Adopt standalone Jest 29 with `ts-jest` and `jest-environment-jsdom`, preserving the current `npm test -- ...` command surface and `src/setupTests.ts`. Replace the embedded `eslintConfig` in `package.json` with a root `.eslintrc.cjs` that explicitly extends `react-app` and `react-app/jest` via the standalone `eslint-config-react-app` package, while adding a Playwright override so Testing Library rules stop producing false positives in `test/e2e/`. Add a `typecheck` script backed by `tsc --noEmit`, then remove `react-scripts` and the `eject` script once the standalone commands are validated.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Install standalone Jest, ESLint, and related dependencies needed to remove `react-scripts`.
3. Add explicit `jest.config.cjs`, `.eslintrc.cjs`, and Jest mock files, then update `package.json` scripts and config ownership.
4. Add `typecheck`, remove `react-scripts` and `eject`, and align the docs.
5. Validate `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`, plus a narrow Playwright spec to confirm the runtime build path remains unaffected.

## Validation plan

- `npm test -- --watchAll=false --runInBand --testPathPattern=test/unit/utils/appEnvironment.test.ts test/unit/utils/buildInfo.test.ts test/unit/constants/featureFlags.test.ts test/unit/components/AppErrorBoundary.test.tsx`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run build && npm run test:e2e:smoke`

## Risks and rollback

- Risk: the standalone Jest transform can miss an implicit CRA behavior and break a subset of unit tests.
- Risk: the standalone ESLint config can introduce new repo-wide noise if the `react-app` rules or Playwright override are mis-scoped.
- Risk: removing `react-scripts` too early can leave CI without a working test path if the standalone setup is incomplete.
- Rollback is contained to the files above; if the standalone cutover regresses behavior, restore `react-scripts` and the prior package-level config while keeping the Vite build path intact.

## Progress notes

- 2026-03-22: Started the standalone Jest/ESLint/typecheck cutover after the successful Phase 2 Vite migration.
- 2026-03-22: Added standalone `jest.config.cjs`, `.eslintrc.cjs`, Jest asset/style mocks, `tsconfig.typecheck.json`, explicit `lint` and `typecheck` scripts, and removed `react-scripts` plus `eject` from `package.json`.
- 2026-03-22: Kept the lint surface intentionally scoped to `src`, `scripts`, `test/e2e`, and tooling config files so this cutover does not pull unrelated historical unit-test lint cleanup into scope.
- 2026-03-22: Validated the standalone toolchain with focused `npm test -- --watchAll=false`, `npm run lint`, `npm run typecheck`, `npm run build && npm run test:e2e:smoke`, and a follow-up `npm run build:e2e` check for the gated bundle path.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
