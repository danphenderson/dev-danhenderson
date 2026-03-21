# Non-Home Effective Motion Alignment

## Goal

Make active non-home motion-bearing UI surfaces resolve from the app's effective motion level instead of raw stored preference values, fixed MUI defaults, or always-smooth scrolling.

Concrete outcome:

- shared settings UI shows both the stored preference and the effective runtime state cleanly enough for consumers to disable overrides without losing the saved preset
- when effective motion is `off`, active non-home MUI enter and exit transitions collapse to `0`, app-shell scroll smoothing becomes `auto`, and spring-based smoothing paths bypass interpolation
- when effective motion is `subtle`, `default`, or `expressive`, explicit non-home transition durations scale from shared factors instead of fixed numbers
- shared app-shell surfaces used on non-home routes are in scope even if the same component also mounts on `/`
- Home-only IDE and hero motion systems remain out of scope

## Why

The current branch already computes an effective motion level in `src/ThemeProvider.tsx` and uses it for theme assembly in `src/theme/createAppTheme.ts`, while `src/motion/hooks.ts` independently forces Motion consumers to the off scale when the OS requests reduced motion.

The remaining drift is concentrated in active visible surfaces that still bypass that effective state:

- theme context exposes only the stored `motionIntensity`, so UI consumers cannot distinguish stored preference from runtime-effective state
- the header settings surface binds its active state to the stored value, not the effective value
- several active MUI transitions still use fixed or implicit timings
- several active scroll paths still always request smooth scrolling
- some active overlays still rely on default MUI transition behavior with no explicit effective-motion contract
- the shared `AppSpeedDial` primitive still controls visible non-home motion through default MUI behavior while the CV page mounts it directly outside the CV navigator

## Constraints

- Preserve the current SPA architecture, direct-link routing, and `PUBLIC_URL` compatibility.
- Preserve stored preference semantics: OS reduced motion must not overwrite the user's saved preset.
- Do not rename or repurpose the existing `motionIntensity` setter contract. Additive provider fields are allowed; breaking consumer changes are not.
- Shared app-shell surfaces used on non-home routes are in scope: `Header`, `ScrollProgressBar`, `Footer`-hosted `PerformanceScorecard`, `GlobalCommandPalette`, and global `scrollBehavior` in `createAppTheme.ts`.
- Home route validation is required for any shared consumer touched by this work, but the Home-only IDE and hero subsystem remain out of scope:
  - `src/pages/Home.tsx`
  - `src/components/TerminalHeroContent.tsx`
  - `src/components/HeroMotionPath.tsx`
  - `src/components/ide/VscodeEditorPane.tsx`
  - `src/components/ide/VscodeTerminalPanel.tsx`
  - `src/components/ide/VscodeStatusBar.tsx`
  - `src/components/ide/VscodeNotificationToast.tsx`
  - `src/components/FirstVisitCustomizeModal.tsx`
- Reuse the existing `AnimatedContentCard` patch pattern where MUI wrappers already own explicit timeout values.
- Do not introduce a large helper framework. Small shared helpers are acceptable only after repeated inline scaling would otherwise duplicate the same logic.
- Keep dormant header appearance and motion dials out of scope unless a shared primitive change requires a compile-safe incidental update.
- Leave `CommonLinkTooltip.tsx` and other third-party tooltip behavior out of the main patch unless browser validation shows a real active regression and the library exposes a clean, low-risk fix.

## Affected files and responsibilities

- `src/ThemeProvider.tsx`: expose additive effective-motion state and system-override state while preserving stored preference persistence.
- `src/theme/createAppTheme.ts`: make global document scroll behavior respect effective motion.
- `src/components/Header.tsx`: pass stored and effective motion state through the active header settings UI and scale the hide-on-scroll `Slide`.
- `src/components/header/HeaderSettingsPopover.tsx`: render active motion state from the effective level, keep stored preference selection available for user edits, and control popover transition timing explicitly.
- `src/components/header/HeaderNav.tsx`: align mobile navigation menu transition timing with effective motion.
- `src/components/AnimatedZoomList.tsx`: scale `Zoom` timeouts in addition to stagger delays.
- `src/components/AnimatedSlideList.tsx`: scale `Slide` timeouts in addition to stagger delays.
- `src/components/BackToTopButton.tsx`: scale `Zoom` timing and switch `window.scrollTo()` behavior to `auto` when effective motion is off.
- `src/components/TabPanel.tsx`: make `Collapse` and content opacity respect effective motion.
- `src/components/ScrollProgressBar.tsx`: bypass spring interpolation when effective motion is off and scale spring config for non-zero modes through shared factors.
- `src/components/GlobalCommandPalette.tsx`: preserve the current reduced-motion-aware scroll path and extend explicit dialog transition timing if needed.
- `src/components/AppSpeedDial.tsx`: explicitly control SpeedDial transition duration because it is an active visible primitive on `/cv` and in `CVSectionNavigator`.
- `src/pages/CV.tsx`: consume any `AppSpeedDial` primitive-level motion alignment through the embedded About actions consumer.
- `src/components/cv/CVSectionNavigator.tsx`: scale `Zoom`, dial opacity transition, and smooth-scroll behavior from effective motion.
- `src/components/cv/CVStoryViewer.tsx`: make story viewer container scroll behavior and fixed motion timings respect effective motion.
- `src/components/PerformanceScorecard.tsx`: align dialog transition timing with effective motion.
- `src/components/photography/ImmersiveLightbox.tsx`: align lightbox dialog transition timing with effective motion.
- `test/unit/ThemeProvider.test.tsx`: cover stored versus effective motion state and OS override behavior.
- `test/unit/components/Header.test.tsx`: cover additive header wiring to effective motion state.
- `test/unit/components/header/HeaderActions.test.tsx`: cover effective-motion display, stored-preference controls, and OS override behavior.
- `test/unit/components/header/HeaderNav.test.tsx`: cover menu transition timing plumbing.
- `test/unit/components/AnimatedZoomList.test.tsx`: assert timeout scaling and collapse.
- `test/unit/components/AnimatedSlideList.test.tsx`: assert timeout scaling and collapse.
- `test/unit/components/BackToTopButton.test.tsx`: assert instant versus smooth scroll and timeout behavior.
- `test/unit/components/TabPanel.test.tsx`: assert collapse behavior and opacity transition behavior when motion is off.
- `test/unit/components/ScrollProgressBar.test.tsx`: assert spring bypass or scaled behavior.
- `test/unit/components/GlobalCommandPalette.test.tsx`: preserve reduced-motion scroll behavior and add any explicit dialog-transition assertions only if implementation introduces them.
- `test/unit/components/AppSpeedDial.test.tsx`: cover shared SpeedDial timing wiring if the primitive changes.
- `test/unit/components/cv/CVSectionNavigator.test.tsx`: assert navigator transition and scroll behavior.
- `test/unit/components/cv/CVStoryViewer.test.tsx`: assert story viewer reduced-motion behavior.
- `test/unit/components/photography/ImmersiveLightbox.test.tsx`: cover lightbox dialog motion behavior.
- `test/unit/components/PerformanceScorecard.test.tsx`: new focused unit coverage for scorecard dialog behavior if explicit transition props are added.
- `test/e2e/home.spec.ts`: shared-header/settings consumer coverage because shared surfaces touched here are mounted on Home.
- `test/e2e/navigation.spec.ts`: shared app-shell route behavior.
- `test/e2e/cv.github.spec.ts`: CV navigator and story-mode route coverage.
- `test/e2e/photography.spec.ts`: back-to-top and lightbox route coverage.
- `test/e2e/climbing.spec.ts`: shared non-home route sanity coverage.
- `test/e2e/blog.spec.ts`: feature-gated shared overlay and command-palette coverage.
- `test/e2e/not-found.spec.ts`: command-palette dialog coverage on another shared route.
- `test/e2e/smoke.spec.ts`: production scorecard dialog coverage if `PerformanceScorecard` remains in scope.

## Proposed approach

Use the existing `AnimatedContentCard` timeout-scaling shape as the local reference for MUI wrapper components that already own explicit timeouts, but keep provider and UI state handling additive rather than repurposing the stored `motionIntensity` field.

Provider contract:

- keep `motionIntensity` as the stored preference
- add `effectiveMotionIntensity`
- add `isSystemMotionOverrideActive`
- let UI consumers decide whether they need stored state, effective state, or both

Motion patch contract:

- read `useMotionScale()` inside each active motion-owning component or primitive
- when `duration === 0`, set MUI transition timeouts to `0`, bypass spring interpolation, and switch programmatic scrolling to `auto`
- when `duration > 0`, scale explicit numeric durations with `Math.round(baseMs * durationFactor)`
- keep existing stagger-delay scaling paths intact
- keep route pages consuming shared primitives instead of moving orchestration into page code

Overlay API map:

- `HeaderSettingsPopover.tsx`: use explicit `transitionDuration` on `Popover`
- `HeaderNav.tsx`: use `transitionDuration` on `Menu`
- `GlobalCommandPalette.tsx`: use explicit dialog `transitionDuration` only if the default transition is shown to remain visible when motion is off
- `PerformanceScorecard.tsx`: use explicit dialog `transitionDuration`
- `ImmersiveLightbox.tsx`: use explicit dialog `transitionDuration`
- `AppSpeedDial.tsx`: control SpeedDial transition through explicit transition duration props if MUI exposes them cleanly; otherwise use the narrowest supported API and cover both `/cv` consumers

Residual scope boundary:

- if browser validation surfaces a real active gap outside the listed files, record it in progress notes and stop unless the fix is confined to one already-in-scope file or a small shared primitive already touched by this change

## Execution steps

1. Add this ExecPlan under `plans/` and keep it updated as implementation progresses.

2. Expose additive effective motion state from `ThemeProvider.tsx`.
   Keep the saved preference untouched, add explicit effective-motion and system-override fields, and extend provider tests first.

3. Patch shared settings and header wiring.
   Update `Header.tsx` and `HeaderSettingsPopover.tsx` so the UI can show effective motion state while preserving stored-preference editing semantics, then scale the hide-on-scroll `Slide`.

4. Patch shared non-home primitives and wrappers.
   Update `AnimatedZoomList.tsx`, `AnimatedSlideList.tsx`, `BackToTopButton.tsx`, `TabPanel.tsx`, `ScrollProgressBar.tsx`, `HeaderNav.tsx`, `GlobalCommandPalette.tsx`, and `AppSpeedDial.tsx` in that order.

5. Patch route-specific non-home consumers.
   Update `createAppTheme.ts`, `pages/CV.tsx`, `CVSectionNavigator.tsx`, `CVStoryViewer.tsx`, `PerformanceScorecard.tsx`, and `ImmersiveLightbox.tsx`.

6. Add focused unit coverage for each changed contract and only add new tests where no current coverage exists.

7. Run targeted build, unit, and Playwright validation using exact repo-standard command shapes.

8. Perform browser checks for shared surfaces on desktop and narrow viewports, then update progress notes with any residual follow-up gaps instead of silently expanding scope.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runTestsByPath test/unit/ThemeProvider.test.tsx test/unit/components/Header.test.tsx test/unit/components/header/HeaderActions.test.tsx test/unit/components/header/HeaderNav.test.tsx test/unit/components/AnimatedZoomList.test.tsx test/unit/components/AnimatedSlideList.test.tsx test/unit/components/BackToTopButton.test.tsx test/unit/components/ScrollProgressBar.test.tsx test/unit/components/TabPanel.test.tsx test/unit/components/GlobalCommandPalette.test.tsx test/unit/components/AppSpeedDial.test.tsx test/unit/components/cv/CVSectionNavigator.test.tsx test/unit/components/cv/CVStoryViewer.test.tsx test/unit/components/photography/ImmersiveLightbox.test.tsx`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/navigation.spec.ts test/e2e/cv.github.spec.ts test/e2e/photography.spec.ts test/e2e/climbing.spec.ts test/e2e/blog.spec.ts test/e2e/not-found.spec.ts`
- `npm run build && npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`

Browser validation:

- validate desktop and narrow/mobile viewports on `/cv`, `/cv?mode=story`, `/climbing`, `/photography`, one photography detail route, and `/`
- validate the shared header settings popover on a non-home route with default motion, motion off, and OS reduced-motion emulation
- validate that shared non-home MUI enter and exit motion collapses instantly when effective motion is off
- validate that back-to-top, CV section navigation, story viewer scrolling, and command-palette hash jumps use instant scrolling when effective motion is off
- validate the footer performance dialog and photography lightbox directly because they sit outside page-content wrappers
- validate one light mode route and one dark mode route because `createAppTheme.ts` changes global scroll behavior in theme assembly

## Risks and rollback

- additive `ThemeProvider` API changes can still regress consumers if tests or mocks are not updated everywhere the hook is used
- changing global `scrollBehavior` can affect hash navigation, skip links, and scroll expectations across all routes
- `TabPanel` mixes `Collapse` timing with a separate opacity transition, so off-mode handling must collapse both paths
- `ScrollProgressBar` uses spring interpolation rather than timeout-based motion, so off-mode behavior must bypass the spring instead of only scaling numeric config values
- `AppSpeedDial` is shared between active and dormant surfaces; a primitive-level change must preserve compile safety for the dormant header dial consumers
- dialog, popover, menu, and speed-dial APIs expose different transition knobs; patching them requires targeted component-level tests to avoid accidental no-op props
- rollback order:
  - first revert provider additive fields and header/settings wiring
  - then revert shared primitives and app-shell motion patches
  - then revert route-specific consumers
  - keep already-correct Motion primitives untouched

## Progress notes

- 2026-03-21: Added the ExecPlan file before implementation because this work is cross-cutting and touches shared app-shell motion.
- 2026-03-21: Tightened scope versus the original draft by explicitly including shared app-shell consumers, adding `AppSpeedDial` and `pages/CV.tsx`, and replacing the open-ended residual audit with a closed boundary.
- 2026-03-22: Reviewer follow-up found one blocker still open: `ScrollProgressBar.tsx` still routed the off-motion branch through `useSpring`, so the off path continued to interpolate instead of binding directly to `scrollYProgress`.
- 2026-03-22: Reviewer follow-up patched `ScrollProgressBar.tsx` to bypass `useSpring` entirely when effective motion is off and added direct off-mode unit coverage for `ScrollProgressBar`, `AppSpeedDial`, `BackToTopButton`, `CVSectionNavigator`, and `PerformanceScorecard`.
- 2026-03-22: Reviewer validation reran `npm run build`, `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/ScrollProgressBar.test.tsx test/unit/components/AppSpeedDial.test.tsx test/unit/components/BackToTopButton.test.tsx test/unit/components/cv/CVSectionNavigator.test.tsx test/unit/components/PerformanceScorecard.test.tsx`, and `npx eslint src/components/ScrollProgressBar.tsx test/unit/components/ScrollProgressBar.test.tsx test/unit/components/AppSpeedDial.test.tsx test/unit/components/BackToTopButton.test.tsx test/unit/components/cv/CVSectionNavigator.test.tsx test/unit/components/PerformanceScorecard.test.tsx`. The broader Playwright, smoke, and browser-validation steps from the original plan were not rerun in this reviewer follow-up.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
