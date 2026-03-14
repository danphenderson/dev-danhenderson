# CI/CD Consolidation and Hardening

## Goal

Replace the two separate Build and Tests workflows with a single orchestrated CI workflow that runs unit tests, builds, and Playwright E2E checks as coordinated parallel jobs. Add Dependabot for automated dependency maintenance and CodeQL for security analysis. Apply `paths-ignore` so documentation-only changes skip the full pipeline.

## Why

The CI/CD audit identified several high-priority improvement opportunities:

1. **Duplicated setup** — `build.yml` and `tests.yml` independently checkout, install Node, warm the npm cache, and run `npm ci`. This doubles runner time and maintenance surface.
2. **Unenforced E2E coverage** — Playwright specs exist in `e2e/` and are maintained locally, but never run in CI, so browser regressions can reach review without detection.
3. **Missing security automation** — No Dependabot configuration or CodeQL analysis exists, so transitive vulnerabilities and deprecated packages accumulate silently.
4. **Unnecessary CI for docs** — Every push or PR runs the full workflow even when only markdown or non-source files changed.

## Constraints

- The app remains fully client-side; no server-side CI dependencies.
- SPA routing and direct-link behavior remain intact.
- Static asset usage remains compatible with `PUBLIC_URL`.
- Existing npm scripts (`npm run build`, `npm test`, `npm run test:e2e`) are the source of truth for CI commands.
- Playwright E2E requires the production build artifact (uses `serve -s build -l 3100`).
- Workflow concurrency should still cancel superseded runs on the same ref.
- Do not introduce new runtime dependencies; only CI/infrastructure changes.

## Affected files and responsibilities

- `.github/actions/setup/action.yml` — New composite action for checkout + Node 20 + npm ci (DRY shared setup).
- `.github/workflows/ci.yml` — New single orchestrated workflow replacing `build.yml` and `tests.yml`, adding E2E job.
- `.github/workflows/build.yml` — Removed (replaced by ci.yml build job).
- `.github/workflows/tests.yml` — Removed (replaced by ci.yml test job).
- `.github/workflows/codeql.yml` — New CodeQL analysis workflow.
- `.github/dependabot.yml` — New Dependabot configuration for npm and GitHub Actions ecosystems.

## Proposed approach

### Composite action for shared setup

Create `.github/actions/setup/action.yml` that encapsulates:
- `actions/checkout@v4`
- `actions/setup-node@v4` with Node 20 and npm cache
- `npm ci`

All CI jobs reference this single action, eliminating duplicated setup.

### Single CI workflow (`ci.yml`)

Three parallel jobs sharing the composite setup:
1. **test** — Runs `CI=true npm test -- --watch=false --passWithNoTests --coverage`, uploads coverage artifact.
2. **build** — Runs `npm run build`, uploads build artifact.
3. **e2e** — Depends on `build`, downloads build artifact, installs Playwright Chromium, runs `npx playwright test`, uploads traces/screenshots/reports on failure.

### paths-ignore

The CI workflow ignores changes to `*.md`, `docs/**`, `LICENSE`, `.editorconfig`, `.prettierrc`, `.prettierignore`, and `resume/**`.

### Dependabot

Configure grouped updates for npm (weekly) and GitHub Actions (weekly) with auto-merge labels for patch updates.

### CodeQL

Separate workflow running on push to main, PRs to main, and weekly schedule, analyzing JavaScript/TypeScript.

## Execution steps

1. Create `.github/actions/setup/action.yml` composite action.
2. Create `.github/workflows/ci.yml` with test, build, and e2e jobs.
3. Remove `.github/workflows/build.yml`.
4. Remove `.github/workflows/tests.yml`.
5. Create `.github/dependabot.yml`.
6. Create `.github/workflows/codeql.yml`.
7. Validate workflow YAML syntax.
8. Run code review and security checks.

## Validation plan

- Verify YAML syntax is valid (use `actionlint` if available, or manual review).
- Verify composite action references are correct.
- Verify `paths-ignore` patterns are appropriate.
- Verify E2E job correctly depends on build and downloads the artifact.
- Verify Dependabot config targets correct ecosystems.
- Verify CodeQL workflow targets correct language.

## Risks and rollback

- **Risk**: New CI workflow could have syntax errors that block CI. Mitigation: validate YAML before merge.
- **Risk**: E2E job may be flaky due to animation timing. Mitigation: Playwright config already has retries (2 in CI) and tests use `reducedMotion: 'reduce'`.
- **Risk**: `paths-ignore` could skip CI on changes that affect the build. Mitigation: only ignore clearly non-source files (markdown, config, resume).
- **Rollback**: Revert the single commit that replaces the workflows to restore `build.yml` and `tests.yml`.

## Progress notes

- Created composite action for shared Node setup.
- Created consolidated ci.yml with test, build, and e2e jobs.
- Removed old build.yml and tests.yml.
- Created CodeQL workflow.
- Created Dependabot config with grouped updates.
- Added paths-ignore for docs-only changes.
- Fixed composite action to not include checkout (must be separate step in each job).
- Verified `serve` is a dependency for Playwright webServer config.
- Verified no actionable security advisories for referenced GitHub Actions.
