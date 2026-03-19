# Design-System Cleanup Smoke Tests

## Goal

Bring the identified drifting UI surfaces back onto the shared route, text, card, and panel primitives without changing route behavior, and add focused smoke tests that fail if those surfaces bypass the shared primitives again.

## Why

The audit found a small cluster of fallback and utility surfaces that still hand-build standard headings, body copy, and inset panels even though the repository now documents shared primitives for those roles. Cleaning up those surfaces reduces local styling drift and gives future contributors tests that catch regressions early.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and direct-link behavior.
- Keep changes narrowly scoped to the identified cleanup targets.
- Do not redesign the intentional alternative subsystems: Home faux IDE shell, blog editorial surfaces, photography overlays/lightbox, or CV story mode.
- Preserve existing route copy and recovery behavior unless small wording adjustments are needed to fit shared primitives cleanly.

## Affected files and responsibilities

- `src/pages/NotFound.tsx`: route-level recovery page heading/body cleanup.
- `src/pages/BlogPost.tsx`: blog post not-found branch cleanup.
- `src/pages/PhotographyCategory.tsx`: photography album not-found branch cleanup.
- `src/components/RouteRecoveryPanel.tsx`: shared recovery panel surface and text cleanup.
- `src/components/header/HintPopover.tsx`: align popover title/body with shared text primitives.
- `src/pages/Home.tsx`: align audio prompt body/error copy with shared text primitives.
- `test/unit/pages/NotFound.test.tsx`: page smoke coverage for shared recovery primitives.
- `test/unit/pages/BlogPost.test.tsx`: page smoke coverage for blog fallback primitives.
- `test/unit/pages/PhotographyCategory.test.tsx`: page smoke coverage for photography fallback primitives.
- `test/unit/components/RouteRecoveryPanel.test.tsx`: component smoke coverage for shared recovery panel primitives.
- `test/unit/components/header/HintPopover.test.tsx`: smoke coverage for popover primitive usage.
- `test/unit/pages/Home.test.tsx`: smoke coverage for audio prompt primitive usage.

## Proposed approach

Refactor the standard fallback branches to use `SectionHeading` and shared text primitives while preserving their route-level layout and recovery actions. Update `RouteRecoveryPanel` to use shared text primitives and `SectionPanel` for nested recovery rows instead of locally recreating a glass card style. Keep the changes minimal and validated with targeted unit tests that mock the relevant primitives so the tests fail if raw MUI markup is reintroduced.

## Execution steps

1. Add the ExecPlan and verify the affected page/component tests that already exist.
2. Refactor `NotFound`, `BlogPost`, and `PhotographyCategory` fallback content to use shared heading/text primitives and add page-level smoke assertions.
3. Refactor `RouteRecoveryPanel` to use shared inset surfaces and shared text primitives, then add component smoke assertions.
4. Refactor `HintPopover` and the Home audio prompt copy to shared text primitives and add targeted smoke assertions.
5. Run the narrowest relevant unit tests, then run `npm run build` if the targeted tests pass cleanly.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/pages/NotFound.test.tsx test/unit/pages/BlogPost.test.tsx test/unit/pages/PhotographyCategory.test.tsx test/unit/components/RouteRecoveryPanel.test.tsx test/unit/components/header/HintPopover.test.tsx test/unit/pages/Home.test.tsx`
- `npm run build`

## Risks and rollback

- The main regression risk is making the smoke tests too implementation-specific and brittle; keep them focused on primitive usage and visible fallback content.
- `RouteRecoveryPanel` is reused across multiple recovery branches, so styling changes there can affect several routes at once.
- If the shared panel styling is visually too dense or too flat, the change can be isolated by reverting only `RouteRecoveryPanel.tsx` while keeping the page-level heading cleanup.

## Progress notes

- 2026-03-18: Plan created from the design-system audit. Existing unit tests already cover all identified cleanup targets, which makes targeted smoke coverage feasible without adding new broad suites.
- 2026-03-18: Refactored the fallback branches in `NotFound`, `BlogPost`, and `PhotographyCategory` to use `SectionHeading`, while keeping their route copy and recovery behavior intact.
- 2026-03-18: Refactored `RouteRecoveryPanel` to use `SectionPanel` plus shared text primitives instead of local frosted-card styling and raw `Typography`.
- 2026-03-18: Refactored `HintPopover` and the Home audio prompt to use shared semantic text primitives.
- 2026-03-18: Added primitive-usage smoke tests to the touched page/component suites. The Home page flow test was made deterministic by bootstrapping the post-play pause-hint state in the page test while relying on the existing `useHomeWelcomeSequence` hook tests for direct `handlePlay` coverage.
- 2026-03-18: Validation completed with targeted unit tests for the touched suites, direct ESLint verification for the touched page files, and a fresh-shell `npm run build` that compiled successfully.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
