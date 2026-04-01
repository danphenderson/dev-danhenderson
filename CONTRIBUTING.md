# Contributing

Thanks for contributing to `danhenderson.dev`. This repository is a client-side React + TypeScript portfolio site, so the main constraints are preserving SPA routing, static-hosting compatibility, and the existing local TypeScript content sources.

## Prerequisites

- Node.js 20.19 or newer
- npm

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

The dev server defaults to port `3001`.

To use a different port:

```bash
PORT=3000 npm start
```

## Useful scripts

| Command                                | Purpose                                                      |
| -------------------------------------- | ------------------------------------------------------------ |
| `npm start`                            | Start the local dev server on port `3001` by default         |
| `npm run build`                        | Create the production build in `build/`                      |
| `CI=true npm test -- --watchAll=false` | Run the Jest suite in CI-style mode                          |
| `npm run test:e2e`                     | Run Playwright end-to-end tests                              |
| `npm run test:e2e:headed`              | Run Playwright in a visible browser                          |
| `npm run test:e2e:ui`                  | Open the Playwright UI runner                                |
| `npm run serve:e2e`                    | Serve the production build on port `3100` for local E2E work |

## Validation

Use the narrowest relevant validation for the change you made.

The canonical validation matrix, build variants, and repo-standard command shapes live in `docs/engineering/testing-strategy.md`. Repo-level guardrails and instruction discovery live in `AGENTS.md`.

Common starting points:

- `npm run build`
- `CI=true npm test -- --watchAll=false`
- `npm run build:e2e` then `npm run test:e2e` for feature-gated blog coverage or Playwright route validation

For layout, navigation, interaction, animation, or responsive changes, validate in a browser on at least one desktop viewport and one mobile viewport.

## CI

GitHub Actions currently runs three workflows:

- `Codecov`: runs `CI=true npm test -- --watchAll=false --passWithNoTests --coverage`, uploads the `coverage/` artifact, and reports to Codecov when configured.
- `Build`: runs `npm run build`, uploads the production `build/` artifact, then runs Playwright against that build artifact.
- `CodeQL`: analyzes the JavaScript/TypeScript codebase on pushes, pull requests, and the weekly schedule.

These workflows validate pushes to `main` and `v1`, plus pull requests targeting either branch.

Docs-only, `plans/`, `public/resume/`, `LICENSE`, and formatting-config-only changes do not trigger the `Codecov` or `Build` workflows.

## Project structure

- `src/pages/`: route-level pages
- `src/components/`: shared UI and feature components
- `src/data/`: source-of-truth content modules
- `src/hooks/`: data adapters and navigation helpers
- `src/theme/`, `src/styles/`, `src/motion/`: theming, styling, and motion systems
- `test/unit/`: Jest unit and component tests
- `test/e2e/`: Playwright end-to-end tests
- `public/assets/`: shipped media, photography, climbing, and published resume assets
- `public/resume/`: LaTeX source for the downloadable resume PDF

## Primary content entry points

- `src/data/cv.ts`: CV content, resume metadata, and GitHub fallback content
- `src/data/blog.ts`: blog posts
- `src/data/climbs.ts`: climbing ticks and to-dos
- `src/data/photography.ts`: photography collections and image metadata
- `public/assets/daniel-henderson-resume.pdf`: downloadable resume artifact
- `public/resume/`: resume source files when you intentionally need to update the PDF source

## GitHub-backed CV sections

The `/cv` route fetches public GitHub data in production and falls back to bundled data from `src/data/cv.ts` when requests fail or are rate-limited.

In development and tests, bundled GitHub data is used by default. Set `REACT_APP_ENABLE_GITHUB_API_IN_DEV=true` if you intentionally want live GitHub requests locally.

## Guardrails

- Keep the app fully client-side.
- Preserve direct-link routing behavior and `PUBLIC_URL` compatibility.
- Use existing TypeScript data modules as the primary content source.
- Keep changes focused; avoid unrelated refactors or dependency additions unless they are required.
- Update `README.md` when public-facing behavior changes.
- Preserve graceful fallbacks for GitHub-backed CV content.

## Pull requests

- Describe the user-facing change and the affected routes.
- Mention the validation you actually ran.
- Include screenshots or short recordings for UI changes when helpful.
- Update docs in the same change if setup, commands, architecture, or public behavior changed.

## Repository instructions

- General contributor guidance lives in `AGENTS.md`.
- Copilot-specific guidance lives in `.github/copilot-instructions.md`.
- Path-specific AI instructions live in `.github/instructions/` and defer to the scoped `AGENTS.md` files they summarize.
- `docs/README.md` contains the instruction map and links to the canonical engineering docs.
