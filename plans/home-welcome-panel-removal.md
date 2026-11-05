# Remove the retired Home welcome panel

## Goal

Finish the Home intro cleanup by removing the unused welcome panel and its exclusive supporting code.

## Why

The Customize appearance & audio control was removed from Home, leaving an unreachable component, hook, style entry, tests, and stale documentation.

## Constraints

- Preserve the remaining CV action, IDE behavior, SPA routing, and header settings.
- Preserve global onboarding/audio providers and their existing consumers.
- Keep all existing unrelated CV edits and index state intact.
- Leave completed historical review plans as historical records.

## Affected files and responsibilities

- `src/components/FirstVisitWelcome.tsx`: delete the unused panel.
- `src/hooks/useHomeWelcomeSequence.ts`: delete the panel-only hook.
- `src/styles/appStyleBuilders.ts`: remove the unused panel surface.
- The component/hook unit tests: remove tests exclusive to deleted modules.
- `src/hooks/AGENTS.md`, `docs/architecture/app-architecture.md`, and `docs/frontend/page-choreography.md`: correct current ownership and Home behavior documentation.
- Existing Home/browser tests: review retained behavior and regression checks.
- `test/unit/pages/helpers/homeTestHarness.tsx`: remove panel-only audio mocks and onboarding probes while retaining returning-visitor storage setup.

## Proposed approach

Verify consumers before deleting the retired modules and their exclusive assets. Keep the current Home composition and header settings as the runtime source of truth. Correct current documentation while preserving historical records.

## Execution steps

1. Review the live first-pass diff and all consumers of the retired modules.
2. Delete panel-only modules/tests/styles and update current documentation.
3. Search for stale active references, run static/unit/build checks, and validate Home and header settings with sandboxed Playwright.
4. Review the final diff and report remaining limitations.

## Validation plan

- Reference search over `src`, `test`, and `docs`.
- `git diff --check`.
- `npm run typecheck` and `npm run lint`.
- `CI=true npm test -- --watchAll=false --runInBand`.
- `npm run build`.
- `npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/welcome.spec.ts --reporter=line` against the production build, including desktop/mobile entry and header settings/audio retry.

## Risks and rollback

- Removing shared providers would widen scope and could break header behavior; retain them.
- Removing a style key must not disturb other surfaces; search for consumers and run style tests/build.
- Roll back only this cleanup's files/hunks if needed, preserving unrelated work.

## Progress notes

- Reviewed branch `codex/cv-snorkel-presentation` at `be7dddf`; existing unrelated changes remain unstaged.
- Confirmed that the component and hook had no remaining runtime consumers and `welcomePanelSx` was used only by the retired component; all three are now removed, along with dedicated unit tests and panel-only Home harness fixtures.
- First-pass Home changes preserve immediate hero readiness: the removed hook returned `isHeroAnimationReady: true` unconditionally.
- Corrected current hook inventory, architecture ownership, and Home choreography documentation; historical review plans retain their original evidence.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` passed. The build verified 305 CV/media assets and reported its chunk-size warning.
- Production-build sandboxed Chromium coverage passed all 23 Home/entry tests, including 1440px/390px intro/navigation, IDE controls, reduced/off motion, settings, and audio failure/retry.
- The full unit suite passed: 135 suites and 1,042 tests (68.34 seconds). An additional focused run passed all 100 tests across Home, app style builders, header, and audio/onboarding providers.
- Final review found no remaining imports, exports, style consumers, or current documentation references to the deleted panel/hook. Negative regression assertions intentionally retain the removed controls' labels. No further correctness issues were found in the Home changes.
- Existing unrelated CV changes and the empty index remain preserved. The production build's chunk-size warning remains outside this cleanup.

## Completion Status

- [x] Complete
