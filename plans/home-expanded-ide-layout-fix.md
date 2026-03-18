# Home Expanded IDE Layout Fix

## Goal

Make the home-route expanded IDE fill the intended page viewport between the site header and footer, and ensure the IDE chrome, tabs, editor pane, and terminal panel all expand together when the green traffic dot is clicked.

## Why

The recent home-shell commits introduced an expanded mode at the route level, but the overlay currently uses viewport-wide fixed positioning while the inner IDE subcomponents still keep their compact hero widths and heights. The result is a partially expanded shell with blank background space and inconsistent bounds relative to the page header and footer.

## Constraints

- Preserve the existing SPA and client-side-only architecture.
- Keep the change scoped to the home route, the shared IDE shell components it composes, and focused home-route tests.
- Do not change stable routes, data models, or unrelated shared component behavior.
- Preserve current close/minimize restore behavior and the draggable normal-state window interaction.

## Affected files and responsibilities

- `src/pages/Home.tsx`: own the expanded overlay viewport bounds and pass expanded state into the IDE shell.
- `src/components/TerminalHeroContent.tsx`: expose an expanded mode and thread it into the IDE subcomponents.
- `src/components/ide/VscodeTabBar.tsx`: expand the tab strip width in expanded mode.
- `src/components/ide/VscodeEditorPane.tsx`: expand editor width and height in expanded mode.
- `src/components/ide/VscodeTerminalPanel.tsx`: expand terminal width and body height in expanded mode.
- `test/unit/pages/Home.test.tsx`: verify expanded mode is explicitly enabled on the expanded shell.
- `test/unit/components/TerminalHeroContent.test.tsx`: verify expanded mode reaches the tab bar, editor pane, and terminal panel.
- `test/e2e/home.spec.ts`: verify expanded layout bounds and internal resizing in the browser.

## Proposed approach

Keep the expanded overlay owned by `Home`, but compute viewport-aware fixed bounds so it stays below the visible header and above any visible footer area. Add an explicit `expanded` prop to the IDE shell so the tab bar, editor pane, and terminal panel switch from compact hero sizing to full-width, full-height layout rules only in expanded mode.

## Execution steps

1. Add a viewport-bounds helper in `Home` for the expanded overlay and pass `expanded` into the expanded IDE shell.
2. Add explicit expanded-mode layout behavior to `TerminalHeroContent`.
3. Update the tab bar, editor pane, and terminal panel to respect expanded mode.
4. Update unit and Playwright coverage for expanded-mode layout behavior.
5. Run focused validation.

## Validation plan

- `CI=true npm test -- --watch=false --runInBand test/unit/components/TerminalHeroContent.test.tsx test/unit/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`

## Risks and rollback

- The expanded overlay depends on live layout measurements, so missing or changing page anchors could affect bounds calculations.
- The IDE shell uses nested flex layouts and fixed heights today; expanded-mode overrides can easily introduce clipping if `minHeight: 0` is missed in one layer.
- Roll back by removing the expanded viewport state in `Home` and reverting the expanded-mode prop/threading in the IDE shell.

## Progress notes

- Plan created before implementation.
- Implementation complete.
- Focused Jest, build, and home Playwright validation passed.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
