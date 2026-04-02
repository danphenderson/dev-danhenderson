# CV Story Reveal Sequencing

## Goal

Keep later `/cv?mode=story` chapters hidden until the chapter above has fully finished revealing, so lower story items never appear while the current chapter's content is still animating in.

## Why

Story mode currently lets each chapter reveal itself independently when its wrapper enters view. That works for simple section text, but the chapter-local skills chip rows have their own delayed slide animation. In practice, a lower chapter can unlock while the current chapter's chips are still moving, which breaks the intended single-threaded story choreography.

## Constraints

- Preserve the existing client-side `/cv` route and story-mode entry/exit behavior.
- Keep the change scoped to the CV story subsystem; do not redesign default exploratory `/cv`.
- Preserve reduced-motion and `motionIntensity=off` behavior so delays collapse cleanly.
- Keep the existing per-chip skills motion if possible.
- Avoid widening shared component APIs unless the story fix genuinely needs it.

## Affected files and responsibilities

- `src/components/cv/CVStoryViewer.tsx`: own the ordered reveal queue so later chapters only unlock after earlier chapters settle.
- `src/components/cv/CVStorySectionRenderer.tsx`: accept explicit reveal state, keep hidden chapters non-interactive, and align chapter-local animation timing with viewer sequencing.
- `test/unit/components/cv/CVStoryViewer.test.tsx`: cover queued reveal order and active-label behavior.
- `test/unit/components/cv/CVStorySectionRenderer.test.tsx`: cover hidden-state behavior and deterministic story chip timing.
- `test/e2e/cv.github.spec.ts`: keep route-level story-mode coverage aligned if a stable sequencing assertion is practical.

## Proposed approach

Move reveal ownership into `CVStoryViewer`. The viewer will continue tracking raw chapter intersections for progress/header behavior, but it will reveal chapters sequentially: chapter `n + 1` cannot unlock until chapter `n` reports that its reveal animation has settled.

Keep the per-chip story motion, but remove the chip row's independent row-in-view trigger as the pacing source. Instead, align the chip animation to the chapter reveal timeline so the viewer can compute a deterministic settle point for each chapter. This preserves the chip motion while eliminating the overlapping choreography shown in the bug report.

## Execution steps

1. Add a written ExecPlan before code changes.
2. Update `CVStoryViewer` to track requested, revealed, and settled chapter indices separately.
3. Pass explicit reveal state into `CVStorySectionRenderer` and keep unrevealed chapters visually hidden and non-interactive.
4. Make story chip rows animate from the chapter reveal timeline instead of their own viewport trigger.
5. Add focused unit coverage for queued reveal order and renderer timing.
6. Run targeted build, unit, route Playwright, and manual browser validation.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false test/unit/components/cv/CVStoryViewer.test.tsx test/unit/components/cv/CVStorySectionRenderer.test.tsx`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts`
- Manual browser validation on `http://localhost:3001/cv?mode=story` in desktop and narrow widths, including a motion-off check.

## Risks and rollback

- The main risk is deadlocking the reveal queue if a chapter never reports settled. Keep the settle calculation deterministic and immediate when motion is off.
- Hiding unrevealed chapters without removing them from layout can create blank runway if the queue logic is wrong; cover this with unit tests and browser validation.
- Rollback is isolated: revert the viewer-owned reveal state and restore the section-local reveal trigger if the new sequencing misbehaves.

## Progress notes

- [2026-04-02] Confirmed the visible overlap comes from two independent reveal sources: chapter-level `MotionSection` viewport entry and story chip rows starting their own delayed slide animation afterward.
- [2026-04-02] Chose viewer-owned sequential unlocks and deterministic chapter settle timing over root-margin tuning because the bug is a choreography ordering issue, not just an early viewport threshold.
- [2026-04-02] Added a fast-scroll catch-up path in `CVStoryViewer` so once the scroll position requests a chapter beyond the settled queue, the viewer reveals through that chapter immediately instead of leaving hidden chapters mounted as blank runway.
- [2026-04-02] Final implementation keeps story items mounted in layout but viewer-gates their reveal order, aligns story chip motion to the chapter timeline, and keeps hidden chapters scroll-addressable with `opacity` plus `pointer-events: none` instead of `visibility: hidden`.
- [2026-04-02] Focused unit coverage passed, the targeted CV story Playwright check passed after aligning the test to the new reveal contract, and the remaining Playwright failure stayed limited to the unrelated Michigan Tech tooltip copy mismatch.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
