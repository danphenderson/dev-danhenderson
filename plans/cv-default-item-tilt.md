# Default CV Item Tilt

## Goal

Enable the repeated content cards on the default `/cv` layout to use the existing 3D mouse-follow tilt effect while preserving the current CV page architecture, section ordering, and list content rendering.

## Why

The repeated CV cards are the highest-volume interactive surfaces on the default CV page, so they are the best place to extend the existing Photography interaction pattern with meaningful reuse. This scope satisfies the request to reuse `TiltCard`, keep the shared spring behavior, and standardize the entrance choreography on the project's motion primitives without broadening the change into story mode or section-shell redesign.

## Constraints

- Reuse the existing `TiltCard` utility; do not duplicate the tilt math or spring logic.
- Keep `TiltCard` physics aligned with the current implementation: `stiffness: 200`, `damping: 20`, `transformPerspective: 900`, and `transformStyle: 'preserve-3d'`.
- Use motion primitives from `src/motion/index.ts` for the targeted repeated-card entrance sequence before the interactive tilt state is active.
- Scope is limited to the default `/cv` layout. Story mode remains unchanged.
- Target only repeated CV item cards, not the About profile card, whole CV section containers, or the GitHub calendar/data panels.
- Preserve existing route behavior, SPA/static-hosting compatibility, GitHub fallback behavior, and current CV content/data sources.
- Keep the change narrow and avoid widening shared component APIs more than needed for the repeated CV card use case.

## Affected files and responsibilities

- `src/components/AnimatedContentList.tsx`: primary integration seam; add an opt-in render path for motion-driven entrance plus `TiltCard` wrapping while preserving existing mount-on-view and skip-animation behavior for current consumers.
- `src/components/photography/TiltCard.tsx`: reuse as-is if possible; only touch this file if a minimal API extension is required to support CV layout passthrough without changing the tilt physics.
- `src/components/ContentCard.tsx`: likely reused directly by the new `AnimatedContentList` path so the panel surface can remain unchanged when bypassing `AnimatedContentCard`.
- `src/components/cv/CertificatesList.tsx`: opt certificates into the tilt-enabled list mode.
- `src/components/cv/ExperienceList.tsx`: opt experience cards into the tilt-enabled list mode.
- `src/components/cv/EducationSection.tsx`: opt education entry cards into the tilt-enabled list mode.
- `src/components/cv/VolunteeringList.tsx`: opt volunteering cards into the tilt-enabled list mode.
- `src/components/cv/CodingExamplesSection.tsx`: opt coding example cards into the tilt-enabled list mode.
- `test/unit/components/AnimatedContentList.test.tsx`: extend coverage for the new motion-plus-tilt render path and preserved list semantics.
- `test/unit/components/cv/CertificatesList.test.tsx`: update mocked `AnimatedContentList` expectations for the new opt-in behavior.
- `test/unit/components/cv/ExperienceList.test.tsx`: update mocked `AnimatedContentList` expectations for the new opt-in behavior.
- `test/unit/components/cv/EducationSection.test.tsx`: update mocked `AnimatedContentList` expectations for the new opt-in behavior.
- `test/unit/components/cv/VolunteeringList.test.tsx`: update mocked `AnimatedContentList` expectations for the new opt-in behavior.
- `test/unit/components/cv/CodingExamplesSection.test.tsx`: update mocked `AnimatedContentList` expectations for the new opt-in behavior.
- `test/unit/components/photography/TiltCard.test.tsx`: rerun as a regression guard for the shared tilt utility.
- `test/e2e/cv.github.spec.ts`: rerun to confirm default CV behavior remains stable with the new repeated-card composition.

## Proposed approach

Add a narrow, opt-in tilted repeated-card mode to `AnimatedContentList` instead of introducing CV-only duplicate list animation code. In that mode, `AnimatedContentList` should keep its existing viewport-gating logic, item key handling, item surface styling, and stack/wrap layout responsibilities, but swap the item animation layer from `AnimatedContentCard` to motion-driven wrappers composed from `StaggerChildren`, `MotionItem`, and `scaleIn`. Each targeted item should then wrap the rendered card surface with `TiltCard` so the motion entrance finishes before the pointer-driven transform becomes the steady-state interaction.

Keep the existing outer `CVSectionCard` and section-level reveal flow intact. The change should be limited to repeated item cards inside the section content, which avoids double-applying tilt to large section shells and limits the risk of layout regressions in the page grid. Preserve the current CV list cadence by mapping the existing `startDelayMs` and `120ms` item staggering into the tilted `StaggerChildren` configuration instead of silently switching those lists to the motion system's faster default stagger.

## Execution steps

1. Define the repeated-card tilt contract in `AnimatedContentList`.
2. Implement the motion-driven repeated-card render path inside `AnimatedContentList`.
3. Preserve existing CV reveal timing in the tilted list mode.
4. Opt the five repeated default-mode CV list consumers into the new tilt-enabled list mode.
5. Update unit tests for the shared list seam and CV list wrappers.
6. Run targeted verification and browser validation.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runInBand test/unit/components/AnimatedContentList.test.tsx test/unit/components/photography/TiltCard.test.tsx test/unit/components/cv/CertificatesList.test.tsx test/unit/components/cv/ExperienceList.test.tsx test/unit/components/cv/EducationSection.test.tsx test/unit/components/cv/VolunteeringList.test.tsx test/unit/components/cv/CodingExamplesSection.test.tsx`
- `npx playwright test test/e2e/cv.github.spec.ts`
- Browser-check `/cv` in a narrow/mobile viewport and a desktop viewport, confirming repeated cards animate in, tilt smoothly on pointer move, reset on mouse leave, and do not clip or jitter during tab expansion.
- If `TiltCard` or shared motion behavior changes, browser-check `/photography` to confirm the original album-card tilt effect still renders and feels unchanged.

## Risks and rollback

- The biggest regression risk is double animation: the CV page already uses `AnimatedContentCard` / `Zoom` at the section shell, so the implementation should avoid adding another full-card entrance wrapper at the section level.
- `AnimatedContentList` currently uses explicit `120ms` per-item timing, while the shared motion stagger defaults to `80ms`. If the new path silently changes cadence, the default CV page may feel noticeably different even if the code is correct.
- `StaggerChildren` expects `MotionItem` direct children, which may require careful handling of MUI stack or wrap layout styles so spacing remains consistent.
- 3D transforms can introduce clipping, aliasing, or overflow artifacts in dense CV panels, especially when tab content expands. Keep the rollout isolated to the opt-in list mode so it can be disabled quickly if visual regressions appear.
- Rollback path: remove the opt-in flag from the five CV list consumers first; if needed, revert the `AnimatedContentList` tilt branch while keeping the original `AnimatedContentCard` path intact.

## Progress notes

- Discovery confirmed `TiltCard` is currently only used on Photography and already contains the required spring and perspective settings.
- Discovery confirmed the repeated default-mode CV cards all funnel through `AnimatedContentList`, making it the narrowest reusable integration seam.
- Included scope: repeated default-mode CV item cards in certificates, experience, education, volunteering, and coding sections.
- Excluded scope: story mode, About profile card, GitHub section cards/calendar, route restructuring, and any new tilt implementation separate from `TiltCard`.
- Implemented an opt-in `tiltItems` path in `AnimatedContentList` that renders repeated cards through `StaggerChildren`, `MotionItem`, `scaleIn`, `TiltCard`, and `ContentCard`, while preserving the existing `AnimatedContentCard` path for non-tilted consumers.
- Opted the default CV repeated-card lists into `tiltItems` in certificates, experience, education, volunteering, and coding examples.
- Updated the shared list and CV wrapper unit tests, and expanded `TiltCard` coverage to assert the shared spring config and depth styling.
- `npm run build` compiled successfully with existing unrelated ESLint warnings in `src/components/TabPanel.tsx`, `src/hooks/githubProfileData.ts`, and `src/hooks/useClimbingData.ts`.
- Targeted Jest validation passed for the shared list seam, the five CV list wrappers, and `TiltCard`.
- Follow-up cleanup aligned the story-mode Playwright assertions with the current immersive viewer contract, and `npx playwright test test/e2e/cv.github.spec.ts` now passes 6 of 6 checks.
- Browser validation confirmed the default `/cv` desktop and mobile layouts render the repeated cards correctly, the tilted wrappers expose `perspective(900px)` and `preserve-3d`, and an Experience card responds to hover and resets after mouseout. A `/photography` smoke check also confirmed the original tilt wrappers still render.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
