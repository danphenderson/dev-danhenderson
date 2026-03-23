# Home IDE Orchestration Batch B

## Goal

Refactor the Home route's faux IDE choreography into a clearer page-local orchestration model and split the oversized Home test surface into smaller, responsibility-based suites, while preserving the current Home behavior.

After this change:

- the Home route reads as route composition plus a small set of orchestration hookups instead of a large cluster of local flags, refs, and pointer handlers
- IDE window state transitions are defined in one page-local orchestration module instead of being split between `Home.tsx` and ad hoc local state
- the terminal boot sequence uses a more explicit phase definition instead of a long chain of phase-specific effects
- Home test coverage is split into smaller, reviewable suites with clearer boundaries between route integration, page-local IDE orchestration, and hook behavior

## Why

Batch A fixed the truthfulness drift, but the Home route still carries the underlying orchestration complexity:

- `Home.tsx` still mixes route composition with drag, resize, auto-expand, pointer capability, and restore/minimize lifecycle management
- `useTerminalBootSequence()` still expresses its phase progression through a long series of effect blocks, which makes the progression harder to audit and extend
- the large `test/unit/pages/Home.test.tsx` file still acts as the primary test owner for route rendering, welcome flow, IDE state transitions, auto-expand timing, and resize behavior all at once

Batch B should address that structural complexity without reopening the Batch A content cleanup or changing the user-visible Home choreography.

## Constraints

- Preserve the current client-side SPA architecture, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep route-level IDE orchestration page-local under `src/pages/`; do not move more orchestration into `src/hooks/`.
- Preserve existing Home behavior: onboarding flow, hero motion handoff, auto-expand timing, drag/resize affordances, portal behavior, minimize/restore behavior, and reduced-motion behavior.
- Do not redesign the Home hero or change the Batch A truthful content except for direct refactor fallout.
- Keep the diff focused on the Home / IDE track only.
- Avoid shared-component API churn unless a very small compatibility adjustment is required for correctness.

## Affected files and responsibilities

- `src/pages/Home.tsx` — route-level page composition; should stop owning the bulk of IDE window orchestration state.
- `src/pages/homeIdeOrchestration.ts` — canonical page-local IDE orchestration module; should absorb the remaining IDE window state machine and related handlers.
- `src/hooks/useHomeWelcomeSequence.ts` — existing onboarding/welcome flow adapter; may need a clearer phase-oriented contract or small cleanup if it helps trim route logic.
- `src/hooks/useTerminalBootSequence.ts` — boot-sequence hook; should move to a more declarative phase configuration while preserving timing and outputs.
- `test/unit/pages/Home.test.tsx` — current oversized integration suite; should be reduced to route-level integration coverage only or replaced by smaller route-level suites.
- `test/unit/hooks/useTerminalBootSequence.test.ts` — existing boot-sequence coverage; should be updated to reflect any new explicit phase helpers or state shape.
- `test/unit/pages/helpers/*` — new shared route-test harness/helpers for Home if needed.
- `test/unit/pages/homeIdeOrchestration.test.tsx` — new focused page-local orchestration coverage if extracted.
- `test/unit/hooks/useHomeWelcomeSequence.test.tsx` — new focused welcome-sequence coverage if extracting route concerns out of `Home.test.tsx` makes that worthwhile.

## Proposed approach

Use the smallest refactor that creates one explicit page-local IDE state machine and one smaller test architecture.

1. Expand `src/pages/homeIdeOrchestration.ts` so it owns the remaining IDE window lifecycle concerns that are currently local to `Home.tsx`: typewriter start/handoff state, pointer-capability gating, drag/resize enablement, window-size reset behavior, and timer-driven auto-expand lifecycle.
2. Keep DOM measurement and portal attachment logic in the page-local orchestration module so `Home.tsx` becomes mostly composition and ref wiring.
3. Refactor `useTerminalBootSequence()` around an explicit phase configuration map so the phase progression is readable without tracing a long effect ladder.
4. Trim `Home.tsx` to route composition plus hero scroll-motion wiring, with smaller handler hookups from the page-local orchestration module.
5. Replace the single large Home route test with a smaller architecture:
   - route integration coverage for welcome flow and visible route behavior
   - focused page-local orchestration tests for IDE state transitions, auto-expand, and resize behavior
   - focused hook tests where behavior becomes clearer at the hook boundary
6. Keep the existing visible behavior and assertions stable unless a structural change requires a small expectation update.

## Execution steps

1. Add and maintain this Batch B ExecPlan.
2. Refactor `src/pages/homeIdeOrchestration.ts` into the single page-local owner for IDE window lifecycle state and update `Home.tsx` to consume it.
3. Refactor `src/hooks/useTerminalBootSequence.ts` to use a more declarative phase definition while preserving outputs, timing, and reduced-motion behavior.
4. Apply any small `useHomeWelcomeSequence.ts` cleanup needed so Home route state reads more explicitly.
5. Split the Home test surface into smaller suites/helpers with clear concern boundaries and update focused expectations.
6. Run build, targeted Jest suites, and browser validation on `/` at desktop and narrow/mobile widths.
7. If route behavior is materially affected, run the narrowest relevant Home Playwright coverage.

## Validation plan

- `npm run build`
- Targeted Jest coverage for the touched route/orchestration/hook suites, at minimum the Home route suites plus `test/unit/hooks/useTerminalBootSequence.test.ts`, and any new focused orchestration/welcome hook suites added in this batch
- Browser validation on `/` at one desktop viewport and one narrow/mobile viewport using the browser tooling
- If the visible Home hero behavior changes materially: `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts`

## Risks and rollback

- Moving drag/resize and auto-expand state out of `Home.tsx` can break subtle timing or reset behavior if the new orchestration module changes when session keys or size resets happen.
- Making boot progression more declarative can accidentally change command typing timing or session accumulation if the new phase map is not behaviorally identical.
- Splitting the Home tests can accidentally drop coverage if assertions are removed without being re-homed into the new focused suites.

Rollback approach:

- Keep the IDE orchestration refactor, boot-sequence refactor, and test split logically separable so any one area can be reverted independently.
- Preserve public route behavior and shared component props so rollback scope stays local to the Home / IDE track.

## Progress notes

- 2026-03-23: Initial investigation confirmed Batch A removed truthfulness drift, but `Home.tsx` still owns drag, resize, typewriter start, and auto-expand coordination that should move into the page-local orchestration module in Batch B.
- 2026-03-23: Initial investigation confirmed `useTerminalBootSequence()` still uses a long phase-by-phase effect ladder; Batch B should make the phase model more explicit without changing the visible outputs.
- 2026-03-23: Initial investigation confirmed `test/unit/pages/Home.test.tsx` still bundles route rendering, welcome flow, IDE window actions, auto-expand timing, and resize behavior into one large file; Batch B should split those concerns into smaller suites and helpers.
- 2026-03-23: Implemented the page-local orchestration refactor by moving typewriter start, pointer-capability gating, drag state, resize state, and reset behavior into `src/pages/homeIdeOrchestration.ts`, leaving `src/pages/Home.tsx` focused on route composition, hero scroll-motion wiring, and render placement.
- 2026-03-23: Refactored `src/hooks/useTerminalBootSequence.ts` from a phase-by-phase effect ladder to a transition map plus a single active-phase effect. The visible command/output behavior and reduced-motion shortcut remained unchanged.
- 2026-03-23: Split the Home test architecture into a smaller route integration suite plus focused hook/page-orchestration suites:
  - `test/unit/pages/Home.test.tsx` now covers route-level integration only.
  - `test/unit/pages/homeIdeOrchestration.test.tsx` covers page-local IDE lifecycle, viewport resolution, auto-expand, drag gating, and resize/reset behavior.
  - `test/unit/hooks/useHomeWelcomeSequence.test.tsx` covers the onboarding/welcome sequence directly.
  - `test/unit/pages/helpers/homeTestHarness.tsx` owns the shared Home route test harness and mocks.
- 2026-03-23: `src/hooks/useHomeWelcomeSequence.ts` did not require a code change once the welcome flow assertions moved into a dedicated hook suite; the smaller test boundary delivered the desired clarity without widening the hook API.
- 2026-03-23: The staged diff was later adjusted to keep the original ping-pong terminal/editor/explorer content while retaining the Batch B orchestration and test-architecture refactor. Any earlier references to preserving the Batch A truthful content should be read as preserving the then-current Home behavior, not the final staged content.
- 2026-03-23: Validation completed successfully with:
  - `npm run build`
  - `export CI=true && npm test -- --watchAll=false --runInBand --coverage --runTestsByPath test/unit/pages/Home.test.tsx test/unit/pages/homeIdeOrchestration.test.tsx test/unit/hooks/useHomeWelcomeSequence.test.tsx test/unit/hooks/useTerminalBootSequence.test.ts test/unit/components/TerminalHeroContent.test.tsx test/unit/components/ide/IdeResizeLayout.test.tsx`
  - live browser validation of `/` at desktop and narrow/mobile widths against the local dev server via browser tooling
  - `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts`

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
