# Terminal To Ide Refactor

## Goal

Rename the shared VS Code chrome component directory from `src/components/terminal/` to `src/components/ide/` without changing runtime behavior, and update the repository documentation and instruction-oriented references that point at the old path.

## Why

The current directory name no longer matches the responsibility of the subtree very well: it contains the broader IDE shell used by the home hero, not just the terminal panel. Keeping the path aligned with the component role reduces confusion when navigating the codebase and when referencing these files in plans or future instructions.

## Constraints

- Preserve the current client-side SPA architecture and route behavior.
- Keep the change narrowly scoped to a directory rename and path-reference updates.
- Do not rename stable component exports or change shared-component behavior unless required for the path refactor.
- Update documentation and instruction-adjacent references that mention the old path.

## Affected files and responsibilities

- `src/components/terminal/` -> `src/components/ide/`: renamed shared IDE-shell component subtree.
- `src/components/TerminalHeroContent.tsx`: updates imports into the renamed subtree.
- `test/unit/components/TerminalHeroContent.test.tsx`: updates Jest mocks that target the renamed subtree.
- `plans/home-vscode-consistency-followup.md`: updates historical file-path references.
- `plans/home-terminal-drag-window.md`: updates historical file-path references.
- `plans/terminal-panel-production-polish.md`: updates historical file-path references.
- `plans/types-dir-buildout.md`: updates historical file-path references.

## Proposed approach

Perform a filesystem rename for the subtree so git can track the move, then update all import strings and path references surfaced by repository-wide search. Keep file basenames and exported symbols unchanged so the refactor stays limited to the directory path. Finish by running targeted validation to confirm TypeScript/Jest/module resolution still succeeds.

## Execution steps

1. Add this ExecPlan and inventory all references to `src/components/terminal` and `./terminal/...` imports.
2. Rename `src/components/terminal` to `src/components/ide`.
3. Update source imports, test mocks, and plan/documentation path references to the new directory.
4. Re-run search to confirm no stale path references remain.
5. Run targeted validation for the affected component/test surface and a full build if the targeted checks pass.

## Validation plan

- `rg -n "src/components/terminal|components/terminal|\./terminal/|\.\./terminal/|/terminal/" .`
- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/TerminalHeroContent.test.tsx`
- `npm run build`

## Risks and rollback

- A missed import or Jest mock path will fail compilation or the targeted test suite.
- Historical plan documents may retain stale file-path references if search patterns are incomplete.
- Rollback is straightforward: rename `src/components/ide` back to `src/components/terminal` and restore the updated path references if validation fails.

## Progress notes

- Initial search shows live code references are limited to `TerminalHeroContent` and its unit test, plus four existing plan documents.
- No nested `AGENTS.md` file exists under the renamed subtree, so instruction updates are limited to path references rather than subtree-specific rules.
- Renamed `src/components/terminal/` to `src/components/ide/`, updated the `TerminalHeroContent` imports and the corresponding Jest mock paths, and refreshed historical plan references that pointed at the old directory.
- Validation passed with no stale old-path references outside this ExecPlan, `TerminalHeroContent` targeted tests passed, and `npm run build` succeeded. Remaining build warnings are unrelated pre-existing unused imports in `src/components/TabPanel.tsx` and `src/hooks/useClimbingData.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
