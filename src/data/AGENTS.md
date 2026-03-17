# AGENTS.md

## Scope

These instructions apply to files under `src/data/`.

## Purpose

This directory contains source-of-truth content and structured data for the site, including CV, climbing, and photography data.

Changes here should preserve schema stability, predictable rendering, and compatibility with consuming hooks, pages, and shared components. Content edits in this directory are expected when requested, and they should remain precise and consistent with existing entries. Schema changes must be intentional, with all affected types, hooks, and components updated in the same change set.

## General rules

- Treat data modules in this directory as source-of-truth content.
- Prefer editing existing exported objects, arrays, and typed structures over introducing new content-loading patterns.
- Preserve existing field names, export names, and high-level shapes unless a schema change is explicitly required.
- When a schema change is necessary, update all consuming types, hooks, and components in the same change set.
- Keep entries normalized and internally consistent with existing conventions in the file being edited.

## Type and schema discipline

- Respect the contracts in `src/types/`. Data modules are consumers of those types, not owners.
- Do not define types in data files that are consumed by more than one file outside `src/data/`. Those belong in the appropriate `src/types/` file. If a type was originally defined here because the data module needed it, and it has since acquired external consumers, move it to `src/types/` and keep a `export type { ... }` re-export here until all consumers are migrated.
- Avoid optional-field drift: do not add ad hoc fields to a small subset of records unless the type system and consumers are updated intentionally.
- Preserve ordering semantics when the UI depends on author-defined order.
- Prefer explicit, typed content over computed magic values in data files.

## File-specific guidance

### `cv.ts`

- This is the primary source for portfolio and CV content.
- Treat `src/data/cv.ts` as the source of truth for the interactive `/cv` experience.
- Prefer concise, user-facing content that maps cleanly into the current UI.
- The downloadable resume does not need conceptual parity with the live `/cv` experience unless the task explicitly involves the resume artifact or resume source.
- Be careful with dates, links, labels, and metadata that may be displayed in multiple sections.

### `climbs.ts`

- Do not edit climbing datasets unless the task explicitly requests it.
- Preserve sorting, normalization, and assumptions used by `useClimbingData` and DataGrid consumers.
- Do not silently rename grades, areas, identifiers, or filterable fields.

### `photography.ts`

- Do not edit gallery content unless the task explicitly requests it.
- Preserve slug generation and route matching assumptions.
- Keep image metadata consistent with any derived gallery/detail views.

### `blog.ts`

- Do not edit blog post content unless the task explicitly requests it.
- Preserve the `BlogContentBlock` discriminated union; all content blocks must use an existing union arm or extend it with a matching type and consumer update in the same change set.
- Post ordering within the array is author-defined; do not silently reorder entries.
- Tag strings must be consistent with existing values; do not introduce near-duplicate tags.

### `cvStoryItems.ts`

- Source of truth for the ordered sequence of CV story slides consumed by `CVStoryViewer` and `CVStoryNavBar`.
- Story item kinds: `about`, `experience`, `education`, `certificate`, `volunteering`, `coding`, `end`. All seven are discriminated union arms; adding a new kind requires updating the union, `kindLabel`/`kindIcon` maps in both viewer and nav-bar, and `buildCVStoryItems` in the same change set.
- The `end` kind has no `data` field and is always appended last by `buildCVStoryItems` — do not add an `end` entry to the static array.
- Do not restructure the overall `CVStoryItem` union without updating every downstream consumer in the same change.

## Editing guidance

- Prefer small, reviewable diffs.
- Keep copy edits precise; avoid broad tone rewrites across the dataset unless explicitly requested.
- Do not migrate content into a CMS, remote API, or separate JSON source unless explicitly requested.

## Validation

- Verify that changed data still matches the consuming types and renders through the existing pages/hooks.
- For schema-affecting edits, validate all known consumers touched by the changed fields.
- For content-only edits, validate the affected page or section at minimum.
- When the working branch includes Playwright E2E coverage for the affected route, run the corresponding route spec after `npm run build`.
- For `cv.ts` changes that affect GitHub fallback content or `/cv` route behavior, prefer mocked Playwright `/cv` coverage over live API-dependent validation when available.

## Scope control

- Do not mix schema redesign with content edits unless the task explicitly requires both.
- Do not perform formatting-only churn across large data files.
- Do not rename stable exports or fields without updating every consumer in the same change.

## Final response expectations

Include:

- which data files changed
- whether the change was content-only or schema-affecting
- which consuming pages, hooks, or components were impacted
- what validation was actually performed
