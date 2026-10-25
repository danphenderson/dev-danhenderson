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
- Home identity, CV/project links, and the IDE are available immediately; expansion is manual. “Customize appearance & audio” toggles a nonmodal panel (exposed with `aria-expanded`) that closes after five idle seconds and stays open during hover or focus; keyboard activation moves focus into the panel, which keeps it open. Header settings remain available, and audio requires explicit play. Failed audio-script loads can be retried from either control.
- CV and Climbing retain scroll reveals and also provide keyboard-operable reveal buttons. Resume and contact links are visible in the CV header.
- Photography uses generated responsive WebP display files; original photographs remain available for download. If a generated display file cannot be loaded, album covers, gallery tiles, the lightbox, and the page background fall back once to the original photograph instead of rendering blank.

## Runtime Environment

- `src/constants/runtimeEnvironment.ts` resolves the app runtime environment from `REACT_APP_RUNTIME_ENV` or `NODE_ENV`.
- Override the resolved runtime at build time with `REACT_APP_RUNTIME_ENV=development|test|production` when a workflow needs a non-default bundle.
- The resolved runtime is used for environment-sensitive client behavior and Playwright test-build parity.

## Build Variants

- `npm run build` creates the production bundle.
- `npm run build:e2e` creates the test-runtime bundle used for Playwright Chromium coverage and test-runtime validation.
- Both build variants route through `scripts/buildWithMetadata.js`, use Vite for bundling, and stamp git SHA, build time, and package version into the bundle so the footer scorecard reflects the built artifact instead of runtime placeholders. Each build also checks that CV documents and photography source/display assets contain the expected file signatures and exactly match the public source files.

## E2E Workflows

- `npm run test:e2e` runs the test-runtime Chromium suite, production smoke and mobile asset suites, and a temporary `/portfolio` deployment to verify `PUBLIC_URL`.
- `npm run build:e2e && npm run test:e2e:chromium` is the targeted path for Chromium browser coverage.
- `npm run build && npm run test:e2e:smoke` is the targeted path for production smoke coverage.
- `npm run build && npm run test:e2e:assets` checks native CV downloads/certificate links, PDF byte ranges, decoded photography images, and original-image recovery in desktop Chromium, mobile Chromium, and iPhone-configured WebKit.
- `npm run test:e2e:assets:subpath` builds and checks the same asset flows under `/portfolio`, removes its temporary deployment, and restores the normal build. Port 3100 must be free. Install both engines with `npx playwright install --with-deps chromium webkit`.

**Pending CI activation:** The mobile/subpath commands are available locally, but
the workflow update requires credentials authorized to modify GitHub Actions.
The exact update is preserved in `plans/cv-photography-workflow.patch`; a maintainer
can run `git apply --check plans/cv-photography-workflow.patch` followed by
`git apply plans/cv-photography-workflow.patch`, then commit and push the workflow
with authorized credentials. Existing CI still runs the build asset gate and
desktop smoke coverage.

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

The service worker keeps at most 48 display images (each at most 1 MB) and 128 other runtime assets, plus the app shell. It does not cache original images or image query variants. Cache writes finish in the background (the worker stays alive through `event.waitUntil`), so they never delay network responses, and write failures preserve successful responses.

The worker only applies HTML fallback to same-origin, in-scope application navigations. PDF/file navigations and byte-range requests go directly to the host; failed documents must not become successful HTML downloads. Non-image responses cannot enter or replace the display-image cache. The cache version changes when these rules change so older poisoned entries are discarded.

After `npm run build`, run `npm run check:bundle`. It totals the entry's entire static import graph, with limits of 950 KB raw and 300 KB gzip; dynamic route chunks are reported separately by Vite. These are transfer-size checks, not a production performance score. Build CI runs lint, typecheck, media checks, and this bundle budget.

## Asset hosting and release acceptance

Serve real static files before applying the SPA rewrite. In particular, do not rewrite
`/assets/**` (including `.pdf` and `.webp`) or `service-worker.js` to `index.html`.
Use `application/pdf` for PDFs, `image/webp` for display images, and the correct image
MIME for originals. Support PDF range requests with `206` and `Content-Range`.
Missing assets must retain a real error status. App routes such as `/cv` and
`/photography/landscape` must still resolve to the SPA shell.

Deploy the complete `build/` atomically, including both original photographs and
the generated display files. Do not deploy only the JavaScript/CSS bundles. A
blanket SPA rewrite can make certificate links render an application 404 and can
make desktop downloads appear successful while actually saving HTML. WebP rewrites
can also break mobile responsive-image candidates.

Run `npm run assets:check` to recheck an existing build. After deployment, run
`npm run assets:check -- --url https://danhenderson.dev` (include the base path for
a subpath deployment). This opt-in network audit downloads all referenced CV/media
files, checks status, MIME, signatures, byte-for-byte equality with this checkout,
and PDF range responses; original photographs can make this a large download.
Run it against a completed deployment from the matching revision, not during a build.

Automated WebKit coverage is not a physical iOS PDF-viewer test. Release acceptance
also includes opening both certificates, downloading the resume from both controls,
and scrolling the photography index/album on an iPhone in a fresh Safari session
and an existing service-worker-controlled session. Verify the PDF viewer/share-save
flow, normal image decoding, and returning to the site.

## Tooling Notes

- Playwright launches Chromium with `chromiumSandbox: true`; keep the browser sandbox enabled.
- Ubuntu 23.10+ (including GitHub's Ubuntu 24.04 runners) blocks the unprivileged user namespaces that Chromium's sandbox needs, so Playwright fails with "No usable sandbox!". CI runs `.github/actions/playwright-sandbox`, which grants that permission only to Playwright's Chromium through an AppArmor profile. On a local Ubuntu machine, run the same commands from that action.
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
