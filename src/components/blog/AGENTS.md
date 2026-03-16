# AGENTS.md — Blog Components

## Purpose

Documents conventions, data model, and validation requirements for the editorial blog feature (`/blog`, `/blog/:slug`).

## Component conventions

- All blog UI components live in `src/components/blog/`.
- Use existing motion, theme, and typography primitives — do not introduce parallel animation or style systems.
- Prefer composition over inheritance; keep components focused and reusable.
- Use `MotionSection`, `StaggerChildren`, and `MotionCard` for scroll-triggered and interactive motion.
- Use `contentCardSx` for glassmorphism surface treatments.
- All navigation uses React Router `Link` or `useNavigate`.

## Data model

- Source of truth: `src/data/blog.ts` (array of `BlogPost` objects).
- Content blocks: `BlogContentBlock[]` (discriminated union for paragraphs, headings, code, blockquote, callout, image, list, divider).
- Use `useBlogData` hook for all data access, filtering, and navigation helpers.
- Do not fetch blog content from remote APIs or CMS.

## Validation

- All new components must have unit tests in `test/unit/components/blog/` or relevant page/hook test.
- Blog index and post pages must be covered by unit and E2E tests.
- Run `npm run build` and `npm test -- --watch=false` before PR.
- Validate `/blog` and `/blog/:slug` in browser at multiple viewports and theme presets.

## Recovery and fallback

- Not-found blog slugs must render `RouteRecoveryPanel` with contextual suggestions.
- Tag filtering and navigation must degrade gracefully if no posts match.

## Content updates

- Add new posts by editing `src/data/blog.ts` only.
- Use the `BlogContentBlock` union for all content — do not use MDX or HTML.

## Contact

- For architecture or design questions, consult the root `AGENTS.md` or contact the repository owner.
