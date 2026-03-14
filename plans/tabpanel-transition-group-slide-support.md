# TabPanel Transition-Group Slide Support

## Goal

Add a reusable slide-up transition path for shared `TabPanel` drawer content on `/cv` so list and chip content animates into the selected drawer with staggered timing, while preserving existing tab semantics and keeping the app fully client-side.

## Why

The current `TabPanel` swaps panel bodies abruptly, which makes the Education, Experience, Coding Examples, and Stack & Tools drawers feel disconnected from the tab interaction. The baseline test coverage also has tab-panel-specific debt: `src/components/TabPanel.test.tsx` contains a brittle style-equality assertion and `src/components/cv/CodingExamplesSection.test.tsx` still asserts stale content that no longer matches `src/data/cv.ts`.

## Constraints

- Keep the app fully client-side and preserve SPA routing and `/cv` behavior.
- Keep the change narrowly scoped to shared tab-panel behavior and its `/cv` consumers.
- Preserve current tab semantics, including clicking the selected tab to close its content.
- Do not rename routes, stable CV data fields, or unrelated motion behavior.
- Use a fixed slide direction of `up` inside the tab drawer container.
- Reuse `motionTokens.accordionChipStaggerMs` for drawer-item staggering.
- Work safely on top of unrelated in-flight GitHub section edits already present in the shared branch.

## Affected files and responsibilities

- `package.json` and `package-lock.json`: remove direct `react-transition-group` dependency ownership now that no local code imports from it.
- `src/components/TabPanel.tsx`: keep `renderContent` panels mounted while inactive (with `hidden` attribute) so the drawer container exists before selection, while preserving unmount behavior for plain `content` panels.
- `src/components/TabPanel.test.tsx`: replace brittle style comparison with stable behavioral coverage for controlled/uncontrolled state, deselection, `defaultValue`, `keepMounted`, disabled-item handling, and the new `renderContent` mounted-while-inactive lifecycle.
- `src/components/AnimatedSlideList.tsx`: provide the shared drawer-focused slide primitive, driving each `Slide` with the `in` prop from selected state instead of `TransitionGroup` mount transitions.
- `src/components/SkillsChipList.tsx`: add optional slide-mode rendering for tab drawers while preserving current zoom behavior as the default.
- `src/styles/componentStyleBuilders.ts`: ensure tab drawer bodies clip and position slide content correctly.
- `src/components/cv/ExperienceList.tsx`: move highlights and skills tabs onto the transition-aware render path.
- `src/components/cv/EducationSection.tsx`: move highlights, coursework, and skills tabs onto the transition-aware render path.
- `src/components/cv/CodingExamplesSection.tsx`: move list and skills tabs onto the transition-aware render path.
- `src/components/cv/StackAndToolsSection.tsx`: move stack skill chips onto the transition-aware render path.
- `src/components/cv/*.test.tsx` for those consumers plus `src/components/SkillsChipList.test.tsx`: align stale expectations and verify the animated drawer rendering path.

## Proposed approach

First stabilize the failing tests so the new animation work starts from a clean baseline. Then add a shared slide-list component that composes MUI `Slide` directly, using stable node refs to avoid strict-mode `findDOMNode` warnings, supporting both stack and wrap layouts, and falling back to immediate rendering under reduced motion. Each `Slide` is driven by the parent `selected` state through the `in` prop rather than relying on `TransitionGroup` mount/unmount transitions. Extend `TabPanel` so that `renderContent` panels remain mounted while inactive (hidden via the `hidden` attribute), ensuring the drawer container DOM node exists before the slide transition fires. The drawer container is treated only as slide-origin context (the `container` prop on `Slide`), not as a portal or mount host. Plain `content` panels retain the existing unmount-when-inactive behavior unless `keepMounted` is enabled. The four `/cv` tab consumers already thread `selected` and `renderContext` through `renderContent`, so no consumer rewrites are needed. The direct dependency on `react-transition-group` is removed since no local code imports from it; MUI's internal usage does not require app-level ownership.

## Execution steps

1. Stabilize `TabPanel` and `CodingExamplesSection` tests, and broaden `TabPanel` coverage to its controlled, uncontrolled, deselect, disabled, and mount-state branches.
2. Add explicit transition-group dependency ownership and implement the shared slide-group primitive.
3. Extend `TabPanel` with drawer-container render context and update drawer-body clipping/positioning styles.
4. Opt `ExperienceList`, `EducationSection`, `CodingExamplesSection`, and `StackAndToolsSection` into the slide-aware list and chip rendering path.
5. Re-run targeted tests, build the app, run the `/cv` Playwright coverage, and validate `/cv` manually at desktop and mobile widths with normal and reduced motion.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath src/components/TabPanel.test.tsx src/components/SkillsChipList.test.tsx src/components/cv/ExperienceList.test.tsx src/components/cv/EducationSection.test.tsx src/components/cv/CodingExamplesSection.test.tsx src/components/cv/StackAndToolsSection.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation on `/cv` at one desktop viewport and one narrow/mobile viewport with normal motion
- Browser validation on `/cv` with reduced motion to confirm immediate rendering without animation regressions

## Risks and rollback

- Controlled/uncontrolled selection logic is easy to regress while threading new render context through `TabPanel`.
- Drawer overflow and positioning changes could clip static content incorrectly if the body styles are widened too far.
- Transition-group integrations can trigger strict-mode warnings if refs are not stable.
- Rollback is localized: remove the slide-group primitive and consumer opt-ins while leaving the base `TabPanel` selection behavior intact.

## Progress notes

- Initial inspection confirmed the `renderContent` callback is currently used only by the four `/cv` consumers named in the request.
- The baseline `TabPanel` failure comes from a style-equality test against an unrelated button surface rather than from tab behavior.
- `CodingExamplesSection.test.tsx` still asserts older typewriter-purpose copy and needs to be aligned to the current `src/data/cv.ts` values before feature work can be validated cleanly.
- Replaced the brittle `TabPanel` surface test with behavioral coverage for `defaultValue`, controlled `value`, deselect-to-`false`, `keepMounted`, disabled-item fallback, and the new drawer render context.
- Added `AnimatedSlideList` as the shared transition-group primitive, wired `SkillsChipList` into an optional slide mode, and kept zoom as the default outside tab drawers.
- Desktop browser validation on `/cv` confirmed Experience, Education, Coding Example, and Stack & Tools tabs render the new drawer content while keeping surrounding summary text stable; the active stack drawer reported `position: relative` and `overflow: hidden` as intended for clipped slide content.
- Mobile browser validation on `/cv` confirmed the same four tab groups render correctly after scrolling them into view at a narrow viewport.
- Reduced-motion browser validation on `/cv` confirmed Experience, Education, and Coding Example drawer content appears immediately after tab selection; Stack & Tools also rendered immediately once revalidated through a direct panel DOM check.
- The original `TransitionGroup`-based approach caused a staged tab drawer slide bug: items relied on mount/unmount transitions, but inactive tab panels were unmounted, so the `Slide` children never transitioned from `in={false}` to `in={true}`. Replaced with a state-driven model where `renderContent` panels stay mounted while inactive and each `Slide` is driven by selected state through the `in` prop.
- Removed direct `react-transition-group` dependency from `package.json` and `@types/react-transition-group` from `devDependencies`. MUI's internal usage does not require app-level ownership.
- Added `TabPanel` tests verifying that `renderContent` panels remain mounted while inactive with the `hidden` attribute, and that plain `content` panels still unmount when inactive.
- Rewrote `AnimatedSlideList` tests to verify inactive-to-active state transitions through `Slide` `in` prop rerenders rather than relying on first-mount animation.
