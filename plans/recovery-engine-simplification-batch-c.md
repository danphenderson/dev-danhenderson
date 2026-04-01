# Recovery Engine Simplification Batch C

## Goal

Simplify the not-found recovery ranking logic so future maintainers can understand why a suggestion wins without tracing a long chain of token helpers and score bonuses, while keeping the existing `RecoveryContext` shape and preserving high-quality suggestions for unknown routes.

## Why

The current recovery engine mixes generic token matching, route-hint detection, action-kind bonuses, and path-prefix bonuses into one additive score made of several small helper functions and magic numbers. That makes the behavior harder to reason about, harder to adjust safely, and harder to pin with representative tests. Batch C should replace that with clearer ranking rules and focused ordering tests without expanding into route metadata or command-palette architecture.

## Constraints

- Preserve SPA routing, direct-link behavior, static-hosting compatibility, and `PUBLIC_URL`-safe asset handling.
- Keep `src/constants/recoveryContext.ts` pure and framework-agnostic.
- Do not change route metadata ownership in `src/constants/siteRoutes.ts`.
- Do not rebuild or redesign `src/constants/commandPaletteActions.ts` or `src/constants/routeActions.ts`.
- Keep the current `RecoveryContext` and `RecoverySuggestion` UI contract unless a narrow consumer change is required for correctness.
- Keep this batch isolated from Home / IDE work, static-data hook cleanup, shared sx/text helper cleanup, and compatibility cleanup tracks.

## Affected files and responsibilities

- `src/constants/recoveryContext.ts`: Pure ranking and route-hint logic for not-found recovery suggestions.
- `test/unit/constants/recoveryContext.test.ts`: Representative unit coverage for normalization, route hints, palette query derivation, and suggestion ordering.
- `src/components/RouteRecoveryPanel.tsx`: Consumer of the recovery context output; should remain unchanged unless the simplified model requires a minimal presentation adjustment.
- `test/unit/components/RouteRecoveryPanel.test.tsx`: Consumer contract coverage if the panel needs a narrow update.
- `test/unit/pages/NotFound.test.tsx`: Route-level contract coverage if the not-found page behavior or expectations change.

## Proposed approach

Replace the current many-bonus score accumulator with a smaller, explicit ranking model built around named signals:

1. Normalize the attempted path once and derive a route hint using direct prefix matches first, then a simpler token-overlap fallback.
2. Derive a palette query from the remaining path segments after the hinted route.
3. For each command-palette action, compute a compact set of ranking signals in one place, such as:
   - same hinted route
   - direct path-prefix relationship
   - exact token overlap
   - prefix token overlap
   - action-type alignment for CV sections and photography albums
   - recovery-route fallback priority
4. Keep the weight table centralized and named so the ordering is readable from top to bottom.
5. Generate the match reason from the strongest contextual signal rather than from scattered conditionals.
6. Expand tests to pin representative outputs and ordering for typos, section-like paths, album-like paths, and unrelated paths.

This keeps the boundary pure, keeps the UI contract stable, and reduces the amount of hidden coupling in the ranking logic.

## Execution steps

1. Add the ExecPlan and capture the current recovery behavior for a few representative paths that must remain high quality.
2. Refactor `src/constants/recoveryContext.ts` to use a smaller set of named ranking signals and a centralized rule table.
3. Update `test/unit/constants/recoveryContext.test.ts` to verify representative ordering, route hints, palette query derivation, and deduplication.
4. Adjust `RouteRecoveryPanel` or route-level tests only if the simplified logic requires a narrow consumer expectation update.
5. Run the required build, focused Jest coverage, and browser validation on unknown routes in desktop and narrow viewports.

## Validation plan

- `npm run build`
- Focused Jest coverage for `test/unit/constants/recoveryContext.test.ts`
- Focused Jest coverage for `test/unit/components/RouteRecoveryPanel.test.tsx` if touched
- Focused Jest coverage for `test/unit/pages/NotFound.test.tsx` if touched
- Browser validation of an unknown route in one desktop viewport and one mobile or narrow viewport
- If route behavior changes materially, run the narrowest relevant Playwright coverage for `test/e2e/not-found.spec.ts`

## Risks and rollback

- The main regression risk is lowering suggestion quality for typo-heavy paths such as `/cv/abou` or scoped paths such as `/photography/<slug>`.
- A second risk is overfitting the ranking rules to only the test fixtures and losing robustness for unrelated paths.
- Keep the change isolated to `recoveryContext.ts` and focused tests so rollback is straightforward if ranking quality drops.
- If the simplified model fails to preserve suggestion quality, revert the ranking refactor while keeping any newly useful tests that document expected behavior.

## Progress notes

- Initial inspection shows the current implementation combines token-set scoring, route bonuses, path-prefix bonuses, and action-kind bonuses in one additive score.
- Route-level and E2E coverage confirm the highest-value preserved behavior is typo recovery like `/cv/abou` suggesting `CV: About` and pre-filling the command palette with `abou`.
- Consumer expectations are narrow enough that the refactor should remain mostly inside `src/constants/recoveryContext.ts` and `test/unit/constants/recoveryContext.test.ts`.
- Replaced the additive score accumulator with explicit ranking signals for ordered path alignment, action-path query matches, general query matches, path token matches, route scope, contextual kind matching, and recovery-route priority.
- Tightened fuzzy matching so short one- and two-character tokens no longer create spurious prefix matches, and limited contextual suggestions to candidates with stronger evidence than loose substring overlap alone.
- Updated `getPaletteQuery()` so inferred route hints only strip route segments when the attempted path actually starts with the hinted route path; keyword-only hints now keep the full query text.
- Strengthened `test/unit/constants/recoveryContext.test.ts` around representative route hints, palette queries, and suggestion ordering for CV typo paths, photography album paths, keyword-only CV fallback paths, and unrelated paths.
- Final production build completed successfully after the refactor (`npm run build`); the terminal wrapper reported exit code 130 after returning to the prompt, but Vite finished and emitted the updated bundle.
- Focused Jest reruns and browser-based unknown-route checks were attempted multiple ways, but the current terminal/browser tooling did not provide a trustworthy current-only result stream after earlier interactive Jest runs. Those validation limitations are environmental rather than TypeScript or build errors in the touched files.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
