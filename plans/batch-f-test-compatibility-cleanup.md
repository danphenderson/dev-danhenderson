# Batch F Test And Compatibility Cleanup

## Goal

Align stale test fixtures and compatibility shims with the current runtime so the GitHub-backed CV coverage, theme preference coverage, and CV page test surface all reflect real app behavior without preserving dead compatibility branches.

## Why

Batch F is addressing three sources of drift:

- the Playwright GitHub helper still mocks request paths the runtime no longer uses
- theme-related tests still assert deprecated storage-key compatibility that ThemeProvider no longer implements
- the standalone CV runtime smoke suite largely reasserts coverage already owned by the main CV page suite

Cleaning that up reduces maintenance cost, keeps tests honest, and removes deprecated exports only where the app no longer depends on them.

## Constraints

- Preserve SPA routing, direct-link behavior, static-hosting compatibility, and PUBLIC_URL-safe asset handling.
- Do not redesign theme or preference behavior.
- Preserve graceful GitHub fallback behavior in src/hooks/githubProfileData.ts.
- Do not refactor GitHub runtime logic beyond what is required to keep tests aligned with the current request graph and status messaging.
- Keep the change isolated from Home / IDE files, recovery logic, static-data hook cleanup, and shared sx/text work.
- Touch package.json only if this batch already requires it; if touched, only move @types/node, @types/react, and @types/react-dom from dependencies to devDependencies without version or script changes.

## Affected files and responsibilities

- test/e2e/helpers/github.ts: Mock the actual GitHub request graph used by the CV runtime.
- test/e2e/cv.github.spec.ts: Assert against the current mocked GitHub activity and fallback behavior.
- src/hooks/githubProfileData.ts: Runtime GitHub request graph and fallback/cache status source of truth; adjust only if test alignment reveals a narrow correctness issue.
- src/theme/appAppearance.ts: Deprecated storage-key exports for appearance and motion intensity, removable if no runtime consumers remain.
- src/theme/preferences.ts: Current source of truth for persisted preference keys.
- test/unit/ThemeProvider.test.tsx: Update preference persistence expectations to the current source of truth and remove legacy compatibility assertions.
- test/unit/pages/CV.test.tsx: Keep the main CV route suite as the primary behavioral coverage and align any stale preference-key assumptions.
- test/unit/pages/CV.runtime.test.tsx: Trim or consolidate duplicate smoke coverage if it no longer protects distinct behavior.
- test/unit/pages/Climbing.test.tsx: Update motion-intensity persistence coverage to the centralized preference-key source of truth.
- package.json: Piggyback-only dependency metadata cleanup if the file becomes necessary.

## Proposed approach

1. Keep src/hooks/githubProfileData.ts as the runtime source of truth and update Playwright mocks to match its real fetch pattern: public events, issue search, and per-repo enrichment.
2. Remove dead theme storage-key compatibility surfaces only after migrating tests to use PREFERENCE_STORAGE_KEYS from src/theme/preferences.ts.
3. Keep one strong CV page suite as the main contract and reduce CV.runtime.test.tsx to only any distinct smoke assertion that still adds value; otherwise remove redundant cases.
4. Skip package.json unless another required Batch F change forces the file into the diff.

## Execution steps

1. Add and maintain this ExecPlan before implementation.
2. Update the GitHub Playwright helper so mocked routes and payloads match the current runtime request graph.
3. Adjust the CV GitHub E2E spec assertions to the current mock data and status messaging.
4. Migrate theme and climbing tests to PREFERENCE_STORAGE_KEYS and remove deprecated appearance/motion storage-key exports if no runtime users remain.
5. Trim CV.runtime.test.tsx so it only retains unique coverage, or remove redundant cases entirely if CV.test.tsx already owns them.
6. Run build, focused Jest coverage for touched tests, and the narrowest relevant Playwright coverage for test/e2e/cv.github.spec.ts.

## Validation plan

- npm run build
- CI=true npm test -- --watch=false --runTestsByPath test/unit/ThemeProvider.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CV.runtime.test.tsx test/unit/pages/Climbing.test.tsx --coverage
- npm run build:e2e && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts
- If package.json is touched, rerun the required build and targeted tests after the dependency metadata move

## Risks and rollback

- The main risk is removing a compatibility export that still has a runtime consumer outside the initially targeted tests.
- A second risk is over-trimming CV.runtime.test.tsx and losing distinct smoke protection for the live CV component tree.
- GitHub mock updates can also drift if the runtime request graph changes again; keep the helper narrowly coupled to githubProfileData.ts.
- Roll back by restoring removed deprecated exports or reinstating a focused runtime smoke assertion if validation shows coverage was trimmed too far.

## Progress notes

- Initial inspection shows ThemeProvider now reads only PREFERENCE_STORAGE_KEYS from src/theme/preferences.ts and does not consult the legacy cv appearance key.
- Initial inspection shows the Playwright GitHub helper still mocks **/api.github.com/users/\*/repos** even though the runtime currently fetches users/\*/events, search/issues, and repos/<name> enrichment.
- Initial inspection shows CV.test.tsx already covers the primary route structure and story-mode behavior, while CV.runtime.test.tsx largely duplicates those assertions with a lighter harness.
- package.json appears unnecessary for the current scope and should remain untouched unless implementation changes that assessment.
- Updated test/e2e/helpers/github.ts to mock the current GitHub request graph and added success-path assertions in test/e2e/cv.github.spec.ts for enriched contribution repos plus a partial-fallback contribution assertion.
- Removed the deprecated appearance and motion storage-key exports from src/theme/appAppearance.ts after migrating the touched tests to PREFERENCE_STORAGE_KEYS in src/theme/preferences.ts.
- Reduced test/unit/pages/CV.runtime.test.tsx from overlapping route assertions to a single runtime smoke test that still exercises the live CV tree, accessible bio layer, and mocked GitHub content.
- Validation completed successfully with npm run build, focused Jest coverage for the touched theme/CV/climbing suites, and npm run build:e2e plus the chromium Playwright run for test/e2e/cv.github.spec.ts.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
