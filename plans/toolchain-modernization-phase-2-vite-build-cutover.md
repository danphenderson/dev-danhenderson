# Toolchain Modernization Phase 2 Vite Build Cutover

## Goal

Move the main app's dev server and build pipeline from Create React App to Vite while preserving the current static SPA behavior, `PUBLIC_URL` compatibility, build metadata stamping, feature-gated `build:e2e` behavior, and Playwright's `build/` output contract.

## Why

Phase 1 isolated app-level environment reads behind a shared compatibility layer. The next step is to replace the CRA dev/build toolchain itself. This is the highest-value part of the modernization track because it removes the hidden Webpack/Workbox build stack from normal development and production bundling without forcing an immediate Jest/ESLint migration.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep `build` and `build:e2e` as the published command surface.
- Preserve the current `REACT_APP_RUNTIME_ENV` build override used by Playwright coverage.
- Preserve the `build/` output directory so Playwright and CI keep serving the same artifact path.
- Preserve `public/service-worker.js` at the site root.
- Do not remove `react-scripts` yet; Phase 3 still needs it for the existing Jest/ESLint plumbing.

## Affected files and responsibilities

- `vite.config.ts`: new Vite configuration for base path, env injection, output directory, and HTML placeholder replacement.
- `index.html`: new Vite HTML entrypoint that preserves the existing metadata and `PUBLIC_URL` placeholders.
- `public/index.html`: removed CRA-only HTML template path.
- `package.json`: switch `start` to Vite while preserving the current build/test command names.
- `scripts/buildWithMetadata.js`: invoke Vite build instead of CRA build while preserving metadata stamping and `build:e2e` behavior.
- `src/utils/appEnvironment.ts`: read from the Vite-injected environment object in browser builds while preserving Node/Jest fallback behavior.

## Proposed approach

Use Vite only for dev/build in this phase. Keep the shared `appEnvironment` compatibility layer as the single source of runtime/build values and inject a Vite-defined `__APP_ENV__` object into browser bundles. Preserve the existing `%PUBLIC_URL%` placeholder semantics in the new root `index.html` via a small Vite HTML transform plugin so static asset and manifest links continue to behave like the CRA build. Keep the existing `buildWithMetadata.js` wrapper and simply swap its underlying build command from `react-scripts` to `vite build`.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Add a Vite config that preserves the current base-path and `build/` output expectations.
3. Move the HTML entrypoint from `public/index.html` to root `index.html` and preserve `%PUBLIC_URL%` placeholder behavior.
4. Update `scripts/buildWithMetadata.js` and `package.json` so local dev/build use Vite while tests still use `react-scripts`.
5. Validate `npm start`, `npm run build`, and `npm run build:e2e`, then run the narrowest relevant browser coverage to confirm the built app still serves key routes.

## Validation plan

- `npm run build`
- `npm run build:e2e`
- `npm start`
- `npm run build && npm run test:e2e:smoke`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts`

## Risks and rollback

- Risk: base-path handling can regress if Vite `base`, router basename, and `%PUBLIC_URL%` HTML replacement drift apart.
- Risk: `build:e2e` can silently lose the runtime override and break the blog route coverage.
- Risk: moving `index.html` out of `public/` can break manifest/service-worker links if placeholder replacement is incomplete.
- Rollback is contained to the files above; if the Vite cutover regresses behavior, revert this slice while keeping the Phase 1 runtime-contract abstraction.

## Progress notes

- 2026-03-22: Started the Vite dev/build cutover while intentionally retaining `react-scripts` for Jest/ESLint until Phase 3.
- 2026-03-22: Added `vite.config.ts`, moved the HTML entrypoint to root `index.html`, and updated `scripts/buildWithMetadata.js` plus `package.json` so `npm start`, `npm run build`, and `npm run build:e2e` now route through Vite.
- 2026-03-22: Used the Vite 4 / `@vitejs/plugin-react` 4 generation for this slice so the build cutover stays compatible with the repo's current Node type floor instead of pulling the later TypeScript/Node upgrade forward.
- 2026-03-22: Validated the cutover with `npm run build`, `npm run build:e2e`, a successful Vite dev-server startup on port 3001, `npm run build && npm run test:e2e:smoke`, and `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts`.
- 2026-03-22: Re-ran focused unit coverage for `appEnvironment`, `buildInfo`, and `featureFlags`, and confirmed the built artifact still ships `build/index.html`, `build/manifest.json`, and `build/service-worker.js` at the root.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
