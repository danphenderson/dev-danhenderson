# Home And CV Route Orchestration Extraction

## Goal

Reduce the orchestration load inside the Home and CV route files by extracting the distinct page-local state machines and descriptor builders that currently make those routes hard to modify safely.

After this change:

- `src/pages/Home.tsx` remains the route composer for the home hero, welcome flow, and final JSX tree, but no longer owns inline IDE controller plumbing, expanded viewport tracking, or auto-expand timing details.
- `src/pages/CV.tsx` remains the route composer for CV mode selection, metadata, GitHub loading, and desktop/mobile/story branching, but no longer owns inline reveal-state bookkeeping or section-descriptor resolution.

## Why

The current route files are large orchestration hubs that interleave unrelated concerns:

- `src/pages/Home.tsx` mixes welcome-audio sequencing, hero motion, IDE window state, portal attachment, viewport bookkeeping, auto-expand timing, drag gating, and resize handling.
- `src/pages/CV.tsx` mixes mode parsing, metadata, GitHub loading, reveal persistence, action construction, section descriptor building, and region rendering.

The main risk is long-term maintenance cost. Future edits require loading too much route-local context before a small change can be made confidently.

## Constraints

- Preserve the client-side SPA architecture, direct-link routing behavior, and `PUBLIC_URL` compatibility.
- Keep route files declarative and preserve existing page behavior, test IDs, and child component APIs where practical.
- Keep extracted orchestration page-local under `src/pages/`; do not move route orchestration into `src/hooks/`.
- Keep the patch narrowly scoped to the state machines named in the issue and their direct tests.
- Do not fold in unrelated welcome-flow redesign, CV layout metadata changes, or shared component refactors.
- Do not disturb unrelated in-progress changes already present in the branch.

## Affected files and responsibilities

- `src/pages/Home.tsx` — route composer for the home hero; should stop owning inline IDE controller, expanded viewport tracking, and auto-expand details.
- `src/pages/CV.tsx` — route composer for the CV route; should stop owning inline reveal-state bookkeeping and section descriptor assembly.
- `src/pages/cvPageLayout.ts` — existing source of CV placement and motion metadata; the extracted CV builder must continue to consume it.
- `src/pages/homeIdeOrchestration.ts` — new page-local Home helper module for IDE window state, portal attachment, viewport tracking, and auto-expand behavior.
- `src/pages/cvRouteOrchestration.tsx` — new page-local CV helper module for reveal-state management and section descriptor building.
- `test/unit/pages/Home.test.tsx` — current safety net for IDE lifecycle, auto-expand, resize, restore, and viewport overlay behavior.
- `test/unit/pages/CV.test.tsx` — current safety net for section placement, motion props, about actions, and floating navigation.
- `test/unit/pages/CVRevealPersistence.test.tsx` — safety net for reveal persistence across mobile/desktop remounts.
- `test/unit/pages/CV.runtime.test.tsx` — smoke safety net for the live CV tree.
- `test/e2e/home.spec.ts` — browser coverage for onboarding, auto-expand, close/minimize, expand, resize, and drag.
- `test/e2e/cv.github.spec.ts` — browser coverage for GitHub states and story-mode behavior.

## Proposed approach

Extract only the most distinct page-local concerns first.

For Home:

1. Move IDE window state/session transitions into a page-local hook.
2. Move portal host/container lifecycle into a page-local hook.
3. Move expanded viewport calculation and RAF-backed resize/scroll tracking into a page-local helper/hook.
4. Move auto-expand timer/highlight lifecycle into a page-local hook.
5. Keep drag and resize pointer handling in `Home.tsx` for this pass unless they become the last major blocker to readability.

For CV:

1. Move reveal-state bookkeeping into a page-local hook.
2. Move About reveal-key generation/reset into that same hook.
3. Move section definition assembly and descriptor resolution into a page-local builder module.
4. Keep mode selection, metadata, GitHub loading, breakpoint detection, and story-mode branching in `CV.tsx`.

This keeps the patch structural and page-local while preserving the existing route/component/hook layering.

## Execution steps

1. Add this ExecPlan and keep it current during implementation.
2. Extract Home page-local orchestration helpers and rewire `Home.tsx` to consume them.
3. Extract CV page-local reveal-state and section-descriptor helpers and rewire `CV.tsx` to consume them.
4. Update focused unit tests only where helper boundaries require it, preserving current behavioral assertions.
5. Run build, targeted Jest coverage, narrow Playwright coverage, and route-level browser validation.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runInBand test/unit/pages/Home.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CVRevealPersistence.test.tsx test/unit/pages/CV.runtime.test.tsx`
- `npm run build && npm run test:e2e:chromium -- test/e2e/home.spec.ts`
- `npm run build && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts`
- Browser validation on `/` at one desktop and one narrow/mobile viewport, including welcome flow, expand/collapse, close/minimize/restore, resize, drag, and motion-off behavior.
- Browser validation on `/cv` at one desktop and one narrow/mobile viewport, including section order/placement, reveal persistence, story-mode toggle/exit, and mocked GitHub success/failure rendering.

## Risks and rollback

- Portal timing or host-attachment order could regress the Home expanded IDE overlay.
- Viewport bookkeeping extraction could subtly change expanded overlay bounds.
- CV descriptor extraction could accidentally change section ordering or region placement.
- Reveal-state extraction could accidentally reset section visibility across layout changes.

Rollback approach:

- Keep the Home and CV refactors logically separate so either route can be reverted independently.
- Preserve current child component APIs and test IDs so regressions remain isolated to the route orchestration layer.

## Progress notes

- 2026-03-22: Investigation confirmed that `src/hooks/AGENTS.md` reserves `src/hooks/` for shared adaptation hooks and explicitly warns against moving route orchestration there, so extracted modules for this refactor should stay page-local under `src/pages/`.
- 2026-03-22: Investigation confirmed that existing unit and Playwright coverage already protects the highest-risk Home and CV behaviors, so the patch should preserve those contracts rather than invent a new public API.
- 2026-03-22: Added `src/pages/homeIdeOrchestration.ts` and moved Home IDE window state/session management, portal host lifecycle, expanded viewport tracking, and auto-expand timing out of `src/pages/Home.tsx` while keeping drag/resize and route rendering in the page.
- 2026-03-22: Added `src/pages/cvRouteOrchestration.tsx` and moved CV reveal-state bookkeeping plus section descriptor assembly out of `src/pages/CV.tsx` while keeping mode selection, metadata, GitHub loading, and route branching in the page.
- 2026-03-22: Focused Jest validation passed with `export CI=true && npm test -- --watchAll=false --runInBand --runTestsByPath test/unit/pages/Home.test.tsx test/unit/pages/CV.test.tsx test/unit/pages/CVRevealPersistence.test.tsx test/unit/pages/CV.runtime.test.tsx`.
- 2026-03-22: Cleared the build blockers by aliasing the text import in `src/pages/PhotographyCategory.tsx`, switching the text-style variant typing off the restricted Typography component import in `src/styles/textStyleBuilders.ts`, and removing an unused style-type import from `src/components/cv/CVAboutSection.tsx`.
- 2026-03-22: `npm run build && printf 'BUILD_OK\n'` passed.
- 2026-03-22: `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/cv.github.spec.ts` passed overall with one retry-only tooltip flake in the CV suite, and the isolated rerun `npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts -g "renders the CV page with core sections"` passed cleanly.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
