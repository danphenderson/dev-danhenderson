# danhenderson.dev

[![Build](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/build.yml)
[![Codecov](https://codecov.io/github/danphenderson/dev-danhenderson/branch/main/graph/badge.svg)](https://app.codecov.io/github/danphenderson/dev-danhenderson?branch=main)
[![CodeQL](https://github.com/danphenderson/dev-danhenderson/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/danphenderson/dev-danhenderson/actions/workflows/codeql.yml)
[![Docs](https://github.com/danphenderson/dev-danhenderson/actions/workflows/deploy-docs.yml/badge.svg)](https://danphenderson.github.io/dev-danhenderson/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.19.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/danphenderson/dev-danhenderson/blob/main/LICENSE)

Source code for [danhenderson.dev](https://danhenderson.dev), a React + TypeScript portfolio site with an interactive CV (& CV story mode), climbing log, photography galleries, and a public editorial blog.

## Sections

| Route                                   | What it contains                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                                     | Identity, portfolio links, interactive IDE, and optional appearance/audio controls       |
| `/cv`                                   | Interactive CV, downloadable resume, and GitHub-backed highlights with bundled fallbacks |
| `/blog` and `/blog/:slug`               | Editorial blog index and post detail pages                                               |
| `/climbing`                             | Climbing ticks and wish-list views                                                       |
| `/photography` and `/photography/:slug` | Photography collection index and album pages                                             |

## Highlights

- Fully client-side single-page app built for static hosting.
- Portfolio content is authored in local TypeScript data modules.
- GitHub-powered CV sections degrade gracefully to bundled content when live API data is unavailable. Contribution stars use live values when available, show an em dash for unknown counts, and sort unknowns after known counts.
- Shared motion, theming, and reusable UI primitives power the different sections of the site.
- Home identity, CV/project links, and the IDE are available immediately; expansion is manual. “Customize appearance & audio” opens a nonmodal panel that closes after five idle seconds and stays open during hover or focus. Header settings remain available, and audio requires explicit play. Failed audio-script loads can be retried from either control.
- CV and Climbing retain scroll reveals and also provide keyboard-operable reveal buttons. Resume and contact links are visible in the CV header.
- Photography uses generated responsive WebP display files; original photographs remain available for download.

## Runtime Environment

- `src/constants/runtimeEnvironment.ts` resolves the app runtime environment from `REACT_APP_RUNTIME_ENV` or `NODE_ENV`.
- Override the resolved runtime at build time with `REACT_APP_RUNTIME_ENV=development|test|production` when a workflow needs a non-default bundle.
- The resolved runtime is used for environment-sensitive client behavior and Playwright test-build parity.

## Build Variants

- `npm run build` creates the production bundle.
- `npm run build:e2e` creates the test-runtime bundle used for Playwright Chromium coverage and test-runtime validation.
- Both build variants route through `scripts/buildWithMetadata.js`, use Vite for bundling, and stamp git SHA, build time, and package version into the bundle so the footer scorecard reflects the built artifact instead of runtime placeholders.

## E2E Workflows

- `npm run test:e2e` runs the full local Playwright suite by building the test-runtime bundle for `chromium` first and then rebuilding the production bundle for `smoke`.
- `npm run build:e2e && npm run test:e2e:chromium` is the targeted path for Chromium browser coverage.
- `npm run build && npm run test:e2e:smoke` is the targeted path for production smoke coverage.

## Coverage

[![Codecov](https://codecov.io/github/danpherson/dev-danhenderson/branch/main/graph/badge.svg)](https://app.codecov.io/github/danpherson/dev-danhenderson?branch=main)

- Default-branch coverage is published to Codecov from the Jest coverage run in `.github/workflows/codecov.yml`.
- The uploaded report comes from `CI=true npm test -- --watchAll=false --passWithNoTests --coverage`, so it reflects the unit and component test suite rather than the Playwright `e2e` and `smoke` jobs.
- Browse line, patch, and commit-level coverage details in the [Codecov project dashboard](https://app.codecov.io/github/danpherson/dev-danhenderson?branch=main).

## Stack

- React 19
- TypeScript
- React Router v7
- MUI + Emotion
- MUI Table
- Vite for local development and production builds

## Display images and performance checks

Run `npm run media:generate` after adding or replacing source images under `public/assets/photography/`, `public/assets/climbing/`, or `public/assets/home.jpg`. The development-only Sharp transformer auto-orients images, strips metadata, avoids upscaling, and writes WebP variants with maximum edges of 480, 960, 1600, and 2400 pixels. Quality starts at 80 and is reduced only to meet the per-file budgets: 250 KB through 960 px, 500 KB through 1600 px, and 1 MB through 2400 px.

Commit `public/assets/display/` and `src/generated/displayImages.json` together. `npm run media:check` detects stale sources, missing derivatives, and budget violations. The manifest is generated; gallery content and original downloads remain in their existing modules. `getDisplayImage()` handles responsive display URLs, including `PUBLIC_URL` subpaths.

The service worker keeps at most 48 display images (each at most 1 MB) and 128 other runtime assets, plus the app shell. It does not cache original images or image query variants. Cache-write failures preserve successful network responses.

After `npm run build`, run `npm run check:bundle`. It totals the entry's entire static import graph, with limits of 950 KB raw and 300 KB gzip; dynamic route chunks are reported separately by Vite. These are transfer-size checks, not a production performance score. Build CI runs lint, typecheck, media checks, and this bundle budget.

## Tooling Notes

- Playwright launches Chromium with `chromiumSandbox: true`; keep the browser sandbox enabled.
- The main app now uses Vite for `npm start`, `npm run build`, and `npm run build:e2e`.
- The main app toolchain baseline is Node 20.19 or newer and TypeScript 5.6.x.
- Jest configuration is owned by `jest.config.cjs`, ESLint configuration is owned by `eslint.config.cjs`, and `npm run typecheck` uses `tsconfig.typecheck.json`.

## Contributing

Setup, testing, project structure, and contribution guidelines live in [CONTRIBUTING.md](CONTRIBUTING.md).

Architecture, design system, motion, theme, and engineering docs live in [docs/](docs/README.md).

To browse them as a rendered site locally:

```bash
cd docs-site && npm install && npm start
```

See [docs-site/README.md](docs-site/README.md) for build, deploy, and authoring details.

## License

[MIT](LICENSE)
