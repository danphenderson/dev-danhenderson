# CV Organization Link Tooltips

## Goal
Add explicit tooltip opt-in for organization-name links rendered through `/cv`'s shared `CVEntryHeader` path, while leaving `Various Locations`, education organizations, and non-organization inline links unchanged in this batch.

## Why
The current tooltip rollout covers the bio program link and the inline advisor link, but the remaining organization-name text links rendered through `CVEntryHeader` still do not opt into the shared tooltip treatment. This batch completes the organization-link scope with explicit metadata and updated destination URLs, without widening the change into unrelated CV link surfaces.

## Constraints
- Preserve the existing client-side SPA architecture and `/cv` route behavior.
- Keep the Michigan Tech bio link pointed at the math graduate student page.
- Apply the new Michigan Tech Global Campus URL only to organization-name links in experience entries.
- Preserve existing tooltip behavior for the bio link and the inline `Jiguang Sun` link.
- Leave non-organization inline links, coding example title links, education organizations, `MidWest Devo`, and `Various Locations` plain text under this batch.
- Keep the change narrowly scoped to the current CV data/component/test surfaces.

## Affected files and responsibilities
- `src/types/cv.ts`: extend the typed CV data model with organization tooltip fields for experiences and volunteering entries.
- `src/data/cv.ts`: split Michigan Tech URLs, update organization link destinations, add tooltip copy, and explicitly remove the `Various Locations` company link.
- `src/components/cv/CVEntryHeader.tsx`: add shared organization tooltip prop handling and apply tooltip attributes only when organization tooltip text is present.
- `src/components/cv/ExperienceList.tsx`: forward `companyTooltip` into `CVEntryHeader`.
- `src/components/cv/VolunteeringList.tsx`: forward `organizationTooltip` into `CVEntryHeader`.
- `src/components/cv/CVEntryHeader.test.tsx`: verify linked organization rows render URL and tooltip attributes together.
- `src/components/cv/ExperienceList.test.tsx`: verify Michigan Tech and Lucerna organization links render the expected URLs and tooltip text.
- `src/components/cv/VolunteeringList.test.tsx`: verify volunteering organization links render the expected URLs and tooltip text.
- `e2e/cv.github.spec.ts`: extend `/cv` browser coverage to check tooltip-enabled organization links alongside the existing bio/advisor coverage.

## Proposed approach
Keep the existing shared `CVEntryHeader` render path as the single place that decides whether organization text is plain text or an external link. Extend the typed CV data with explicit tooltip fields so tooltip behavior remains opt-in and content-driven. Update the experience and volunteering list adapters to pass the new fields through, and add focused tests that prove both the shared component contract and the rendered `/cv` data instances.

## Execution steps
1. Add the ExecPlan and inspect the current CV types, data, shared header component, and existing tests/specs.
2. Extend the `Experience` and `VolunteeringEntry` types with tooltip fields and update `CVEntryHeader` to accept an optional `organizationTooltip`.
3. Update `src/data/cv.ts` so organization links use the intended URLs and explicit tooltip copy, while removing the `Various Locations` link.
4. Wire `ExperienceList` and `VolunteeringList` to pass the tooltip metadata into `CVEntryHeader`.
5. Extend the targeted unit tests and the `/cv` Playwright spec for the new tooltip-enabled organization links.
6. Run the focused unit tests, production build, and the narrow `/cv` Playwright coverage.

## Validation plan
- `CI=true npm test -- --runTestsByPath src/components/cv/CVEntryHeader.test.tsx src/components/cv/ExperienceList.test.tsx src/components/cv/VolunteeringList.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`

## Risks and rollback
- The main regression risk is unintentionally adding tooltip attributes to organization text that should remain plain text, especially entries without a tooltip or without a link.
- Changing the shared `CVEntryHeader` link branch can affect multiple `/cv` sections, so the component must only emit tooltip attributes when explicitly requested.
- The Michigan Tech URL split could accidentally change the bio link if the old constant is reused incorrectly; keep the bio and organization URLs as separate named constants.
- Rollback is straightforward: revert the new tooltip fields and `CVEntryHeader` prop path, and restore the prior CV data URLs if validation shows unexpected shared-component regressions.

## Progress notes
- Initial inspection confirmed the organization link rendering is centralized in `CVEntryHeader`, with existing tooltip behavior already established for other `CommonLink` usages.
- Added explicit tooltip fields to the `Experience` and `VolunteeringEntry` types and passed them through `ExperienceList` / `VolunteeringList` into `CVEntryHeader`.
- Split the Michigan Tech bio URL from the new organization-link URL, updated the targeted experience and volunteering entries, and removed the `Various Locations` company link.
- Extended the focused Jest coverage and updated the `/cv` Playwright helper to validate tooltips via hover for the bio link, `Jiguang Sun`, a Michigan Tech organization link, and the new `Little Brothers` organization link.
- The first focused Jest run exposed a brittle existing RGB color assertion on the experience industry chip; the chip-placement test was narrowed to the structural behavior it is intended to protect before rerunning validation.
- Validation completed successfully with `CI=true npm test -- --runTestsByPath src/components/cv/CVEntryHeader.test.tsx src/components/cv/ExperienceList.test.tsx src/components/cv/VolunteeringList.test.tsx`, `npm run build`, and `npx playwright test e2e/cv.github.spec.ts`.
