# Home IDE Window Controls Hardening

## Goal

Make the home hero window controls and GitHub chip tilt work reliably by preserving draggable title-bar behavior, making traffic dots keyboard accessible, making reset-on-restore intentional in code, and adding focused test coverage for the new behaviors.

## Why

The staged diff introduced clickable traffic dots and per-chip tilt, but it also broke an existing home-page drag browser spec, left the traffic dots mouse-only, and did not fully cover the new expand/reset-on-restore and chip-tilt behaviors.

## Constraints

- Preserve the existing SPA and client-side-only architecture.
- Keep the change narrowly scoped to the home hero window controls, related tests, and GitHub chip tilt coverage.
- Do not rename stable routes, exported data fields, or existing public component contracts without need.
- Reset-on-restore is intentional for close and minimize, so the code should express that behavior instead of implicitly relying on incidental remounting.

## Affected files and responsibilities

- `src/components/ide/VscodeTitleBar.tsx`: traffic-dot interaction model and accessibility.
- `src/pages/Home.tsx`: route-level IDE window state, restore UI, and explicit fresh-session behavior.
- `src/components/cv/GitHubLinkChipList.tsx`: chip tilt integration already staged; verify behavior through tests.
- `test/unit/components/ide/VscodeTitleBar.test.tsx`: keyboard and click coverage for traffic dots.
- `test/unit/pages/Home.test.tsx`: expand behavior and reset-on-restore coverage.
- `test/unit/components/cv/GitHubLinkChipList.test.tsx`: tilt-wrapper coverage.
- `test/e2e/home.spec.ts`: drag regression fix and browser coverage for the new window controls.

## Proposed approach

Keep the current public APIs, but harden the interaction boundaries.

Use the title bar's existing pointer-down drag model while making the traffic dots keyboard accessible with explicit focus and keyboard activation support. In `Home`, make fresh-session restore behavior explicit with a dedicated session key that is rotated when the window is closed or minimized, and keep the restore controls outside the transformed hero wrapper so their fixed positioning behaves predictably. Expand the test suite with focused unit checks and narrow home-route Playwright coverage.

## Execution steps

1. Add explicit fresh-session restore state in `Home` and adjust restore-control placement.
2. Make traffic dots keyboard accessible without reintroducing drag-on-click behavior.
3. Extend unit tests for expand/reset-on-restore and for the GitHub chip tilt wrappers.
4. Update home Playwright coverage to drag from a non-interactive title-bar region and verify close/minimize restore flows.
5. Run targeted unit tests, `npm run build`, and the narrow home Playwright suite.

## Validation plan

- `CI=true npm test -- --watch=false --runInBand test/unit/components/ide/VscodeTitleBar.test.tsx test/unit/components/TerminalHeroContent.test.tsx test/unit/components/cv/GitHubLinkChipList.test.tsx test/unit/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`

## Risks and rollback

- The title bar has tight interaction overlap between traffic dots, the centered search affordance, and the drag surface; changes there can easily break drag or click behavior.
- The home hero wrapper uses motion transforms, so overlay positioning can regress if restore controls stay inside the transformed subtree.
- If the fresh-session implementation misfires, restore could keep stale state or reset on expand, both of which would be user-visible regressions.
- Roll back by reverting the home window-state follow-up and restoring the previous drag spec if the interaction model becomes unstable.

## Progress notes

- Review findings identified four follow-up items: drag-spec regression, reset-on-restore clarity, keyboard accessibility for traffic dots, and missing tests for expand/tilt flows.
- User confirmed that reset-on-restore is intentional and should be made explicit and covered by tests.
- `Home` now rotates an explicit IDE session key on close and minimize, uses that key for fresh-session remounts, and exposes the session token on the hero window for test coverage.
- `VscodeTitleBar` traffic dots now support keyboard activation with visible focus styling while still preventing drag-start propagation on click.
- Targeted unit coverage now includes expand behavior, explicit reset-on-restore session-token assertions, keyboard traffic-dot activation, and tilt-wrapper assertions for animated and non-animated GitHub chip paths.
- `test/e2e/home.spec.ts` now covers close/restore and minimize/restore fresh-session behavior and uses a safer drag start point outside the interactive title-bar controls.
- Validation completed successfully with targeted unit tests, `npm run build`, and `npx playwright test test/e2e/home.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
