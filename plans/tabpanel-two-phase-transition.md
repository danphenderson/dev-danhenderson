# TabPanel Two-Phase Content Transition

## Goal

Make tab panel interaction feel smooth by opening the drawer first, then revealing and animating drawer content only after the drawer has fully expanded.

## Why

Current behavior starts inner content animation while the drawer is still opening, creating choppy motion and perceived layout contention.

## Constraints

- Keep change narrowly scoped to tab panel transition behavior.
- Preserve existing shared component APIs unless extension is required.
- Preserve SPA/client-only architecture and existing route behavior.
- Avoid unrelated style or content refactors.

## Affected files and responsibilities

- `src/components/TabPanel.tsx`: introduce two-phase transition gating and post-open opacity polish.
- `src/components/AnimatedSlideList.tsx`: add opt-in ability to keep slide children mounted while exited.
- `src/components/SkillsChipList.tsx`: thread keep-mounted option to slide list mode.
- `src/components/cv/EducationSection.tsx`: opt in tabpanel detail lists/chips to keep mounted while exited.
- `src/components/cv/ExperienceList.tsx`: opt in tabpanel detail lists/chips to keep mounted while exited.
- `src/components/cv/CodingExamplesSection.tsx`: opt in tabpanel detail lists/chips to keep mounted while exited.
- `src/components/cv/VolunteeringList.tsx`: opt in tabpanel detail lists to keep mounted while exited.

## Proposed approach

1. Track a per-panel "content ready" state in TabPanel.
2. Set selected panel content to not ready as soon as selection changes.
3. Use Collapse lifecycle callbacks to flip readiness true only on `onEntered`.
4. Pass readiness-gated selection to `renderContent` so child animations start after drawer expansion completes.
5. Add a short opacity fade wrapper for second-phase reveal polish.
6. Keep animated slide items mounted when exited only where tabpanel content is used, to reduce reflow/pop while opening.

## Execution steps

1. Add keep-mounted opt-in to AnimatedSlideList and thread through SkillsChipList.
2. Update TabPanel with per-panel readiness state and Collapse callbacks.
3. Add opacity transition wrapper tied to content-ready state.
4. Opt in tabpanel CV consumers to keep-mounted slide content.
5. Run build validation.

## Validation plan

- `npm run build`
- Check for TypeScript/lint errors in changed files.

## Risks and rollback

- Risk: content visibility state could desync when tabs are disabled/removed dynamically.
- Mitigation: prune readiness map to enabled tab values.
- Risk: keeping slide items mounted could alter offscreen rendering behavior.
- Mitigation: keep the new behavior opt-in and only enable for tabpanel consumers.
- Rollback: revert the new props and readiness gating, restoring direct `isSelected` pass-through.

## Progress notes

- Plan created before implementation.
- Added per-panel content readiness gating in TabPanel and switched renderContent to use gated readiness.
- Added short opacity fade wrapper in TabPanel for post-open content reveal polish.
- Added opt-in keep-mounted behavior to AnimatedSlideList and threaded it through SkillsChipList.
- Enabled keep-mounted behavior in tabpanel CV consumers for smoother drawer opening.
- Added close sequencing in TabPanel: content exits first, then drawer collapse closes.
- Added reverse-order exit staggering support in AnimatedSlideList and enabled it for tabpanel CV consumers.
- Kept closing tab content visible during the exit phase and aligned drawer close delays with staggered slide-list exit duration.
- Validated with `npm run build` and `npx playwright test test/e2e/cv.github.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
