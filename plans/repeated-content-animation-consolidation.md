# Repeated Content Animation Consolidation

## Goal

Reduce the overlap between the three repeated-content animation primitives so the codebase has one primary controlled-list animation primitive, a clearly specialized viewport-card list, and no duplicate zoom-list implementation that must be maintained separately.

After this change:

- `AnimatedSlideList` remains the canonical public primitive for parent-controlled repeated-item entrance and exit animation.
- zoom-specific rendering remains only in local chip-oriented helpers where it is still needed.
- `AnimatedContentList` remains a specialized viewport/card orchestrator for CV entry cards instead of a competing general-purpose list abstraction.

## Why

The current shared component layer splits repeated-content animation across three abstractions that solve similar problems with different APIs and different implementations:

- `AnimatedSlideList` owns parent-controlled stagger sequencing, exit reversal, and tab/drawer timing helpers.
- zoom-specialized chip reveals need controlled timing but do not need a second shared public primitive.
- `AnimatedContentList` overlaps on repeated-item timing but is really a viewport-triggered card wrapper with tilt and surface composition.

This fragmentation makes motion behavior, reduced-motion handling, and bug fixes harder to reason about. It also obscures which primitive should be used for new repeated-content animation work.

## Constraints

- Preserve the client-side SPA architecture, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep the change narrowly scoped to shared animation primitives, their direct consumers, focused tests, and the design-system docs that describe them.
- Preserve `AnimatedSlideList` public props and the `getAnimatedSlideListCloseDelayMs()` helper used by CV tab-panel consumers.
- Preserve `AnimatedContentList` behavior around `mountItemsOnView`, `itemSurface`, and `tiltItems`.
- Do not revert unrelated in-progress work already present in the branch.
- Do not broaden this patch into global motion-token retuning or a wider CV redesign.

## Affected files and responsibilities

- `src/components/AnimatedSlideList.tsx` — canonical public controlled-list primitive; should route through the shared internal implementation while preserving its public contract.
- `src/components/SkillsChipList.tsx` — preserve public animation behavior while keeping zoom-specific behavior local to the chip list instead of routing through a second shared primitive.
- `src/components/cv/GitHubLinkChipList.tsx` — preserve animated GitHub chip behavior while keeping zoom-specific behavior local to the chip list instead of routing through a second shared primitive.
- `src/components/AnimatedContentList.tsx` — keep the viewport/card specialization and only share logic that does not break `AnimatedContentCard` composition.
- `test/unit/components/AnimatedSlideList.test.tsx` — preserve controlled-list sequencing, container handling, and reduced-motion behavior.
- `test/unit/components/AnimatedContentList.test.tsx` — guard the viewport/card-specific behavior that must remain specialized.
- `test/unit/components/SkillsChipList.test.tsx` — update implementation-bound assertions if the default controlled-list primitive boundary changes.
- `test/unit/components/cv/GitHubLinkChipList.test.tsx` — update animated-chip expectations if the zoom list is demoted or removed.
- `docs/frontend/component-architecture.md` — update the shared list-primitive ownership model.
- `docs/design-system-reference.md` — update repeated-item guidance so the abstraction hierarchy is explicit.
- `docs/project/overview.md` — keep the high-level composition summary aligned with the implemented component roles.

## Proposed approach

Use `AnimatedSlideList` as the primary public repeated-content animation primitive for parent-controlled lists. Extract the duplicated controlled-list logic into a private helper inside `src/components/`, then keep any remaining zoom-specific behavior local to chip-oriented consumers rather than preserving a second shared public list primitive.

Keep `AnimatedContentList` separate because it is not just another controlled-list primitive: it owns viewport-triggered card reveal, `AnimatedContentCard` composition, optional `MotionTiltCard`, and shared card/panel/plain surfaces.

This approach reduces duplication without creating a fourth public primitive or destabilizing the CV card-list behavior that the repository docs already treat as a special case.

## Execution steps

1. Add this ExecPlan and keep it updated as implementation progresses.
2. Extract a shared internal controlled-list animation path that owns scaled stagger timing, stack/wrap container rendering, and reduced-motion behavior.
3. Rebuild `AnimatedSlideList` on top of the shared path while preserving its public API and `getAnimatedSlideListCloseDelayMs()` timing helper.
4. Remove `AnimatedZoomList` and move the remaining zoom-specific behavior into local chip-oriented helpers built on the shared path.
5. Update `SkillsChipList` and `GitHubLinkChipList` to use the new structure without changing their public props.
6. Refresh focused unit tests and shared-component docs.
7. Run focused validation, then the relevant build and E2E coverage.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/AnimatedContentList.test.tsx test/unit/components/AnimatedSlideList.test.tsx test/unit/components/SkillsChipList.test.tsx test/unit/components/cv/GitHubLinkChipList.test.tsx`
- `npm run build`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts test/e2e/smoke.spec.ts`
- Browser validation on `/cv` at mobile and desktop widths with motion intensity at both default and `off`, checking top-level entry cards, tab/drawer detail lists, and animated chip lists.

## Risks and rollback

- Consolidating the controlled-list internals could accidentally change stagger timing, entry order, or reduced-motion behavior.
- Localizing zoom behavior into chip consumers could subtly change chip list semantics if those consumers relied on the old shared wrapper shape.
- Sharing too much with `AnimatedContentList` could break the `tiltItems` composition path that the repo docs already flag as fragile.

Rollback approach:

- If the shared controlled-list extraction destabilizes consumers, revert the internal extraction and keep `AnimatedSlideList` intact first.
- If full removal proves too disruptive, keep zoom-specific behavior local to a single chip-oriented consumer first instead of restoring it as a shared public primitive.
- If `AnimatedContentList` sharing changes behavior, keep it fully separate and limit this patch to the parent-controlled-list overlap.

## Progress notes

- Discovery confirmed that the current workspace already removed the old `Slide as unknown as ...` cast from `AnimatedSlideList`; this task should preserve that improvement rather than reintroduce local typing shims.
- Discovery confirmed that `AnimatedSlideList` is the strongest candidate for the canonical public controlled-list primitive because it already owns `reverseExitStagger`, `keepMountedWhenExited`, and `getAnimatedSlideListCloseDelayMs()`.
- Discovery confirmed that `AnimatedContentList` is not a clean drop-in replacement because its `tiltItems` path depends on per-item `AnimatedContentCard` composition.
- Implemented a shared internal controlled-list timing path in `src/components/animatedListShared.ts` and rebuilt `AnimatedSlideList` on top of it.
- Removed `AnimatedZoomList` and moved the remaining zoom-specialized behavior into `SkillsChipList` and `GitHubLinkChipList` so the codebase no longer exposes a second shared controlled-list primitive.
- Focused unit validation passed for `AnimatedContentList`, `AnimatedSlideList`, `SkillsChipList`, and `GitHubLinkChipList` before the final cleanup step.
- `npm run build` was rerun after the stricter cleanup phase and is still blocked only by unrelated existing lint/build errors in `src/pages/PhotographyCategory.tsx` and `src/styles/textStyleBuilders.ts`, so broader build-backed route validation could not be completed inside this pass.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
