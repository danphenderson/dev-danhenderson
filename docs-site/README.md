# Documentation Site

Docusaurus-powered static documentation site for [danhenderson.dev](https://danhenderson.dev).

The root `docs/` directory is the **source of truth** for all authored documentation content. This directory (`docs-site/`) contains only the Docusaurus presentation layer — it reads markdown directly from `../docs` at build time.

## Quick start

```bash
cd docs-site
npm install
npm start          # dev server at http://localhost:3000
```

## Commands

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm start`     | Start a local dev server with hot reload |
| `npm run build` | Build the static site into `build/`      |
| `npm run serve` | Serve the production build locally       |
| `npm run clear` | Clear Docusaurus caches                  |

## Architecture

```
docs/                   ← canonical authored markdown (root of repo)
docs-site/              ← Docusaurus app (this directory)
  docusaurus.config.ts  ← site config, consumes ../docs
  sidebars.ts           ← explicit sidebar structure
  src/css/custom.css    ← theme overrides
  build/                ← generated static output (git-ignored)
```

The key configuration in `docusaurus.config.ts`:

```ts
docs: {
  path: '../docs',       // read content from root docs/
  routeBasePath: '/',    // docs-first site, no separate home
}
```

## Features

- **Mermaid diagrams** render natively via `@docusaurus/theme-mermaid`
- **Dark mode** enabled by default, respects system preference
- **Edit links** point to the canonical `docs/` directory on GitHub
- **Git metadata** (last updated time/author) shown on each page
- **Explicit sidebar** with intentional category grouping

## Deployment

The site builds to `docs-site/build/` as a fully static directory ready for any static host.

### GitHub Pages

1. In repo Settings → Pages, set **Source** to **GitHub Actions** — that's it.
   - Leave the **Custom domain** field blank unless you have a real domain.
   - The site will be served at `https://danphenderson.github.io/dev-danhenderson/`.
2. The workflow at `.github/workflows/deploy-docs.yml` handles the build and deploy automatically on every `main` push that touches `docs/**` or `docs-site/**`.

> **Note:** `baseUrl` in `docusaurus.config.ts` is already set to `/dev-danhenderson/` for this project page. Do not put that value in the GitHub Pages Custom domain field — it expects an actual hostname like `docs.danhenderson.dev`.

### Custom domain

1. Set `url` to your domain and `baseUrl` to `/`
2. Add a `CNAME` file to `docs-site/static/` with the domain name
3. Configure DNS per GitHub Pages docs

## Content authoring

All documentation is written in the root `docs/` directory using standard Markdown. Docusaurus renders it automatically.

- Mermaid diagrams use standard fenced code blocks: ` ```mermaid `
- Relative links between docs work as expected
- Source-code links (`../src/…`) are preserved for raw-markdown readers but won't resolve in the rendered site
