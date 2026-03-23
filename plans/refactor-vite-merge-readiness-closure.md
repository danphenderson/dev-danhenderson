# Refactor Vite Merge Readiness Closure

## Goal

Close the merge-blocking gaps from the CRA-to-Vite review so the branch has a green standalone Jest baseline, CI validates `v1`-targeted pull requests, the directly flagged toolchain dependencies are modernized, and the remaining tracked CRA-era guidance is removed.

## Why

The migration branch currently passes build, typecheck, and targeted Playwright checks, but it is not fully closed out:

- the repo-owned Jest coverage path is still red because several tests drifted away from the current implementation
- the updated Build, Codecov, and CodeQL workflows only validate `main`, which leaves `v1`-targeted pull requests unvalidated by the migrated workflows
- direct toolchain dependencies called out in review (`vite`, `eslint`, `jest-environment-jsdom`) remain on older majors with audit/outdated debt
- one tracked instruction file still describes the service-worker helper as CRA-specific even though the code already uses the shared app-environment abstraction

## Constraints

- Keep the app fully client-side and preserve SPA routing plus `PUBLIC_URL` compatibility.
- Preserve current shared component APIs unless a change is required to restore an intended contract.
- Keep changes narrowly scoped to the reviewed issues; avoid unrelated refactors.
- Use the repo-standard validation commands from `docs/engineering/testing-strategy.md`.
- Preserve current Playwright project behavior: `chromium` must run against `build:e2e`, while `smoke` must run against a fresh production `build`.
- Do not broaden docs deployment scope unless explicitly requested; only Build, Codecov, and CodeQL are in scope for the workflow change.

## Affected files and responsibilities

- `test/unit/components/cv/CVGitHubSection.test.tsx`: stale semantic heading expectation in the failing Jest suite.
- `src/components/cv/CVGitHubSection.tsx`: current GitHub section heading structure using the text role system.
- `src/components/text/Text.tsx`: semantic element mapping for `subsectionTitle` that the test should follow.
- `test/unit/components/cv/CVStoryHeader.test.tsx`: stale alignment expectation for the embedded story header variant.
- `src/components/cv/CVStoryHeader.tsx`: current embedded/page header layout contract to preserve or deliberately adjust.
- `test/unit/styles/componentStyleBuilders.test.ts`: failing assertions against removed or renamed style map keys.
- `src/styles/componentStyleBuilders.ts`: current component style map API and appearance-driven surfaces.
- `.github/workflows/build.yml`: Build plus Chromium Playwright CI scope.
- `.github/workflows/codecov.yml`: CI-shape Jest coverage workflow scope.
- `.github/workflows/codeql.yml`: security analysis workflow scope.
- `CONTRIBUTING.md`: contributor-facing CI and validation guidance.
- `docs/engineering/testing-strategy.md`: canonical validation matrix and workflow-aligned command guidance.
- `package.json`: direct toolchain dependency versions and scripts.
- `package-lock.json`: resolved dependency graph for the upgraded toolchain.
- `vite.config.ts`: Vite/plugin compatibility adjustments if required by the version bump.
- `.eslintrc.cjs` or replacement flat-config file: repo-owned ESLint configuration during the v8 to v9 migration.
- `jest.config.cjs`: standalone Jest config if the jsdom/Jest package bump requires config adjustments.
- `src/utils/AGENTS.md`: last tracked CRA-era guidance noted in review.

## Proposed approach

Implement the work in four phases with validation gates between them:

1. Repair the failing Jest suites first so the standalone CI-shape coverage run is green before any workflow scope change.
2. Expand workflow branch coverage to include `v1`, then align contributor-facing docs with that new scope.
3. Upgrade the flagged toolchain dependencies in controlled subphases: Vite/plugin first, then the ESLint stack, then the Jest-side jsdom surface.
4. Remove the remaining tracked CRA-era guidance once the functional work is complete.

This order isolates failures by layer and keeps rollback straightforward.

## Execution steps

1. Reproduce the current red Jest baseline and confirm the failing surface remains limited to the three reviewed suites.
2. Update the GitHub section test so its heading expectation follows the current `Text` semantic role mapping.
3. Resolve the CV story header contract mismatch by explicitly choosing the intended embedded alignment and making either the test or implementation match it.
4. Re-anchor the component style builder test to the current exported style-map API instead of removed keys.
5. Rerun the three focused suites and then the full CI-shape Jest coverage command until that baseline is green.
6. Update Build, Codecov, and CodeQL workflows so `pull_request` and `push` branch filters cover both `main` and `v1`.
7. Update `CONTRIBUTING.md` and any necessary testing docs so branch-validation guidance matches the workflows.
8. Upgrade `vite` and `@vitejs/plugin-react`, then rerun build and Playwright checks.
9. Migrate the lint stack off ESLint 8 with the minimum durable repo-owned configuration for ESLint 9.
10. Upgrade `jest-environment-jsdom` and any required companion Jest packages or config so the full Jest coverage run stays green.
11. Update the stale service-worker guidance in `src/utils/AGENTS.md`.
12. Run the full validation matrix and capture any residual debt that remains intentionally deferred.

## Validation plan

- `npm test -- test/unit/components/cv/CVGitHubSection.test.tsx --watchAll=false`
- `npm test -- test/unit/components/cv/CVStoryHeader.test.tsx --watchAll=false`
- `npm test -- test/unit/styles/componentStyleBuilders.test.ts --watchAll=false`
- `npm test -- --watchAll=false --ci --passWithNoTests --coverage`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run build:e2e`
- `npm run test:e2e:chromium -- test/e2e/navigation.spec.ts`
- `npm run build`
- `npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`
- `npm audit --audit-level=moderate`
- `npm outdated vite eslint jest-environment-jsdom @vitejs/plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser`

## Risks and rollback

- Expanding workflow scope before the Jest baseline is green would make known-red `v1` PRs noisy; phase ordering avoids that.
- ESLint 9 is the highest-friction dependency step because config format and rule surface can change. If that subphase causes excessive churn, isolate it and finish the Vite plus Jest-side upgrades first.
- Jest dependency upgrades may require companion package bumps (`jest`, `@types/jest`, `ts-jest`) to keep the coverage run green.
- Smoke Playwright can produce false positives if it runs after `build:e2e` without a fresh production build; always rebuild production before smoke validation.
- Rollback is contained by phase: each phase can be reverted independently if its validation gate fails.

## Progress notes

- 2026-03-22: ExecPlan created from the merge-readiness review findings before implementation.
- 2026-03-22: Repaired the three stale Jest suites by updating the GitHub section heading expectation, the embedded CV story header layout expectation, and the style builder assertions that referenced removed keys.
- 2026-03-22: Expanded Build, Codecov, and CodeQL workflow branch filters to validate both `main` and `v1`, and aligned `CONTRIBUTING.md` with that branch coverage.
- 2026-03-22: Upgraded the directly flagged toolchain dependencies to Vite 8, ESLint 9 with a repo-owned flat config, and Jest 30 / jsdom 30-compatible packages; updated the Node engine floor to `>=20.19.0` and switched TypeScript module resolution to `bundler` for Vite 8 compatibility.
- 2026-03-22: Removed the remaining tracked CRA-era service-worker wording from `src/utils/AGENTS.md`.
- 2026-03-22: Validated with focused Jest suites, full Jest coverage, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/navigation.spec.ts`, `npm run build && npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`, `npm audit --audit-level=moderate`, and a targeted `npm outdated` check.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
