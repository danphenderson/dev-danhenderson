# CV Section Text Consistency

## Goal

Make the Experience, Education, and Volunteering cards on `/cv` use the same text hierarchy and metadata placement so dates, organizations, supporting details, and summaries appear in predictable locations across all three sections.

## Why

The three section renderers currently describe similar CV entries with different visual rules:

- Experience shows the date inline with the company row and keeps the industry chip in the title row.
- Education shows the university first, then the program, then uses `status` for the timeline and `dateRange` for GPA text.
- Volunteering puts the date in a right-side block and the location under it.

This makes the cards harder to scan as a unified CV, overloads some data fields with inconsistent meaning, and increases the chance that future content edits drift further apart.

## Constraints

- Keep the app fully client-side and preserve the existing SPA route behavior.
- Keep the change scoped to the `/cv` route and the three affected CV sections.
- Preserve current content sources in `src/data/cv.ts`; do not introduce a CMS or remote content source.
- Preserve existing card surfaces, section structure, and tabbed supplemental content unless a small layout adjustment is required for consistency.
- Avoid turning shared CV rendering into an overly generic catch-all component.
- Keep `PUBLIC_URL` compatibility unchanged.

## Affected files and responsibilities

- `src/components/cv/ExperienceList.tsx`: align experience card header and metadata placement to the shared pattern.
- `src/components/cv/EducationSection.tsx`: reorder education text hierarchy and stop overloading metadata fields with mixed semantics.
- `src/components/cv/VolunteeringList.tsx`: move volunteering metadata into the same card slots used by the other sections.
- `src/components/cv/`: likely home for a narrow shared header/meta primitive or helper used by all three renderers.
- `src/styles/componentStyleBuilders.ts`: add or consolidate shared CV entry header/meta layout tokens so spacing and wrapping behavior are consistent.
- `src/data/cv.ts`: normalize education entry content so the actual date range, GPA, expected graduation, location, and similar details map into explicit slots.
- `src/types/cv.ts`: update types only if needed to support explicit metadata fields instead of overloaded strings.
- `src/components/cv/ExperienceList.test.tsx`: cover the shared placement rules for title, organization, date, and optional chip/meta rendering.
- `src/components/cv/EducationSection.test.tsx`: cover the new education text order and metadata semantics.
- `src/components/cv/VolunteeringList.test.tsx`: cover the aligned volunteering header/meta layout.
- `src/pages/CV.test.tsx`: remain green as the route-level consumer of the three sections.
- `e2e/cv.github.spec.ts`: optional place to extend `/cv` route assertions if a route-level regression check for card text structure is warranted.

## Proposed approach

Adopt one shared text pattern for all three entry types:

1. Top row: primary entry title on the left, date or date range on the right.
2. Second row: organization or institution label on the left, with optional contextual UI such as the industry chip kept in a consistent secondary slot.
3. Supporting metadata row: optional items such as location, GPA, expected graduation, minor, or status shown beneath the organization line in a consistent order and style.
4. Summary/body text.
5. Existing tab panel or highlights list.

To make that possible without broad refactoring:

- Introduce a narrow CV-specific header/meta primitive or display helper instead of duplicating three separate header layouts.
- Normalize each section's data into the same display slots before rendering.
- Treat the date/date range as a first-class field in every section.
- Stop using education's `status` and `dateRange` fields to carry unrelated meanings. Education should expose a real timeline field and separate supporting metadata for GPA, expected graduation, minor, or similar details.

Recommended content mapping:

- Experience: primary title = role/title; secondary label = company; date range = derived from `startDate` and `endDate`; supporting metadata = optional industry chip.
- Education: primary title = degree/program; secondary label = university; date range = attendance/expected graduation timeline; supporting metadata = GPA, minor, or similar academic details.
- Volunteering: primary title = role; secondary label = organization; date range = volunteering timeline; supporting metadata = location.

This keeps the change aligned with the existing architecture: data still lives in `src/data/cv.ts`, the `/cv` page still composes section-local components, and only the three sibling renderers plus their shared styling are tightened up.

## Execution steps

1. Define the target text hierarchy and slot rules for CV entries, including the exact placement of date/date range, organization/institution, and secondary metadata.
2. Add a narrow shared CV entry header/meta primitive or helper in `src/components/cv/` and shared style tokens in `src/styles/componentStyleBuilders.ts`.
3. Refactor `ExperienceList.tsx`, `EducationSection.tsx`, and `VolunteeringList.tsx` to render through the shared pattern while preserving their existing summary and tab/highlight bodies.
4. Normalize the education data shape in `src/data/cv.ts` and `src/types/cv.ts` so date-related fields and academic metadata have explicit meaning.
5. Update focused Jest tests for the three section components to assert the new hierarchy and metadata placement.
6. Run route-level validation on `/cv` and expand to Playwright/browser checks if the new shared layout changes responsive wrapping or alignment.

## Validation plan

- `npm test -- --watch=false --runTestsByPath src/components/cv/ExperienceList.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/VolunteeringList.test.tsx src/pages/CV.test.tsx`
- `npm run build`
- Browser validation on `/cv` at one narrow/mobile viewport and one desktop viewport:
- verify all three sections place the date/date range in the same location relative to the card header
- verify primary title, organization/institution, and supporting metadata render in the same vertical order across all three sections
- verify long titles, long schools/organizations, and long locations wrap without overlapping chips or dates
- verify tab panels and highlight lists still align correctly below the summary text
- if the working branch keeps Playwright coverage focused on `/cv`, run the narrowest relevant `e2e/cv.github.spec.ts` scenario after `npm run build`

## Risks and rollback

- Education currently has overloaded metadata fields, so schema cleanup may touch both content and renderer expectations. Keep the schema change minimal and update all consumers in the same change.
- A shared header primitive can become too generic if it tries to solve unrelated CV card layouts. Keep it narrow to the three entry styles in scope.
- Long date ranges or academic metadata may wrap differently on mobile than on desktop. The implementation needs explicit responsive checks.
- Reordering education from university-first to degree-first changes emphasis. Confirm the chosen hierarchy before implementation if that tradeoff feels too disruptive.
- Rollback is low risk because the three section renderers are already isolated; the change can be reverted by removing the shared header/helper and restoring the prior field mapping.

## Progress notes

- Reviewed the current Experience, Education, and Volunteering renderers and confirmed the inconsistency is split across both render structure and data semantics.
- The highest-value cleanup is to make date/date range placement consistent first, then align the title/organization/supporting-meta hierarchy behind it.
