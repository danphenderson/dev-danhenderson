# Home IDE Truthfulness Cleanup Batch A

## Goal

Clean up the Home route's faux VS Code hero so it no longer presents clearly stale or misleading repo/runtime details, while preserving the current Home orchestration, welcome flow, drag/resize behavior, portal behavior, and animation sequencing.

After this change:

- the faux terminal and editor surfaces reflect this repository instead of a fake Python/TypeScript ping server demo
- build/version/commit details shown to users come from the existing build metadata contract where available
- local development and test fallbacks remain explicit but honest rather than pretending to be stamped build data
- dead Home / IDE API crumbs with no real consumer are removed without changing the underlying choreography model

## Why

The current Home / IDE hero mixes polished chrome with demo content that has drifted away from the actual repository:

- the editor tabs and explorer show `server.py` and `client.ts` files that do not represent this app
- the boot sequence runs `uvicorn` and `tsx` commands for a fake ping server workflow that is unrelated to the portfolio site
- the looping terminal content hard-codes runtime and package-manager details that can easily become false
- some Home / IDE API surface remains even though no caller uses it, which increases maintenance noise ahead of the orchestration refactor planned for Batch B

Batch A should fix truthfulness and dead-surface issues only, leaving the existing state choreography intact for the dedicated Batch B refactor.

## Constraints

- Preserve the client-side SPA architecture, direct-link routing behavior, and `PUBLIC_URL` compatibility.
- Keep the Home route and IDE hero behavior functionally the same unless a minimal change is required to support truthful content.
- Do not refactor Home orchestration into a reducer, state machine, or new architectural layer in this batch.
- Keep route-level orchestration in `src/pages/` and avoid moving it into `src/hooks/`.
- Keep the patch narrowly scoped to the Home / IDE subsystem and its direct tests.
- Do not touch recovery logic, static-data hooks, package dependency reshaping, or shared sx/text helper cleanup.
- Do not disturb unrelated in-progress branch work outside the files needed for Batch A.

## Affected files and responsibilities

- `src/pages/Home.tsx` — defines the looping terminal lines rendered in the Home hero and should stop hard-coding misleading runtime details.
- `src/components/TerminalHeroContent.tsx` — integrates boot-sequence output with the existing IDE shell and is the right place to remove dead prop surface that no longer has callers.
- `src/components/ide/VscodeEditorPane.tsx` — renders the faux editor content and should switch from fake server/client demo code to repo-authentic snippets.
- `src/components/ide/VscodeExplorerSidebar.tsx` — renders the faux file tree and should reflect this repository's structure instead of a fake app.
- `src/components/ide/VscodeStatusBar.tsx` — renders visible IDE chrome and should not hard-code fake environment or branch labels once the rest of the hero is made truthful.
- `src/components/ide/VscodeTerminalPanel.tsx` — renders the terminal prompt chrome and should not hard-code fake branch/dirty-state details once the boot narrative is made truthful.
- `src/components/ide/vscodeEditorTabs.ts` — owns tab metadata that must stay aligned with the editor/explorer content if tab labels or breadcrumbs change.
- `src/components/ide/vscodeSyntaxHelpers.tsx` — syntax-token helpers; remove unused helper exports if they are dead after the editor cleanup.
- `src/hooks/useTerminalBootSequence.ts` — drives the post-expand boot narrative and should use truthful commands/session labels while preserving the existing phase model and timing.
- `src/utils/buildInfo.ts` — the canonical build metadata surface; should expose honest fallbacks and any small derived helpers needed by Home/scorecard consumers.
- `src/components/PerformanceScorecard.tsx` — displays build metadata and should render truthful local/test fallback labels rather than ambiguous stamped-looking values.
- `test/unit/pages/Home.test.tsx` — protects the Home route shell and will need narrow expectation updates for the changed terminal lines.
- `test/unit/components/TerminalHeroContent.test.tsx` — protects boot handoff behavior and will need narrow expectation updates for the renamed tabs/session labels and removed dead boot fields.
- `test/unit/hooks/useTerminalBootSequence.test.ts` — protects the boot-sequence phase contract and will need expectation updates if commands/session labels change or dead return fields are removed.
- `test/unit/components/ide/IdeResizeLayout.test.tsx` — may need narrow updates if truthful tab/file names replace the fake ones.
- `test/unit/components/PerformanceScorecard.test.tsx` and `test/unit/utils/buildInfo.test.ts` — may need updates if build metadata fallback behavior becomes more explicit.

## Proposed approach

Use the smallest content-and-contract cleanup that makes the hero truthful without changing its choreography.

1. Replace fake editor/explorer/tab content with repo-authentic surfaces based on actual files in this app, keeping the same two-tab IDE presentation and overall VS Code chrome.
2. Rewrite the boot sequence narrative to use app-relevant commands and session labels while preserving the current phase list, timings, and consumer contract shape where still needed.
3. Route Home hero lines and scorecard labels through `buildInfo` so commit/version/build details come from the existing build metadata injection path when present.
4. Make local/test fallbacks explicit and honest, for example by distinguishing unstamped local workspace data from stamped build data instead of using placeholders that can be mistaken for real metadata.
5. Remove dead API crumbs that have no real consumer, but avoid structural cleanup that belongs to Batch B.
6. Update only the focused tests that directly depend on the renamed commands, file labels, metadata fallbacks, or removed dead surface.

## Execution steps

1. Add and maintain this ExecPlan for Batch A.
2. Update the build metadata helper and its immediate UI consumers so Home and the scorecard can render truthful metadata and explicit local fallbacks.
3. Replace fake Home hero terminal/editor/explorer content with repo-authentic content while preserving existing layout and sequencing.
4. Remove dead Home / IDE API surface that no caller or consumer actually uses.
5. Update the focused Home / IDE unit tests and any tightly related IDE layout tests.
6. Run build, targeted Jest validation, and browser validation on `/` for desktop and narrow/mobile viewports.
7. If the visible Home hero behavior ends up materially changed beyond content truthfulness, run the narrowest relevant Playwright coverage for `test/e2e/home.spec.ts`.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false --runInBand --runTestsByPath test/unit/pages/Home.test.tsx test/unit/components/TerminalHeroContent.test.tsx test/unit/hooks/useTerminalBootSequence.test.ts`
- If touched expectations require it: `CI=true npm test -- --watchAll=false --runInBand --runTestsByPath test/unit/components/ide/IdeResizeLayout.test.tsx test/unit/components/PerformanceScorecard.test.tsx test/unit/utils/buildInfo.test.ts`
- Browser validation on `/` at one desktop viewport and one narrow/mobile viewport using the browser tooling, checking the faux IDE shell, terminal/editor content, expand/minimize/restore affordances, and general layout integrity.
- If Home hero behavior is materially affected: `npm run build && npm run test:e2e:chromium -- test/e2e/home.spec.ts`

## Risks and rollback

- Changing tab metadata, explorer entries, or editor content can accidentally break other IDE chrome components that consume shared file-name metadata.
- Changing boot commands or session labels can break handoff tests or subtly alter the perceived sequence if the output strings no longer fit the current layout.
- Tightening build metadata fallbacks can break tests that currently assume placeholder values like `dev` and `unknown`.
- A truthfulness cleanup can easily drift into the larger Home orchestration refactor if implementation starts chasing incidental complexity.

Rollback approach:

- Keep metadata cleanup, IDE content cleanup, and dead-surface removals logically separable so any one area can be reverted independently.
- Preserve existing public component behavior and orchestration flow so regression scope stays limited to content and small local contracts.

## Progress notes

- 2026-03-23: Initial investigation confirmed the current Home hero uses a fake Python/TypeScript ping-server narrative (`server.py`, `client.ts`, `uvicorn`, `tsx`) that does not match this repository and should be replaced in Batch A.
- 2026-03-23: Initial investigation confirmed at least two dead Home / IDE API crumbs: `sessionLabel` on `TerminalHeroContentProps` has no caller, and `explorerOpen` returned from `useTerminalBootSequence()` is not consumed by `TerminalHeroContent`.
- 2026-03-23: Initial investigation confirmed existing build metadata already flows through `scripts/buildWithMetadata.js` and `src/utils/buildInfo.ts`, so Batch A should reuse that contract instead of adding a parallel metadata source.
- 2026-03-23: Completed the content cleanup by swapping the fake ping-server editor, explorer, tabs, boot sessions, and looping terminal lines to repo-authentic App/index/build-metadata surfaces while preserving the existing Home choreography.
- 2026-03-23: Completed a final consistency cleanup in `VscodeStatusBar.tsx` and `VscodeTerminalPanel.tsx` so the remaining visible IDE chrome now shows browser/build-context labels instead of fake WSL, branch, and dirty-state details.
- 2026-03-23: Completed the dead-surface cleanup by removing the unused `sessionLabel` prop from `TerminalHeroContent`, the unused `explorerOpen` return field from `useTerminalBootSequence()`, and the unused `playing` prop path from `VscodeEditorPane`.
- 2026-03-23: Updated the focused unit and Home E2E expectations so they assert the truthful Home hero surface instead of the old fake server demo. The old screenshot-style Home E2E assertion was narrowed to direct UI assertions to avoid stale platform snapshot baselines for this content-only batch.
- 2026-03-23: Validation completed with `npm run build`, focused CI-style Jest coverage for the touched Home / IDE files, desktop and mobile browser validation on `/`, and `npm run build:e2e` plus `npm run test:e2e:chromium -- test/e2e/home.spec.ts`. The build, Jest, browser, and Playwright checks were rerun after the final chrome-only consistency cleanup.
- 2026-03-23: The staged diff was later adjusted to restore the original ping-pong terminal/editor/explorer surfaces. The build-metadata helper and scorecard work remain staged, but the Home IDE content truthfulness changes described above are no longer part of the staged patch.
- 2026-03-23: Batch B orchestration debt remains intentionally deferred: the current multi-flag/timer/portal choreography in `Home.tsx` and the large Home test architecture will stay in place for this batch.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
