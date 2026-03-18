# Home VS Code Consistency Follow-up

## Goal

Fix the staged home-route VS Code hero regressions and consistency gaps so the draggable shell,
tilt interaction, editor tabs, and surrounding chrome behave like one coherent UI.

## Why

The current staged work improves the home hero substantially, but it leaves several follow-up bugs:

- mouse-move propagation is blocked across most terminal surfaces, suppressing the existing tilt
  interaction outside of active drag
- the new shared editor-tab state is not reflected by all dependent chrome surfaces, so the explorer,
  status bar, and notification toast can contradict the active tab
- IntelliSense hover content still reflects the old demo file instead of the new server/client files
- one terminal output colorization rule does not match the staged home-route data

These issues are all local to the home hero/editor family and should be fixed together so the shell
feels production-consistent.

## Constraints

- Preserve the current SPA architecture and direct-link routing behavior.
- Keep the change scoped to the home page and terminal component family.
- Do not add dependencies or introduce backend behavior.
- Preserve the new draggable-window interaction and fixed-width editor-column approach.
- Follow existing component/page separation: page owns orchestration, terminal subcomponents own
  local presentation.

## Affected files and responsibilities

- `src/components/TerminalHeroContent.tsx`: continue to own the shared active-tab state and pass it
  into dependent subcomponents.
- `src/components/terminal/VscodeTabBar.tsx`: consume shared tab metadata instead of duplicating file
  labels and badge styling.
- `src/components/terminal/VscodeExplorerSidebar.tsx`: highlight the file that matches the active tab.
- `src/components/terminal/VscodeStatusBar.tsx`: render the language mode that matches the active tab.
- `src/components/terminal/VscodeNotificationToast.tsx`: show toast copy for the currently active file.
- `src/components/terminal/VscodeEditorPane.tsx`: align IntelliSense hover content with the new demo
  files and use shared tab metadata where appropriate.
- `src/components/terminal/VscodeIntelliSenseTooltip.tsx`: render symbol-specific tooltip content.
- `src/components/terminal/VscodeTerminalPanel.tsx`: align output colorization with the actual home
  hero output.
- `src/components/terminal/vscodeTokens.ts`: hold any shared file-type tokens needed by multiple
  terminal chrome surfaces.
- `src/components/terminal/vscodeInteractionHelpers.ts`: remove or narrow the helper if it is no
  longer needed after restoring tilt.
- `test/unit/components/TerminalHeroContent.test.tsx`: cover active-tab propagation beyond the tab bar
  and editor pane.

## Proposed approach

Use a single shared metadata module for the VS Code editor tabs so the tab bar, explorer, status bar,
and toast all derive file-specific labels from the same source of truth. Remove the terminal-surface
mousemove propagation blocking so MotionTiltCard continues to work except when explicitly disabled
during active drag. Replace the stale IntelliSense tooltip content with symbol-aware demo content that
matches the server/client editor panes.

## Execution steps

1. Add a shared editor-tab metadata module and thread `activeTab` through the remaining dependent
   terminal subcomponents.
2. Remove the broad mousemove propagation blocking so the home hero tilt interaction works again
   outside of active drag.
3. Make IntelliSense tooltip content token-aware for the new server/client editor demo.
4. Align the terminal output colorizer with the current home-route sample output.
5. Update targeted unit coverage for the expanded active-tab propagation.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/TerminalHeroContent.test.tsx`
- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`

## Risks and rollback

- Shared tab metadata can drift if some terminal surfaces continue to hardcode file details; keep the
  metadata narrow and use it from every touched file.
- Removing the propagation-blocking helper could reintroduce drag/tilt interference if the drag logic
  accidentally relied on it; validate drag and tilt on the home route after the change.
- IntelliSense demo content is mock UI, so overengineering it would add maintenance cost. Keep the
  tooltip API narrowly scoped to current demo symbols.
- Rollback is straightforward: revert the metadata/threading changes and restore the previous tooltip
  component if a downstream consumer unexpectedly relies on the old static content.

## Progress notes

- Plan created to address review findings on the staged home-page/editor work.
- Added shared `vscodeEditorTabs.ts` metadata so the tab bar, explorer, status bar, and notification
  toast all derive file-specific chrome from one source of truth.
- Removed the broad terminal-surface mousemove propagation blocking, which restores the existing home
  hero tilt behavior outside of active drag.
- Replaced the stale IntelliSense tooltip content with symbol-aware tooltip content for the new
  server/client demo files and simplified primitive type tokens to non-tooltip annotations.
- Updated the home Playwright spec to measure layout width rather than tilt-transformed bounds and
  regenerated the two terminal-hero screenshot baselines after the intentional chrome changes.
- Validation completed with targeted Jest, production build, and Playwright home-route coverage.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
