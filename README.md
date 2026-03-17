# [danhenderson.dev](https://www.danhenderson.dev)

[![Tests](https://github.com/danphenderson/dev-danhenderson/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/tests.yml)
[![Build](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/danphenderson/dev-danhenderson/graph/badge.svg)](https://codecov.io/gh/danphenderson/dev-danhenderson)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/danphenderson/dev-danhenderson/blob/main/LICENSE)
[![Live Site](https://img.shields.io/website?url=https%3A%2F%2Fwww.danhenderson.dev&label=danhenderson.dev)](https://www.danhenderson.dev)

Source for [danhenderson.dev](https://www.danhenderson.dev), a client-side React + TypeScript portfolio site for the home page, CV, climbing log, and photography galleries. The app stays fully static-hostable: content lives in local TypeScript modules, routing stays in the browser, and the CV enhances itself with public GitHub data when it is available.

## Overview

This repository powers four main areas:

- `/` for the home page and optional welcome audio
- `/cv` for the interactive CV, downloadable resume link, and GitHub-backed highlights
- `/climbing` for climbing ticks and to-do routes
- `/photography` for gallery browsing and album detail pages

The site is a React Router single-page app. Keep unknown-route rewrites, `PUBLIC_URL` compatibility, and shipped static assets intact when making changes.

## Project Signals

- **CI**: pull requests are expected to keep both GitHub Actions workflows green:
  - `tests.yml` runs `npm ci` and `CI=true npm test -- --watch=false --passWithNoTests --coverage`
  - `build.yml` runs `npm ci` and `npm run build`
- **Coverage**: coverage is collected from the Jest run in `tests.yml` and uploaded as a GitHub Actions artifact named `coverage-report-<sha>`. There is no separate coverage SaaS configuration required for contributors right now.
- **Deployment**: this repo produces a static `build/` output. Deployments must ship `public/assets/`, preserve SPA rewrites to `index.html`, and set `PUBLIC_URL` correctly when serving from a subpath.

## Routes

| Route                | Page                  | Purpose                                                                                    |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `/`                  | `Home`                | Intro page with optional welcome audio prompt                                              |
| `/cv`                | `CV`                  | Resume-style experience, education, certificates, tools, code samples, and GitHub sections |
| `/climbing`          | `Climbing`            | Tick list and route wish list in MUI X DataGrid tables                                     |
| `/photography`       | `Photography`         | Photography collection index                                                               |
| `/photography/:slug` | `PhotographyCategory` | Album view for a selected collection                                                       |
| `*`                  | `NotFound`            | Fallback page                                                                              |

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

## Copilot instructions

- Repository-wide Copilot custom instructions live in `.github/copilot-instructions.md`.
- Path-specific Copilot custom instructions live in `.github/instructions/*.instructions.md`.
- Agent-specific guidance remains in the root `AGENTS.md` and the nested `src/**/AGENTS.md` files.

## Component Hierarchy

- `src/index.tsx` bootstraps the app and wraps it with `ThemeProvider` and `WelcomeAudioProvider`.
- `src/App.tsx` owns `BrowserRouter`, the shared `Header` / `Footer`, and route registration.
- Route pages compose shared layout primitives such as `BackgroundPaper`, `PageFrame`, and `SectionCard`.
- `/cv` is composed from reusable section components such as `CVAboutSection`, `CVExperienceSection`, `CVEducationSection`, `CVVolunteeringSection`, `CVGitHubSection`, `CVCertificatesSection`, `CVStackToolsSection`, and `CVCodingSection`, with layout orchestration in `src/pages/cvPageLayout.ts`.

## Animation Behavior

Animation behavior is intentionally centralized for the CV route instead of being hardcoded in individual feature components.

- `src/styles/springEasing.ts`
  - single source of truth for the spring-physics landing easing curve used across all entry and hover animations
  - exports `SPRING_EASING_CSS` (CSS `cubic-bezier()`) for MUI transition props and CSS `transition` shorthand
  - exports `SPRING_EASING_MOTION` (numeric tuple) for the Motion library's `ease` option
- `src/components/AnimatedContentCard.tsx`
  - shared wrapper for card-style entry animation
  - uses `IntersectionObserver` to trigger near viewport entry
  - applies a literal `delayMs` before a short `Zoom` transition
- `src/components/AnimatedContentList.tsx`
  - shared staggered list wrapper for repeatable CV content such as experience, education, volunteering, certificates, coding examples, and GitHub items
  - supports both stacked and wrapped layouts while keeping delay math out of feature components
  - supports reusable item surface modes (`card`, `panel`, `plain`) so section components avoid repeated card/panel styling logic
- `src/components/AnimatedZoomList.tsx`
  - shared staggered `Zoom` list for accordion chip reveals
  - used by the CV tools accordion so chip timing is not defined inline
- `src/hooks/useHomeWelcomeSequence.ts`
  - coordinates the home-page intro so the hero shell and title stay hidden until the welcome dialog and follow-up hints have been dismissed
- `src/components/HeroMotionPath.tsx`
  - Motion-powered wrapper that drives the `/home` hero card circular entrance
  - staged sequence: hold at viewport centre while the nested Zoom plays (~280 ms), then travel along a larger counter-clockwise arc to the card's resting position (~3.3 s)
  - uses transform-based keyframes (x / y offsets relative to the element's natural position) so the element returns to its normal flex layout at (0, 0)
  - fires `onComplete` when the travel finishes; Home.tsx uses this to start the typewriter
- `src/styles/componentStyles.ts`
  - source of truth for shared motion tokens and delay helpers used by CV animation wrappers and sections
  - current motion tokens are:
    - `itemOffsetMs = 120`
    - `itemStaggerMs = 120`
    - `sectionStaggerMs = 120`
    - `githubSubsectionStaggerMs = 120`
    - `accordionChipStaggerMs = 120`
  - exposes helpers such as `getSectionDelayMs(...)` and `getItemDelayMs(...)` so feature components avoid hardcoding delay math

Current `/cv` sequencing rules:

- Section cards stagger from shared section timing.
- Repeatable inner item groups wait for the same additional shared item offset before their own stagger starts.
- GitHub activity, contributions, and project chips follow the same shared item-offset rule as experience and volunteering.
- Shared ambient and entrance motion remains enabled across all appearance presets.

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

| Script                    | Command                                    | Purpose                                         |
| ------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `npm start`               | `PORT=${PORT:-3001} react-scripts start`   | Start the local dev server                      |
| `npm run build`           | `react-scripts build`                      | Create the production build in `build/`         |
| `npm test`                | `react-scripts test --roots test/unit src` | Start the Jest runner                           |
| `npm run eject`           | `react-scripts eject`                      | Eject CRA configuration                         |
| `npm run test:e2e`        | `playwright test`                          | Run Playwright end-to-end tests (headless)      |
| `npm run test:e2e:headed` | `playwright test --headed`                 | Run E2E tests in a visible browser              |
| `npm run test:e2e:ui`     | `playwright test --ui`                     | Open the Playwright interactive UI runner       |
| `npm run serve:e2e`       | `serve -s build -l 3100`                   | Serve the production build locally on port 3100 |

### CI workflows

GitHub Actions workflows live in `.github/workflows/`:

- `tests.yml`
  - installs dependencies with `npm ci`
  - runs `CI=true npm test -- --watch=false --passWithNoTests --coverage`
  - uploads the generated `coverage/` directory as a `coverage-report-<sha>` artifact for review in GitHub Actions
- `build.yml`
  - installs dependencies with `npm ci`
  - runs `npm run build`
  - uploads the production `build/` directory as a `build-output-<sha>` artifact

### Coverage reporting for contributors

If you need a local coverage report that matches CI, run:

```bash
CI=true npm test -- --watch=false --coverage
```

This writes the report to `coverage/`, which is already git-ignored. No additional token, secret, or third-party uploader setup is currently required for contributor pull requests because GitHub Actions handles artifact upload automatically.

### End-to-end testing

[Playwright](https://playwright.dev/) provides browser-level E2E coverage that complements the Jest unit/integration suite. Tests live in `test/e2e/` and run against a production build served on port `3100`.

#### Prerequisites

Install the Chromium browser binary that Playwright requires (one-time setup):

```bash
npx playwright install chromium
```

#### Running E2E tests

Build the app first, then run the test suite:

```bash
npm run build
npm run test:e2e
```

Playwright automatically starts a local server (`serve -s build -l 3100`) before running the tests and shuts it down afterwards. Outside CI, it reuses an already-running server on that port so you can keep `npm run serve:e2e` running in a separate terminal for faster iteration.

#### Additional modes

```bash
npm run test:e2e:headed    # Watch tests run in a visible browser window
npm run test:e2e:ui        # Open the Playwright interactive UI runner
```

#### Test structure

All tests are centralized under `test/`:

```text
test/
├── unit/                          # Jest unit and integration tests
│   ├── App.test.tsx
│   ├── ThemeProvider.test.tsx
│   ├── WelcomeAudioProvider.test.tsx
│   ├── components/
│   │   ├── cv/                    # CV section component tests
│   │   ├── header/                # Header component tests
│   │   ├── layout/                # Layout primitive tests
│   │   └── text/                  # Text primitive tests
│   ├── hooks/                     # Data adapter hook tests
│   ├── pages/                     # Route-level page tests
│   ├── styles/                    # Style builder tests
│   └── utils/                     # Utility tests
└── e2e/                           # Playwright end-to-end tests
    ├── helpers/
    │   └── github.ts              # Reusable GitHub API mock handlers (success + failure)
    ├── home.spec.ts               # Home hero render and welcome audio prompt dismissal
    ├── cv.github.spec.ts          # CV render, mocked GitHub API success, and graceful fallback
    ├── climbing.spec.ts           # Climbing route tables render
    ├── photography.spec.ts        # Photography category cards and direct slug navigation
    └── not-found.spec.ts          # 404 page for unknown routes
```

#### Configuration highlights

- **Browser**: Chromium only (initial rollout).
- **CI behavior**: Single worker, retries twice, uses the `github` reporter, and traces/screenshots/video are captured on first retry or failure.
- **Artifacts**: Test output goes to `e2e-results/` and the HTML report to `playwright-report/`; both are git-ignored.

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
  - global light/dark mode and appearance preset state
  - persisted keys: `danhenderson-theme`, `danhenderson-appearance`
- `src/theme/appAppearance.ts`
  - application appearance presets, typography directions, and surface/motion treatment tokens
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
├── .github/workflows/   # CI, E2E, and security automation
├── public/assets/       # Shipped images, certificates, media, and resume PDF
├── resume/              # LaTeX resume source
├── src/components/      # Shared UI and CV-specific components
├── src/constants/       # Route registry, command palette actions, recovery context
├── src/data/            # Source-of-truth content modules
├── src/hooks/           # Data adapters for GitHub, climbing, photography, and UI sequencing
├── src/motion/          # Animation tokens, Motion Variants, and animated primitives
├── src/pages/           # Route-level pages
├── src/styles/          # Spring easing constants, Emotion keyframes, and theme-conditioned style maps
├── src/theme/           # MUI theme assembly and appearance-preset definitions
├── src/types/           # Canonical shared TypeScript type definitions
├── src/utils/           # Pure helpers: asset paths, date formatting, DOM, search
├── test/unit/           # Jest unit and integration tests (mirrors src/ structure)
├── test/e2e/            # Playwright end-to-end tests
└── README.md
```

### Customization guide

- Update CV copy, certificates, code examples, and GitHub fallback content in `src/data/cv.ts`.
- Replace the downloadable resume PDF at `public/assets/daniel-henderson-resume.pdf` and keep related metadata in `src/data/cv.ts` aligned with it.
- Update global appearance presets in `src/theme/appAppearance.ts`, theme assembly in `src/theme/createAppTheme.ts`, and persisted theme state in `src/ThemeProvider.tsx`.
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
npm run test:e2e
```
