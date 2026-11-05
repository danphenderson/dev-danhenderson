# Develop portfolio project case studies

## Goal

Develop two publishable case studies first, with a third scientific-computing case study following source verification. Each should explain the problem, the user's contribution, an important engineering decision, and an outcome supported by inspectable evidence.

The initial delivery belongs in the existing `/cv` Coding Examples cards and their story-mode counterparts. It does not introduce a new Projects route or change the Home hero.

The user approved implementation of both ExecPlans on 2026-11-04. Implementation is complete for the two verified cases; the approved evidence-gap fallback applies to BlockOpt. Actual source checks and application validation are recorded below.

Companion plan: [Connect CV Stack chips to evidence](cv-stack-evidence-links.md). Case-study content can ship independently; chip activation waits for useful destinations.

## Why

The existing `codingExamples` records in `src/data/cv.ts` already provide summaries, repositories, and structured tabs. Their content emphasizes features and tools. A short narrative can make the engineering work easier to assess without adding another navigation system.

The same records feed `CodingExamplesSection` and `CVStorySectionRenderer`. Reusing those records avoids two versions of the user's project history and preserves the established animated presentation.

## Constraints

- **Preserve the current standard-CV and story motion.** Keep reveal timing, typewriters, staggers, tilt, animated tabs, and motion preferences. Do not adopt the earlier suggestion to make the standard CV reveal everything immediately.
- Start with existing `CodingExample` fields and the `list`/`skills` tab variants. No new CMS, backend, route, dependency, or case-study rendering framework is needed for the first release.
- Keep `src/data/cv.ts` as the content source of truth. Preserve the existing project order, other project records, primary repository links, and story chapter structure.
- Do not infer sole authorship, current maintenance, adoption, performance improvements, or deployment configuration from repository ownership or existing promotional copy.
- Use qualitative outcomes when there is no reliable measurement. Never invent an impact percentage or treat test counts as user/business impact.
- Employer experience, medical/scientific conclusions, and private research material are outside these public-project case studies. Do not pull unrelated local repositories or private artifacts into this task without establishing scope and suitable source material.
- Keep source provenance in the planning/evidence notes. Public copy should explain the work clearly, with useful source links rather than internal validation jargon.
- Follow [PLANS.md](../PLANS.md), the [data instructions](../src/data/AGENTS.md), and [testing strategy](../docs/engineering/testing-strategy.md). Preserve existing staged/unstaged work and keep new planning documents unstaged.

## Affected files and responsibilities

| File or area                                                                         | Planned responsibility                                                                                                                                   |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/cv.ts`                                                                     | Update only the selected projects' summaries and tabs; include descriptive evidence links using existing segment support.                                |
| `src/types/cv.ts`                                                                    | No content-schema change expected for the first release. Coordinate optional stable IDs with the companion plan, which owns that change.                 |
| `src/components/cv/CodingExamplesSection.tsx`                                        | Existing card/tab renderer; change only if a verified rendering or accessibility gap prevents the planned content from working.                          |
| `src/components/cv/CVStorySectionRenderer.tsx` and `src/data/cvStoryItems.ts`        | Validate shared content and slide order; preserve existing narrative motion and behavior.                                                                |
| `test/unit/data/cv.test.ts`, existing coding/story component tests, CV browser specs | Validate schema/rendering, links, tab behavior, mobile layout, and story-mode parity.                                                                    |
| This plan, with a claim/source appendix added during implementation                  | Record source revisions, source locators, outstanding claims, and measured results without committing raw debug dumps.                                   |
| `README.md` and relevant architecture docs                                           | Update only if the final implementation changes documented public behavior or schema; ordinary prose edits do not require unrelated documentation churn. |

If a new content variant or reusable renderer becomes necessary, revise this plan before expanding the implementation. The text-and-links release should not be held up by an optional illustration system.

## Proposed approach

### 1. Project selection and release order

| Priority           | Existing project                           | Intended story                                                                                     | Why it fits / evidence boundary                                                                                                                                                                                          |
| ------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First              | Portfolio using React, TypeScript, and AWS | A motion-rich static portfolio with robust navigation, media delivery, and graceful data fallbacks | The current repository provides inspectable source and reproducible browser/build checks. AWS hosting is stated in current content; verify deployment evidence separately before making infrastructure claims beyond it. |
| Second             | typewriter CLI                             | Focused Python source transformations with an inspectable change preview                           | Current CV describes Typer/LibCST, None-related annotation rewrites, and dry-run diffs. Re-read the actual project at a recorded revision before drafting those claims as confirmed behavior.                            |
| Third, conditional | BlockOpt.jl Julia Package                  | Turning numerical optimization research into reusable solver software                              | Provides scientific-computing breadth. Current CV descriptions are candidate claims; algorithm details, authorship, dependencies, reproducibility, and any performance claims need primary-source review.                |

Keep `chromex`, `UncNLPrograms.jl`, and `MasterPlan` as shorter coding examples in this phase. UncNLPrograms can be a supporting source for BlockOpt only if the reviewed materials establish that relationship; do not combine them into a single claimed benchmark workflow by assumption.

Ship the first two when ready. If BlockOpt evidence is incomplete, retain its current short record and record the specific missing material; do not delay the first two or fill the gap with unsupported claims.

### 2. Common editorial structure

Target roughly 250–400 words per completed case study, excluding link labels. Favor two to four concise bullets per narrative tab, with one idea per bullet.

| Surface                 | Content                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card title              | Preserve the recognizable project name; any revised title must be descriptive rather than a new branding exercise.                                                          |
| Visible summary         | One or two sentences stating the problem and delivered capability; include the user's specific role only after confirming it.                                               |
| `problem` / “Problem”   | Audience, original friction, and meaningful constraints.                                                                                                                    |
| `approach` / “Approach” | The user's contribution, one or two architectural decisions, an alternative considered, and the tradeoff. This becomes the entry-link landing tab under the companion plan. |
| `results` / “Results”   | Demonstrated behavior, a supported outcome, one limitation, and links to relevant source/test/example evidence.                                                             |
| `stack` / “Stack”       | A short set of tools tied to the described work, not an exhaustive dependency list.                                                                                         |

Use the current list-tab and skills-tab discriminants. Descriptive inline links can already be represented with `ExperienceProjectSegment[]` in list items and rendered in both CV modes. Keep the primary repository URL in `links[0]`; do not assume secondary `links` entries are displayed by the current renderer.

The four short tab labels are deliberate: validate them with the current full-width card tabs at 320px, and the story renderer's scrollable tabs. Keep useful summaries visible when drawers are closed. Do not insert long unbroken URLs, Markdown code fences, or HTML into plain-text fields and expect a rich renderer.

### 3. Portfolio case-study brief

**Proposed problem:** present engineering, research, and personal work through a client-side site while retaining static deployment, direct links, motion preferences, and dependable media controls.

**Contribution to document:** the user's actual ownership of the application, architecture, and changes. Confirm the wording; do not infer sole authorship from the account name or omit collaboration when it matters.

**Approach topics:**

- Local typed content modules and route metadata, with optional GitHub enrichment and bundled fallbacks.
- Shared motion/theme primitives supporting the user's chosen animated CV and story experience.
- `PUBLIC_URL`-safe assets and direct-link handling on a static host.
- Browser/asset validation and reliable explicit audio playback as examples of engineering work, rather than a chronological bug diary.

**Inspectable local sources:** `src/data/cv.ts`, `src/constants/siteRoutes.ts`, `src/pages/CV.tsx`, `src/hooks/useGithubProfile.ts`, `src/WelcomeAudioProvider.tsx`, `src/utils/assets.ts`, `playwright.config.ts`, `test/e2e/`, `.github/workflows/build.yml`, `.pre-commit-config.yaml`, and `scripts/checkBundleBudget.js`.

**Outcome candidates:** supported navigation and asset behavior at root and subpath deployments; explicit play/pause and retry behavior; working GitHub fallback states; preserved motion preferences. Each published statement must correspond to source and an actual validation result.

**Measurement rules:** rerun relevant checks on the implementation revision before quoting any number. Label bundle size as a build measurement with raw/gzip units and scope; label browser results as validation. Do not turn repository tests into claims about real-world traffic, business impact, or physical-device coverage. The earlier session's test counts are not evergreen product copy.

**Open source check:** current content names S3, CloudFront, and Route53, but this planning pass did not establish the deployed infrastructure from IaC or deployment configuration. Confirm an appropriate public source or owner-approved architecture description before expanding that part of the narrative.

### 4. Typewriter CLI case-study brief

**Proposed problem:** consistently update supported None-related Python annotations while keeping changes inspectable.

**Approach to investigate:** LibCST-based source transformation, CLI input modes, preview/diff support, scope of supported annotations, and the limits of the transformation. Explain why the chosen representation suits the task only after checking the implementation or the author's rationale.

**Evidence collection:** inspect the existing project URL recorded in `cv.ts`, record a commit/release, read its README, packaging metadata, CLI entry points, transformation code, and relevant tests. Use a small example from a real test fixture rather than inventing a before/after pair that the program may not support.

**Demonstration:** reproduce one command with its input, expected diff, and resulting output in a scratch environment. The first UI release can link to a committed example or test fixture and explain it in plain language. An inline code viewer or recording is an optional later enhancement, not a prerequisite.

**Outcome candidates:** the verified transformation and deterministic diff for the demonstrated input. “Preserves formatting/comments” must be bounded to supported transformations and tested examples. Do not equate syntactic rewrites with proof of semantic equivalence for arbitrary programs.

**Missing author input, if sources do not establish it:** intended audience, project motivation, personal role, current status, and a real example of usefulness. Use modest wording or omit these claims until supported.

### 5. BlockOpt.jl case-study brief

**Proposed problem:** make a particular numerical optimization method available as usable, testable Julia software. The exact formulation remains subject to primary-source verification.

**Approach to investigate:** supported objective/problem assumptions, solver organization, derivative information, trust-region subproblem handling, and how the package relates to the cited research. Separate algorithm authorship from the user's software contribution.

**Evidence collection:** inspect the existing repository URL at a recorded revision; read package metadata, docs, tests, a minimal example, and the relevant research source. Follow cited links only to establish claims needed by the case study. Record package/dependency versions and any setup caveats.

**Demonstration:** reproduce one documented solve with a stated problem, dimensions, initial point, stopping condition, and observable result. Use a small example before attempting a benchmark campaign.

**Outcome candidates:** a reproducible solver example and a clear explanation of the implemented method's intended use and limitations. Comparative speed, robustness, or convergence claims require named baselines, settings, repeated measurements where appropriate, and retained raw results. Without those, publish no superiority claim.

**Missing author input, if sources do not establish it:** personal contribution, connection to the research, current package status, and any shareable result that materially strengthens the story. Do not claim that the package is novel merely because an older CV description uses that word.

### 6. Claim and source discipline

During implementation, add a compact claim/source appendix to this plan. Each nontrivial claim should record:

| Field             | Purpose                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Claim and project | Exact assertion intended for the UI.                                                                     |
| Evidence kind     | Source code, documentation, authored PR/commit, reproduced result, or owner-provided experience account. |
| Source locator    | Stable URL/path and commit/release, with the relevant function, test, section, or artifact.              |
| Verification      | What was inspected or run, when, and what it establishes.                                                |
| Limits/status     | Supported, needs author input, needs reproduction, or omit.                                              |

Use repository permalinks for implementation evidence when available. A profile link, repository root, or star count is not a substitute for a specific contribution. Recheck links before release, and do not expose private artifacts or internal logs merely to make a source column complete.

Only a small number of useful links should reach the portfolio UI. Preserve detailed provenance in this plan; keep generated screenshots/traces and bulk logs out of the commit unless a deliberately selected artifact is needed by the product.

## Execution steps

1. **Collect sources:** verify portfolio sources locally; inspect the Typewriter and BlockOpt repositories and relevant primary research at recorded revisions. Establish authorship/status boundaries and the minimum reproduction for each.
2. **Draft the first two:** prepare complete problem/approach/results/stack content and a claim/source appendix. Use available evidence to finish concrete drafts before asking for any truly missing personal details.
3. **Content review:** identify only unresolved claims that materially affect publication. Keep independently supported sections ready; omit or mark unresolved draft claims in the plan rather than publishing placeholders.
4. **Implement content:** update the two selected `codingExamples` records using existing fields. Preserve project order and other records. Validate regular and story views without changing motion behavior.
5. **Third case study:** reproduce and draft BlockOpt when evidence is sufficient, or document the specific missing evidence and keep the existing short entry.
6. **Connect evidence:** hand off stable project targets to the companion plan. The Stack mapping must point to a useful explanation, not simply another occurrence of the same technology name.
7. **Closeout:** record implemented records, verified sources, actual checks, and any deliberately deferred content. Keep the two plans synchronized.

## Validation plan

The approved validation matrix follows. Actual reproduction evidence and application results are recorded below.

- Editorial: every substantial claim has support; the user's contribution is distinct from the project's overall capabilities; outcomes and limitations are explicit; unsupported metrics and stale “current” claims are absent.
- Data: existing types still accept the records; tab values are unique; summaries are nonempty; source links use descriptive labels; project ordering and unrelated records are unchanged.
- Components: each selected project works with closed/open tabs and linked list segments; the story renderer shows the same content without losing focus, clipping text, or changing slide ordering.
- Browser: normal motion remains intact; repeat with off/reduced motion for accessibility. Check 320px, 390px, and desktop layouts, long-content scrolling in story mode, touch/keyboard tab navigation, and two light/dark appearance combinations.
- Shared change discipline: if implementation remains data-only, use focused data/coding/story tests plus affected route checks. If a shared renderer or schema changes, broaden to its consumers and the full unit suite as required by the repository testing strategy.
- Source links and demos: verify primary external links at implementation time. Any new local media must use `resolvePublicAssetPath`, have suitable alt text, and pass asset checks; new media is not required for the first release.

Planned repository commands:

```sh
npm run typecheck
npm run lint
CI=true npm test -- --watchAll=false --runInBand test/unit/data/cv.test.ts test/unit/data/cvStoryItems.test.ts test/unit/components/cv/CodingExamplesSection.test.tsx test/unit/components/cv/CVStorySectionRenderer.test.tsx test/unit/components/cv/CVStoryViewer.test.tsx
npm run build:e2e
npm run test:e2e:chromium -- test/e2e/cv.github.spec.ts test/e2e/cv-actions.spec.ts test/e2e/quality.spec.ts
npm run build
git diff --check
```

Extend an existing CV browser spec with focused case-study tab/link checks where current tests do not exercise the revised content. The commands above are not a substitute for that coverage or visual inspection. Use sandboxed Playwright and close validation sessions afterward.

## Risks and rollback

- **Promotional claims outrun evidence:** verify at a revision, document limits, and ship two strong cases rather than three speculative ones.
- **Long content overwhelms animated cards:** keep summaries brief and narratives within the existing tab model; trim prose before adding layout machinery.
- **Content diverges between modes:** keep one `codingExamples` record per project and validate both consumers.
- **A data edit quietly becomes a redesign:** retain current types/renderers first; explicitly revise this plan if a new block or component is justified.
- **Measurements become stale:** prefer durable qualitative claims; attach revision/date/context to any retained quantitative result.
- **Rollback:** revert only the selected project summaries/tabs. If the companion plan has published stable IDs/anchors, preserve those identities and keep their links resolving to the shorter entries.

## Progress notes

- 2026-11-04: inspected existing coding-example records, list/skills tab types, standard/story renderers, local CI/test configuration, and the related Stack plan. Base HEAD was `be7dddf`; current staged and unstaged changes are also part of the inspected state.
- Two initial cases plus a conditional scientific-computing case are selected. Their technical briefs are planning hypotheses where external verification is pending, not newly verified project facts.
- The user approved planning case studies and explicitly retained CV motion. No application content, schema, renderer, route, or tests were changed in this planning pass.

### Implementation and claim/source appendix — 2026-11-04

Implementation followed the approved order: verify and write the portfolio/Typewriter cases,
then provide stable entry navigation and activate only supported Stack links. Both cases use
the existing `list`/`skills` tab schema and both existing renderers. Project order, primary
repository links, motion, and story chapters remain unchanged.

Visual validation discovered that story project tabs truncated lists after three bullets,
omitting the fourth Results bullet containing source links. Removed only the coding-tab cap;
other story excerpts and all animation variants/timing remain unchanged. Regression tests
exercise the actual Results evidence links in both new cases.

| Public assertion                                                                                                                                    | Source and verification                                                                                                                                                                                                                                   | Scope and limits                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typewriter is an authored Python CLI around LibCST and Typer.                                                                                       | `python-typewriter` revision `5d109085268e96af1acb1adbc441490d9ea07495`: `pyproject.toml` names Daniel Henderson; inspected `typewriter/cli.py`, `runner.py`, and `codemod.py`. Package version 1.1.0, LibCST 1.8.5, Typer 0.24.1.                        | Supports the implementation/contribution account; no adoption or sole-authorship claim.                                                              |
| Typewriter offers preview/application, Optional-default output, target-version selection, and scoped recursive inputs.                              | Same revision: CLI/runner implementation and `tests/test_cli.py`; public Results links pin the tests and codemod source.                                                                                                                                  | Describes supported transformations, not general type inference or universal semantic equivalence.                                                   |
| A preview leaves `var: int = None` unchanged; application adds the Optional import and rewrites the annotation; rechecking finds no further change. | Reproduced with Python 3.14t in a disposable venv. Check/apply/recheck exited 1/0/0. Four selected upstream tests passed (33 deselected).                                                                                                                 | One concrete transformation and focused regression evidence, not a benchmark. Two upstream Typer/Click deprecation warnings did not prevent the run. |
| This portfolio uses typed content, React composition, motion preferences, local fallbacks, browser checks, and configured CI/pre-commit gates.      | Current repository source plus public permalinks at baseline `be7dddfd89bda3eae1db08e9483563403a19dd34`: `test/e2e/asset-delivery.smoke.spec.ts`, `.github/workflows/build.yml`, `.pre-commit-config.yaml`; current build/browser results recorded below. | Configuration is distinguished from a passing local run. No production-traffic, hosting-topology, or business-impact claim was added.                |
| BlockOpt is connected to the user's research, but a runnable case-study outcome is not yet established.                                             | `BlockOpt.jl` revision `c53672e67e8aba4daea2f1b8c7d2effd042d63c3`: `Project.toml`, `README.md`, and `src/BlockOpt.jl`; [QN Optimization with Hessian Sample](https://arxiv.org/abs/2201.02608) lists Daniel Henderson among its authors.                  | Authorship/scope only. The documented setup fails before a solve; no new numerical or comparative claim was published.                               |

Reproduction records were kept outside the repository: `/tmp/portfolio-typewriter-tests.log`,
`/tmp/portfolio-typewriter-reproduction.json`, and `/tmp/portfolio-blockopt-run.log`. They are
session artifacts, not durable published evidence. The source revisions and commands below
allow the checks to be repeated.

Typewriter, from a checkout at the recorded revision after installing it and pytest in a venv:

```sh
python -m pytest tests/test_cli.py -k 'writes_changes_in_place or check_does_not_write_and_returns_one or check_clean_directory_returns_zero' -q
```

The worked input was exactly `var: int = None` followed by a newline. `typewriter run example.py --check`
reported a diff without changing that file; `typewriter run example.py` applied it; a second `--check` returned
clean. The resulting file was `from typing import Optional`, a blank line, and
`var: Optional[int] = None`.

**BlockOpt fallback used:** with Julia 1.10.10 and a disposable project/depot, installed
`https://github.com/danphenderson/TRS.jl`, developed the pinned BlockOpt checkout, and attempted
`using BlockOpt`. Import failed with `ArgumentError: Package BlockOpt does not have TRS in its
dependencies`. [`src/BlockOpt.jl`](https://github.com/danphenderson/BlockOpt.jl/blob/c53672e67e8aba4daea2f1b8c7d2effd042d63c3/src/BlockOpt.jl)
imports TRS, but the recorded `Project.toml` does not declare it. The external repository was
not repaired as part of this portfolio task. Its existing short CV entry is retained, and the
Julia chip remains plain. A third case study requires fixing that package dependency and then
reproducing a documented solve with recorded settings/results.

## Application validation — 2026-11-04

The final full Jest run passed 131 suites / 1,020 tests, including both actual case-study
Results source links in the story renderer. Lint, typecheck, production build, the 305-asset
build gate, and the eager bundle budget passed. The full browser matrix passed 163 checks;
after the final story list-cap repair, nine focused production CV/evidence checks passed.
The broader asset matrix was not repeated for that renderer-only repair. Desktop/mobile
visual checks confirmed complete source-link content in normal and story views, retained
motion, and plain project Stack chips. See the [companion plan's validation record](cv-stack-evidence-links.md#validation-results--2026-11-04)
for command scopes, browser configurations, and measurements.

Both plans and all changes from this round remain unstaged. The implementation baseline's
HEAD and index entries are unchanged. No new application dependency, route, media asset,
external publication, or commit was introduced.

## Completion status

- [x] Detailed plan prepared from local code/content inspection.
- [x] Source and authorship verification complete for the published cases; BlockOpt gap recorded.
- [x] First two case studies drafted and evidence-checked.
- [x] First two implemented and validated.
- [x] BlockOpt implemented, or a specific evidence gap recorded (dependency failure; case deferred).
- [x] Stack evidence integration complete where supported.
