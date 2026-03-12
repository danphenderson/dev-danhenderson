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

## Core expectations
- Keep the app fully client-side unless backend work is explicitly requested.
- Preserve SPA routing behavior. Direct links must continue to work via host-side rewrites to `index.html`.
- Preserve static asset compatibility with `PUBLIC_URL`.
- Prefer focused, minimal edits that fit the current component and data model patterns.
- Do not add new dependencies unless the task cannot be completed cleanly with the existing stack. If a new dependency is necessary, explain why.
- When updating content, prefer the existing TypeScript data modules over introducing a CMS or remote content source.
- Keep `README.md` aligned with implementation changes in the same PR to avoid documentation drift.
- Identify technical debt relevant to the requested change. Only fix it if it is required for correctness, maintainability, or task completion. Otherwise, note it briefly without expanding scope.
- Emphasize component reuse and consistency with existing UI and data handling patterns.

## Repository notes
- Dev server defaults to port `3001`.
- Playwright MCP server `webdev` available when needed
- Override with `PORT=3000 npm start` when needed.

## Repository map
- `src/components/`: shared UI and CV-specific components
- `src/pages/`: route-level pages
- `src/data/`: source-of-truth content for CV, climbing, and photography
- `src/hooks/`: adapters/hooks for GitHub, climbing, and photography data
- `src/types/`: centralized data model types
- `public/assets/`: shipped images, certificates, media, and resume PDF
- `resume/`: LaTeX source for the downloadable resume PDF

## Change guidance by area

### CV / portfolio content
- Primary content lives in `src/data/cv.ts`.
- Keep the live `/cv` experience and the downloadable PDF conceptually aligned, but they do not need to match exactly.
- If you update the downloadable resume artifact, replace `public/assets/daniel-henderson-resume.pdf` and verify any related metadata in `src/data/cv.ts`.

### GitHub-driven sections
- Dynamic CV highlights use GitHub API-backed hooks with fallback content.
- Preserve graceful degradation when GitHub API calls fail or are rate-limited.
- Do not introduce authenticated backend infrastructure unless explicitly requested.

### Climbing data
- Do not edit climbing datasets in `src/data/climbs.ts`.
- Preserve sorting and normalization assumptions used by `useClimbingData` and DataGrid views.

### Photography
- Do not edit gallery content in `src/data/photography.ts`.
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

## UI validation
- Use the webdev MCP server when validating UI changes, route rendering, or screenshots.
- Browser-based validation is expected for changes that affect layout, interaction, navigation, responsive behavior, or asset rendering.
- Tear down the browser session after validation so no stale tabs or sessions remain open.

## Validation
Typical checks:
- `npm run build`
- relevant tests, if the change affects tested behavior
- browser-based route or screenshot validation for UI-affecting changes

Do not claim validation was performed unless you actually ran it.

## Deployment-sensitive constraints
- Production output is generated in `build/`.
- Hosts must rewrite unknown paths to `index.html` for SPA routing.
- Static assets under `public/assets/` must ship with the deployment.
- Review any asset URL changes for `PUBLIC_URL` compatibility.

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
