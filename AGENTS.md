# AGENTS.md

## Repository purpose

This repository contains the source for `danhenderson.dev`, a client-side React + TypeScript portfolio site.

Primary user-facing routes:

- `/` home page and optional intro audio
- `/cv` interactive CV and GitHub-driven profile sections
- `/climbing` climbing logs and to-do routes
- `/photography` and `/photography/:slug` gallery browsing
- `/blog` and `/blog/:slug` editorial blog and post detail, feature-gated to dev/test builds

Prefer changes that preserve the current single-page-app architecture and static hosting model.

## Source-of-truth docs

- `docs/README.md` is the index for the repository documentation set and the instruction-discovery map.
- `docs/engineering/agent-guide.md` is the canonical source for repository-wide architecture invariants, intentional exceptions, and safe extension patterns.
- `docs/engineering/testing-strategy.md` is the canonical source for validation matrices, build variants, and repo-standard Playwright/Jest command shapes.
- `PLANS.md` is the canonical source for ExecPlan requirements, triggers, and templates.
- Scoped `AGENTS.md` files under `src/` (and `public/resume/` when relevant) are the canonical local rules for the files they cover.

## Instruction map

- `public/resume/AGENTS.md` — resume-source work and PDF update constraints
- `src/pages/AGENTS.md` — route-level composition, page-local behavior, and route validation expectations
- `src/components/AGENTS.md` — shared component design, multi-consumer risk, and component validation expectations
- `src/components/blog/AGENTS.md` — editorial blog subsystem rules and blog-specific validation
- `src/data/AGENTS.md` — content source-of-truth modules, schema discipline, and protected datasets
- `src/hooks/AGENTS.md` — adapter-layer boundaries, fallback behavior, and shared hook rules
- `src/constants/AGENTS.md` — route metadata, feature flags, command palette data, and recovery logic
- `src/motion/AGENTS.md` — motion foundation, timing rules, and Motion-library boundaries
- `src/styles/AGENTS.md` — style builders, keyframes, and CSS animation ownership
- `src/theme/AGENTS.md` — appearance presets, theme assembly, and token ownership
- `src/types/AGENTS.md` — shared type ownership and low-level dependency boundaries
- `src/utils/AGENTS.md` — pure helpers and `PUBLIC_URL`-safe asset path construction

## Stack and runtime

- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- TypeScript 5.6 baseline
- Framer Motion (via `motion/react`)
- Vite for dev/build
- Standalone Jest + ESLint configuration
- Node 20.19+ for the main app toolchain; CI remains pinned to Node 20
- webdev MCP server available for browser-based UI validation and screenshots

## Decision priority

When instructions conflict, prioritize:

1. preserving existing user-facing behavior and SPA route behavior
2. keeping the change narrowly scoped to the task
3. following existing component, hook, and data-module patterns
4. keeping `README.md` aligned with implementation changes

Runtime system and developer instructions override repository instructions. Within repository docs, follow the canonical owner for the topic; for directory-specific work, the closest in-scope `AGENTS.md` takes precedence over broader repo guidance.

## Planning and workflow

- Start with the smallest relevant file set: the affected route page, shared component, hook, and data module.
- Prefer the minimum viable change. Do not broad-scan or refactor unrelated areas unless the task clearly requires it.
- Use the nearest scoped `AGENTS.md` before editing inside that directory.
- Before editing, identify the smallest set of files that can satisfy the request while preserving behavior.
- For non-trivial features, refactors, cross-cutting changes, or any task that meets an ExecPlan trigger in `PLANS.md`, create and follow an ExecPlan before making changes.
- Keep plans current as implementation details change.
- Preserve existing public component APIs where practical. Change them only when required for correctness or the requested task.
- If the task is review-only, prioritize findings over implementation and distinguish required fixes from optional improvements.
- For UI edits, identify whether the change is page-local or shared-component-impacting before editing, then validate accordingly.

## Concurrent work

- Multiple agents and the repository developer may work on the same branch at the same time. Treat the branch as shared and assume others may push changes at any time.

## Repo-wide guardrails

- Keep the app fully client-side unless backend work is explicitly requested.
- Preserve SPA routing behavior, direct-link compatibility, and `PUBLIC_URL`-safe asset handling.
- Prefer focused, minimal edits that fit the current component, hook, and data model patterns.
- Use existing TypeScript data modules as the primary content source; do not introduce a CMS or new remote content source unless explicitly requested.
- Preserve graceful fallbacks for GitHub-backed CV content.
- Do not add new dependencies unless the task cannot be completed cleanly with the existing stack. If a new dependency is necessary, explain why.
- Keep `README.md` aligned with implementation changes when setup, commands, architecture, or public behavior changes.
- Avoid unrelated refactors, formatting-only churn, mass renames, or dependency upgrades unless required by the task.

## Repository-wide invariants

Canonical definitions live in `docs/engineering/agent-guide.md`.

- Preserve provider nesting order.
- Preserve the motion intensity contract through `useMotionScale()`.
- Keep theme-conditional reusable surfaces in the style-builder pipeline.
- Keep feature-gated routes and navigation driven by `isFeatureEnabled()` and route metadata.
- Respect the documented intentional design-system exceptions for the Home IDE hero, blog editorial surfaces, photography overlays/lightbox, and CV story mode.

## Commands

Use the narrowest relevant validation first, then expand if needed.

`docs/engineering/testing-strategy.md` is the canonical source for validation matrices, build variants, browser-validation expectations, and repo-standard Playwright/Jest command shapes.

Quick reference:

- install: `npm install`
- dev server: `npm start`
- build: `npm run build`
- gated E2E build: `npm run build:e2e`
- unit/component tests: `CI=true npm test -- --watchAll=false`
- lint: `npm run lint`
- typecheck: `npm run typecheck`
- Playwright: `npm run test:e2e`

Notes:

- The dev server defaults to port `3001` in this repository.
- Playwright serves the `build/` directory on port `3100`.
- `CI=true npm test -- --watchAll=false` currently has unrelated baseline failures in existing CV tests, so prefer the narrowest relevant validation for the files you change and separate unrelated failures from regressions you introduce.
- Do not claim a command or validation step was run unless it was actually run.

## Repository map

- `src/components/`: shared UI and CV-specific components, including `src/components/blog/` for the blog feature
- `src/pages/`: route-level pages
- `src/data/`: source-of-truth content for CV, climbing, photography, and blog
- `src/hooks/`: adapters/hooks for GitHub, climbing, photography, and blog data
- `src/types/`: centralized data model types shared across layers
- `src/motion/`: unified animation foundation — duration tokens, easing, variants, and animated primitives
- `src/styles/`: theme-conditioned style maps, Emotion keyframes, and spring-easing constants
- `src/theme/`: MUI theme assembly and appearance-preset system
- `src/constants/`: build-time stable config — route definitions, feature flags, command palette registry, recovery scoring
- `src/utils/`: pure, framework-agnostic helper functions
- `test/e2e/`: Playwright end-to-end specs and helpers when the branch includes browser integration tests
- `test/unit/`: Jest unit and component tests
- `public/assets/`: shipped images, certificates, media, and resume PDF
- `public/resume/`: LaTeX source for the downloadable resume PDF
- `docs/`: source-of-truth architecture, frontend, engineering, and reference documentation

## Area guidance

### CV / portfolio and GitHub-backed sections

- `src/data/cv.ts` is the source of truth for interactive `/cv`; use `src/data/AGENTS.md` for content/schema rules and `public/resume/AGENTS.md` for resume-source work.
- Preserve graceful GitHub fallback behavior through the existing hooks and prefer mocked validation when applicable; see `src/hooks/AGENTS.md`.

### Climbing, photography, and blog content

- Content edits stay in `src/data/`; use `src/data/AGENTS.md` for protected datasets, ordering rules, and schema expectations.
- Blog UI, routing, and gating should follow `src/components/blog/AGENTS.md`, `src/pages/AGENTS.md`, and `src/constants/AGENTS.md`.

### Theme, motion, and UX state

- Theme, appearance, motion intensity, and reusable styling rules are owned by the `src/theme/`, `src/styles/`, and `src/motion/` instruction files plus their canonical docs.
- Preserve existing provider-driven UX state and localStorage-backed preferences; do not reimplement theme or welcome-audio logic in pages or components.

## Review guidelines

For review, audit, or design-feedback tasks:

- prioritize correctness, regressions, API stability, accessibility, and consistency with existing project patterns
- order findings by severity and confidence when practical
- distinguish required fixes from optional improvements
- note scope creep, hidden coupling, or architecture drift when present
- prefer targeted recommendations over broad rewrites unless the architecture is the issue

## Final response expectations

Include:

- what changed
- which routes, components, hooks, or data modules were affected
- why the change was made
- how the change fits the existing architecture
- what validation was actually performed
- any relevant technical debt identified, even if not fixed

Do not include:

- coverage percentages
- claims about tests or validation you did not run
