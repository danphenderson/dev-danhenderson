# [danhenderson.dev](https://www.danhenderson.dev)

[![Tests](https://github.com/danphenderson/dev-danhenderson/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/tests.yml)
[![Build](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml)
[![Node 20.x](https://img.shields.io/badge/node-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

Source for [danhenderson.dev](https://www.danhenderson.dev), a client-side portfolio site built with React, TypeScript, and MUI. The app stays fully static-hostable: content is stored in local TypeScript modules, routes are handled in the browser, and the CV enhances itself with public GitHub data when it is available.

## Overview

This repository powers four main areas:

- `/` for the home page and optional welcome audio
- `/cv` for the interactive CV, downloadable resume link, and GitHub-backed highlights
- `/climbing` for climbing ticks and to-do routes
- `/photography` for gallery browsing and album detail pages

The site is a React Router single-page app. Keep unknown-route rewrites, `PUBLIC_URL` compatibility, and shipped static assets intact when making changes.

## Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `Home` | Intro page with optional welcome audio prompt |
| `/cv` | `CV` | Resume-style experience, education, certificates, tools, code samples, and GitHub sections |
| `/climbing` | `Climbing` | Tick list and route wish list in MUI X DataGrid tables |
| `/photography` | `Photography` | Photography collection index |
| `/photography/:slug` | `PhotographyCategory` | Album view for a selected collection |
| `*` | `NotFound` | Fallback page |

## Stack

- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- `@fontsource/source-sans-3`
- `@fontsource/space-grotesk`
- `react-github-calendar`
- Create React App (`react-scripts`)
- Node 20.x in CI

## Component Hierarchy

- `src/index.tsx` bootstraps the app and wraps it with `ThemeProvider` and `WelcomeAudioProvider`.
- `src/App.tsx` owns `BrowserRouter`, the shared `Header` / `Footer`, and route registration.
- Route pages compose shared layout primitives such as `BackgroundPaper`, `PageFrame`, and `SectionCard`.
- `/cv` is composed from reusable section components such as `CVAboutSection`, `CVExperienceSection`, `CVEducationSection`, `CVVolunteeringSection`, `CVGitHubSection`, `CVCertificatesSection`, `CVStackToolsSection`, and `CVCodingSection`, with layout orchestration in `src/pages/cvPageLayout.ts`.

## Animation Behavior

Animation behavior is intentionally centralized for the CV route instead of being hardcoded in individual feature components.

- `src/components/AnimatedContentCard.tsx`
  - shared wrapper for card-style entry animation
  - uses `IntersectionObserver` to trigger near viewport entry
  - applies a literal `delayMs` before a short `Zoom` transition
  - skips observer setup, timers, and transition effects when `prefers-reduced-motion` is enabled
- `src/components/AnimatedContentList.tsx`
  - shared staggered list wrapper for repeatable CV content such as experience, education, volunteering, certificates, coding examples, and GitHub items
  - supports both stacked and wrapped layouts while keeping delay math out of feature components
  - supports reusable item surface modes (`card`, `panel`, `plain`) so section components avoid repeated card/panel styling logic
- `src/components/AnimatedZoomList.tsx`
  - shared staggered `Zoom` list for accordion chip reveals
  - used by the CV tools accordion so chip timing is not defined inline
- `src/hooks/useHomeWelcomeSequence.ts`
  - coordinates the home-page intro so the hero shell and title stay hidden until the welcome dialog and follow-up hints have been dismissed
- `src/styles/componentStyles.ts`
  - source of truth for shared motion tokens and delay helpers used by CV animation wrappers and sections
  - current motion tokens are:
    - `itemOffsetMs = 120`
    - `itemStaggerMs = 120`
    - `sectionStaggerMs = 120`
    - `githubSubsectionStaggerMs = 120`
    - `accordionChipStaggerMs = 120`
  - exposes helpers such as `getSectionDelayMs(...)`, `getItemDelayMs(...)`, and `getAnimatedZoomItemSx(...)` so feature components avoid hardcoding delay math

Current `/cv` sequencing rules:

- Section cards stagger from shared section timing.
- Repeatable inner item groups wait for the same additional shared item offset before their own stagger starts.
- GitHub activity, contributions, and project chips follow the same shared item-offset rule as experience and volunteering.
- Reduced-motion users should receive the same content without stagger, delayed reveal, or decorative pulse behavior.

When changing CV motion:

- prefer updating `src/styles/componentStyles.ts` tokens/helpers first
- reuse `AnimatedContentCard`, `AnimatedContentList`, and `AnimatedZoomList`
- avoid reintroducing inline transition-delay styles or per-component timing constants unless there is a route-specific reason

## Data Model and Content Sources

### Local data modules
- `src/data/cv.ts`
  - Profile/contact info
  - Experience entries
  - Education data
  - Certificates
  - Stack/tools list
  - GitHub fallback activity, projects, and contributions
- `src/data/climbs.ts`
  - `ticks`: sent routes with dates
  - `todos`: project/wishlist routes
  - Current dataset size: 566 ticks and 352 todos
- `src/data/photography.ts`
  - Album category cards + per-album images
  - Current dataset size: 4 categories, 43 photos

### Runtime API data
`src/hooks/useGithubProfile.ts` fetches from GitHub:
- User events: `GET /users/:username/events/public`
- User repos: `GET /users/:username/repos`
- Public PR contribution search: `GET /search/issues`
- Repo metadata enrichment: `GET /repos/:owner/:repo`

If API calls fail or are rate-limited, CV sections gracefully fall back to static content from `src/data/cv.ts`.

## Local Development

### Prerequisites

- Node.js 20.x
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm start
```

The development server defaults to port `3001`.

Use a different port when needed:

```bash
PORT=3000 npm start
```

### Available scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `npm start` | `PORT=${PORT:-3001} react-scripts start` | Start the local dev server |
| `npm run build` | `react-scripts build` | Create the production build in `build/` |
| `npm test` | `react-scripts test` | Start the Jest runner |
| `npm run eject` | `react-scripts eject` | Eject CRA configuration |

### CI workflows

GitHub Actions workflows live in `.github/workflows/`:

- `tests.yml` runs `CI=true npm test -- --watch=false --passWithNoTests --coverage`
- `build.yml` runs `npm run build`

### Known technical debt

- The app still depends on Create React App (`react-scripts`), which is no longer actively maintained.
- Current build/test output includes a `babel-preset-react-app` warning about `@babel/plugin-proposal-private-property-in-object` being transitive-only.
- React Router v6 future-flag warnings appear in tests (`v7_startTransition`, `v7_relativeSplatPath`); behavior is currently correct but migration planning is pending.

## Content Sources

### Primary maintainer entry points

- `src/data/cv.ts`
  - primary CV content
  - resume download metadata
  - fallback GitHub activity, projects, and contributions used when runtime requests fail
- `src/data/climbs.ts`
  - climbing ticks and to-do routes consumed by `useClimbingData`
  - keep route formatting compatible with the existing sorting and normalization logic
- `src/data/photography.ts`
  - photography collections, album images, and route slugs consumed by `usePhotographyData`
  - preserve slug stability so existing album URLs continue to resolve
- `src/ThemeProvider.tsx`
  - application palette, typography, and component theme overrides
  - persisted theme key: `danhenderson-theme`
- `src/WelcomeAudioProvider.tsx`
  - SoundCloud embed URL and welcome-audio behavior
  - persisted audio consent key: `danhenderson-welcome-audio-consent`
- `src/utils/assets.ts`
  - centralized `PUBLIC_URL`-aware asset path resolution via `resolvePublicAssetPath(...)`
  - used by shared layout wrappers such as `BackgroundPaper` to keep local and deployed asset paths consistent
- `resume/daniel-henderson-resume.tex`
  - LaTeX source for the downloadable PDF in `public/assets/daniel-henderson-resume.pdf`

### Repository layout

```text
.
├── .github/workflows/   # Build and test automation
├── public/assets/       # Shipped images, certificates, media, and resume PDF
├── resume/              # LaTeX resume source
├── src/components/      # Shared UI and CV-specific components
├── src/data/            # Source-of-truth content modules
├── src/hooks/           # Data adapters for GitHub, climbing, and photography
├── src/pages/           # Route-level pages
├── src/styles/          # Shared animation, layout, and component style tokens
├── src/types/           # Shared TypeScript models
├── src/utils/           # Asset/date helpers and similar utilities
└── README.md
```

### Customization guide

- Update CV copy, certificates, code examples, and GitHub fallback content in `src/data/cv.ts`.
- Replace the downloadable resume PDF at `public/assets/daniel-henderson-resume.pdf` and keep related metadata in `src/data/cv.ts` aligned with it.
- Update app theme tokens and MUI component overrides in `src/ThemeProvider.tsx`.
- Keep reusable page and CV styling centralized in `src/styles/appStyles.ts` and `src/styles/componentStyles.ts` rather than reintroducing component-local `sx` fragments.
- Update welcome-audio behavior or track configuration in `src/WelcomeAudioProvider.tsx`.
- Use `resolvePublicAssetPath(...)` from `src/utils/assets.ts` when adding new local asset paths to keep `PUBLIC_URL` behavior stable.
- When changing climbing or photography data, preserve `useClimbingData` sorting assumptions and photography slug stability.

## Deployment Notes

- Production output is generated in `build/`.
- The host must rewrite unknown routes to `index.html` so direct links like `/cv` and `/photography/:slug` work.
- Set `PUBLIC_URL` when deploying under a subpath so generated asset URLs resolve correctly.
- Route local asset URLs through `resolvePublicAssetPath(...)` (already used by `BackgroundPaper`) to avoid subpath regressions.
- Ship `public/assets/` with the deployment.
- The CV fetches public GitHub data at runtime; if requests fail or are rate-limited, the UI falls back to static content from `src/data/cv.ts`.

## Validation

README claims in this repo should stay aligned with `package.json`, `src/App.tsx`, `src/data/`, `src/ThemeProvider.tsx`, `src/WelcomeAudioProvider.tsx`, `src/utils/assets.ts`, and `src/styles/componentStyles.ts`.

Use these checks after meaningful changes:

```bash
npm run build
CI=true npm test -- --watch=false --passWithNoTests
```
