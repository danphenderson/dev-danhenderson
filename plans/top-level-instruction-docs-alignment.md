# Top-Level Instruction Docs Alignment

## Goal

Align the repository-wide instruction layer in `AGENTS.md` and `.github/copilot-instructions.md` with the current source-of-truth documentation in `docs/` so top-level guidance matches the documented architecture, motion system, feature gating, validation workflow, and repository structure.

## Why

The scoped instruction files now reflect the docs set, but the top-level instruction layer still has a few stale or incomplete assumptions: it does not clearly point agents at `docs/` as the canonical documentation set, it underspecifies the motion/style invariants now documented in the agent guide, and `.github/copilot-instructions.md` still has an outdated E2E path and incomplete route/test guidance for the feature-gated blog.

## Constraints

- Limit changes to `AGENTS.md`, `.github/copilot-instructions.md`, and this plan.
- Keep top-level instructions concise and operational; use the docs as the deeper source of truth rather than duplicating entire documents.
- Preserve the existing repo architecture: fully client-side SPA, static-hosting compatibility, documented intentional design-system exceptions, and feature-gated blog behavior.
- Do not claim validation commands were run unless they were actually run.

## Affected files and responsibilities

- `plans/top-level-instruction-docs-alignment.md`: ExecPlan for this top-level docs-alignment pass.
- `AGENTS.md`: root repository guidance for architecture invariants, validation, and docs discovery.
- `.github/copilot-instructions.md`: top-level Copilot repository overview, map, and validated command guidance.

## Proposed approach

Patch the root files only where they drift from `docs/`:

1. add an explicit pointer to `docs/README.md` and `docs/engineering/agent-guide.md` as the source-of-truth documentation layer
2. refresh the route and repository map details to include the feature-gated blog and the correct `test/e2e/` path
3. add concise architecture invariants covering provider order, motion scaling through `useMotionScale()`, style-builder usage for theme-conditional surfaces, and feature gating through `isFeatureEnabled()`
4. update validation guidance to reflect the `npm run build:e2e` requirement for gated blog Playwright coverage

## Execution steps

1. Compare the current root instruction files against the docs set and identify concrete drift.
2. Patch `AGENTS.md` with docs-source-of-truth references and concise repo-wide invariants.
3. Patch `.github/copilot-instructions.md` with updated route/repo map details and E2E guidance.
4. Review the diff and confirm only the intended top-level instruction files changed.

## Validation plan

- Re-read the changed root instruction files against `docs/README.md`, `docs/engineering/agent-guide.md`, `docs/architecture/app-architecture.md`, and `docs/engineering/testing-strategy.md`.
- Review the git diff to confirm only the intended top-level instruction files and this plan changed.
- No runtime validation is required because this change affects documentation only.

## Risks and rollback

- Overloading the root instructions can make them noisy. Keep additions short and push detail to `docs/`.
- Copying too much doc language verbatim can make the root files redundant with scoped instructions. Keep the top layer focused on repository-wide invariants.
- Rollback is straightforward: revert the root instruction edits if they become too verbose or conflicting.

## Progress notes

- Comparison completed: the main drift is docs discovery, feature-gated blog validation flow, motion/style invariants, and an outdated `e2e/` path in `.github/copilot-instructions.md`.
- Updated `AGENTS.md` with explicit docs entrypoints, repository-wide invariants, the gated blog build variant, and the current repo map.
- Updated `.github/copilot-instructions.md` with the current route set, blog gating note, corrected `test/e2e/` path, docs entrypoint guidance, and the `npm run build:e2e` validation rule.
- Validation completed by re-reading both root instruction files against the docs set and reviewing the diff; unrelated workspace changes were left untouched.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
