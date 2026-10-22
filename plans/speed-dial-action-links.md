# Restore shared speed-dial actions

## Goal

Restore the CV About card's GitHub, LinkedIn, email, and resume links, together with callback actions in other consumers of `AppSpeedDial`.

## Why

`AppSpeedDial` passes action attributes through deprecated MUI `FabProps`. Installed MUI 7.3.9 injects `slotProps.fab` from `SpeedDial`, overriding those attributes in `SpeedDialAction`. Actions render as unlabeled buttons without destinations or application click handlers. Existing tests mock both MUI components and miss this interaction.

## Constraints

- Preserve the public `AppSpeedDial` API, motion scaling, styling, SPA navigation, and static asset paths.
- Keep data modules and route composition unchanged; add no dependencies.
- Preserve unrelated untracked `output/` content and stage only task-owned files.

## Affected files and responsibilities

- `src/components/AppSpeedDial.tsx`: send action attributes through `slotProps.fab`.
- `test/unit/components/AppSpeedDial.test.tsx`: align existing isolated tests with the slot API.
- `test/unit/components/AppSpeedDial.integration.test.tsx`: exercise real MUI link, callback, and router behavior.
- This plan: record execution and validation evidence.

## Proposed approach

Migrate only action FAB props to MUI's supported slot API. Keep existing callers and trigger props intact. Add integration coverage without mocking `SpeedDial` or `SpeedDialAction`, and prove it fails before the implementation change.

## Execution steps

1. Add real-MUI regression tests and demonstrate the existing failure.
2. Update action slot wiring and the existing test double.
3. Run targeted tests, typecheck, lint, and the production build.
4. Validate CV action links and downloads and section navigation in a sandboxed browser; check an additional route. Confirm which header consumers are mounted before attempting header-dial checks.
5. Review and commit only the focused diff on local `fix/app-speed-dial-slot-props`.

## Validation plan

- `CI=true npm test -- --watchAll=false --runInBand --testPathPatterns=AppSpeedDial`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Relevant CV and navigation Playwright specs, using a temporary configuration that enables `chromiumSandbox` without changing repository configuration. Use the already running development server if starting a production preview is unavailable, and report the distinction.
- Browser checks on `/cv`, including link attributes, external navigation, resume download, callback actions, and motion off; additional route checks through navigation coverage.
- `git diff --check` and staged-diff review.

## Risks and rollback

The component also serves header settings and CV section navigation, so callback behavior and hover handlers must survive. Real-MUI tests cover the integration boundary; browser checks cover consumers. Roll back the focused component/test diff if necessary; no data, routing, or dependency migration is involved.

## Progress notes

- Baseline: local `main` at `900a0c0`; index clean; only pre-existing untracked `output/` present.
- Triage reproduced four plain action buttons without `href` or accessible labels; GitHub click did nothing. All six mocked tests passed.
- All three real-MUI regression tests failed before the source change: GitHub, callback, and internal-route actions had no accessible names.
- Action attributes now use `slotProps.fab`; the existing isolated test double reads the same slot. Public props and callers are unchanged.
- All nine speed-dial tests pass after the fix, including the three real-MUI tests. Typecheck and the production build pass. Lint passes with eight existing warnings in `test/e2e/home.spec.ts`; Vite reports its existing large-chunk advisory.
- Automatic approval review rejected starting `npm run serve:e2e`. Browser checks and the route specs therefore used the existing Vite server on port 3001, with Chromium sandboxing explicitly enabled. Production build validation passed separately; production-preview E2E and mocked GitHub success/failure checks were not run.
- Seven of eight selected CV/navigation checks pass. The CV core-sections test fails at its unchanged assertion for `MS in Applied/Computational Math`, which is absent from the pre-fix About card and current `ProfileCard`; it never reaches link checks. This stale assertion is outside this fix.
- Browser checks verified all four actions are named anchors, email has its `mailto:` destination, both external actions open the expected URL (destination responses mocked), and the resume downloads as `Daniel-Henderson-Resume.pdf` without a download error. Selection closes the menu.
- Desktop CV section navigation scrolls to Certificates and closes after selection. At 390px width, all About actions are visible with motion off.
- The current header uses `HeaderSettingsPopover`; `HeaderActions` and its appearance/motion speed dials have no current callers. Their shared action-handler contract is covered by the real-MUI callback/hover test; no claim of live header-dial browser validation is made.
- README already documents downloadable CV behavior; this restores that behavior without changing its documented contract.
- Concurrent unrelated changes appeared in `src/components/ide/VscodeExplorerSidebar.tsx`; leave them and pre-existing `output/` content unstaged.
- Final diff review and `git diff --check` passed. The focused implementation, tests, and this plan were committed on local `fix/app-speed-dial-slot-props`; the concurrent IDE-shell edit remains outside the commit in the worktree.
- An optional home-settings check stopped at an onboarding dialog intercepting the settings trigger; it did not exercise header settings. Additional route validation is supplied by the seven passing CV/navigation checks. Temporary browser sessions were closed.

## Completion Status

- [ ] In progress
- [x] Complete

Implementation and local-branch closeout are complete.
