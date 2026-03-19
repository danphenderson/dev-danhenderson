# AGENTS.md

## Scope

These instructions apply to files under `src/components/blog/`.

## Purpose

Documents conventions, data model, and validation requirements for the editorial blog feature (`/blog`, `/blog/:slug`).
This directory is one of the documented intentional design-system exceptions; preserve its editorial typography and layout language instead of forcing it back into the standard section-card stack.

## Component conventions

- All blog UI components live in `src/components/blog/`.
- Use existing motion, theme, and typography primitives — do not introduce parallel animation or style systems.
- Preserve the editorial exception: custom display typography and article-layout treatment are expected here, even when standard routes use `SectionHeading` and `SectionCard`.
- Prefer composition over inheritance; keep components focused and reusable.
- Use `MotionSection`, `StaggerChildren`, and `MotionCard` for scroll-triggered and interactive motion.
- Use `contentCardSx` for glassmorphism surface treatments.
- All navigation uses React Router `Link` or `useNavigate`.
- Blog route behavior is feature-gated via `isFeatureEnabled('blog')`; keep component behavior compatible with `/blog` and `/blog/:slug` appearing only in enabled runtime environments.

## Data model

- Source of truth: `src/data/blog.ts` (array of `BlogPost` objects).
- Content blocks: `BlogContentBlock[]` (discriminated union for paragraphs, headings, code, blockquote, callout, image, list, divider).
- Use `useBlogData` hook for all data access, filtering, and navigation helpers.
- Do not fetch blog content from remote APIs or CMS.

## Validation

- All new components must have unit tests in `test/unit/components/blog/` or relevant page/hook test.
- Blog index and post pages must be covered by unit and E2E tests.
- Run `npm run build` for compile checks and the narrowest relevant unit tests for changed behavior.
- Use `npm run build:e2e` before `npm run test:e2e` or `npx playwright test test/e2e/blog.spec.ts` so the feature-gated blog routes are enabled in the E2E build.
- Validate `/blog` and `/blog/:slug` in browser at multiple viewports and theme presets.

## Recovery and fallback

- Not-found blog slugs must render `RouteRecoveryPanel` with contextual suggestions.
- Tag filtering and navigation must degrade gracefully if no posts match.

## Content updates

- Add new posts by editing `src/data/blog.ts` only.
- Use the `BlogContentBlock` union for all content — do not use MDX or HTML.

## Final response expectations

Include:

- which components changed
- whether any public props or shared blog behavior changed
- which consuming routes or pages were affected (`/blog`, `/blog/:slug`)
- what browser validation was actually performed
- any multi-consumer risks or technical debt noticed
