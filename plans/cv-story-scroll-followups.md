# CV Story Scroll Follow-Ups

## Goal

Bring `/cv?mode=story` to a production-ready continuous-scroll experience by moving story mode into a route shell that suppresses surrounding site chrome, preserving structured experience project content in the story renderer, removing retired slide-deck artifacts, and then repairing and strengthening the test and validation surface for the new interaction model.

## Why

The current branch rewrites story mode from a slide deck into a continuous-scroll narrative, but it still leaves app-shell chrome mounted behind the fullscreen viewer, flattens structured `ExperienceProject` content into plain text, and keeps obsolete slide-deck artifacts in the codebase. Validation is also stale: route-level and browser-level tests still assert removed slide controls, and the new viewer test does not exercise the actual scroll-tracking behavior.

## Constraints

- Preserve the fully client-side SPA architecture and direct-link routing behavior.
- Keep static-hosting compatibility and `PUBLIC_URL`-safe asset handling intact.
- Keep CV content sourced from existing TypeScript data modules.
- Keep changes narrowly scoped to `/cv` story mode, its supporting shared CV components, and directly related motion/test files.
- Avoid renaming stable exported types or data fields unless all consumers are updated in the same change.
- Address validation and test work after the requested implementation changes.

## Affected files and responsibilities

- `src/App.tsx`: route shell composition and suppression of global chrome for story mode.
- `src/pages/CV.tsx`: story-mode wiring and route-level composition.
- `src/components/cv/CVStoryViewer.tsx`: fullscreen story viewer behavior and section rendering.
- `src/components/cv/CVStorySectionRenderer.tsx`: per-section story rendering, structured experience project output, and divider behavior.
- `src/components/cv/ExperienceList.tsx`: current canonical structured experience rendering to align with story mode.
- `src/components/cv/CVStoryHeader.tsx`: default CV mode controls that remain outside fullscreen story mode.
- `src/data/cv.ts`: story metadata and any retired story-only artifacts.
- `src/motion/variants.ts`: removal of unused slide-deck variants.
- `src/motion/index.ts`: removal of stale slide-deck re-exports.
- `test/unit/components/cv/CVStoryViewer.test.tsx`: viewer behavior coverage for scroll-based story mode.
- `test/unit/components/cv/CVStorySectionRenderer.test.tsx`: renderer coverage, including structured project content.
- `test/unit/pages/CV.test.tsx`: route-level story-mode expectations.
- `test/e2e/cv.github.spec.ts`: browser-level story-mode coverage for the scroll narrative.

## Proposed approach

Use the app shell, not the viewer overlay itself, to suppress surrounding chrome when the current route is `/cv?mode=story`. This keeps fullscreen behavior at the route-shell boundary and avoids leaving hidden header/footer content mounted behind the story experience.

Align story-mode experience content with the existing CV experience rendering by extracting or sharing the inline project-segment rendering logic, rather than flattening structured `ExperienceProject` entries into plain text.

Remove dead slide-deck surfaces that are no longer part of the continuous-scroll architecture: the old story nav bar, slide-only motion variants, and unused chapter-specific artifacts that no longer participate in `/cv?mode=story`.

After the implementation changes land, update unit and Playwright coverage to assert the new scroll-based contract: story mode renders without app chrome, old slide controls are absent, the exit affordance remains available, structured links remain interactive, and active-kind/scroll state is tested through explicit observer behavior rather than legacy assumptions.

## Execution steps

1. Add this ExecPlan and keep it updated as implementation progresses.
2. Update the route shell so `/cv?mode=story` suppresses global header/footer and related page chrome while preserving default `/cv` behavior.
3. Rename or replace the story section renderer surface so it reflects the continuous-scroll model, and teach it to preserve structured `ExperienceProject` content.
4. Remove retired slide-deck artifacts and stale exports that are no longer consumed by the scroll narrative.
5. Update unit and Playwright coverage last so the validation surface matches the new story-mode contract.
6. Run the narrowest relevant build and test coverage, then expand only as needed if failures indicate hidden coupling.

## Validation plan

- `npm run build`
- `export CI=true && npm test -- --watch=false --runInBand test/unit/components/cv/CVStoryViewer.test.tsx test/unit/components/cv/CVStorySectionRenderer.test.tsx test/unit/pages/CV.test.tsx test/unit/data/cvStoryItems.test.ts`
- `npm run build:e2e`
- `npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts`
- Browser validation of `/cv` and `/cv?mode=story` on desktop and a narrow viewport, confirming chrome suppression, story content rendering, and exit behavior.

## Risks and rollback

- App-shell changes can unintentionally affect non-story routes if the route detection is too broad.
- Removing slide-deck artifacts can break tests or imports that still rely on old names.
- Sharing structured experience rendering between default CV and story mode can introduce subtle markup or spacing regressions.
- If app-shell suppression proves too invasive, rollback should isolate the change to a route-level shell check without altering unrelated route composition.

## Progress notes

- 2026-03-20: Plan created. Requested execution order is route shell change first, structured `ExperienceProject` rendering second, slide-deck artifact removal third, and validation/test repair last.
- 2026-03-20: Updated `src/App.tsx` so `/cv?mode=story` suppresses global header, footer, skip links, and scroll progress at the route-shell level while keeping shared overlays mounted.
- 2026-03-20: Extracted shared experience rich-text helpers into `src/components/cv/experienceContent.tsx` and reused them in both the default experience list and the story section renderer so structured project links are preserved.
- 2026-03-20: Removed source and test slide-deck artifacts, including the old nav bar component/test, unused chapter metadata/component, deprecated slide renderer alias, and unused slide-only motion variants/re-exports. Renamed the renderer source and test files to `CVStorySectionRenderer`.
- 2026-03-20: Validation completed with `npm run build`, focused CV-related Jest coverage, `npm run build:e2e`, and `npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts`.
- 2026-03-20: Remaining drift is limited to scoped agent-instruction files that still mention removed slide-deck symbols; product code and tests were updated, but those instruction documents were left untouched to keep the change narrowly focused.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
