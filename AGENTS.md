# AGENTS.md

## Repository purpose
This repository contains the source for `danhenderson.dev`, a client-side React + TypeScript portfolio site. The main user-facing areas are:
- `/` for the home page and optional intro audio
- `/cv` for the interactive CV and GitHub-driven profile sections
- `/climbing` for climbing logs and to-do routes
- `/photography` and `/photography/:slug` for gallery browsing

Prefer changes that preserve the existing single-page-app architecture and static hosting model.

## Stack and runtime
- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Create React App (`react-scripts`)
- Node 20 in CI

## Core expectations
- Keep the app fully client-side unless the task explicitly calls for backend work.
- Preserve route behavior for the SPA. Direct links must continue to work with host-side rewrites to `index.html`.
- Preserve static asset compatibility with `PUBLIC_URL`.
- Prefer focused, minimal edits that fit the current component and data model patterns.
- Do not add new dependencies without a clear reason.
- When updating content, favor the existing TypeScript data modules over introducing a CMS or remote content source.
- Always identify and address technical debt.
- Emphasize component reuse and consistency in UI and data handling patterns.

Notes:
- The dev server defaults to port `3001`.
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
- Keep the live `/cv` experience and the downloadable PDF conceptually aligned, but do not assume they must always match exactly.
- If you update the downloadable resume artifact, replace `public/assets/daniel-henderson-resume.pdf` and verify any related metadata in `src/data/cv.ts`.

### GitHub-driven sections
- Dynamic CV highlights use GitHub API-backed hooks with fallback content.
- Preserve graceful degradation when GitHub API calls fail or are rate-limited.
- Avoid changes that make the CV depend on authenticated backend infrastructure unless explicitly requested.

### Climbing data
- Do not edit climbing datasets in `src/data/climbs.ts`.
- Preserve sorting/normalization assumptions used by `useClimbingData` and the DataGrid views.

### Photography
- Do not edit gallery content in `src/data/photography.ts`.
- Preserve slug generation assumptions used by `usePhotographyData` and route matching.

### Theme and UX state
- Theme configuration lives in `src/ThemeProvider.tsx`.
- Welcome audio behavior lives in `src/WelcomeAudioProvider.tsx`.
- Preserve localStorage-backed preferences unless the task explicitly asks to migrate them.
- Avoid hardcoding theme in components or routes. Use the context and hooks provided.

## Deployment-sensitive constraints
- Production output is generated in `build/`.
- Hosts must rewrite unknown paths to `index.html` for SPA routing.
- Static assets under `public/assets/` must ship with the deployment.
- Any change touching asset URLs should be reviewed for `PUBLIC_URL` compatibility.

## When proposing changes
Include:
- what changed
- which routes or data modules were affected
- what validation was run
- any deployment follow-up required (for example SPA rewrites, assets, or `PUBLIC_URL` concerns)

For any meaningful code change, implement the narrowest set of tests relevant to validate functionality.
