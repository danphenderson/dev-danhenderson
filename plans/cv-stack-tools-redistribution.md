# CV Stack Tools Redistribution

## Goal

Remove the standalone Stack & Tools section from the `/cv` route and preserve the most relevant stack/tooling information through lighter-weight, contextual presentation in the existing CV sections.

## Why

The current Stack & Tools section adds visual and cognitive noise to the CV page, especially in the desktop sidebar and mobile stacked flow. It repeats information already present in experience, education, and project entries, while presenting low-signal environment details with the same visual weight as core technical strengths.

## Constraints

- Preserve the current client-side SPA architecture and existing `/cv` route behavior.
- Keep changes narrowly scoped to the CV route, CV data, and directly affected tests.
- Continue sourcing content from `src/data/cv.ts`.
- Do not recreate the removed section as another all-in-one tab panel elsewhere.
- Reuse existing CV components and typography/chip primitives where practical.

## Affected files and responsibilities

- `src/data/cv.ts`: remove the standalone Stack & Tools dataset and add a compact About-level workflow summary while redistributing contextual items into existing skills arrays.
- `src/pages/CV.tsx`: remove the Stack & Tools section from route composition and render the new compact About footer summary.
- `src/components/cv/cvSectionMetadata.ts`: remove the tools section metadata and navigation order entry.
- `src/pages/cvPageLayout.ts`: remove the tools section placement from mobile and desktop layouts.
- `src/components/cv/CVSectionNavigator.tsx`: remove the tools icon mapping after metadata removal.
- `src/components/cv/CVStackToolsSection.tsx`: delete after route composition no longer references it.
- `src/components/cv/StackAndToolsSection.tsx`: delete after route composition no longer references it.
- `test/unit/pages/CV.test.tsx`: update section layout and About assertions.
- `test/unit/pages/cvPageLayout.test.ts`: update expected mobile/desktop section ordering.
- `test/unit/components/cv/cvSectionMetadata.test.ts`: update expected section keys.
- `test/unit/components/cv/StackAndToolsSection.test.tsx`: remove obsolete standalone section coverage.

## Proposed approach

Use the existing `footer` slot on `CVAboutSection` to present a compact “Current workflow” summary using existing text and chip components. Keep only a curated set of current, identity-level tools there. Preserve richer stack/tooling detail by relying on the existing Experience, Education, and Coding Examples skill tabs, with minor data cleanup where needed so the removed section does not create content loss.

## Execution steps

1. Remove the standalone Stack & Tools data exports and replace them with a compact About workflow summary in `src/data/cv.ts`.
2. Fold high-value contextual tools into existing experience and education skills arrays where the current Stack & Tools section was the only visible home for them.
3. Update `src/pages/CV.tsx` to render the About workflow summary in the About footer and remove the Stack & Tools section definition.
4. Remove the tools section from CV metadata, layout, and navigator icon mappings.
5. Delete the standalone Stack & Tools components.
6. Update the directly affected unit tests.
7. Run build, targeted tests, and browser validation on `/cv` desktop and mobile.

## Validation plan

- `npm run build`
- `npm test -- --watch=false --runInBand test/unit/pages/CV.test.tsx test/unit/pages/cvPageLayout.test.ts test/unit/components/cv/cvSectionMetadata.test.ts`
- `npx playwright test test/e2e/cv.github.spec.ts`
- Browser validation on `/cv` at one desktop and one mobile viewport

## Risks and rollback

- Removing a section can break navigation order, section anchors, and layout assumptions if metadata, layout, and tests are not updated together.
- Redistributing content can reintroduce noise if the About summary is too large or if contextual skills become overly repetitive.
- If the new presentation feels too sparse, rollback is straightforward by restoring the removed data/section files from git and keeping the new About summary out of the final patch.

## Progress notes

- Initial planning and content mapping completed before implementation.
- Preferred About summary: Python, TypeScript, Julia, AWS, React, Docker, GitHub Actions.
- Preferred contextual ownership: role-owned platforms/services remain in Experience, academic tooling remains in Education, project stacks remain in Coding Examples.
- Structural redistribution completed in `src/data/cv.ts`, `src/pages/CV.tsx`, CV metadata/layout, and directly affected unit tests.
- Validation completed: `npm run build`, targeted CV unit tests, `npx playwright test test/e2e/cv.github.spec.ts`, and browser checks on `/cv` at desktop and mobile widths.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
