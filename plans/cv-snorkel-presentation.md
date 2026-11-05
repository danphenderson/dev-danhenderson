# CV experience and motion polish

## Goal

Add Snorkel AI as the current Expert Contributor role beginning June 2026, and review the CV's presentation and motion in the running application.

## Why

The experience list is missing the user's current contributor role. A focused motion pass has also identified CV-only animations and reveal timers that bypass the existing motion preference.

## Constraints

- Work on `codex/cv-snorkel-presentation`, freshly based on fetched `origin/main`.
- Preserve the client-side SPA, route anchors, GitHub fallbacks, providers, content schemas, and downloadable resume.
- Keep content in `src/data/cv.ts`; do not invent duties, skills, or achievements.
- Use the existing `useMotionScale()` contract and timing tokens. Keep changes within the CV subsystem except the confirmed shared card visibility repair documented below.
- Preserve the pre-existing untracked `output/` directory and any concurrent work.
- Keep the Playwright browser sandbox enabled.

## Affected files and responsibilities

- `src/data/cv.ts`: current contributor experience.
- `src/components/cv/CVAboutSection.tsx` and `CVAboutBioTypewriter.tsx`: About reveal timing and immediate off/reduced-motion presentation.
- `src/components/cv/CVExperienceSection.tsx`: scale the detail backdrop transition.
- `src/components/cv/CVStoryProgress.tsx`: scale progress transitions.
- `src/components/cv/ExperienceList.tsx`: dismiss the detail backdrop when keyboard focus enters a different role.
- `src/components/AnimatedContentCard.tsx`: ensure uncontrolled cards render immediately with motion off, preserving explicitly controlled visibility. This shared primitive underlies all CV repeated lists and other route surfaces.
- Existing focused CV unit tests: verify off/reduced and default timing behavior.
- `README.md`: document the corrected CV motion preference behavior.
- Further presentation fixes only if confirmed in the browser; update this plan before expanding scope.

## Proposed approach

Prepend a concise Expert Contributor entry with `Jun 2026 – Present`. Preserve existing experience rendering in exploratory and story modes. Correct only the discovered CV timing bypasses, retaining normal-motion choreography. Inspect desktop/mobile, light/dark, expandable experience details, story mode, and motion off/reduced in the requested Browser once a local server is available.

## Execution steps

1. Fetch main, create the fresh branch, inspect the smallest relevant source set. Complete.
2. Add the role and correct the CV-specific motion bypasses.
3. Start the application and inspect the route, recording any focused presentation findings. Complete after the user started the server.
4. Run focused tests, typecheck/lint, production build, and relevant CV browser regressions. Review the final diff and branch state. Complete; remaining mobile menu failures reproduce on clean main and are documented below.

## Validation plan

- `CI=true npm test -- --watchAll=false --testPathPatterns='CVAboutSection|CVAboutBioTypewriter|CVExperienceSection|CVStoryProgress|ExperienceList|CVStory|cv.test|CVRevealPersistence'`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts test/e2e/cv-actions.spec.ts` (mocked GitHub states require the test-runtime build; use `npm run build:e2e` before that run).
- Browser review of `/cv`, deep-linked Experience, story mode, mobile and desktop, light/dark, and motion off/reduced. Capture screenshots.
- Broaden unit checks if new coupling or failures require it.
- Shared reveal repair: non-intersecting observer unit tests for off/reduced, controlled-hidden preservation, and preference changes; full unit and E2E suites, plus Browser validation on an additional consumer route.

## Risks and rollback

- About is a sequential reveal state machine; avoid duplicate completion callbacks or replay when preferences change.
- Outer section persistence intentionally leaves inner list entrances independent; preserve that behavior.
- Current experience is added to story mode automatically, so verify the story builder/renderer tests too.
- Revert only this task's narrow changes if necessary. No schema or dependency migrations are involved.

## Progress notes

- The branch is based on fetched main at `be7dddfd89bda3eae1db08e9483563403a19dd34`; pre-existing files in `output/` are preserved.
- Baseline production build passes; it reports an existing large-chunk warning.
- Automatic approval review rejected `npm start` (including localhost-only binding), reporting approval required with approvals unavailable. The user has been asked to start the preview while implementation continues. Browser validation is pending a running server.
- The user started the dev server, and Browser review is underway. Desktop review confirmed the new role renders correctly and verified that Tab from an expanded role moves to a different card under the blurred backdrop. Extend the focused fix to dismiss the active detail on focus entering another role, without adding public props.
- Mobile Browser reload at `/cv#cv-experience` with motion off confirmed that nested cards can remain hidden behind `scale(0)` until another scroll. The shared `AnimatedContentCard` skips timing but still gates uncontrolled visibility on an intersection observer. Fix that primitive so off/reduced is immediately visible and does not depend on intersection; preserve explicit `visible={false}` and existing normal-motion behavior. This shared correction is needed across the CV's repeated lists, so broaden consumer checks accordingly.
- Initial checks pass: typecheck, lint, test-runtime build, 137 unit suites / 1056 tests, and 11 targeted CV E2E cases. These predate the shared reveal repair; repeat appropriate checks after it.
- Final implementation checks pass: all 137 unit suites / 1063 tests, typecheck, lint with no warnings, and diff whitespace checks. Normal-mode timing and explicitly hidden controlled cards remain protected.
- Browser review completed at desktop 1440x1000 and mobile 390x844, using Evergreen light/dark and Atlas dark. Checked full-CV reveal, direct Experience link reload, story mode with the Snorkel AI role, and focus leaving expanded details. Motion-off mobile reload now shows the previously hidden cards; focus moving to another role clears the backdrop. Climbing's intro and log reveal still render correctly as an additional shared-card consumer. Browser settings restored and sessions closed.
- Captured desktop/mobile screenshots in `output/playwright/cv-snorkel-{desktop,mobile}-2026-11-02.png`; existing output files are preserved. Full E2E output is recorded in `output/playwright/cv-validation-2026-11-02.log`.
- The first full E2E run reached the mobile asset tests but failed because WebKit build 2311 was absent. Installed the matching Playwright WebKit browser without changing dependencies; the full E2E rerun is pending. Production builds continue to pass their 305-asset checks.
- Existing debt observed: build chunk-size warning above 500 KB, and the Vite dev preview emits manifest URL DNS errors. Neither changes the CV presentation or production asset validation; neither is widened into this task.
- Full E2E rerun completed: 88/88 Chromium route/interaction tests, 20/20 production smoke tests, 13/14 mobile asset tests, and 20/21 subpath asset tests passed. The two failing runs both concern the small About action-menu resume download: WebKit's action becomes hidden while tap waits for stability; the subpath Chromium case reports an obscured trigger center. The direct header resume download passes.
- Focused WebKit menu retry failed 3/3 times. To check regression attribution, an isolated source snapshot of exact `origin/main` (`be7dddf`) was built with existing dependencies/assets and tested with the same mobile-WebKit case. It fails with the same initial instability followed by 53 hidden-element retries and no download. This is confirmed existing action-menu debt, not introduced by these changes. Baseline logs/trace are retained at `/tmp/cv-main-baseline-evidence-2026-11-02/`; the temporary snapshot was removed. The main workspace build/source/server remained untouched during comparison.
- Final branch remains `codex/cv-snorkel-presentation`; `HEAD` and `origin/main` still match the starting revision. Changes are unstaged/uncommitted, no dependencies or public APIs changed, and final `git diff --check` passes.

## Completion status

- [ ] In progress
- [x] Complete
