# Home IDE Resize Regression Fixes

## Goal

Restore the intended home-route expanded IDE bounds, keep manual resize constrained to the visible hero area after dragging, and prevent resize handles from blocking IDE content interactions.

## Why

The staged resize follow-up introduced three regressions: expanded mode no longer respects the page-scoped viewport below the header, normal-mode resize can push the dragged window outside its bounds, and the new right-edge resize sash sits on top of the editor's own scrollbar hit area.

## Constraints

- Preserve the client-side SPA architecture and current route behavior.
- Keep the fix scoped to the home route, the shared IDE shell components it composes, and focused tests.
- Preserve close/minimize restore semantics and the current expanded/normal IDE affordances.
- Do not rename stable exports or route wiring.

## Affected files and responsibilities

- `src/pages/Home.tsx`: restore viewport-aware expanded overlay bounds and clamp normal-mode resize against the remaining available space.
- `src/components/TerminalHeroContent.tsx`: reserve safe resize gutters and keep the resize handle wiring scoped to normal mode.
- `src/components/ide/VscodeResizeHandle.tsx`: continue exposing the resize affordances without covering content hit targets.
- `src/components/ide/vscodeTokens.ts`: provide resize-gutter tokens if needed by the shell.
- `test/unit/pages/Home.test.tsx`: verify expanded overlay contract and dragged-position resize clamping.
- `test/unit/components/TerminalHeroContent.test.tsx`: verify resize gutter behavior alongside handle threading.
- `test/unit/components/ide/*.test.tsx`: strengthen IDE component coverage where the current smoke tests miss real layout/interaction regressions.
- `test/e2e/home.spec.ts`: existing browser contract should remain green without widening scope.

## Proposed approach

Reinstate the existing viewport measurement logic in `Home` so expanded mode renders inside the page-scoped viewport and re-exposes the `home-ide-expanded` overlay hook. For manual resize, capture the hero's current rendered rectangle when resizing starts and clamp width/height to the remaining horizontal and vertical space inside the hero bounds. In the shared shell, reserve dedicated right/bottom resize gutters inside the outer container so the handles remain available without overlaying editor or terminal scrollbars. Add focused unit assertions for expanded overlay bounds, dragged-position clamping, and resize gutter layout so the regressions are covered by tests instead of smoke rendering.

## Execution steps

1. Restore the page-scoped expanded overlay measurement path in `Home` and reintroduce the `home-ide-expanded` wrapper.
2. Update resize clamping in `Home` to use the current rendered hero position inside `heroBoundsRef`.
3. Reserve non-content resize gutters in `TerminalHeroContent` and adjust resize-handle usage if needed.
4. Expand Home and IDE component tests to assert the fixed contracts.
5. Run targeted tests, build, and the narrow home Playwright suite.

## Validation plan

- `CI=true npm test -- --watch=false --runInBand test/unit/pages/Home.test.tsx test/unit/components/TerminalHeroContent.test.tsx test/unit/components/ide/*.test.tsx`
- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`

## Risks and rollback

- The expanded overlay relies on live layout measurements; missing page anchors can cause null bounds or incorrect positioning.
- Resize clamping depends on DOM rectangles at pointer-down time; mixing transformed wrappers and nested shells can easily produce off-by-one clipping if the wrong element is measured.
- Reserving resize gutters changes the inner shell's available space and can subtly affect IDE chrome alignment.
- Roll back by removing the resize-specific follow-up and returning to the pre-resize home/IDE shell state if the interaction model becomes unstable.

## Progress notes

- Plan created before implementation.
- Review findings to address: page-scoped expanded overlay contract, dragged-position resize clamping, and resize sash overlap with content hit areas.
- `Home` now restores the measured page-scoped expanded overlay bounds and reintroduces the `home-ide-expanded` wrapper used by the existing browser contract.
- Normal-mode resize now clamps against the remaining right/bottom space from the hero's current rendered position instead of the full bounds size.
- `TerminalHeroContent` now keeps the visible shell footprint unchanged while `VscodeResizeHandle` renders in an outer overlay lane outside the shell so resize hit targets no longer cover editor or terminal content.
- Focused unit coverage now verifies expanded overlay geometry, dragged-position resize clamping, direct resize-handle callbacks, and prop-branch coverage across IDE shell components.
- Validation completed with focused Jest, `npm run build`, and `npx playwright test test/e2e/home.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
