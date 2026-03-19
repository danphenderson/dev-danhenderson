# Repository overview

This repository contains `danhenderson.dev`, a client-side React + TypeScript portfolio site with route-level pages for `/`, `/cv`, `/climbing`, `/photography`, `/photography/:slug`, `/blog`, and `/blog/:slug`. Preserve the current single-page-app architecture, direct-link routing behavior, and static-hosting compatibility with `PUBLIC_URL`. Blog routes are feature-gated outside development and test builds.

## Primary stack

- React 18 + TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Framer Motion (via `motion/react`)
- Create React App (`react-scripts`)
- Node 20 in CI
- webdev MCP server available for browser-based UI validation and screenshots

## Working rules

- Prefer the smallest relevant file set and narrowly scoped changes.
- Build on existing component, hook, and data-module patterns instead of introducing parallel abstractions.
- Treat `docs/README.md` as the source-of-truth documentation index and use the docs set for architecture, motion, theme/styling, and testing guidance when repo instructions are not specific enough.
- Keep `README.md` aligned when setup, commands, architecture, or user-facing behavior changes.
- Use `src/data/` as the source of truth for portfolio, climbing, photography, and blog content.
- Preserve graceful fallback behavior for GitHub-backed `/cv` sections when API calls fail or are rate-limited.
- Preserve the documented motion and styling invariants: motion timing flows through `useMotionScale()`, feature-gated blog behavior flows through `isFeatureEnabled()`, and reusable theme-conditional surfaces belong in the style builders rather than ad hoc inline `theme.appearanceTreatment` styling.
- Follow the nearest applicable `AGENTS.md`; the root `AGENTS.md` covers the repository and nested files under `src/` add directory-specific rules.
- If a task is non-trivial or cross-cutting, follow `PLANS.md` and create an ExecPlan in `plans/` before editing.

## Repository map

- `src/pages/`: route-level page composition
- `src/components/`: shared UI and CV-specific presentation
- `src/hooks/`: data adapters and route helpers
- `src/data/`: source-of-truth content modules
- `src/types/`: shared data model types
- `test/e2e/`: Playwright end-to-end tests and helpers when present on the branch
- `docs/`: source-of-truth architecture, frontend, engineering, and reference documentation
- `.github/workflows/`: CI, E2E, docs, and security automation

## Validated commands

- Bootstrap dependencies with `npm install` before running local build or test commands.
- Run the dev server with `npm start` (defaults to port `3001`).
- Build with `npm run build`.
- Use `npm run build:e2e` before Playwright coverage when feature-gated blog behavior is part of the touched flow.
- Run Jest with `CI=true npm test -- --watch=false` or narrower targeted variants when relevant.
- Run Playwright with `npm run test:e2e -- --workers=4` after the appropriate build variant when the touched behavior has E2E coverage.

## Validation notes

- `npm run build` passes in the current repository state after `npm install`.
- `npm run build:e2e` is the correct build variant when validating feature-gated blog routes under Playwright because it sets `REACT_APP_RUNTIME_ENV=test`.
- Direct `npx playwright test ...` invocations should include `--workers=4` so manual runs match CI and the shared Playwright config.
- `CI=true npm test -- --watch=false` currently has unrelated baseline failures in existing CV tests, so prefer the narrowest relevant validation for the files you change and separate unrelated failures from regressions you introduce.

Trust these instructions first and only explore further when a task needs deeper file-specific details or the documented guidance is incomplete.
