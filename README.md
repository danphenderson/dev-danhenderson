# danhenderson.dev source (`dev-danhenderson`)

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
- `react-github-calendar`
- Create React App (`react-scripts`)
- Node 20.x in CI

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
├── src/types/           # Shared TypeScript models
├── src/utils/           # Asset/date helpers and similar utilities
└── README.md
```

### Common maintenance tasks

- Update CV copy, certificates, code examples, or GitHub fallback content in `src/data/cv.ts`.
- Replace the downloadable resume PDF at `public/assets/daniel-henderson-resume.pdf` and keep related metadata aligned in `src/data/cv.ts`.
- Update theme tokens and component overrides in `src/ThemeProvider.tsx`.
- Update welcome-audio behavior or track configuration in `src/WelcomeAudioProvider.tsx`.
- When changing climbing or photography data, keep `useClimbingData` sorting assumptions and photography slug behavior intact.

## Deployment Notes

- Production output is generated in `build/`.
- The host must rewrite unknown routes to `index.html` so direct links like `/cv` and `/photography/:slug` work.
- Set `PUBLIC_URL` when deploying under a subpath so generated asset URLs resolve correctly.
- Ship `public/assets/` with the deployment.
- The CV fetches public GitHub data at runtime; if requests fail or are rate-limited, the UI falls back to static content from `src/data/cv.ts`.

## Validation

README claims in this repo should stay aligned with `package.json`, `src/App.tsx`, `src/data/`, `src/ThemeProvider.tsx`, and `src/WelcomeAudioProvider.tsx`.

Use these checks after meaningful changes:

```bash
npm run build
CI=true npm test -- --watch=false --passWithNoTests
```
