# AGENTS.md

## Scope
These instructions apply to files under `src/pages/`.

## Purpose
This directory contains route-level pages and top-level page composition for the portfolio site.

Edits here should preserve:
- existing route behavior
- stable page composition boundaries
- compatibility with the current SPA/static-hosting model
- predictable responsive layout and navigation behavior

## Role of page files
- Page files own route-level composition, section ordering, and route-specific data wiring.
- Prefer keeping heavy presentation details in shared components rather than growing route files into large UI monoliths.
- Prefer keeping route files readable and declarative.

## UI edit behavior
- Treat route-level UI edits as behavior-sensitive, even when they appear cosmetic.
- Preserve visible content hierarchy, information scent, and primary calls to action unless the task explicitly requests UX changes.
- Prefer small, local edits over page-wide restructuring.
- Do not move logic from shared components into route files unless the route truly owns that behavior.
- Do not duplicate UI patterns across pages when an existing shared component or pattern already fits.
- Preserve existing spacing rhythm, section ordering intent, and breakpoint behavior unless the task explicitly requires a layout change.
- Do not silently change route semantics, page titles, navigation affordances, or section anchors without verifying downstream impact.

## Route and composition rules
- Preserve stable route paths and direct-navigation behavior.
- Do not rename route exports, route elements, or route wiring unless explicitly required.
- Keep page composition aligned with the current architecture: pages assemble content, components render reusable UI, hooks provide data adaptation.
- If a page change suggests a shared abstraction, prefer extracting only the repeated part rather than refactoring the whole page.

## Data and hook usage
- Use existing hooks and data modules for page content and derived state.
- Do not introduce ad hoc inline data structures in page files when the content belongs in `src/data/`.
- Avoid page-level fetch patterns or new remote data dependencies unless explicitly requested.

## Browser validation requirements
Browser-based validation is required for any page edit affecting:
- layout
- spacing
- typography hierarchy
- responsive behavior
- route navigation
- route-level integrations or mocked API-backed states
- conditional rendering
- animations or transitions
- asset rendering
- section visibility or order
- interactions that depend on scroll, resize, hover, focus, or viewport entry

## Browser validation procedure
When page UI changes are made:
- validate the changed route directly
- validate any adjacent route affected by shared navigation or layout
- check at least one narrow/mobile viewport and one desktop viewport for layout-affecting edits
- when the working branch includes Playwright E2E coverage for the touched route, run `npm run build` and then the narrowest relevant `npx playwright test e2e/<spec>.ts` command
- when that workflow is present, use `npm run test:e2e` if a page change spans multiple covered routes or shared route behavior
- for `/cv` GitHub-backed behavior, prefer mocked Playwright success/failure coverage over live API-dependent validation when that workflow is available
- verify that major headings, primary content blocks, and critical assets render as intended
- verify that no obvious overflow, clipping, overlap, or collapsed spacing was introduced
- verify that links and route transitions still work for touched areas
- if browser tooling is unavailable, run the narrowest available fallback validation (for example build plus targeted tests) and report browser validation as deferred
- close the browser session after validation

## Validation examples
Common validation targets for this directory:
- `/`
- `/cv`
- `/climbing`
- `/photography`
- `/photography/:slug`

Common checks:
- direct navigation to the changed route
- responsive layout check
- asset/image/media rendering check
- Playwright route coverage, when present in the branch:
  - `/` -> `npx playwright test e2e/home.spec.ts`
  - `/cv` and mocked GitHub states -> `npx playwright test e2e/cv.github.spec.ts`
  - `/climbing` -> `npx playwright test e2e/climbing.spec.ts`
  - `/photography` and `/photography/:slug` -> `npx playwright test e2e/photography.spec.ts`
  - unknown-route handling -> `npx playwright test e2e/not-found.spec.ts`
- screenshot capture when the task is visual or review-oriented

## Scope control
- Do not mix page redesign with unrelated content rewrites or data restructuring unless the task explicitly requires it.
- Do not perform route-wide cleanup or style normalization as incidental work.
- Do not convert page-local changes into cross-app refactors without a clear need.

## Planning alignment
- For page work that meets ExecPlan triggers, follow `PLANS.md` and create an ExecPlan before implementation.

## Final response expectations
Include:
- which route-level pages changed
- whether the change was layout, behavior, content wiring, or composition related
- which shared components or hooks were also affected
- what browser validation was actually performed
- any route-specific regressions or technical debt noticed but not addressed
