# Education GPA Chip Migration

## Goal
Render education GPA metadata in the same visual tier as Experience industry tags, with GPA values displayed as chips on the university row instead of inline supporting text.

## Why
The current Education cards render GPA as plain metadata text, which weakens its visual hierarchy compared with the tag treatment already used in Experience. Moving GPA into chips makes the placement and styling more consistent without changing the underlying data shape.

## Constraints
- Keep the app fully client-side and preserve existing `/cv` route behavior.
- Keep the change narrowly scoped to Education GPA presentation and the shared header support it needs.
- Do not change the `EducationEntry.gpa` data shape; keep GPA parsing display-only.
- Preserve current Experience and Volunteering header behavior while extending the shared header.
- Do not modify unrelated in-progress work in the current branch.

## Affected files and responsibilities
- `src/components/cv/CVEntryHeader.tsx`: extend the organization row to support one or many chips through a shared rendering path.
- `src/components/cv/EducationSection.tsx`: split GPA strings into chip labels and remove GPA from supporting metadata.
- `src/styles/componentStyleBuilders.ts`: separate title-row and organization-row layout styles so chip groups wrap cleanly on narrow widths.
- `src/components/cv/EducationSection.test.tsx`: verify GPA chips and supporting metadata placement.
- `src/components/cv/ExperienceList.test.tsx`: verify the existing single industry chip still renders in the organization row.
- `src/components/cv/CVEntryHeader.test.tsx`: cover the shared multiple-chip rendering behavior directly.

## Proposed approach
Add an optional `chips` prop to `CVEntryHeader` while preserving the existing `chip` prop for current single-chip consumers. Normalize either input into a single chip array and render it in a chip-group container on the organization row. Update the row styling so the title/date row stays unchanged while the organization/chip row can stack and wrap on mobile. In Education, split the existing GPA string on `|`, trim each segment, pass those segments as chip labels, and keep only expected completion and minor in supporting metadata.

## Execution steps
1. Add this ExecPlan and keep it current during implementation.
2. Extend `CVEntryHeader` for normalized single- and multi-chip rendering, plus responsive chip-group layout support in component styles.
3. Update `EducationSection` to derive GPA chip labels from `entry.gpa` and stop sending GPA through `supportingMeta`.
4. Add or update targeted tests for Education GPA chips, Experience single-chip placement, and shared header multi-chip rendering.
5. Run the narrowest relevant validation, then record any blockers in progress notes.

## Validation plan
- `npm test -- --watch=false --runInBand src/components/cv/CVEntryHeader.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/ExperienceList.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation of `/cv` on one desktop viewport and one narrow/mobile viewport, focused on Education chip wrapping and Experience chip regression.

## Risks and rollback
- The shared header is reused by Experience and Volunteering, so row layout changes could accidentally shift spacing or wrapping outside Education.
- Multi-chip rows can overflow or wrap awkwardly on narrow widths if the organization row does not stack cleanly.
- If the change regresses other consumers, roll back to the previous single-chip header layout and reintroduce Education-specific rendering locally rather than broadening the shared component further.

## Progress notes
- Initial implementation plan persisted before code edits.
- Implemented shared `CVEntryHeader` multi-chip support while keeping the existing single-chip Experience path unchanged.
- Education now splits `gpa` display strings on `|` and renders the resulting segments as chips; `expectedCompletion` and `minor` remain supporting metadata.
- Added focused shared-header coverage plus updated Education and Experience tests for chip placement.
- Validation completed successfully:
  - `CI=true npm test -- --runInBand src/components/cv/CVEntryHeader.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/ExperienceList.test.tsx`
  - `npm run build`
  - `npx playwright test e2e/cv.github.spec.ts`
  - Browser validation on `/cv` at desktop and mobile viewports confirmed GPA chips align with Experience tag placement and wrap cleanly on narrow screens.
- Follow-up technical debt was identified: the GPA chip renderer still depended on parsing pipe-delimited display strings. That cleanup is tracked separately in `plans/education-gpa-structured-data.md`.
