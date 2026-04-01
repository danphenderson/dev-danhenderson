# Repository overview

This repository contains `danhenderson.dev`, a client-side React + TypeScript portfolio site with route-level pages for `/`, `/cv`, `/climbing`, `/photography`, `/photography/:slug`, `/blog`, and `/blog/:slug`. Preserve the current single-page-app architecture, direct-link routing behavior, and static-hosting compatibility with `PUBLIC_URL`. Blog routes are feature-gated outside development and test builds.

## Instruction layers

Use the instruction stack in this order:

1. `AGENTS.md` — canonical repo-level workflow, guardrails, and instruction discovery
2. `docs/README.md` — documentation index and instruction map
3. `docs/engineering/agent-guide.md` — canonical architecture invariants, intentional exceptions, and safe extension patterns
4. `docs/engineering/testing-strategy.md` — canonical validation matrix, build variants, and repo-standard Playwright/Jest command shapes
5. `PLANS.md` — canonical ExecPlan requirements
6. nearest scoped `AGENTS.md` under `src/` (and `public/resume/` when relevant) — canonical local rules for the files being changed
7. `.github/instructions/*.instructions.md` — auto-applied shims that summarize the relevant scoped rules

## Working rules

- Prefer the smallest relevant file set and narrowly scoped changes.
- Build on existing component, hook, and data-module patterns instead of introducing parallel abstractions.
- Keep `README.md` aligned when setup, commands, architecture, or user-facing behavior changes.
- Use `src/data/` as the source of truth for portfolio, climbing, photography, and blog content.
- Preserve graceful fallback behavior for GitHub-backed `/cv` sections when API calls fail or are rate-limited.
- Preserve the documented motion, styling, and feature-gating invariants defined in `docs/engineering/agent-guide.md`.
- For non-trivial or cross-cutting tasks, follow `PLANS.md` and create an ExecPlan in `plans/` before editing.

## Validation quick reference

- Bootstrap dependencies with `npm install` before local build or test commands.
- Run `npm run build` for the default compile check.
- Use `npm run build:e2e` before Playwright coverage when feature-gated blog behavior is part of the touched flow.
- Use `docs/engineering/testing-strategy.md` for the canonical validation matrix and repo-standard Playwright/Jest command shapes.

## Validation notes

- `npm run build` passes in the current repository state after `npm install`.
- `npm run build:e2e` is the correct build variant when validating feature-gated blog routes under Playwright because it sets `REACT_APP_RUNTIME_ENV=test`.
- `playwright.config.ts` and `docs/engineering/testing-strategy.md` together own the shared Playwright worker count and command shapes; avoid restating worker flags or alternate command forms in nested instructions.
- `CI=true npm test -- --watch=false` currently has unrelated baseline failures in existing CV tests, so prefer the narrowest relevant validation for the files you change and separate unrelated failures from regressions you introduce.
