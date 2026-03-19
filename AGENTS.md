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
- Scoped `AGENTS.md` files under `src/` (and `resume/` when relevant) are the canonical local rules for the files they cover.

## Instruction map

- `resume/AGENTS.md` — resume-source work and PDF update constraints
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
- Framer Motion (via `motion/react`)
- Create React App (`react-scripts`)
- Node 20 in CI
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
- unit/component tests: `CI=true npm test -- --watch=false`
- Playwright: `npm run test:e2e`

Notes:

- The dev server defaults to port `3001` in this repository.
- Playwright serves the `build/` directory on port `3100`.
- `CI=true npm test -- --watch=false` currently has unrelated baseline failures in existing CV tests, so prefer the narrowest relevant validation for the files you change and separate unrelated failures from regressions you introduce.
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
- `resume/`: LaTeX source for the downloadable resume PDF
- `docs/`: source-of-truth architecture, frontend, engineering, and reference documentation

## Area guidance

### CV / portfolio content

- Treat `src/data/cv.ts` as the source of truth for the interactive `/cv` experience and routine CV content updates.
- `resume/` is read-only unless the task explicitly requests resume-source changes or a resume PDF update.
- The live `/cv` experience and the downloadable resume do not need conceptual parity unless the task explicitly connects them.

### GitHub-driven sections

- Dynamic CV highlights use GitHub API-backed hooks with fallback content.
- Preserve graceful degradation when GitHub API calls fail or are rate-limited.
- Prefer deterministic mocked validation over live GitHub API behavior when Playwright E2E helpers are available.

### Climbing and photography data

- Do not edit `src/data/climbs.ts` or `src/data/photography.ts` unless the task explicitly requests it.
- Preserve sorting, normalization, slug generation, and route-matching assumptions used by their hooks and routes.

### Blog content

- All blog UI components live in `src/components/blog/`; use `useBlogData` for all data access and navigation helpers.
- Blog routes are feature-gated via `isFeatureEnabled('blog')`; preserve the current behavior where they are available in development/test builds and omitted in production.
- Do not fetch blog content from remote APIs or a CMS; all content is static.

### Theme and UX state

- Theme configuration lives in `src/ThemeProvider.tsx`.
- Welcome audio behavior lives in `src/WelcomeAudioProvider.tsx`.
- Preserve localStorage-backed preferences unless migration is explicitly requested.
- Do not hardcode theme logic in components or routes; use the existing context and hooks.

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
