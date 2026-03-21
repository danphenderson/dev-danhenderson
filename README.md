# danhenderson.dev

Source for [danhenderson.dev](https://danhenderson.dev), a React + TypeScript portfolio site with an interactive CV, climbing log, photography galleries, and a feature-flagged blog available in development and test builds.

## Sections

| Route                                   | What it contains                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                                     | Home page with the welcome audio prompt                                                  |
| `/cv`                                   | Interactive CV, downloadable resume, and GitHub-backed highlights with bundled fallbacks |
| `/blog` and `/blog/:slug`               | Editorial blog index and post detail pages in development and test builds                |
| `/climbing`                             | Climbing ticks and wish-list views                                                       |
| `/photography` and `/photography/:slug` | Photography collection index and album pages                                             |

## Highlights

- Fully client-side single-page app built for static hosting.
- Portfolio content is authored in local TypeScript data modules.
- GitHub-powered CV sections degrade gracefully to bundled content when live API data is unavailable.
- Shared motion, theming, and reusable UI primitives power the different sections of the site.

## Feature Flags

- `src/constants/featureFlags.ts` is the central runtime-aware feature-flag registry.
- The `blog` flag is enabled in `development` and `test`, and disabled in `production`.
- Override the resolved runtime at build time with `REACT_APP_RUNTIME_ENV=development|test|production` when a workflow needs a non-default bundle.

## Build Variants

- `npm run build` creates the production bundle and disables production-hidden feature flags such as `blog`.
- `npm run build:e2e` creates the test-runtime bundle used for Playwright so gated routes remain available during browser coverage.
- Both build variants stamp git SHA, build time, and package version into the bundle so the footer scorecard reflects the built artifact instead of runtime placeholders.

## E2E Workflows

- `npm run test:e2e` runs the full local Playwright suite by building the test-runtime bundle for `chromium` first and then rebuilding the production bundle for `smoke`.
- `npm run build:e2e && npm run test:e2e:chromium` is the targeted path for gated route and blog-enabled browser coverage.
- `npm run build && npm run test:e2e:smoke` is the targeted path for production smoke coverage.

## Stack

- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Create React App (`react-scripts`)

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
