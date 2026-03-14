# Education GPA Structured Data

## Goal

Replace pipe-delimited Education GPA strings with structured typed data so the `/cv` Education section can render GPA chips without parsing display text.

## Why

The current GPA chip rendering works, but it depends on splitting a presentation string on `|`. That couples layout behavior to a fragile content format and makes future GPA edits harder to validate.

## Constraints

- Keep the change narrowly scoped to Education GPA data and its existing chip presentation.
- Preserve the current `/cv` layout, supporting metadata placement, and shared header behavior.
- Do not broaden the data migration beyond the Education GPA field.
- Keep the app fully client-side and compatible with the existing TypeScript data-module architecture.

## Affected files and responsibilities

- `src/types/cv.ts`: define the structured GPA entry type and update `EducationEntry.gpa`.
- `src/data/cv.ts`: convert Education GPA content to the new structured shape.
- `src/components/cv/EducationSection.tsx`: render GPA chips from typed GPA entries instead of parsing strings.
- `src/components/cv/EducationSection.test.tsx`: continue validating Education GPA chips after the data-shape change.

## Proposed approach

Introduce a small `EducationGpaEntry` type with `label` and `value`, and change `EducationEntry.gpa` to an array of these entries. Update the Education data records to provide explicit GPA entries. Replace the `splitEducationGpa` string parser with a formatter that maps structured GPA entries into chip labels such as `Cumulative: 3.44`.

## Execution steps

1. Add this ExecPlan before code edits.
2. Introduce the structured GPA type and update the Education data shape.
3. Remove GPA string parsing from `EducationSection` and render chips from typed GPA entries.
4. Update targeted Education tests if needed.
5. Re-run the narrowest relevant validation for `/cv`.

## Validation plan

- `CI=true npm test -- --runInBand src/components/cv/CVEntryHeader.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/ExperienceList.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation of `/cv` on desktop and mobile to confirm Education GPA chips still render correctly.

## Risks and rollback

- The main risk is a partial schema update leaving the data and renderer out of sync.
- If the structured data change causes type or rendering regressions, roll back `EducationEntry.gpa` to the previous string shape and reapply the migration in one smaller batch.

## Progress notes

- ExecPlan added before implementation.
- Added `EducationGpaEntry` and converted `educationInfo` GPA data from pipe-delimited strings to structured `{ label, value }` entries.
- Removed GPA string parsing from `EducationSection`; chip labels now come from typed GPA entries.
- Validation completed successfully:
  - `CI=true npm test -- --runInBand src/components/cv/CVEntryHeader.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/ExperienceList.test.tsx`
  - `npm run build`
  - `npx playwright test e2e/cv.github.spec.ts`
  - Browser validation on the production build at desktop and mobile viewports confirmed Education GPA chips still render and wrap correctly.
