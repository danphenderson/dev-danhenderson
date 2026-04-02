# CV Section Reveal Choreography

## Goal

Change the default `/cv` landing sequence so the About section renders alone on initial load, the remaining sections stay out of the page until the shared header-collapse scroll threshold is crossed, and the desktop body sections enter with direction-aware motion based on their column placement.

## Why

The current CV route mounts every section immediately and relies on per-section viewport reveals. That dilutes the intended focus on the About section and makes the first screen feel populated before the user has engaged with the page. The requested choreography makes the landing state cleaner, ties the next reveal step to an existing global UI transition, and gives the desktop columns a more intentional left/right entrance.

## Constraints

- Preserve the existing client-side `/cv` route and story-mode behavior.
- Keep the change narrowly scoped to CV route composition, CV-specific reveal state, and the minimum shared card-motion surface needed to support directional entrances.
- Reuse the existing header scroll threshold instead of inventing a second collapse trigger.
- Preserve the motion intensity contract so reduced motion and `motionIntensity=off` still render instantly.
- Do not regress GitHub fallback behavior or section anchor/navigation behavior.

## Affected files and responsibilities

- `src/pages/CV.tsx`: own route-level gating so About renders first and non-About sections mount only after the shared scroll trigger flips.
- `src/pages/cvRouteOrchestration.tsx`: extend section descriptor metadata with any reveal-gate or entrance-direction data needed by the route and CV section components.
- `src/pages/cvPageLayout.ts`: keep desktop/mobile layout metadata authoritative for section placement and sequencing.
- `src/components/AnimatedContentCard.tsx`: add the smallest shared entrance-direction support needed for CV section cards while preserving current default behavior.
- `src/components/layout/SectionCard.tsx` and `src/components/cv/CVSectionCard.tsx`: forward the new entrance configuration without changing existing defaults.
- `src/components/cv/*.tsx`: pass direction-aware entrance data where required for desktop CV sections.
- `test/unit/pages/CV.test.tsx` and `test/unit/pages/CVRevealPersistence.test.tsx`: verify the new initial mount and reveal-gate behavior.
- `test/unit/components/cv/*.test.tsx` and `test/unit/components/layout/SectionCard.test.tsx`: verify the new entrance prop is forwarded correctly.
- `test/e2e/cv.github.spec.ts`: verify the route still behaves correctly when content is revealed after scroll.

## Proposed approach

Keep the choreography page-owned. The `/cv` route should read the same `HEADER_HIDE_SCROLL_TRIGGER_OPTIONS` already used by the header and floating section navigator, then treat that trigger as the release gate for all non-About content. The About section stays mounted immediately so its existing internal reveal sequence still plays.

For desktop entrances, extend the shared animated card wrapper with an optional entrance-direction prop that defaults to the current zoom behavior. CV-specific sections can then opt into `left` or `right` slide entrances without changing the rest of the app. The desktop main column sections should use one side consistently and the desktop sidebar sections should use the opposite side, matching the requested directional choreography. Mobile keeps the simpler stacked behavior and only changes the initial gate.

## Execution steps

1. Add a written route-level plan and confirm the shared header-collapse trigger is the reveal gate.
2. Extend the CV layout/descriptor data so non-About sections can be identified as gated content and desktop sections can declare an entrance side.
3. Update the `/cv` route to mount only About initially, then release the remaining sections once the shared scroll trigger becomes active.
4. Extend the animated section card path with an optional directional entrance and wire CV desktop sections to the correct side.
5. Update unit tests for route gating, reveal persistence, and prop forwarding.
6. Run targeted validation for build, unit coverage, and `/cv` browser behavior.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false --runInBand test/unit/pages/CV.test.tsx test/unit/pages/CVRevealPersistence.test.tsx test/unit/components/cv/CVAboutSection.test.tsx test/unit/components/cv/CVExperienceSection.test.tsx test/unit/components/cv/CVSectionCard.test.tsx test/unit/components/layout/SectionCard.test.tsx`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts`
- Browser validation on `/cv` with one desktop viewport and one mobile viewport, including initial load, first scroll past the header-collapse threshold, and motion-intensity-off behavior.

## Risks and rollback

- Hidden coupling: the header-collapse trigger is shared with the floating section navigator; if the CV release gate uses a different threshold, the page will feel inconsistent.
- Shared-component risk: changing `AnimatedContentCard` could affect non-CV consumers if default entrance behavior changes. Keep zoom as the default and make directional entrance opt-in.
- Sequencing risk: mounting non-About sections only after scroll could affect section-nav and anchor expectations. Validate the navigator appearance and anchor jumps after the gate opens.
- Rollback path: revert the new route gate first while keeping any harmless entrance-prop plumbing isolated; then revert the directional entrance support if needed.

## Progress notes

- 2026-04-01: Confirmed the header and `CVSectionNavigator` both already use `HEADER_HIDE_SCROLL_TRIGGER_OPTIONS`, making that the correct shared gate for the new `/cv` reveal sequence.
- 2026-04-01: Confirmed the existing CV route already centralizes section metadata in `cvPageLayout.ts` and `cvRouteOrchestration.tsx`, so the sequencing change can stay page-owned.
- 2026-04-02: Confirmed the active branch already includes the route-level unlock gate in `src/pages/CV.tsx`, desktop/mobile entrance-direction metadata in `src/pages/cvPageLayout.ts`, and opt-in directional card support in `src/components/AnimatedContentCard.tsx`.
- 2026-04-02: `CI=true npm test -- --watchAll=false --runInBand test/unit/pages/CV.test.tsx test/unit/pages/CVRevealPersistence.test.tsx test/unit/components/cv/CVAboutSection.test.tsx test/unit/components/cv/CVExperienceSection.test.tsx test/unit/components/cv/CVSectionCard.test.tsx test/unit/components/layout/SectionCard.test.tsx` passed.
- 2026-04-02: `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts` passed.
- 2026-04-02: Browser validation passed on `/cv` at `1440x1200` and `390x844`, confirming About-only initial render, unlock after scroll, section navigator appearance after unlock, and correct behavior with `danhenderson-motion=off`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
