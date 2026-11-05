# Connect CV Stack chips to evidence

## Goal

Make selected chips in the `/cv` About card navigate to specific, relevant project or experience entries. A visitor should be able to follow a skill claim to a concrete example, copy that destination, and revisit it directly.

The user approved implementation of both ExecPlans on 2026-11-04. Implementation is complete in the agreed order: verified case-study content, entry navigation, then linked Stack chips. Completion and validation are recorded below.

Companion plan: [Portfolio project case studies](portfolio-project-case-studies.md). Write the supporting case-study content before enabling chips that depend on it.

## Why

At planning time, the Stack was a twelve-item `string[]` in `src/data/cv.ts`. `CVAboutSection` passed it to `SkillsChipList` as non-interactive chips. The list communicated familiarity but offered no direct path to supporting work.

The repository already has useful destinations: coding examples, Lucerna Health experience, and portfolio implementation evidence. However, `/cv` currently recognizes section hashes such as `#cv-coding`, not individual entries. Coding and experience cards can also be deferred or mounted only when their section enters view. Adding links without addressing those conditions would create destinations that sometimes do not exist when clicked.

## Constraints

- **Preserve the user's preferred CV motion.** Keep the bio typewriter, heading/chip sequence, section entrances, stagger, tilt, tab transitions, story motion, and reveal persistence. Do not make the standard CV immediately reveal all content or move its motion into story mode.
- Navigation to a chosen entry may unlock that entry's containing section, as existing section deep links do. This is an explicit navigation action, not a change to the normal arrival sequence.
- Continue using `useMotionScale()` and the existing off/reduced-motion behavior. Do not change preferences or timing tokens to make navigation easier.
- Keep the SPA, route definitions, `PUBLIC_URL` behavior, provider order, and GitHub fallbacks intact. No new route, backend, dependency, or runtime request for evidence discovery.
- Keep existing labels and `currentWorkflowTools: string[]` compatible with their consumers. Unlinked chips remain useful, plain labels.
- Do not treat a repository's popularity, another skills list, or the decorative Home IDE's mock files as proof of personal work.
- Leave the downloadable resume, Home hero, audio, blog content, climbing data, and photography data outside scope.
- Follow [PLANS.md](../PLANS.md), [agent guidance](../docs/engineering/agent-guide.md), and the nearest scoped instructions before implementation. Preserve the existing staged and unstaged work.

## Affected files and responsibilities

| File or area                                                                                                          | Planned responsibility                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/cv.ts`                                                                                                     | Add stable entry identifiers and a small discriminated type for project/experience evidence targets.                              |
| `src/data/cv.ts`                                                                                                      | Own entry IDs and the explicit Stack-to-evidence mapping; retain current label order.                                             |
| `src/types/ui.ts`                                                                                                     | Own the generic chip-link descriptor if shared by the renderer and its consumers.                                                 |
| `src/components/SkillsChipList.tsx`                                                                                   | Accept optional link metadata without changing existing string-only consumers or animation defaults.                              |
| `src/components/cv/CVAboutSection.tsx`                                                                                | Pass link metadata only to the Stack row; opportunity chips remain unchanged.                                                     |
| `src/pages/cvRouteOrchestration.tsx`                                                                                  | Wire the mapping through the existing About/section descriptors.                                                                  |
| `src/pages/CV.tsx` and proposed `src/pages/cvEvidenceNavigation.ts`                                                   | Resolve supported entry hashes, unlock the parent section, coordinate mounting, scroll, focus, cancellation, and history.         |
| `src/components/cv/CodingExamplesSection.tsx`, `CVCodingSection.tsx`, `ExperienceList.tsx`, `CVExperienceSection.tsx` | Render stable targets and expose only the readiness/selected-detail state needed by explicit entry navigation.                    |
| `src/components/cv/cvSectionMetadata.ts`                                                                              | Continue owning section anchors and header offsets; derive parent-section behavior from it.                                       |
| `src/components/AnimatedContentList.tsx`                                                                              | Only if needed, add an optional per-item visibility callback using the existing card visibility signal. Keep all defaults intact. |
| `src/styles/componentStyleBuilders.ts`                                                                                | Add linked-chip hover/focus treatment through the existing style-builder pipeline.                                                |
| Relevant unit/E2E tests, `README.md`, architecture/testing docs                                                       | Document and protect deep-link behavior and shared-consumer compatibility.                                                        |

The implemented navigation helper keeps DOM coordination out of content data and chip components. It is specific to CV entry navigation and does not replace the router or motion system.

## Proposed approach

### 1. Evidence selection and initial mapping

The table distinguishes existing local content from evidence that still needs to be collected. A proposed link is enabled only when its destination actually explains the associated skill.

| Stack chip      | Proposed primary destination                        | Evidence/readiness                                                                                                                                                         |
| --------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Python          | Typewriter CLI case study                           | Existing CV describes Python/LibCST rewrites. Verify the source and worked example under the companion plan before enabling.                                               |
| TypeScript      | Portfolio case study                                | Local typed application source; the case study must point to a concrete design/implementation example.                                                                     |
| Julia           | BlockOpt.jl case study                              | Existing CV describes the solver. Source review is pending; retain a plain chip until the third case study is ready.                                                       |
| AWS             | Lucerna Health — Data Pipeline Engineer, Highlights | Existing first-person experience narrative describes Glue, EMR, CDK, and S3 work. Present it as an experience account, not independently verified performance evidence.    |
| React           | Portfolio case study                                | Local React application and component architecture.                                                                                                                        |
| Postgres        | Lucerna Health — Data Pipeline Engineer, Highlights | Existing reconciliation-service bullet explicitly names PostgreSQL. Preserve the concise chip label.                                                                       |
| Docker          | No link initially                                   | Present in the role's skills list, but that alone is circular evidence. Add a concrete implementation account or public artifact first.                                    |
| Docker Compose  | No link initially                                   | No substantive Compose example was established in this planning pass. A mock `docker-compose.yml` filename in the IDE hero is not evidence.                                |
| GitHub CLI (gh) | No link initially                                   | The label records the user's tool choice; it does not establish a specific automation example. Add a shareable script/workflow or short account first.                     |
| GitHub Actions  | Portfolio case study                                | Local `.github/workflows/build.yml` provides actual workflow configuration.                                                                                                |
| Playwright      | Portfolio case study                                | Local `playwright.config.ts` and `test/e2e/` provide actual browser-validation examples. Do not substitute a generic upstream repository URL for an authored contribution. |
| pre-commit      | Portfolio case study                                | Local `.pre-commit-config.yaml` provides the configured checks. Distinguish configuration from evidence that a particular run passed.                                      |

This yields eight initial links and four plain chips; a verified BlockOpt case would make nine links and three plain chips. The map remains explicit; do not infer destinations by searching label text at runtime.

### 2. Stable identity and URLs

- Add an optional `id` to `CodingExample` and `Experience` for compatibility with existing component fixtures and callers. Populate stable IDs for all production records in both arrays; do not derive IDs from array positions or editable titles.
- Initial target IDs include `typewriter`, `portfolio`, `blockopt`, and `lucerna-data-pipeline`. The remaining records receive descriptive unique IDs even when no Stack chip links to them yet.
- Public examples: `/cv#cv-coding-typewriter`, `/cv#cv-coding-portfolio`, `/cv#cv-coding-blockopt`, and `/cv#cv-experience-lucerna-data-pipeline`.
- Keep all existing section hashes valid. Resolve entry hashes through validated data IDs and section metadata, rather than accepting arbitrary DOM IDs.
- Store a typed target descriptor and descriptive accessible label for each linked skill in `cv.ts`; keep `currentWorkflowTools` unchanged. The route layer resolves that descriptor to a router destination.
- A recognized project-entry hash opens its `approach` tab once, if present. The Lucerna entry hash opens the existing `details` tab, whose visible label is “Highlights.” Resolve this from the entry, so a copied URL behaves the same as a chip click.
- Do not encode mutable display labels in URLs. Validate every target ID and requested tab against its source record. Preserve existing hash links when titles or array order change.
- Use React Router links that respect the configured basename. Verify that links rendered under `/portfolio` point to `/portfolio/cv#...`; do not concatenate a second base path manually.

### 3. Chip interaction and accessibility

- Extend `SkillsChipList` with an optional mapping of skill label to link descriptor. Existing callers continue to pass `string[]`; absent metadata produces the same plain chip as today.
- Render linked chips as real anchors through the existing router integration, not clickable `div`s. This preserves Enter activation, copy-link, modified clicks, and open-in-new-tab behavior.
- Keep concise visible text. Use an accessible name such as “Python — view Typewriter CLI case study,” retaining the visible skill name at the start.
- Give linked chips a consistent link affordance and visible focus treatment that work without hover. Do not add a modal, popover, tooltip-only explanation, or extra navigation step.
- Preserve the zoom, slide, and motion-off branches. Hidden/exiting chips must not become keyboard targets before their existing reveal makes them available.
- Keep plain chips outside the tab order. Only the Stack row receives evidence metadata; opportunity, certificate, project-detail, and story chips retain current behavior.
- Check spacing and hit areas at 320px and 390px. Do not let added link styling create horizontal overflow or overlap neighboring targets.

### 4. Navigation that cooperates with motion

Implement a small, cancellable navigation sequence owned by the CV route:

1. Resolve the hash to a known section or entry. Unknown hashes leave the CV usable and do not start a retry loop.
2. Unlock the destination's parent section using the existing deferred-section mechanism.
3. Ensure that section's target entry has a normal-flow DOM wrapper. For explicit entry navigation only, allow its existing list to mount before viewport observation; do not use `skipEntranceAnimation` as a substitute for mounting.
4. Scroll to the mounted target using the existing header offset convention. Let the existing intersection/visibility path run its entrance animation. Keep current instant deep-link scrolling; do not introduce a competing smooth-scroll animation.
5. Open the destination's intended detail tab once and let the existing tab animation run. Respect `CVExperienceSection`'s controlled detail state and backdrop behavior.
6. Focus the entry heading with `tabIndex=-1` and `preventScroll` when its existing visibility signal releases the hidden state. Prefer a scoped readiness callback over fixed delays or an unbounded `requestAnimationFrame` loop.
7. Cancel pending work when the target changes, the route unmounts, or story mode becomes active. Rapidly selecting another chip must not let an older request steal scroll or focus.

This sequence must work both on direct load and after the About reveal. It must not replay completed About animations. Re-selecting the current destination should scroll/focus it once without adding duplicate history entries.

For in-app chip activation, remember the originating chip for that navigation. Back should restore its location/focus when returning to that known origin. Do not steal focus on unrelated history navigation or fresh loads. Preserve ordinary browser behavior for modified clicks.

The new links target the standard `/cv` route. Do not add Stack navigation to story mode in this phase or silently override an explicitly selected `?mode=story`; existing story behavior remains authoritative.

## Execution steps

1. **Content readiness:** complete the first two case-study drafts and their evidence checks under the companion plan. Record which proposed links are eligible; unsupported labels remain plain.
2. **Identity foundation:** add compatible entry IDs, populate production records, define the evidence map, and validate uniqueness, references, and tab names. Preserve existing export names and section URLs.
3. **Entry navigation:** implement and test direct loading, deferred mounting, visibility/focus handoff, selected details, cancellation, and Back/Forward before exposing new chip links.
4. **Chip activation:** add optional link rendering and CV wiring. Preserve animation branches and validate a second existing `SkillsChipList` consumer to catch accidental shared behavior changes.
5. **Browser and document closeout:** run the matrix below, inspect desktop/mobile screenshots, document entry links and evidence-selection rules, and record exact validation results.

Each step should be independently reviewable. The feature can be stopped before step 4 without exposing incomplete links.

## Validation plan

The approved validation matrix follows. Actual implementation results are recorded under Validation results.

- Data tests: unique stable IDs; every evidence label occurs in the Stack; targets/tabs exist; unsupported chips remain unlinked; reordering records leaves URLs unchanged.
- Chip tests: real anchor semantics, descriptive names, unchanged plain consumers, consistent zoom/slide/off rendering, and no hidden focusable links.
- Route/section tests: direct entry hash, existing section hash, unknown hash, repeated target, rapid target changes, cancellation, controlled Highlights backdrop, and no About replay.
- Browser cases: keyboard activation, touch activation, copy/open destination, hard reload, Back/Forward, focus landing, header clearance, and 320px/390px/desktop wrapping. Verify both default and subtle motion retain their sequence; off and reduced motion must settle without waiting for an animation callback that will not run.
- Keep GitHub success/failure mocked in route tests. Evidence navigation must work when enrichment fails.
- Put focused behavior in a proposed `test/e2e/cv-evidence.spec.ts`. Add one small entry-link/reload/base-path smoke case to the existing `test/e2e/asset-delivery.smoke.spec.ts`, so its current desktop/mobile/subpath runners actually exercise the new URLs. Running today's subpath asset tests alone would not prove entry navigation.
- Inspect light/dark linked-chip focus treatment in two existing appearance presets. Validate an unchanged non-Stack `SkillsChipList` consumer, including a story/project tab.

Planned commands, using the repository's existing runners:

```sh
npm run lint
npm run typecheck
CI=true npm test -- --watchAll=false
npm run build:e2e
npm run test:e2e:chromium -- test/e2e/cv-evidence.spec.ts test/e2e/cv-actions.spec.ts test/e2e/cv.github.spec.ts test/e2e/quality.spec.ts
npm run build
npm run check:bundle
npm run test:e2e:assets
npm run test:e2e:assets:subpath
git diff --check
```

Keep Chromium's sandbox enabled. The existing asset runners include mobile Chromium/WebKit; preserve that coverage and the subpath runner's production-build restoration. Check the staged diff separately if implementation is staged for review.

## Risks and rollback

- **Deep links race deferred rendering:** explicit mounting and scoped readiness callbacks are required before chip activation ships.
- **Shared chips accidentally become interactive elsewhere:** default to no links; apply metadata only to the Stack row and test another consumer.
- **Focus or scroll fights motion:** retain existing reveal timing, cancel stale requests, and avoid timer-based completion assumptions.
- **Titles change or entries reorder:** stable IDs and reference checks protect published URLs.
- **Evidence overstates the claim:** keep personal experience narratives distinct from public implementation/validation evidence; leave unsupported chips plain.
- **Rollback:** remove the Stack evidence mapping/prop to restore plain chips immediately. Retain valid entry IDs and public anchors once published, even if the chip enhancement is rolled back.

## Progress notes

- 2026-11-04: inspected the current working tree, Stack renderer, CV section routing, deferred item mounting, experience detail state, story coding renderer, and browser runner configuration. Base HEAD was `be7dddf`; the inspected working tree also contains staged and unstaged changes, so that commit alone is not the full evidence snapshot.
- The user explicitly rejected removing the standard CV's motion. Motion preservation is a requirement of this plan, not an optional follow-up.
- No application code, navigation, data, or tests were changed for this planning request. External project evidence has not been verified in this pass.

### Implementation — 2026-11-04

- The companion case-study plan verified two cases and documented BlockOpt's missing TRS dependency. Eight mappings are active; Julia, Docker, Docker Compose, and GitHub CLI remain plain. AWS/Postgres link to the existing first-person Lucerna account.
- All production project/experience records now have stable IDs. Optional IDs preserve fixture/caller compatibility, and resolver tests confirm URLs survive record reordering and reject unknown entries.
- `cvEvidenceNavigation.ts` owns known-target resolution, same-destination activation, origin restoration, and cancellable DOM coordination. A scoped MutationObserver and existing per-card visibility signals trigger readiness checks; no animation-duration timer or endless frame polling was introduced. A single initial animation frame lets native fragment navigation finish before focus is assigned.
- Explicit targets mount the coding list, open Approach or Highlights once, and retain ordinary entrance/tab animation. Existing section links, story precedence, and basename handling are preserved. A repeated activation after Back clears the restored-origin intent and focuses the entry again.
- Shared chips accept optional router-link metadata, with underlining and theme-derived focus treatment. Hidden/exiting linked chips are removed from tab order. Only the About Stack row receives links; project/story/opportunity consumers remain plain.
- Browser development caught and repaired native same-document hash navigation clearing experience focus. It also caught a test trying to click an unrevealed About chip after starting far down the page; the rapid-navigation case now starts from visible chips and issues two ordinary anchor activations before either target settles.
- README, architecture ownership, and testing guidance now describe the feature. New application changes and both plans remain unstaged; the pre-existing index is being preserved.

## Validation results — 2026-11-04

- `npm run lint` and `npm run typecheck`: passed on the final application changes.
- `CI=true npm test -- --watchAll=false`: 131 suites, 1,020 tests passed after the final story evidence fix. Unit checks cover IDs/mappings, plain and linked chip rendering, hidden/exiting tab order, and both story case-study evidence links.
- `CI=true npm run test:e2e`: 163 checks passed without retries (96 Chromium test-runtime, 22 production smoke, 18 mobile, 27 `/portfolio` subpath). This includes the new entry-link smoke case on desktop Chromium, Pixel-configured Chromium, and iPhone-configured WebKit. The subpath runner restored the normal production build.
- After the story-only list-cap repair, rebuilt production and ran `CI=true npm run test:e2e:chromium -- test/e2e/cv-evidence.spec.ts --reporter=line --retries=0`: all nine final cases passed, including the new mobile story-source-link check. The full asset matrix was not rerun for that renderer-only change.
- Final `npm run build`: passed and verified 305 shipped assets. `npm run check:bundle`: passed, 888,865 eager JavaScript bytes / 275,609 gzip bytes across six chunks. Vite still emits its non-blocking large-chunk advisory; the repository's eager-graph budget passes.
- Sandboxed Playwright visual checks: evergreen/dark desktop at 1440px; atlas/light at 320px and story content at 390px; default/subtle motion; complete Stack wrapping, focus treatment, case-study Results, and unchanged plain project Stack chips. Browser console errors were limited to deliberately mocked GitHub 503 responses. Screenshots remain in `/tmp/cv-evidence-*.png` and are not commit artifacts.
- `git diff --check`: passed. HEAD and the index-entry hash (`git ls-files --stage -z`) match the implementation baseline. Existing staged changes and the prior unstaged Stack edits were preserved; protected Home/audio/resume/other content files were unchanged this round.

## Completion status

- [x] Planning document prepared from local code inspection.
- [x] Supporting case-study content verified and ready.
- [x] Entry IDs and navigation implemented.
- [x] Linked chips implemented.
- [x] Implementation validation complete.

## CV presentation follow-up — 2026-11-05

The user requested removal of the visible Download resume button and the underlined Stack
chip text, followed by staging and a commit-readiness assessment. The visible About-card
button is the removal target. Resume access is provided by its existing actions menu.

1. Remove the visible button in `src/pages/CV.tsx` and the linked-chip underline in
   `src/styles/componentStyleBuilders.ts`.
2. Update the existing CV, quality, asset-delivery, and service-worker assertions to follow
   the revised interface. Verify chip click/keyboard navigation and hover/focus styling.
3. Update the two documentation statements describing resume access. Keep the SPA routing,
   content data, keyboard focus treatment, and motion contracts intact.
4. Run lint, typecheck, full Jest, production build/bundle checks, and the browser matrix.
   Inspect desktop/mobile appearance with sandboxed Playwright. Inspect the existing staged
   diff, then stage this follow-up's files and verify the index against the tested worktree.

The primary regression risk is an old test depending on the removed button as its page-load
marker. Use the visible contact action or the menu download where appropriate. Reverting the
button deletion and chip-style deletion isolates this follow-up. The user-prohibited cached
Prettier executable must not be invoked, including through pre-commit.

The visible resume button was removed. Linked Stack chips now explicitly use plain text
in both their resting and hovered states. The global `a:hover` rule initially restored the
underline, which the browser regression check caught. The chip style now overrides that
rule while retaining the existing focus outline.

Validation on 2026-11-05 passed lint, typecheck, all 131 Jest suites / 1,020 tests, both
build variants, and the 305-asset build check. The final production bundle passed its budget
at 888,832 eager JavaScript bytes / 275,596 gzip bytes across six chunks. Desktop and 390px
mobile visual checks confirmed plain chip text, visible focus, the revised About actions,
and fitting layouts. The final full Chromium run passed 96 of 97 cases. Its remaining
failure involved a disappearing faculty tooltip in `cv.github.spec.ts`. Root production
smoke and mobile runs passed 21 and 16 cases respectively.
The final focused production run of `cv-actions.spec.ts`, `cv-evidence.spec.ts`, and
`cv.github.spec.ts` passed all 22 cases with retries disabled, including the corrected
hover styling, resume menu, and the previously failing faculty-tooltip case.

The staged-diff review has open findings. The added-large-files hook rejects 18 existing
staged PNG screenshots under `output/playwright/` against its 500 KB limit. The subpath
suite also exposed intermittent loss of destination-heading focus after reload. An isolated
root reload probe reproduced two failures in 12 runs. Subsequent diagnostic runs passed,
leaving that navigation issue unresolved. These findings qualify the combined diff's commit
readiness.

Staging the 11 follow-up files was attempted with an explicit `git add --` path list.
The execution policy rejected the action because approval is required while approval mode
is `Never`. The edits remain in the working tree. The baseline index entries were verified
after that rejection. Formatting validation used `git diff --check` under the user's
restriction on the cached Prettier executable. The selected large-file hook runs Python.

- [x] Presentation changes implemented.
- [x] Validation and staged-diff review complete, with findings recorded.
- [ ] Stage the follow-up changes, blocked by execution approval policy.
