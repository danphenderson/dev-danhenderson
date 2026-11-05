# Validated unused-code removal

## 1. Goal

Remove the unused code identified in the November 2026 audit while preserving current routes, header settings, audio playback, IDE behavior, photography, CV content, motion preferences, and offline recovery. Reduce maintenance surface and misleading documentation; do not promise a bundle-size improvement because unused exports may already be tree-shaken.

The audit and plan were approved and implemented on 2026-11-04. Existing Home and CV work is preserved, and changes remain unstaged. Validation is complete with the E2E limitations recorded below; the full E2E gate is not green.

## 2. Why and validated evidence

Validated on **2026-11-04** against the working tree on `codex/cv-snorkel-presentation`, HEAD `be7dddfd89bda3eae1db08e9483563403a19dd34`. The working tree includes the earlier Home cleanup and unrelated CV edits; HEAD alone does not represent the audited implementation. The index was empty.

Validation used repository-wide reference searches, a TypeScript-resolved source-module graph starting at `src/index.tsx`, symbol-reference checks through re-exports, direct inspection of state transitions and consumers, and focused baseline tests. The graph included 179 non-declaration source files and found no nonliteral `import()`/`require()` arguments. Its six files outside the app entry graph were the four retired header files below plus two legitimate test facilities, `src/routerFuture.ts` and `src/setupTests.ts`. Barrel reachability does not establish actual component use, so exported primitives were checked separately.

| ID  | Finding and evidence                                                                                                                                                                                                                                              | Planned disposition and boundary                                                                                                                                                                                                                                                                                                                |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | `src/components/header/HeaderActions.tsx:23` has no consumers. It alone composes `HeaderAppearanceDial.tsx` and `HeaderMotionDial.tsx`; those alone use `dockScale.ts`. `Header.tsx:121` renders `HeaderSettingsPopover` instead.                                 | Remove the four retired source files and the two dedicated dial tests. **Retain `test/unit/components/header/HeaderActions.test.tsx`: despite its filename, it tests the live `HeaderSettingsPopover`.** Rename that test file to match its subject as part of this cleanup.                                                                    |
| C2  | Fifteen returned entries in `appStyleBuilders.ts` have no consumers outside the builder, including string-key searches. Two more serve only C1. No dynamic style-map enumeration or computed access was found that would invalidate the result.                   | Remove the exact 17 entries listed below and exclusive local helpers. Keep the style-builder pipeline and all live surfaces.                                                                                                                                                                                                                    |
| C3  | `TypewriterLoopText.tsx:33` is only declared, default-exported, and re-exported by the text barrel; no component renders it. `useTypewriterLoop.ts:34` serves that component and its hook tests only.                                                             | Remove both files, the barrel export, and the dedicated hook test. The reusable-primitive documentation is stale inventory, not evidence of a live caller. Retain `TypewriterText`, `useTypewriterProgress`, terminal typing, and `cursorBlink`, which the IDE still uses.                                                                      |
| C4  | `motion/tokens.ts:94` exports a five-preset `transition` object; its only other symbol reference is the re-export in `motion/index.ts:17`.                                                                                                                        | Remove that object, its re-export, and the now-unused `Transition` type import if applicable. Retain durations, easing, variants, spring options, scaling helpers, and Motion/CSS transition properties.                                                                                                                                        |
| C5  | `constants/runtimeEnvironment.ts:32` exports an eager `appRuntimeEnvironment` snapshot consumed only by its three tests. `CommandPaletteActionKindExtended` at `commandPaletteActions.ts:96` has no references.                                                   | Remove the snapshot and unused type. Preserve `resolveAppRuntimeEnvironment`, route metadata, palette action kinds, and environment behavior. Retarget tests to the resolver while their environment overrides are still installed.                                                                                                             |
| C6  | The exported `utils/serviceWorkerRegistration.ts:113` `unregister()` has no symbol references. The similarly named `registration.unregister()` at line 55 is used by active invalid-worker recovery and is covered by tests.                                      | Delete only the uncalled exported wrapper. Preserve registration, recovery, reload behavior, error handling, and `public/service-worker.js`. This is a narrowly bounded PWA-helper cleanup, not an offline-behavior redesign.                                                                                                                   |
| C7  | `WelcomeOnboardingProvider.tsx` is mounted, but none of its three transition methods has a production caller. Its only runtime reader is `Header`, which reads `showSettingsHint`. That flag initializes to false and cannot become true through the current app. | Remove the dormant provider and unreachable header cue together, with the provider hierarchy documentation updated in the same change. This is dormant state, not an unimported file. Preserve the relative order of all remaining providers.                                                                                                   |
| C8  | `Header.tsx:68` is the only production `useWelcomeAudio()` consumer and reads `play`, `pause`, and `isPlaying`. The other five exposed context members have no production readers.                                                                                | Narrow the context to those three active members. Keep internal `ready`, `audioConsent`, and `grantAudioConsent`: they drive widget initialization, iframe mounting, and explicit-play consent. Remove the test-only decline callback and unobserved error-message state, while preserving promise rejection, logging, cancellation, and retry. |
| C9  | `useWebVitals.ts` maintains and returns `collected`, but `PerformanceScorecard.tsx:111` reads only `metrics`. The flag duplicates `metrics.size > 0`.                                                                                                             | Remove the flag, its setter, the `WebVitalsState` member, and test/mock expectations. Keep all four reporters, metric replacement/accumulation, and scorecard behavior.                                                                                                                                                                         |

### Exact style inventory for C2

All entries are in `src/styles/appStyleBuilders.ts`:

| Group                 | Entries                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Home/CV               | `resumeDownloadContainerSx`, `homeHeroTitleSx`                                                                                            |
| Photography           | `photographyGridSx`, `photographyGridItemSx`, `photographyCardSx`, `photographyCardContentSx`, `photographyMediaSx`, `photographyImageSx` |
| Hints                 | `getHeaderHighlightSx`, `hintPopoverPaperSx`, `hintPopoverTitleSx`, `hintPopoverBodySx`                                                   |
| Other unused surfaces | `errorAlertSx`, `dataGridContainerSx`, `loadingOverlaySx`                                                                                 |
| Only used by C1       | `headerAppearanceDialSx`, `headerAudioControlSx`                                                                                          |

Remove the corresponding private definitions for shorthand entries, plus `HeaderHighlightTone` and `headerSpeedDialSx` when their final consumers disappear. Do not remove similarly named live helpers such as `headerIconButtonSx`, `headerActionsContainerSx`, immersive photography styles, loading-bar builders, or shared colors without checking their remaining references.

## 3. Constraints

- Recheck branch, HEAD, index, and working-tree changes before implementation and before each phase. Preserve all pre-existing work; no bulk reset, restore, staging, or commits are part of this plan.
- Follow the nearest scoped `AGENTS.md` and `docs/engineering/testing-strategy.md`. No dependencies, toolchain upgrades, mass formatting, or unrelated refactors.
- Preserve the client-only SPA, public route registry, direct links, `PUBLIC_URL` handling, content modules, GitHub fallback behavior, and media assets.
- Keep theme/appearance/motion preferences and reduced-motion behavior. The live `HeaderSettingsPopover`, `AppSpeedDial` used by CV navigation, and performance scorecard remain supported.
- C7 deliberately retires one obsolete provider. Update the canonical invariant to `ThemeProvider → WelcomeAudioProvider → BrowserRouter → CommandPaletteProvider → AppContent` in the same phase; do not reorder the surviving providers or weaken their responsibilities.
- Preserve audio storage compatibility, including existing `unknown`/`granted`/`declined` values and legacy migration. Removing a decline UI callback does not make persisted declined consent obsolete. Leave existing onboarding storage values inert; do not add a storage-clearing migration.
- Keep `welcomeSequenceEnvironment.ts`: audio still uses its development-only reset behavior. Keep its tests and environment resolver.
- Keep active service-worker recovery, including its browser `registration.unregister()` calls. The utility-directory guardrail against unrelated PWA edits still applies.
- Keep `src/routerFuture.ts`, Jest setup, lazy-loaded route modules, test-specific cache-reset helpers, and installed dependencies required indirectly by frameworks/types.
- Completed historical plans retain their historical evidence. Update current source-of-truth documentation, not old review narratives. Do not sweep `output/` or untracked user artifacts.

## 4. Affected files and responsibilities

| Files                                                                                                                                                                                                                                                      | Responsibility                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/header/{HeaderActions,HeaderAppearanceDial,HeaderMotionDial}.tsx`, `dockScale.ts`                                                                                                                                                          | Remove unused header controls (C1).                                                                                                                                |
| `src/styles/appStyleBuilders.ts`; `test/unit/styles/appStyleBuilders.test.ts`                                                                                                                                                                              | Remove C2 entries and the assertion testing only the retired header dial. Retain live style tests.                                                                 |
| `src/components/text/{TypewriterLoopText.tsx,useTypewriterLoop.ts,index.ts}`; `test/unit/components/text/useTypewriterLoop.test.tsx`                                                                                                                       | Remove unconsumed loop implementation, export, and exclusive tests (C3).                                                                                           |
| `src/motion/{tokens.ts,index.ts,AGENTS.md}`                                                                                                                                                                                                                | Remove unused composite presets and inventory references (C4).                                                                                                     |
| `src/constants/{runtimeEnvironment.ts,commandPaletteActions.ts,AGENTS.md}`; `test/unit/constants/runtimeEnvironment.test.ts`                                                                                                                               | Remove C5 exports and preserve resolver coverage.                                                                                                                  |
| `src/utils/serviceWorkerRegistration.ts`                                                                                                                                                                                                                   | Remove only the exported unused wrapper (C6); retain its existing registration/recovery tests.                                                                     |
| `src/WelcomeOnboardingProvider.tsx`, `src/index.tsx`, `src/components/Header.tsx`, `src/components/header/HeaderSettingsPopover.tsx`, `src/styles/animations.ts`                                                                                           | Remove the provider, its sole consumer wiring, highlight-only markup/props, and exclusively used `pulseRing` keyframes (C7). Keep shared `cursorBlink`.            |
| `test/unit/WelcomeOnboardingProvider.test.tsx`, `test/unit/components/Header.test.tsx`, `test/unit/components/header/HeaderActions.test.tsx`                                                                                                               | Delete provider-only tests; remove unreachable highlight scenarios/mocks; retain all live settings and header assertions. Rename the misleading popover test file. |
| `test/unit/pages/helpers/homeTestHarness.tsx`, `test/unit/pages/Home.test.tsx`, `test/e2e/helpers/header.ts`, `test/e2e/home.spec.ts`                                                                                                                      | Remove obsolete onboarding fixture keys/imports and dead `data-highlighted` expectations; preserve Home entry, CV action, motion, and audio assertions.            |
| `src/WelcomeAudioProvider.tsx`, `test/unit/WelcomeAudioProvider.test.tsx`, `test/unit/components/Header.test.tsx`                                                                                                                                          | Trim the unused context surface, rewrite probes around live behavior, and retain lifecycle/failure coverage (C8).                                                  |
| `src/hooks/useWebVitals.ts`, `src/types/ui.ts`, `test/unit/hooks/useWebVitals.test.ts`, `test/unit/components/PerformanceScorecard.test.tsx`                                                                                                               | Remove redundant `collected` state and fixtures (C9).                                                                                                              |
| `docs/{README.md,architecture/app-architecture.md,engineering/agent-guide.md,engineering/testing-strategy.md,frontend/component-architecture.md,frontend/motion-architecture.md,frontend/theme-and-styling.md}`; root `README.md` if its statements change | Align provider diagrams/invariants, current header controls, text primitive inventory, motion presets, hint styles, and test descriptions.                         |

Read `src/components/AGENTS.md`, `src/hooks/AGENTS.md`, `src/styles/AGENTS.md`, `src/motion/AGENTS.md`, `src/constants/AGENTS.md`, `src/types/AGENTS.md`, and `src/utils/AGENTS.md` before editing their areas. Root `AGENTS.md` delegates provider-order ownership to the canonical guide; preserve that delegation.

## 5. Proposed approach

Use small, separately reviewable phases. Remove isolated implementations first; then update shared state contracts together with their consumers and meaningful tests. Verify that each removed public symbol has no new caller before deleting it. If concurrent work adds a real consumer, retain that target and revise this plan rather than breaking the new feature.

Treat tests as evidence about intended behavior, not automatic justification to keep obsolete APIs. Delete tests only when their entire subject is retired. Rewrite mixed tests to assert the supported behavior, especially audio failure and cancellation. Add regression coverage only where the changed contract would otherwise lose meaningful protection.

## 6. Execution steps

### Phase 0 — Establish the implementation baseline

1. Record `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, and `git diff --cached --name-only`.
2. Compare the live tree with the validated inventory above. Re-run reference checks over `src`, `test`, docs, and config; account for imports, re-exports, literal dynamic imports, JSX uses, and string-key property access.
3. Read the prior `plans/home-welcome-panel-removal.md` for already completed work. Do not recreate deleted welcome-panel files or undo the separate CV edits.

### Phase 1 — Remove isolated components and style entries (C1–C3)

1. Delete the four C1 source files and the two dial tests. Rename `HeaderActions.test.tsx` to `HeaderSettingsPopover.test.tsx` without dropping its live assertions.
2. Remove exactly the C2 style entries, exclusive local definitions, and the obsolete dial-style test. Preserve all other returned keys and theme calculations.
3. Delete `TypewriterLoopText.tsx`, `useTypewriterLoop.ts`, their barrel export, and `useTypewriterLoop.test.tsx`. Remove only their dedicated types; keep the shared timing engine and IDE cursor animation. Correct the `cursorBlink` ownership comment to name its surviving IDE consumer.
4. Update text/header/style documentation. Run typecheck and focused header, text, and style tests.

### Phase 2 — Remove unused exports (C4–C6)

1. Delete the composite `transition` object/re-export and its unused type import, plus documentation that recommends those presets. Keep common duration/easing/scaling APIs.
2. Delete `appRuntimeEnvironment`. Refactor its tests to invoke `resolveAppRuntimeEnvironment()` **before restoring mocked environment variables**: the existing helper restores them after module import because the old export was an eager snapshot. Calling the resolver after restoration would test the wrong environment.
3. Delete `CommandPaletteActionKindExtended` without changing live blog action kinds or route definitions.
4. Delete only the standalone exported `unregister()` wrapper. Preserve and run active service-worker recovery tests even though they mention the same method name.
5. Update motion/constants inventory and architecture docs. Run focused resolver, command-palette, motion, and service-worker tests.

### Phase 3 — Retire dormant onboarding coherently (C7)

1. Remove the provider and wrapper from `src/index.tsx`; keep Theme outside Audio and preserve router/command-palette composition.
2. Remove `useWelcomeOnboarding`, `showSettingsHint`, and the derived highlight from `Header`. Remove the `forceVisible` override from the private `HideOnScroll`; preserve the existing scroll threshold and motion-scaled slide behavior.
3. Remove `highlightSettingsTrigger` and the unreachable highlight/Badge markup from `HeaderSettingsPopover`, along with highlight-only test IDs and `data-highlighted` fields. Preserve the actual settings button ID/test ID, accessible name, focus behavior, appearance keyboard navigation, and popover controls. Preserve the normal closed/open layout when simplifying the wrapper.
4. Remove `pulseRing` only after confirming no remaining consumer. Preserve other animations and motion scaling.
5. Delete the provider test file. Update Header/popover tests and Home fixtures, removing the retired onboarding key setup while keeping audio consent setup. Replace the returning-visitor Home test description/assertions with the still-supported entry/hero behavior where necessary.
6. Update canonical provider-order documentation and diagrams atomically with the implementation; correct the stale claim that the retired provider's state was only session-scoped.
7. Run focused Header, popover, App, and Home tests. Validate normal header scrolling, settings opening/closing, and desktop/mobile navigation in a browser.

### Phase 4 — Narrow supported state APIs (C8–C9)

1. Reduce the audio context interface/default/value to `play`, `pause`, and `isPlaying`.
2. Keep internal readiness checks, consent state, `grantAudioConsent`, iframe gating, legacy consent reads, timeouts, abort controllers, and widget event cleanup. Remove only `declineAudioConsent` and the unobserved error-message state/setters; preserve error propagation from `play()` and initialization logging. Do not convert failed playback into apparent success.
3. Update audio tests and Header mocks to the narrower API. Assert consent through storage/iframe behavior and playback through widget calls and `isPlaying`, rather than exposing state solely for tests.
4. Preserve script-error, malformed-load, timeout, retry, concurrent-play deduplication, and cleanup coverage. Replace the existing synthetic decline-triggered abort case with unmount-during-initialization coverage, followed by a clean remount/retry. Capture rejected play promises explicitly. Keep tests for legacy declined consent and existing granted consent; assert that mounting does not start playback automatically. For the development reset case, use stored granted consent to make the reset externally observable through iframe/request behavior.
5. Remove `collected` from the Web Vitals hook, return type, and scorecard mock. Retain initial empty-map, reporter registration, latest-value replacement, and multiple-metric tests.
6. Run focused audio/provider, scorecard/Web Vitals, and Header tests, then browser audio failure/retry checks. Preserve the eight-second setup timeout and existing runtime/environment behavior.

### Phase 5 — Final review and validation

1. Complete all gates in section 7 once on the final implementation. Re-run only affected gates after a later fix.
2. Search for stale live references. Expected references may remain in historical plans; current code/config/docs must not import or recommend deleted APIs. A broad search for words such as `transition`, `ready`, or `unregister` is not sufficient: distinguish retired symbols from active properties and browser APIs.
3. Confirm no dependency, asset, content, or unrelated CV changes were introduced. Review deleted tests individually to ensure live behavior was retained elsewhere.
4. Record actual results and any independent baseline failures here. Leave all changes unstaged unless separately requested. Mark implementation complete only when the agreed gates pass or an explicit, evidence-backed limitation is reported.

## 7. Validation plan

### Focused checks during implementation

Use the current test filename for the popover before its rename and the new filename afterward:

```bash
npm run typecheck
CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='Header|appStyleBuilders|TypewriterText|useTypewriterProgress|useTerminalTypewriter'
CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='runtimeEnvironment|commandPaletteActions|serviceWorkerRegistration|motion/components'
CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='Header|App.test|pages/Home|homeIdeOrchestration'
CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='WelcomeAudioProvider|useWebVitals|PerformanceScorecard|Header'
```

Do not rerun deleted suites or add tests that merely assert deleted symbols are absent. Reference checks/typecheck cover missing imports; behavior tests protect the supported app.

### Final gates

```bash
git diff --check
npx tsc --noEmit --project tsconfig.typecheck.json --noUnusedLocals --noUnusedParameters --incremental false
npm run lint
CI=true npm test -- --watchAll=false --runInBand
npm run build
npm run check:bundle
npm run test:e2e
```

The full E2E runner owns its test-runtime and production rebuilds and Chromium/smoke/mobile/subpath sequence. Preserve `chromiumSandbox: true`; never bypass sandbox restrictions or browser security. For an intermediate focused browser check use `npm run build:e2e`, then `npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/welcome.spec.ts test/e2e/navigation.spec.ts`. Production worker checks must use a production build. Close sessions after validation.

Browser acceptance includes Home at 1440px and 390px; live header/settings on Home and another route; light/dark with at least two appearance presets; motion off and reduced motion; appearance keyboard navigation and Escape/focus return; no automatic audio request/consent on a fresh visit; explicit play/pause and retry after script failure; IDE close/minimize/restore/expand; CV navigation and photography layout; performance scorecard access; and production service-worker registration/recovery. Capture representative desktop/mobile screenshots for wrapper/layout review. Preserve existing asset delivery checks run by the build/suite.

Passing TypeScript establishes type consistency, not absence of unused exports. Passing unit/browser checks establishes the tested behaviors, not guaranteed absence of all dead code. Compare bundle measurements if desired, but do not equate a deletion count with shipped-byte savings.

## 8. Risks and rollback

- **Shared dirty tree:** source/style/docs/test files already contain work from earlier tasks. Roll back only this cleanup's exact hunks/files, using the phase-start contents; never restore the whole checkout to HEAD.
- **Misleading test names:** deleting `HeaderActions.test.tsx` wholesale would discard live settings coverage. Rename and retain it.
- **Provider contract:** C7 changes a documented invariant. Treat entry point, Header consumers, tests, and canonical docs as one coherent phase; revert that phase together if it regresses.
- **Audio lifecycle:** trimming context fields must not remove private readiness/consent logic or weaken abort/retry coverage. Keep C8 separate so it can be reverted without restoring dead header/typewriter code.
- **Environment tests:** call the resolver while the test environment is still overridden; preserve restore logic to avoid test pollution.
- **Service-worker name collision:** retain native `registration.unregister()` recovery calls and their tests; remove only the unused module export.
- **Shared styling:** remove only the inventory, not live colors, cursor keyframes, or generic speed-dial infrastructure. Inspect header layout after removing its dormant cue wrapper.
- **New consumers:** revalidate immediately before deletion. A newly used symbol leaves this removal scope until its consumer is accounted for.

## 9. Progress notes and current evidence

- 2026-11-04: All C1–C9 findings revalidated against the current working tree. C8 was narrowed explicitly: unused context exposure does not imply unused internal audio state.
- Confirmed all 15 zero-consumer style entries and the two entries serving only the retired header controls.
- Confirmed `transition` has only its declaration and barrel re-export; `TypewriterLoopText` has its declaration, default export, and barrel re-export; the environment snapshot has only test consumers; the extended action kind and exported unregister wrapper have no consumers.
- `npx tsc --noEmit --project tsconfig.typecheck.json --noUnusedLocals --noUnusedParameters --incremental false` passed.
- Focused baseline command: `CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='WelcomeOnboardingProvider|WelcomeAudioProvider|header/HeaderActions|header/HeaderAppearanceDial|header/HeaderMotionDial|text/useTypewriterLoop|useWebVitals|PerformanceScorecard|styles/appStyleBuilders|constants/runtimeEnvironment|utils/serviceWorkerRegistration|constants/commandPaletteActions'` — **12 suites, 82 tests passed**.
- No build, full test suite, or browser run was performed for this planning task. Those remain implementation gates, not claimed cleanup results.
- The prior Home removal is already present. No application, test, configuration, or existing documentation files were changed while preparing this plan.

### Implementation progress

- 2026-11-04: Re-anchored to the same branch/HEAD and empty index. Saved phase-start tracked-file contents outside the repository for comparison; preserved existing Home/CV changes.
- Phases 1–2: Removed C1–C6, retaining and renaming the live popover suite. Typecheck and 14 focused suites / 108 tests passed.
- Phases 3–4: Removed dormant onboarding and its highlight wiring; retained private audio readiness/consent and narrowed its context; removed redundant Web Vitals state. Updated current architecture/style/motion documentation and provider-order invariant.
- Audio tests now observe storage, iframe/widget behavior and rejected playback promises; script failure/retry, concurrent setup, legacy consent, non-autoplay, unmount/remount cancellation and widget-readiness timeout/retry are covered. Typecheck and 12 focused suites / 89 tests passed.
- Removed `photoPlaceholderColor` after its last consumer (`photographyMediaSx`) was deleted. Other shared colors, IDE cursor animation, CV speed dial, and service-worker recovery remain intact.
- Final source graph: 171 non-declaration source files, no nonliteral dynamic imports, and only the legitimate `routerFuture.ts` / `setupTests.ts` test facilities outside the app graph. No retired symbol references remain in current source, tests, or docs.
- Final static/unit gates: strict TypeScript unused-local/parameter checks, lint, and `git diff --check` passed. Full Jest: **131 suites / 1,006 tests passed**. Production build and its **305-asset** validation passed; bundle budget passed (approximately 887 KB raw / 275 KB gzip). The existing Vite chunk-size warning remains.
- Manual sandboxed Playwright inspection: Home at 1440×1000 and 390×844; dark Evergreen and light Ember settings; motion off; appearance ArrowRight navigation; Escape returning focus to the settings button; mobile menu navigation to Photography; settings on Photography; performance scorecard opening. Representative screenshots are in `output/playwright/cruft-*.png`. Browser and development-server sessions were closed.
- The full E2E runner was attempted first under the filesystem sandbox, where local server binding failed with `EPERM`. Retried with approved process permissions while retaining `chromiumSandbox: true`; no browser security setting was weakened.
- Full E2E results: Chromium **86 passed / 1 failed**; production smoke **20 passed**; mobile production **13 passed / 1 failed**; `/portfolio` asset deployment **20 passed / 1 failed**. All Home/settings/audio-retry, motion/reduced-motion, navigation, photography, and production service-worker checks passed. The failures are described below; do not report this full gate as passing.
- The Chromium failure was `CV actions retain their links, keyboard access, and resume download`: its action menu became hidden before the download click. The exact test subsequently passed **2/2** in isolation on the current test-runtime build and **2/2** on the saved pre-cleanup build. This establishes an intermittent failure, not its root cause.
- Both mobile WebKit failures were `menu resume action downloads real PDF bytes` at the root and `/portfolio` deployments: the menu action became unstable/hidden before the tap. The same failure reproduced twice on the untouched pre-cleanup production snapshot (separate port 3103), while its two mobile Chromium controls passed; it is pre-existing. No CV or asset-test changes were made to mask the failure.
- Preserved all 358 checked CV/content/media/config paths byte-for-byte against the phase-start manifest, including the existing CV source edits and `cv-actions.spec.ts`. Index remains empty. The final normal production build was restored after the test-runtime rerun.
- Evidence: full-run and current/baseline comparison logs are saved under `output/playwright/cruft-validation/`; initial mobile failure artifacts are under `output/playwright/cruft-e2e-initial/`. Baseline execution used a temporary copy outside the checkout, with only dependency linkage and its local server port changed.

### Remaining technical debt

Follow-up on 2026-11-04: [CV actions and audio debt follow-up](cv-actions-and-audio-debt-followup.md) implements shared touch/focus corrections for the CV findings below and passes the full browser workflow. The original failure evidence remains above.

- Investigate the CV action-menu visibility/lifecycle failure on mobile WebKit and the intermittent Chromium download case separately. Both involve the retained `AppSpeedDial`/CV path; that path and the relevant existing tests were deliberately preserved.
- The eager bundle passes the repository budget, but Vite still warns about a chunk above 500 KB. Chunk splitting is outside this removal plan.

## Completion status

- [x] Validate the reported audit findings against the live checkout.
- [x] Construct a self-contained removal plan with explicit keep boundaries and validation gates.
- [x] Execute phases 0–4.
- [x] Complete phase 5 and record final validation, including the evidenced E2E limitations above.
