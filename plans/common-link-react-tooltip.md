# Common Link React Tooltip Support

## Goal

Add a shared link component that can carry `react-tooltip` hover metadata while preserving the current link rendering and behavior across existing shared and page-local inline text link consumers.

## Why

The codebase currently uses raw MUI `Link` instances in multiple shared components and page-local inline text surfaces and does not have a common typed surface for `react-tooltip`'s `data-tooltip-*` attributes. A shared wrapper makes tooltip-enabled links available without changing route structure or introducing a parallel link pattern.

## Constraints

- Keep the app fully client-side.
- Preserve current SPA route behavior and existing external-link behavior.
- Keep the change narrowly scoped to shared link rendering.
- Do not introduce new dependencies unless required.
- Avoid unrelated visual or API churn in shared components.

## Affected files and responsibilities

- `plans/common-link-react-tooltip.md`: Execution plan and progress notes.
- `src/components/CommonLink.tsx`: Shared MUI link wrapper with typed `react-tooltip` data attributes.
- `src/components/CommonLink.test.tsx`: Focused unit coverage for tooltip attribute forwarding.
- `src/components/Footer.tsx`: Shared footer link consumer.
- `src/components/cv/CVEntryHeader.tsx`: Shared CV organization link consumer.
- `src/components/cv/ExperienceList.tsx`: Shared inline/project CV link consumers.
- `src/components/cv/CodingExamplesSection.tsx`: Shared coding example title link consumer.
- `src/components/cv/ProfileCard.tsx`: Shared profile bio link consumer.
- `src/pages/Climbing.tsx`: Route-local inline text link consumers inside DataGrid cells.
- `src/pages/Climbing.test.tsx`: Route-level coverage for climbing inline links.

## Proposed approach

Create a thin wrapper around MUI `Link` that keeps the existing prop model but explicitly types the `data-tooltip-*` attributes used by `react-tooltip`. Then switch the existing shared and page-local inline text link consumers to the wrapper so future tooltip usage can be added at those call-sites without reworking each component independently.

## Execution steps

1. Add `CommonLink` and verify it forwards standard link props plus `react-tooltip` data attributes.
2. Replace existing shared MUI link usages in shared components with `CommonLink` while preserving current prop values and markup.
3. Replace the remaining page-local inline text MUI links with `CommonLink` and add route-level coverage for the affected page.
4. Run targeted unit tests, build the app, and browser-validate the affected routes on desktop and mobile.

## Validation plan

- `npm test -- --watch=false --runTestsByPath src/components/CommonLink.test.tsx src/components/cv/CVEntryHeader.test.tsx src/components/cv/ExperienceList.test.tsx src/components/cv/ProfileCard.test.tsx src/components/Footer.test.tsx`
- `CI=true npm test -- --runTestsByPath src/pages/Climbing.test.tsx`
- `npm run build`
- `npx playwright test e2e/climbing.spec.ts`
- Browser validation for `/cv`, `/climbing`, and one additional consumer route on desktop and mobile when relevant

## Risks and rollback

- Shared link wrappers can accidentally change MUI prop behavior or ref forwarding.
- Replacing imports across shared components can introduce subtle styling regressions if the wrapper is not fully transparent.
- Rollback is straightforward: revert `CommonLink` adoption per consumer and remove the wrapper if it proves unnecessary.

## Progress notes

- Initial scope kept the change to shared components already using MUI `Link`; route-local link patterns were migrated in the follow-up step below.
- Installed `react-tooltip@5.30.0` so the previously typed data attributes can render actual hover UI.
- Added `src/components/CommonLink.tsx` as a transparent MUI `Link` wrapper with typed `react-tooltip` data attributes and covered it with a focused unit test.
- Added a single shared tooltip host in `src/components/CommonLinkTooltip.tsx` and mounted it in `src/App.tsx`.
- Migrated shared link consumers in `Footer`, `CVEntryHeader`, `ExperienceList`, `CodingExamplesSection`, and `ProfileCard` to `CommonLink` without changing their rendered prop values.
- `npm run build` succeeded, targeted link-related tests passed, and browser validation passed on `/cv` and `/climbing` at desktop and mobile widths.
- The broader `src/components/cv/ExperienceList.test.tsx` suite still contains an unrelated industry-chip color assertion failure in the current branch; the link-focused tests from that file passed when run in isolation.
- Migrated the remaining page-local inline text route links in `/climbing` from raw MUI `Link` to `CommonLink` via a small shared cell-render helper.
- Added route-level assertions in `src/pages/Climbing.test.tsx` and Playwright coverage in `e2e/climbing.spec.ts` to confirm the inline route links still render with the expected external URLs.
- Follow-up validation for the route-local migration succeeded with `CI=true npm test -- --runTestsByPath src/pages/Climbing.test.tsx src/components/CommonLink.test.tsx`, `npm run build`, and `npx playwright test e2e/climbing.spec.ts`.
- Wired visible tooltip examples onto the CV bio program link and the climbing route links, added hover assertions in `e2e/cv.github.spec.ts` and `e2e/climbing.spec.ts`, and verified the tooltip text on `/cv` and `/climbing` at desktop and mobile sizes with a direct Playwright browser check.
