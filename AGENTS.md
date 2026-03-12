# AGENTS.md

## Repository purpose
This repository contains the source for `danhenderson.dev`, a client-side React + TypeScript portfolio site.

Primary user-facing routes:
- `/` home page and optional intro audio
- `/cv` interactive CV and GitHub-driven profile sections
- `/climbing` climbing logs and to-do routes
- `/photography` and `/photography/:slug` gallery browsing

Prefer changes that preserve the current single-page-app architecture and static hosting model.

## Stack and runtime
- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Create React App (`react-scripts`)
- Node 20 in CI
- webdev MCP server available for browser-based UI validation and screenshots

## Decision priority
When instructions conflict, prioritize:
1. preserving existing user-facing behavior and SPA route behavior
2. keeping the change narrowly scoped to the task
3. following existing component, hook, and data-module patterns
4. keeping `README.md` aligned with implementation changes

Runtime system and developer instructions override repository instructions. Within repository docs, the closest in-scope `AGENTS.md` takes precedence.

## Local instructions and planning
- More specific instructions may exist in nested `AGENTS.md` files. Follow the closest applicable file for the area being changed.
- For non-trivial features, refactors, or cross-cutting changes, create and follow an ExecPlan using `PLANS.md`. Treat an ExecPlan as required when any ExecPlan trigger in `PLANS.md` is met.
- Keep plans current as implementation details change.

## Working workflow
- Start with the smallest relevant file set: the affected route page, shared component, hook, and data module.
- Prefer the minimum viable change. Do not broad-scan or refactor unrelated areas unless the task clearly requires it.
- Before editing, identify the smallest set of files that can satisfy the request while preserving behavior.
- For tasks affecting multiple routes, cross-cutting UX, architecture, or more than a few source files, write an ExecPlan before making changes.
- Preserve existing public component APIs where practical. Change them only when required for correctness or the requested task.
- If the task is review-only, prioritize findings over implementation and distinguish required fixes from optional improvements.
- For UI edits, identify whether the change is page-local or shared-component-impacting before editing, then validate accordingly.

## Concurrent work
- Multiple agents and the repository developer may work on the same branch at the same time. Treat the branch as shared and assume others may push changes at any time.

## Commands
Use the narrowest relevant validation first, then expand if needed.

Primary commands:
- install: `npm install`
- dev server: `npm start`
- dev server on port 3000: `PORT=3000 npm start`
- build: `npm run build`
- tests when relevant: `npm test -- --watch=false`

Playwright E2E commands, when the working branch includes the Playwright workflow:
- one-time browser install: `npx playwright install chromium`
- serve the production build for local E2E debugging: `npm run serve:e2e`
- end-to-end tests: `npm run test:e2e`
- headed E2E tests: `npm run test:e2e:headed`
- interactive E2E runner: `npm run test:e2e:ui`

Notes:
- The dev server defaults to port `3001` in this repository.
- Playwright E2E runs against a production build served on port `3100`; run `npm run build` before the narrowest relevant `npx playwright test ...` or `npm run test:e2e` command when that workflow is present.
- `npm run serve:e2e` is optional for local iteration; Playwright can start the server itself when the branch includes a `webServer` config.
- Do not claim a command or validation step was run unless it was actually run.

## Core expectations
- Keep the app fully client-side unless backend work is explicitly requested.
- Preserve SPA routing behavior. Direct links must continue to work via host-side rewrites to `index.html`.
- Preserve static asset compatibility with `PUBLIC_URL`.
- Prefer focused, minimal edits that fit the current component and data model patterns.
- Do not add new dependencies unless the task cannot be completed cleanly with the existing stack. If a new dependency is necessary, explain why.
- When updating content, prefer the existing TypeScript data modules over introducing a CMS or remote content source.
- Keep `README.md` aligned with implementation changes in the same change set when setup, commands, architecture, or user-visible behavior meaningfully changes.
- Identify technical debt relevant to the requested change. Fix it only if required for correctness, maintainability, or task completion. Otherwise, note it briefly without expanding scope.
- Emphasize component reuse and consistency with existing UI, hook, and data handling patterns.

## Repository map
- `src/components/`: shared UI and CV-specific components
- `src/pages/`: route-level pages
- `src/data/`: source-of-truth content for CV, climbing, and photography
- `src/hooks/`: adapters/hooks for GitHub, climbing, and photography data
- `src/types/`: centralized data model types
- `e2e/`: Playwright end-to-end specs and helpers when the branch includes browser integration tests
- `public/assets/`: shipped images, certificates, media, and resume PDF
- `resume/`: LaTeX source for the downloadable resume PDF

## Change guidance by area

### CV / portfolio content
- Primary content lives in `src/data/cv.ts`.
- Treat `src/data/cv.ts` as the source of truth for the interactive `/cv` experience and routine CV content updates.
- It isn't necessary for the live `/cv` experience and the downloadable resume to be conceptually aligned unless the task explicitly involves the resume artifact or resume source.
- Do not modify files in `resume/`, which are read-only for agents by default unless the user explicitly requests resume-source updates.
- If the user explicitly requests a downloadable resume artifact update, replace `public/assets/daniel-henderson-resume.pdf` and verify any related metadata in `src/data/cv.ts`.
- If the user explicitly requests resume-source work, update the relevant files under `resume/` and keep any related metadata in `src/data/cv.ts` consistent when needed.

### GitHub-driven sections
- Dynamic CV highlights use GitHub API-backed hooks with fallback content.
- Preserve graceful degradation when GitHub API calls fail or are rate-limited.
- Prefer deterministic mocked validation over live GitHub API behavior when Playwright E2E helpers are available.
- Do not introduce authenticated backend infrastructure unless explicitly requested.

### Climbing data
- Do not edit climbing datasets in `src/data/climbs.ts` unless the task explicitly requests it.
- Preserve sorting and normalization assumptions used by `useClimbingData` and DataGrid views.

### Photography
- Do not edit gallery content in `src/data/photography.ts` unless the task explicitly requests it.
- Preserve slug generation assumptions used by `usePhotographyData` and route matching.

### Theme and UX state
- Theme configuration lives in `src/ThemeProvider.tsx`.
- Welcome audio behavior lives in `src/WelcomeAudioProvider.tsx`.
- Preserve localStorage-backed preferences unless migration is explicitly requested.
- Do not hardcode theme logic in components or routes; use the existing context and hooks.

## Scope control
- Do not perform unrelated refactors, formatting-only churn, mass renames, or dependency upgrades unless required by the task.
- Do not rename routes, exported types, or stable data model fields unless explicitly required.
- Prefer preserving existing component APIs where practical.
- Avoid mixing content changes, UI refactors, and infrastructure changes in one pass unless the task explicitly calls for it.

## UI validation
- Use the webdev MCP server when validating UI changes, route rendering, or screenshots.
- When the working branch includes Playwright E2E coverage, use it for repeatable route flows, navigation, mocked integration states, and browser regressions that benefit from deterministic automation.
- Treat webdev and Playwright as complementary: use webdev for visual/responsive inspection and screenshots, and Playwright for scripted end-to-end validation.
- Browser-based validation is required for changes that affect layout, interaction, navigation, responsive behavior, animations, conditional rendering, or asset rendering.
- If browser tooling is unavailable, run the narrowest available fallback validation (for example build plus targeted tests) and report browser validation as deferred.
- Validate the smallest set of affected routes first, then expand to additional consumers if a shared component or layout primitive changed.
- For layout-affecting edits, check at least one narrow/mobile viewport and one desktop viewport.
- Tear down the browser session after validation so no stale tabs or sessions remain open.

## Validation matrix
- Content-only change: verify the affected page renders and touched data modules still build.
- Page-level UI change: browser validation required on the changed route; when Playwright coverage exists for that route, run the narrowest relevant spec after `npm run build`.
- Shared component change: browser validation required on at least one primary consuming route and one additional consumer when reuse is clear; if those routes are covered by Playwright E2E, run the relevant route specs.
- Layout, interaction, navigation, responsive, animation, conditional-rendering, or asset-rendering change: browser-based validation required.
- Route, navigation, or not-found behavior change: validate direct navigation and `PUBLIC_URL` compatibility, and run the relevant Playwright route coverage when available.
- GitHub-backed CV or fallback-content change: validate `/cv` in the browser and run mocked Playwright coverage for GitHub success/failure states when available.
- Asset-path change: validate direct navigation and `PUBLIC_URL` compatibility.
- Resume artifact change: verify the updated PDF path and any related metadata references.

Typical checks:
- `npm run build`
- relevant tests, if the change affects tested behavior
- `npx playwright test e2e/<route>.spec.ts` for the narrowest relevant route flow when Playwright is present
- `npm run test:e2e` when changes span multiple covered routes or shared route behavior
- browser-based route or screenshot validation for UI-affecting changes

## Deployment-sensitive constraints
- Production output is generated in `build/`.
- Hosts must rewrite unknown paths to `index.html` for SPA routing.
- Static assets under `public/assets/` must ship with the deployment.
- Review any asset URL changes for `PUBLIC_URL` compatibility.

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
