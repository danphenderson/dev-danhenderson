# Repository overview

This repository contains `danhenderson.dev`, a client-side React + TypeScript portfolio site with route-level pages for `/`, `/cv`, `/climbing`, `/photography`, and `/photography/:slug`. Preserve the current single-page-app architecture, direct-link routing behavior, and static-hosting compatibility with `PUBLIC_URL`.

## Primary stack

- React 18 + TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Create React App (`react-scripts`)
- Node 20 in CI

## Working rules

- Prefer the smallest relevant file set and narrowly scoped changes.
- Build on existing component, hook, and data-module patterns instead of introducing parallel abstractions.
- Keep `README.md` aligned when setup, commands, architecture, or user-facing behavior changes.
- Use `src/data/` as the source of truth for portfolio, climbing, and photography content.
- Preserve graceful fallback behavior for GitHub-backed `/cv` sections when API calls fail or are rate-limited.
- Follow the nearest applicable `AGENTS.md`; the root `AGENTS.md` covers the repository and nested files under `src/` add directory-specific rules.
- If a task is non-trivial or cross-cutting, follow `PLANS.md` and create an ExecPlan in `plans/` before editing.

## Repository map

- `src/pages/`: route-level page composition
- `src/components/`: shared UI and CV-specific presentation
- `src/hooks/`: data adapters and route helpers
- `src/data/`: source-of-truth content modules
- `src/types/`: shared data model types
- `e2e/`: Playwright end-to-end tests when present on the branch
- `.github/workflows/`: CI, E2E, and security automation

## Validated commands

- Bootstrap dependencies with `npm install` before running local build or test commands.
- Run the dev server with `npm start` (defaults to port `3001`).
- Build with `npm run build`.
- Run Jest with `CI=true npm test -- --watch=false` or narrower targeted variants when relevant.
- Run Playwright with `npm run test:e2e` after `npm run build` when the touched behavior has E2E coverage.

## Validation notes

- `npm run build` passes in the current repository state after `npm install`.
- `CI=true npm test -- --watch=false` currently has unrelated baseline failures in existing CV tests, so prefer the narrowest relevant validation for the files you change and separate unrelated failures from regressions you introduce.

Trust these instructions first and only explore further when a task needs deeper file-specific details or the documented guidance is incomplete.
