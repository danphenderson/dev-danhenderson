# Build Metadata Injection

## Goal

Ensure production and E2E bundles stamp real git SHA, build time, and package version into the app before CRA renders the footer scorecard metadata.

## Why

The footer scorecard currently reads `buildInfo` as artifact metadata, but the build pipeline never exports the required `REACT_APP_*` variables. As a result, production bundles can show placeholder commit/version values and a browser-time `Built` timestamp.

## Constraints

- Keep the fix narrowly scoped to build metadata generation and its immediate consumers.
- Preserve the existing CRA build entrypoints and feature-gated `build:e2e` behavior.
- Keep `src/utils/buildInfo.ts` as a pure env reader rather than adding React or runtime-side metadata discovery.
- Do not modify unrelated existing worktree changes.

## Affected files and responsibilities

- `package.json`: route both build entrypoints through a shared metadata-aware build script.
- `scripts/buildWithMetadata.js`: populate `REACT_APP_GIT_SHA`, `REACT_APP_BUILD_TIME`, and `REACT_APP_VERSION` before invoking CRA build.
- `src/utils/buildInfo.ts`: keep env reads simple and replace misleading runtime fallbacks.
- `test/unit/utils/buildInfo.test.ts`: align expectations with the new fallback behavior.
- `README.md`: document that build variants stamp artifact metadata.

## Proposed approach

Add a small Node wrapper script that reads the package version, resolves the current git SHA, sets a build timestamp once, optionally applies the existing runtime-env override for `build:e2e`, and then invokes CRA's build entrypoint. Update package scripts to use that wrapper so local builds and GitHub Actions both get the same metadata path. Harden `buildInfo` fallbacks so missing env values are explicit placeholders instead of misleading production-looking values.

## Execution steps

1. Add the shared Node build wrapper under `scripts/`.
2. Update `package.json` so `build` and `build:e2e` both flow through the wrapper.
3. Update `src/utils/buildInfo.ts` fallback values to avoid fake production metadata.
4. Update the unit test and README to match the new behavior.
5. Run targeted validation for build metadata and the production build path.

## Validation plan

- `npm run build`
- `npm run build:e2e`
- `CI=true npm test -- --watch=false --runInBand --testPathPattern=test/unit/utils/buildInfo.test.ts`

## Risks and rollback

- The wrapper script must preserve the existing `build:e2e` runtime override; otherwise feature-gated Playwright behavior will regress.
- The git SHA lookup may fail outside a git checkout, so the script needs a safe fallback.
- Rollback is contained to the files above by restoring the original build scripts and removing the wrapper.

## Progress notes

- Confirmed the current GitHub Actions build job calls `npm run build` and `npm run build:e2e` without exporting build metadata env vars.
- Confirmed the current `buildInfo` fallback path bakes `dev`, `1.0.0`, and `new Date().toISOString()` into the client bundle.
- Implemented: added `scripts/buildWithMetadata.js` to stamp git SHA, build time, and package version before invoking CRA build.
- Implemented: routed both `build` and `build:e2e` through the shared wrapper while preserving the `test` runtime override for `build:e2e`.
- Implemented: changed `buildInfo` fallbacks so unstamped sessions show explicit placeholders instead of misleading production-like metadata.
- Implemented: updated the focused utility test and README to match the new behavior.
- Validated: `npm test -- --watch=false --runInBand --testPathPattern=test/unit/utils/buildInfo.test.ts` passed with `CI=true` exported in the shared shell.
- Validated: `npm run build` passed.
- Validated: `npm run build:e2e` passed.
- Validated: the generated `build/static/js/main.c037e51d.js` bundle contains `gitSha:"688449b"`, `buildTime:"2026-03-21T19:49:37.567Z"`, and `version:"0.1.0"` in the compiled `buildInfo` object.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
