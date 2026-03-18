# danhenderson.dev

Source for [danhenderson.dev](https://danhenderson.dev), a React + TypeScript portfolio site with an interactive CV, blog, climbing log, and photography galleries.

## Sections

| Route                                   | What it contains                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                                     | Home page with the welcome audio prompt                                                  |
| `/cv`                                   | Interactive CV, downloadable resume, and GitHub-backed highlights with bundled fallbacks |
| `/blog` and `/blog/:slug`               | Editorial blog index and post detail pages                                               |
| `/climbing`                             | Climbing ticks and wish-list views                                                       |
| `/photography` and `/photography/:slug` | Photography collection index and album pages                                             |

## Highlights

- Fully client-side single-page app built for static hosting.
- Portfolio content is authored in local TypeScript data modules.
- GitHub-powered CV sections degrade gracefully to bundled content when live API data is unavailable.
- Shared motion, theming, and reusable UI primitives power the different sections of the site.

## Stack

- React 18
- TypeScript
- React Router v6
- MUI + Emotion
- MUI X DataGrid
- Create React App (`react-scripts`)

## Contributing

Setup, testing, project structure, and contribution guidelines live in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
