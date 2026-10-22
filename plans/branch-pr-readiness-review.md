# Branch PR readiness review and remediation

## Goal

Make `fix/app-speed-dial-slot-props` ready for a reviewed PR into the intended `main`, with stable Home motion, working audio recovery, and the local `main` quality commit integrated for one PR to remote `main`. Keep the restored CV action links and truthful GitHub contribution counts.

This document records an adversarial review completed on 2026-10-21 and the subsequently approved implementation. Review findings below describe the original branch; implementation status and fresh evidence are recorded in Progress notes.

## Why

### Review scope and verdict

- Reviewed branch HEAD: `37c1e07b61b9dd7a80ba2a736a2d9f019cb0258e`.
- Branch commits: `13ed1bb` (speed-dial actions) and `37c1e07` (welcome, motion, GitHub stars).
- Common ancestor and live remote `main`: `900a0c0fe671ec209b5634913aeb9afb9abc753e`. Verified remote HEAD with `git ls-remote origin refs/heads/main` during this review.
- Local `main`: `3728808ee1216605373206aba9b50004ca96478f`, one additional unpushed quality-improvement commit, checked out in `/private/tmp/dev-danhenderson-quality`.
- Reviewed all 34 changed paths in the branch diff, with adjacent provider, motion, consumer, build, and test code as needed.
- Excluded the pre-existing unstaged `src/components/ide/VscodeExplorerSidebar.tsx` edit, untracked `output/`, and untracked `plans/codebase-ui-quality-improvements.md`. The index was empty and remains untouched.

**Original review verdict: request changes before declaring the PR ready to merge.** One reproducible branch regression needs a focused fix. Integration into local `main` also requires explicit conflict resolution; that conflict does not currently exist against remote `main`. The existing test suite passes, but it does not exercise the failing motion sequence or actual audio recovery. A draft PR can describe these open items.

### Findings and triage

| ID | Priority and origin | Finding | Disposition |
| --- | --- | --- | --- |
| R1 | P2, new branch regression; high confidence | Changing motion intensity after the Home IDE settles starts its entrance animation again. | Fix before marking the PR ready. |
| R2 | Integration blocker against local `main`; high confidence | The local quality commit and this branch implement incompatible welcome flows and conflict in 16 paths. | Resolve if local `main` is included in the target; otherwise explicitly record the current remote base and revisit when it changes. |
| R3 | P3, new test overstates coverage; underlying runtime defect predates the branch | The audio-retry test never retries, and a real retry after script-load failure times out. | Correct the test's claim before closeout; provider recovery can be a separately scoped follow-up. |
| R4 | P3, maintenance debt | The removed welcome-step components leave an unused provider step API and outdated instruction text. | Optional cleanup after the welcome integration decision. |

#### R1 — Settled hero replays on preference changes

Location: `src/components/HeroMotionPath.tsx:172-201`, especially the measurement effect's new `dFactor` dependency at line 193, and the keyframe `animate` target at lines 224-233.

Reproduction on the reviewed build:

1. Finish the Home welcome and wait for the automatic expanded IDE.
2. Use the IDE's Expand window control to restore the inline window.
3. Open header settings and change Default motion to Subtle.
4. The settled inline IDE moves through the entrance path again. Off followed by Default also replays it.

The probe recorded the wrapper transform changing from `none` to `matrix(1, 0, 0, 1, 23.0123, -68.3708)` after Default → Subtle. Its top moved from about 289px to 221px. Off → Default moved it to about 214px. The terminal stayed connected, so the demonstrated defect is unwanted movement, not a claimed loss of terminal state.

`completed.current` guards only the callback. The layout effect still measures on every scale change, creates new keyframes, and feeds them into Motion even when `settled` is true. The zero-motion render path also replaces the wrapper, so simply removing `dFactor` from the effect would be unsafe when motion is re-enabled. Existing tests cover initial Off and disabling motion mid-flight, but not changes after completion.

#### R2 — Integration with the divergent local main

A read-only three-way comparison used:

```sh
git merge-tree 900a0c0fe671ec209b5634913aeb9afb9abc753e \
  3728808ee1216605373206aba9b50004ca96478f \
  37c1e07b61b9dd7a80ba2a736a2d9f019cb0258e
```

Conflicting paths, including modify/delete conflicts:

- `README.md`, `docs/frontend/page-choreography.md`
- `src/components/FirstVisitSettingsHintPopover.tsx`, `src/components/Header.tsx`, `src/components/HeroMotionPath.tsx`
- `src/hooks/useHomeWelcomeSequence.ts`, `src/motion/tokens.ts`, `src/pages/Home.tsx`
- `test/e2e/cv.github.spec.ts`, `test/e2e/helpers/header.ts`, `test/e2e/home.spec.ts`, `test/e2e/service-worker.smoke.spec.ts`
- `test/unit/components/HeroMotionPath.test.tsx`, both `test/unit/hooks/useHomeWelcomeSequence.test.ts` and `.tsx`, `test/unit/pages/Home.test.tsx`

This is a behavioral conflict, not only a textual merge: local `main` starts Home content immediately and offers explicit customization; the reviewed branch keeps the IDE gated on completion of its optional five-second welcome panel. Local `main` also contains a static Home introduction and CV/project links, responsive media, and accessibility work. Taking either side wholesale can silently discard those improvements or break the branch's new welcome contract. No merge or rebase was performed during review.

#### R3 — Retry coverage and existing audio failure

Location: `test/e2e/welcome.spec.ts:95-104`. The test is named “audio failure does not block entry and can be retried from settings,” but stops after checking that Play is enabled.

A separate browser probe aborted the first widget-script request, offered a successful mocked response for a subsequent request, then actually clicked Play in header settings. After 8.5 seconds there was still only one script request, no Pause control, and a timeout error. In `src/WelcomeAudioProvider.tsx:176-197`, failure clears the promise but leaves the failed script element; the retry attaches listeners to that already-failed element without restarting the request. This provider is unchanged from `900a0c0`, so it is not a newly introduced runtime regression.

Minimum correction: rename the current test to describe entry and retry-control availability, and record actual recovery as unresolved. Preferred separate follow-up: repair failed-script lifecycle and add a failure-then-success playback test. Do not count an enabled button as successful recovery.

#### R4 — Stale welcome API and documentation

`WelcomeOnboardingProvider.tsx` retains `showCustomizeModal`, `showSettingsHint`, `openCustomizeModal`, and `advanceToSettingsHint` although the reviewed Home flow no longer uses them. `src/hooks/AGENTS.md` still describes a dialog-plus-hint sequence. Compatibility retention is documented in the branch plan, so removing the API is not a required regression fix. Resolve R2 first: local `main` still uses that API.

## Constraints

- The user approved implementation and then explicitly required the local quality commit to be included in this branch for one PR. Record both histories in a local integration merge after validation; preserve user-owned work. Do not push or open a remote PR.
- Follow root and scoped `AGENTS.md`, `docs/engineering/agent-guide.md`, and `docs/engineering/testing-strategy.md` when executing a follow-up.
- Preserve user-owned dirty files and the separate local `main` worktree. Recheck live refs and index/worktree state before implementation.
- Preserve client-side SPA routing, direct links, provider nesting, `PUBLIC_URL` asset handling, and static TypeScript content ownership.
- Preserve audio consent, stored preferences, mocked GitHub fallback behavior, and the speed-dial public API.
- Use existing motion tokens and style builders. Off and system reduced motion must complete entrance handoffs immediately.
- Keep Chromium sandboxing enabled. No new dependencies are needed for the proposed fixes.

## Affected files and responsibilities

- `src/components/HeroMotionPath.tsx`: separate entrance lifecycle from subsequent motion preference changes.
- `test/unit/components/HeroMotionPath.test.tsx`: cover completed → new scale and Off → enabled transitions without replay; retain in-flight and exactly-once completion cases.
- `test/e2e/home.spec.ts`: validate the restored inline IDE stays settled while settings change and remains usable.
- `test/e2e/welcome.spec.ts`: make the audio test's name and assertions match its evidence; extend it if recovery is repaired.
- `src/WelcomeAudioProvider.tsx` and `test/unit/WelcomeAudioProvider.test.tsx`: repair actual recovery; manage failed script elements and shared pending setup correctly.
- The R2 conflict list: integrate the local quality commit as explicitly requested. Preserve its unaffected quality work and align all welcome tests and docs with one chosen flow.
- `src/WelcomeOnboardingProvider.tsx`, its tests, and `src/hooks/AGENTS.md`: optional API/docs cleanup after integration establishes which consumers remain.

## Proposed approach

Keep the existing presentation, provider, and page composition boundaries. Fix R1 inside the hero motion component by making “entrance completed” a terminal state until deliberate deactivation/reactivation. Once completed, render a stable neutral transform rather than newly generated travel keyframes. Avoid remeasuring a settled element when intensity changes; preserve the ability to initialize measurement when motion becomes enabled before completion. Use a stable wrapper where needed so preference changes do not replace focused descendants or disturb the IDE portal host.

For R2, establish the actual target commit before conflict resolution. If the local quality commit is part of the intended PR base, use a separate integration checkout/branch and reconcile behavior explicitly. Recommended integration direction: preserve the quality commit's immediate static introduction and CV/project links, and retain a single optional preferences surface without gating meaningful portfolio content. Treat changing the branch's IDE timing as a conscious product choice and update tests/docs together. Do not silently combine both legacy and new welcome state machines.

For R3, separate evidence correction from provider repair. The provider repair should track script loading/failure, discard or replace only the failed owned script, clear its listeners/promise, and allow a later explicit request to initialize normally. Preserve deduplication of simultaneous requests and abort/unmount behavior.

## Execution steps

1. Re-read live refs, dirty state, and the nearest instructions. Record the intended target SHA. If R2 applies, prepare isolated integration and resolve the welcome design and duplicate `heroPath`/`heroEntrance` token names before source changes.
2. Add a failing regression for R1 using a completed entrance followed by Default → Subtle and Off → Default. Retain a stateful child or stable host assertion where useful; ensure `onComplete` remains once per active cycle.
3. Implement the narrow settled-state fix. Verify Off during flight completes immediately and genuine deactivate/reactivate still produces the intended entrance.
4. Add the browser regression through real settings and the restored inline IDE. Check that it remains at its resting transform after preference changes, with content and controls usable.
5. Correct R3's test claim. Either leave the provider issue explicitly tracked or implement it in a separate commit with a mocked failed request followed by successful initialization and playback.
6. If R2 applies, finish integration while preserving independent main improvements, align docs and route tests, and validate the combined result. Do not infer combined readiness from either branch's individual green results.
7. Optionally remove the legacy welcome API and update its documentation after confirming no remaining consumers. Keep this separate from required fixes.
8. Run the validation matrix below on the final commit, inspect the final diff, and update readiness with exact results and remaining limitations.

## Validation plan

Run from the implementation checkout, using the installed dependency versions:

```sh
CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='HeroMotionPath|Home|Welcome'
npm run typecheck
npm run lint
npm run build:e2e
npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/welcome.spec.ts
npm run test:e2e:chromium
npm run build
npm run test:e2e:smoke
git diff --check
```

If integration touches additional main surfaces, also run their relevant unit checks and the final combined CI matrix. Do not update screenshot baselines merely to make an unintended change pass.

Acceptance checks:

- Initial welcome dismissal, unattended entry, hover/focus pause, keyboard exit, consent, and persisted completion remain intentional.
- Default/Subtle/Expressive changes after settling do not restart travel. Off → enabled does not replay a completed entrance. Off during flight and system reduced motion render promptly.
- Check desktop and narrow mobile, light/dark, and at least two presets for layout changes. Check keyboard focus and IDE minimize/restore/expand behavior.
- Preserve real-MUI speed-dial links/callbacks, CV resume download, and mocked GitHub success/failure with verified zero distinguished from unknown stars.
- If audio recovery is implemented, the second explicit Play attempt makes a fresh request and reaches playing state under a deterministic mock. Entry must remain available during failure/loading.
- If target main moved, repeat merge analysis and validate the actual combined result before declaring it merge-ready.

## Risks and rollback

- A settled-state shortcut can suppress a legitimate next entrance or omit `onComplete` on an Off transition. Keep those cases in the same regression set.
- Replacing the wrapper can detach the inline IDE host or reset nested interaction state. Prefer a stable tree and verify the actual page.
- Taking entire conflict sides can drop local main's static introduction, media, accessibility, or route behavior. Resolve by responsibility and inspect the combined diff.
- Script retry changes can duplicate widget initialization or interfere with abort/unmount cleanup. Use deterministic failure, timeout, cancellation, and recovery mocks.
- Keep the combined integration reviewable against both parents. Revert the integration merge against its first parent if necessary; no data or storage migration is proposed. Preserve the already verified speed-dial and star-count changes.

## Progress notes

- Implementation started: the user approved this ExecPlan. HEAD remains `37c1e07`; a fresh remote lookup confirms remote `main` at `900a0c0`.
- User correction: include local quality commit `3728808` in this branch for one PR. R2 integration is now required. Reconcile the quality commit's immediate static Home introduction and manual IDE expansion with the branch's single optional welcome panel; preserve all unrelated quality improvements. Use an isolated checkout to resolve and validate the combined result before transferring it to the shared workspace.
- Implementation scope: R1 motion lifecycle and regressions; R2 complete quality-commit integration; R3 actual failed-script recovery plus unit/browser regressions; R4 hook documentation correction and evaluation of legacy API consumers after integration.
- Existing sidebar, output, and quality-plan changes remain user-owned. Integration imports the quality commit, resolves the conflicting Home composition, and adds the motion/audio fixes, regression tests, and current documentation.
- 2026-10-21: Review completed against the SHAs above. No runtime/source fixes were made. This plan is the only repository file added by the review.
- Tests ran on a `git archive` of branch HEAD in `/tmp/dev-danhenderson-pr-review.16dEdw`, using the existing installed `node_modules` by symlink. This excluded the user's sidebar edit and untracked content. Node was `v22.22.2`; the CI-pinned Node 20 environment and hosted CI were not exercised.
- Focused Jest command with `Home|Welcome|HeroMotionPath|AppSpeedDial|Header|appStyle|GithubProfile|GitHubContributions`: **21 suites / 159 tests passed**. The full Jest suite was not run.
- Typecheck passed. Lint passed with eight warnings in unchanged warning-producing constructs in `test/e2e/home.spec.ts`; no errors.
- Test-runtime build and production build passed. Both retained the large-chunk advisory, with the entry chunk around 519 kB minified. Performance budgets were not assessed.
- Full Chromium project: **60 passed** against the test-runtime build. Full production smoke project: **12 passed**, including service-worker redeploy/deep-link behavior.
- Separate sandboxed browser probes inspected Evergreen dark at 1440×900 and Atlas light at 320×568. Welcome content fit without horizontal page overflow; keyboard navigation from welcome to CV persisted completion. R1 and R3 were reproduced separately from the passing suites.
- Review evidence is temporary under `/tmp/dev-danhenderson-pr-review.16dEdw`: `review-jest.log`, `review-typecheck.log`, `review-lint.log`, `review-build-e2e.log`, `review-build-production.log`, `review-chromium.log`, `review-smoke.log`, `review-browser.json`, `review-motion.json`, `review-audio.json`, their three `.cjs` probe scripts, and `output/playwright/` screenshots/snapshots. Merge output is `/tmp/dev-danhenderson-merge-review.txt`. These paths are local review aids, not durable CI artifacts.
- The default filesystem sandbox blocked the preview port; approved loopback serving and browser execution then completed with `chromiumSandbox: true`. The configured browser tool was occupied, so the review used independent browsers without disturbing that session. Review browsers closed after probes.
- No remote PR, merge, rebase, commit, push, dependency installation, or main-worktree changes were made. No claim is made about live third-party playback or full cross-browser/accessibility certification.

### Combined implementation evidence

- The single Home flow renders the quality commit's identity and CV/project links immediately, keeps expansion manual, and opens the branch's nonmodal panel only from Customize. Its idle timer pauses on focus/hover; it never gates portfolio content or starts audio automatically.
- Motion keeps one wrapper and a neutral transform after completion, including Off → Default. Regression checks cover real settings changes and retained terminal DOM, plus component focus and genuine reactivation.
- Audio failure, missing API, timeout, and consent cancellation remove the owned pending script and its listeners. Concurrent requests share setup; a later explicit retry reaches playback. Browser coverage aborts the first request, fulfills the second with a deterministic widget, then verifies play and pause.
- Keyboard dismissal restores focus to the explicit Customize opener, rather than the header that can hide on scroll. The actual Home integration test asserts that focus target.
- Integration testing exposed the panel's opening click being treated as click-away when motion was Off. Leading pointer events avoid dismissing the same click that opens it; the regression passes with Off and system reduced motion.
- Full Jest: 136 suites / 1,007 tests passed. Focused audio suite: 11 passed. Typecheck, lint (zero warnings), media check (61 sources), and test-runtime build passed. After the final focus-target fix, the affected Home/panel suites passed 11 tests, and the complete Chromium project passed all 82 tests. Production build and all 12 smoke tests passed, including service-worker redeploy/recovery. The eager bundle gate passed at 896,701 raw bytes / 278,910 gzip bytes across nine chunks.

- Visual inspection: Evergreen dark at 1440×900 and Atlas light at 320×568. Home introduction, primary links, IDE, and the open preferences panel fit the viewport without horizontal overflow; reopening the panel resumes idle dismissal. Images and JSON evidence are under `/tmp/dev-danhenderson-integrate.Vem6DB/output/playwright/`.
- Validation ran in the isolated integration checkout using the quality worktree's installed dependencies by read-only symlink. Live remote `main` remained `900a0c0` at final lookup. Node 22.22.2 was used; hosted CI and its pinned Node 20 runtime are not claimed.
- Legacy onboarding step methods are retained for compatibility; no duplicate live dialog/hint flow remains. The existing Vite large-chunk advisory is not an assertion about real-user performance.

- Final status: the combined tree passes local checks and is ready for one PR against remote `main`. The integration merge includes both `37c1e07` and `3728808` as parents. Original sidebar and local quality-plan draft bytes are preserved separately from committed implementation; output artifacts are untouched. The original quality plan remains an unstaged draft over the committed completed plan.
- Validation logs: `/tmp/pr-integration-jest.log`, `pr-integration-types.log`, `pr-integration-lint-final.log`, `pr-integration-media.log`, `pr-integration-build-e2e.log`, `pr-integration-chromium-final2.log`, `pr-integration-build-production.log`, `pr-integration-bundle.log`, and `pr-integration-smoke.log` (all under `/tmp/`). The final affected Home/panel tests are in `/tmp/pr-integration-panel-final.log`. No claim is made about live SoundCloud availability or non-Chromium browser coverage.

## Completion Status

- [x] Adversarial branch review and finding triage complete.
- [x] Follow-up ExecPlan written with reproduced evidence and actual validation.
- [x] R1 motion regression fixed and revalidated.
- [x] R2 integrate local quality commit `3728808` into this branch for the single PR targeting remote `main`.
- [x] R3 actual provider recovery implemented and proven through failed request followed by playback.
- [x] R4 hook documentation corrected. Retain legacy provider step methods for compatibility with Header and existing tests; removing this dormant API is optional maintenance debt.
- [x] Final local PR readiness re-evaluated on the combined tree; ready to submit for PR review and hosted CI. No remote push or PR was performed.
