# CV Tab Panel Initial Grow Transition

## Goal
Add a one-time grow transition to CV tab-panel bodies so the first visible panel expands only after its parent card has finished its entry animation.

## Why
The CV cards already stage into view, but the nested tab content appears immediately. Delaying and growing the first visible panel creates a clearer two-step reveal without changing non-CV behavior.

## Constraints
- Keep the app fully client-side and preserve SPA route behavior.
- Keep the change narrowly scoped to `/cv`.
- Preserve current `TabPanel` semantics and public behavior unless the new opt-in prop is passed.
- Avoid broad style refactors, especially in `src/styles/componentStyleBuilders.ts`, which already contains unrelated local edits.

## Affected files and responsibilities
- `src/components/TabPanel.tsx`: add the opt-in initial grow behavior and reduced-motion handling.
- `src/components/cv/ExperienceList.tsx`: opt experience panels into the delayed initial grow timing.
- `src/components/cv/EducationSection.tsx`: opt education panels into the delayed initial grow timing.
- `src/components/cv/CodingExamplesSection.tsx`: opt coding example panels into the delayed initial grow timing.
- `src/components/cv/StackAndToolsSection.tsx`: opt stack/tools panels into the delayed initial grow timing.
- `src/components/TabPanel.test.tsx`: cover the one-time grow behavior and reduced-motion bypass.
- `src/components/cv/ExperienceList.test.tsx`: assert experience delay wiring.
- `src/components/cv/EducationSection.test.tsx`: assert education delay wiring.
- `src/components/cv/CodingExamplesSection.test.tsx`: assert coding delay wiring.
- `src/components/cv/StackAndToolsSection.test.tsx`: assert stack/tools delay wiring.

## Proposed approach
Add an optional `initialPanelGrowDelayMs` prop to `TabPanel`. When set and reduced motion is not preferred, the tab panel waits for the provided delay, then allows exactly one grow-style reveal for the first visible panel body. After that first reveal, all later tab switches render instantly. CV consumers compute the delay from the existing animated card stagger plus `ANIMATED_CARD_DURATION_MS` and a small buffer so the nested panel starts after the outer card settles.

## Execution steps
1. Add the plan file and implement the `TabPanel` opt-in grow state machine.
2. Pass `initialPanelGrowDelayMs` from the four CV tab-panel consumers using the existing delay helpers.
3. Update unit tests for the shared component and the CV consumers.
4. Run targeted tests and a production build.
5. Browser-validate `/cv` at mobile and desktop widths and confirm the sequence is correct.

## Validation plan
- `npm test -- --watch=false src/components/TabPanel.test.tsx src/components/cv/ExperienceList.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/CodingExamplesSection.test.tsx src/components/cv/StackAndToolsSection.test.tsx`
- `npm run build`
- Browser validation of `/cv` on one mobile viewport and one desktop viewport.

## Risks and rollback
- The main risk is changing shared `TabPanel` behavior for non-CV consumers; the new prop remains opt-in to contain that.
- One-time animation state can easily regress deselection or first-selection behavior; tests must cover visible-on-mount and initially-collapsed cases.
- If the motion looks wrong in the browser, rollback is isolated to the new prop wiring and the `TabPanel` animation path.

## Progress notes
- Initial implementation plan recorded before code changes.
