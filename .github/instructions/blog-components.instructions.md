---
applyTo: 'src/components/blog/**/*.ts,src/components/blog/**/*.tsx'
---

These files implement the editorial blog UI for `/blog` and `/blog/:slug`. Preserve the existing blog data flow, navigation patterns, and validation expectations.

- Keep blog content sourced from `src/data/blog.ts` via `useBlogData`; do not introduce remote loading or a CMS.
- Reuse the current motion, theme, typography, and content-card patterns rather than adding a parallel style system.
- Preserve React Router navigation and not-found recovery behavior for blog slugs.
- Add or update focused tests when blog component behavior changes, and validate both blog routes when the UI is affected.

For more detail, follow `src/components/blog/AGENTS.md`.
