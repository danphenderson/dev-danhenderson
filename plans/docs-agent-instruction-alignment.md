# Docs Agent Instruction Alignment

## Goal

Align the scoped agent guidance under `src/**/AGENTS.md` and `.github/instructions/*.instructions.md` with the current repository source-of-truth documentation in `docs/` so the operational instructions reflect the documented architecture, design system, motion system, feature gating, and validation expectations.

## Why

The documentation under `docs/` now describes the canonical design-system selection guide, page choreography model, motion scaling contract, theme/style-builder pipeline, feature-gated blog behavior, and testing/E2E build variants in more detail than several agent instruction files. Leaving those instructions stale risks pushing future edits toward outdated patterns.

## Constraints

- Keep the change limited to the scoped instruction files requested: `src/*/AGENTS.md`, nested `src/**/AGENTS.md` already in scope, and `.github/instructions/*.instructions.md`.
- Preserve the current architecture: SPA routing, static hosting, data modules as source of truth, and documented intentional design-system exceptions.
- Prefer narrow documentation edits that clarify drift instead of rewriting entire instruction files.
- Keep validation truthful; do not claim builds or tests that are not run.

## Affected files and responsibilities

- `plans/docs-agent-instruction-alignment.md`: ExecPlan for this documentation-alignment task.
- `src/components/AGENTS.md`: shared component design-system defaults and intentional exceptions.
- `src/components/blog/AGENTS.md`: editorial exception, feature gating, and blog-specific validation guidance.
- `src/constants/AGENTS.md`: feature flag system and route metadata authority.
- `src/motion/AGENTS.md`: motion primitive catalog and intensity-scaling contract.
- `src/pages/AGENTS.md`: scaffold patterns, page-owned choreography, and gated-route validation.
- `src/styles/AGENTS.md`: style-builder pipeline and permitted inline styling boundary.
- `.github/instructions/*.instructions.md`: concise mirrors of the updated scoped guidance.

## Proposed approach

Use the docs as the source of truth and patch only the files whose current guidance materially drifts from those docs. Focus on five areas:

1. design-system defaults and intentional exceptions for shared component work
2. page scaffold/choreography ownership and route validation patterns
3. feature gating and blog E2E build-variant guidance
4. motion primitive inventory and the `useMotionScale()` contract
5. theme/style-builder pipeline guidance for theme-conditional styling

Keep each update small: add or adjust the specific rules that are missing, and leave already aligned sections intact.

## Execution steps

1. Compare the docs set against current scoped instruction files and identify concrete drift.
2. Update the drifted `src/**/AGENTS.md` files with source-of-truth guidance from the docs.
3. Update the matching `.github/instructions/*.instructions.md` files so their summaries match the revised scoped AGENTS guidance.
4. Verify the diff is limited to the intended instruction files and confirm the updated guidance matches the docs language and commands.

## Validation plan

- Re-read the changed instruction files after patching to confirm wording matches the docs on design system, motion, feature gating, and validation.
- Review the git diff to ensure only scoped instruction files and this plan changed.
- No runtime build/test validation is required because this task changes documentation only.

## Risks and rollback

- Over-updating instruction files can create noisy or redundant guidance. Keep edits focused on actual drift.
- Merging doc language too literally can make scoped instructions verbose. Preserve concise operational phrasing.
- Rollback is straightforward: revert the changed instruction files if the guidance becomes too heavy or contradictory.

## Progress notes

- Docs review completed across `docs/README.md`, architecture, frontend, engineering, and reference docs.
- Initial drift identified in components, pages, motion, constants, blog-specific validation, and style/theme pipeline guidance.
- Updated the scoped AGENTS files for components, blog components, constants, motion, pages, styles, and theme to match the docs language on design-system defaults, page choreography, feature gating, motion scaling, and resolved theme treatment.
- Updated the matching `.github/instructions/*.instructions.md` summaries so the lightweight Copilot instructions now mirror the scoped AGENTS guidance.
- Validation completed by re-reading the changed instruction files and reviewing the git diff; unrelated workspace changes were left untouched.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
