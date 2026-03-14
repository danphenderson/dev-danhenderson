# Tab panel exit transition groups

## Goal
Add exit transitions to the shared `TabPanel` so selected tab content animates out when switching tabs or collapsing the active tab, without changing the app's single-page architecture or breaking existing tab interactions.

## Why
Tab panel content currently appears and disappears instantly. The issue requests exit transition groups throughout the UI, and the shared `TabPanel` is the common collapse/switch surface used by the `/cv` route, so adding exit transitions here addresses the current abrupt behavior in the reused panel pattern.

## Constraints
- Keep the change narrowly scoped to the shared tab panel behavior and its direct tests.
- Preserve existing `TabPanel` props and selection semantics, including deselecting the active tab on repeated click.
- Respect reduced-motion preferences when adding transitions.
- Do not alter SPA routing, static hosting assumptions, or unrelated CV content/data modules.
- Validate the shared-component change in consuming `/cv` contexts and capture screenshots.

## Affected files and responsibilities
- `src/components/TabPanel.tsx`: shared tab panel rendering and collapse/switch behavior.
- `src/components/TabPanel.test.tsx`: focused behavior coverage for the shared tab panel.
- `plans/tab-panel-exit-transition-groups.md`: living plan and progress notes for this cross-cutting UI change.

## Proposed approach
Wrap each rendered panel body in a lightweight MUI transition that supports exit animation before unmount. Keep the public API stable by handling exit animation internally, while preserving `keepMounted` semantics for consumers after the exit completes. Use the existing reduced-motion hook to disable the animation when motion should be minimized. Update tests to assert the new transition-aware behavior in a deterministic way.

## Execution steps
1. Inspect `TabPanel` consumers and current transition/reduced-motion patterns to confirm the smallest safe implementation.
2. Implement internal exit-transition handling in `TabPanel` while preserving selection, accessibility, and `keepMounted` behavior.
3. Update focused `TabPanel` tests for transition-aware mounting/unmounting and any directly coupled assertions.
4. Run targeted build/tests and browser validation on `/cv` at desktop and mobile sizes, capturing screenshots.
5. Re-run broader validation as needed, then update this plan with the actual outcomes.

## Validation plan
- `npm run build`
- `CI=true npm test -- --watch=false src/components/TabPanel.test.tsx`
- Browser validation on `/cv` in desktop and mobile viewports
- Screenshot capture of the affected tab-panel UI

## Risks and rollback
- Exit transitions can accidentally leave hidden content mounted or expose duplicate tabpanel semantics during animation.
- Shared-component styling or timing changes can create layout jank across multiple CV sections.
- If regressions appear, the change can be isolated by reverting `src/components/TabPanel.tsx` and its focused tests while leaving the rest of the UI untouched.

## Progress notes
- Baseline after `npm install`: `npm run build` passes, while the full Jest suite has a pre-existing failure in `src/components/TabPanel.test.tsx` asserting the panel background matches the resume button.
- Implemented the transition in `TabPanel` with MUI `Collapse`, using reduced-motion detection to preserve immediate mount/unmount behavior when motion should be minimized.
- Updated the shared `TabPanel` test and the directly coupled `EducationSection`, `CodingExamplesSection`, and `/cv` Playwright spec assertions so they reflect transition-aware behavior and current shared surface styling.
- Validation completed: `npm run build`, targeted Jest for the touched component/consumers, full Jest (`198` tests), `CI= npx playwright test e2e/cv.github.spec.ts`, and manual `/cv` browser checks at desktop (`1440x1200`) and mobile (`390x844`) with local screenshots captured for the Experience tab panel open/collapsed states.
