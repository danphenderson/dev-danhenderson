# CV Story Review Fixes Round 2

## Goal

Address the remaining merge blockers for `/cv?mode=story` by making active-section tracking deterministic, replacing the interleaved global chronology with a chapter-based narrative order, collapsing the deprecated slide renderer into a true compatibility wrapper, and updating the canonical docs to match the shipped continuous-scroll architecture.

## Why

The current branch still has three kinds of drift called out in review:

- `CVStoryViewer` can report the wrong active section when multiple story sections intersect at once because it still treats observer entry order as meaningful.
- `buildCVStoryItems()` still interleaves different story kinds by absolute date, which fights the continuous-scroll narrative format.
- Canonical architecture/testing docs still describe the retired slide-deck system, and the old `CVStorySlideRenderer.tsx` surface had become duplicate story-mode cruft.

## Constraints

- Preserve the fully client-side SPA architecture and direct-link routing behavior.
- Keep story content sourced from the existing TypeScript data modules.
- Keep the change narrowly scoped to CV story mode behavior, directly related tests, and the canonical docs that describe it.
- Preserve existing public data shapes unless all consumers are updated together.
- Do not reintroduce slide-deck navigation concepts into the continuous-scroll viewer.

## Affected files and responsibilities

- `src/components/cv/CVStoryViewer.tsx`: deterministic active-section tracking and stable React keys for story sections.
- `test/unit/components/cv/CVStoryViewer.test.tsx`: regression coverage for multi-entry observer callbacks and persistent intersection state.
- `src/data/cvStoryItems.ts`: chapter-based narrative ordering for story items.
- `test/unit/data/cvStoryItems.test.ts`: coverage for grouped chapter ordering and within-chapter sorting.
- `src/components/cv/CVStorySlideRenderer.tsx`: obsolete compatibility shim to remove if the audit shows no remaining consumers.
- `docs/frontend/component-architecture.md`: canonical component ownership description for the continuous-scroll story mode.
- `docs/frontend/page-choreography.md`: canonical route choreography and page/component ownership for scroll-based story mode.
- `docs/frontend/motion-architecture.md`: canonical story-mode motion description after slide-deck removal.
- `docs/engineering/testing-strategy.md`: canonical validation/testing expectations for the current story-mode behavior.
- `docs/design-system-reference.md`: shared-component catalog alignment for the active story renderer.

## Proposed approach

Make `CVStoryViewer` derive the active story label from the full set of currently intersecting sections, not the order of the latest observer entries. The viewer will maintain intersection state across callbacks and resolve the active section deterministically by picking the lowest currently intersecting story index, which matches the topmost visible chapter in the ordered narrative.

Replace the global cross-kind chronological sort in `buildCVStoryItems()` with explicit chapter grouping that mirrors the curated CV flow: experience, education, volunteering, and certificates, each sorted internally by date, followed by coding examples and the end card.

Remove `CVStorySlideRenderer.tsx` entirely if the audit confirms there are no remaining imports or downstream consumers. Keep `CVStorySectionRenderer` as the only renderer surface and update the canonical docs so they no longer describe the deleted shim.

## Execution steps

1. Add this ExecPlan and keep it current while implementing the review fixes.
2. Update `CVStoryViewer` so intersection handling is deterministic and story section keys are stable.
3. Update story-item construction to use explicit narrative chapter order and adjust the data tests.
4. Replace the duplicated slide renderer implementation with a compatibility wrapper around `CVStorySectionRenderer`.
5. Update the canonical docs that still describe slide navigation and slide-only motion.
6. Run focused build and unit validation for the touched component/data surfaces.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runInBand test/unit/components/cv/CVStoryViewer.test.tsx test/unit/data/cvStoryItems.test.ts`

## Risks and rollback

- Changing active-section logic can cause label flicker or stale state if the intersection set is not maintained across callbacks.
- Changing story-item ordering can create unexpected chapter flow if the chosen order does not match the intended CV narrative.
- Doc updates can easily miss a stale slide-system reference if the patch only touches the most obvious sections.
- If the active-section logic misbehaves, rollback should be limited to the viewer callback path without affecting the rest of story-mode rendering.

## Progress notes

- 2026-03-20: Plan created for the second review pass. Intended narrative order is the existing CV section flow without the GitHub panel: about → experience → education → volunteering → certificates → coding → end.
- 2026-03-20: Updated `CVStoryViewer` so the active story label is derived from the full set of currently intersecting sections, using the lowest visible story index instead of observer entry order. Added a unit regression that simulates multiple visible sections in one callback and then removes the leading section in a later callback.
- 2026-03-20: Replaced the global cross-kind chronological sort in `buildCVStoryItems()` with explicit chapter grouping that mirrors the existing CV section flow, while preserving oldest-first sorting within each chapter.
- 2026-03-20: Follow-up audit found no remaining code, test, or doc consumers of the `CVStorySlideRenderer` export path beyond the shim itself, so the file was deleted and the remaining compatibility references were removed.
- 2026-03-20: Validation completed with `npm run build`, `CI=true npm test -- --watch=false --runInBand test/unit/components/cv/CVStoryViewer.test.tsx test/unit/data/cvStoryItems.test.ts`, and `npm run test:e2e -- test/e2e/cv.github.spec.ts --project=chromium`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
