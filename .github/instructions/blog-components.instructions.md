---
applyTo: 'src/components/blog/**/*.ts,src/components/blog/**/*.tsx'
---

These files implement the editorial blog UI for `/blog` and `/blog/:slug`. Preserve the existing blog data flow, editorial-exception styling, navigation patterns, and validation expectations.

- Keep blog content sourced from `src/data/blog.ts` via `useBlogData`; do not introduce remote loading or a CMS.
- Preserve the editorial exception: blog surfaces intentionally use custom display typography and article layout instead of the standard section-card defaults.
- Reuse the current motion, theme, typography, and content-card patterns rather than adding a parallel style system.
- Preserve React Router navigation and not-found recovery behavior for blog slugs.
- Preserve feature-gated blog behavior via `isFeatureEnabled('blog')`; the routes are enabled in development/test builds and hidden in production.
- Add or update focused tests when blog component behavior changes, and validate both blog routes when the UI is affected. Use `npm run build:e2e` before Playwright blog coverage so the gated routes are enabled in the E2E build.

For more detail, follow `src/components/blog/AGENTS.md`.
