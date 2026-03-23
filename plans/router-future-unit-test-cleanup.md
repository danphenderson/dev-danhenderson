# RouterFuture Unit Test Cleanup

## Goal

Eliminate the remaining React Router future-flag warning debt in the targeted unit tests by aligning the last MemoryRouter-based harnesses with the repository's existing routerFuture pattern.

## Why

Several unit tests still mount MemoryRouter without the shared future flags from src/routerFuture.ts. That leaves targeted Jest runs noisy with React Router v7 warnings and keeps the test suite partially migrated even though most router-based tests already use the canonical pattern.

## Constraints

- Keep the scope limited to the known unit-test holdouts and verification of Home.test.tsx.
- Preserve existing provider nesting, mocks, and render helper behavior.
- Do not introduce a new shared test-router abstraction unless a blocker appears.
- Do not widen this follow-up into a repo-wide lint or test refactor.
- Use the existing inline routerFuture pattern already present across test/unit.

## Affected files and responsibilities

- test/unit/components/GlobalCommandPalette.test.tsx: command palette router harness that still omits future flags.
- test/unit/components/RouteRecoveryPanel.test.tsx: recovery panel router harness that still omits future flags.
- test/unit/pages/CV.test.tsx: CV page harness missing future flags.
- test/unit/pages/CV.runtime.test.tsx: runtime CV smoke harness missing future flags.
- test/unit/pages/CVRevealPersistence.test.tsx: responsive rerender harness missing future flags on both initial render and rerender.
- test/unit/pages/Home.test.tsx: verification-only file to confirm no routerFuture change is needed.
- src/routerFuture.ts: canonical flag source reused by the tests.

## Proposed approach

Apply the smallest possible change in each holdout test: import routerFuture from src/routerFuture.ts and pass future={routerFuture} to every MemoryRouter instance. Keep the tests' existing render helpers intact so the change is purely about router configuration, not harness behavior.

## Execution steps

1. Create this ExecPlan before editing because the change spans five files.
2. Update the three CV page tests to use routerFuture in their render helpers and rerender paths.
3. Update the two component tests to use routerFuture in their render helpers.
4. Reconfirm Home.test.tsx needs no routerFuture change.
5. Run focused Jest validation for the touched tests.
6. Run file-scoped lint if an ESLint binary is available locally.

## Validation plan

- CI=true npm test -- --runTestsByPath test/unit/components/GlobalCommandPalette.test.tsx test/unit/components/RouteRecoveryPanel.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CV.runtime.test.tsx test/unit/pages/CVRevealPersistence.test.tsx --watch=false
- If needed, split the Jest validation into per-file runs while keeping the same scope.
- If available locally: npx eslint test/unit/components/GlobalCommandPalette.test.tsx test/unit/components/RouteRecoveryPanel.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CV.runtime.test.tsx test/unit/pages/CVRevealPersistence.test.tsx test/unit/pages/Home.test.tsx

## Risks and rollback

- Risk: accidentally changing provider order or mock behavior while touching render helpers.
- Risk: missing a rerender path in CVRevealPersistence and leaving warnings partially unresolved.
- Rollback is straightforward because each change is a small import-and-prop update in isolated test files.

## Progress notes

- 2026-03-22: Confirmed the targeted holdouts are GlobalCommandPalette, RouteRecoveryPanel, CV.test, CV.runtime.test, and CVRevealPersistence.
- 2026-03-22: Confirmed Home.test.tsx does not currently use MemoryRouter and should be verification-only unless validation proves otherwise.
- 2026-03-22: Updated the five router-based holdouts to import routerFuture from src/routerFuture.ts and pass future={routerFuture} to every MemoryRouter mount, including the second navigation-case mount inside GlobalCommandPalette.
- 2026-03-22: Targeted ESLint surfaced real Testing Library lint debt in Home.test.tsx and file-local lint debt in CV.test.tsx, so the implementation also cleaned those tests rather than leaving validation red.
- 2026-03-22: Validation passed with focused ESLint on the touched files and focused Jest on GlobalCommandPalette, RouteRecoveryPanel, CV.test, CV.runtime.test, CVRevealPersistence, and Home.test.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
