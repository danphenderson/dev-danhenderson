# Home auto-expand fix

## Goal

Ensure the Home route's post-motion VS Code expand pulse reliably transitions the hero window into the expanded overlay state after the motion sequence completes.

## Why

The staged change adds a green-dot highlight after the hero motion completes, but the window never expands in the real UI. The new flow needs to pass review and a strict quality gate by fixing the broken state transition and keeping cancellation behavior correct when the user closes or minimizes the hero before expansion.

## Constraints

- Keep the change narrowly scoped to the Home-route VS Code hero flow.
- Preserve the existing SPA route behavior and static-hosting compatibility.
- Keep route-level orchestration in `src/pages/Home.tsx`; do not push page state into shared components.
- Preserve the existing close, minimize, restore, and manual expand behaviors.
- Validate the affected Home route in both automated tests and a browser.

## Affected files and responsibilities

- `src/pages/Home.tsx`: owns the post-motion orchestration, auto-expand scheduling, and IDE window state.
- `src/components/TerminalHeroContent.tsx`: threads expand-highlight state into the VS Code title bar.
- `src/components/ide/VscodeTitleBar.tsx`: renders the green-dot highlight affordance.
- `test/unit/pages/Home.test.tsx`: verifies the auto-expand scheduling, cancellation, and one-shot behavior.
- `test/e2e/home.spec.ts`: candidate location for route-level browser regression coverage if the change benefits from explicit end-to-end automation.

## Proposed approach

Replace the current queued-effect auto-expand flow with a single scheduling callback triggered from `handleMotionComplete()`. That callback will own the one-shot guard, pulse highlight state, timeout lifecycle, and expansion state transition so the timer cannot be cleared by its own bookkeeping rerender. Keep cancellation centralized so manual close/minimize still suppress pending expansion. Update tests to exercise the fixed scheduling path directly.

## Execution steps

1. Remove the self-canceling queued-effect flow from `Home.tsx` and replace it with a deterministic auto-expand scheduler.
2. Keep the green-dot highlight wiring intact through `TerminalHeroContent` and `VscodeTitleBar`, adjusting only what is required for correctness.
3. Update unit tests to verify expansion after the post-motion delay, cancellation on manual close, and one-shot behavior after restore.
4. Run targeted validation and add/adjust Home route browser coverage if needed to prove the fix in a real browser.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/pages/Home.test.tsx`
- `npm run build`
- Home route browser validation for the post-motion expand flow
- Narrowest relevant Playwright coverage if the browser validation indicates the route should carry explicit regression coverage

## Risks and rollback

- The Home hero has intertwined motion, portal, drag, and resize behavior; it is easy to regress close/minimize or expanded overlay rendering while fixing auto-expand.
- Timer cleanup must remain correct so a pending auto-expand does not fire after close, minimize, or unmount.
- If the new flow introduces regressions, the change can be isolated by reverting the `Home.tsx` auto-expand orchestration and the accompanying tests.

## Progress notes

- Confirmed the staged bug: the auto-expand effect clears its own timeout on the rerender caused by `setAutoExpandQueued(false)`, leaving only the dot highlight visible.
- Planned fix: move auto-expand scheduling out of the effect and into a single callback triggered from motion completion.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
