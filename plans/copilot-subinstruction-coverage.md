# Copilot Subinstruction Coverage

## Goal

Ensure each scoped `AGENTS.md` under `src/` is surfaced to Copilot through a matching file instruction in `.github/instructions/`, following the existing `components`, `data`, and `pages` pattern.

## Why

Only three file instructions currently exist, which means several directory-specific `AGENTS.md` files are easy for Copilot to miss unless they are manually opened. Adding matching `.instructions.md` files makes those scoped rules discoverable through `applyTo` targeting and keeps the instruction system consistent across `src/`.

## Constraints

- Keep the change limited to instruction documentation and planning artifacts.
- Preserve the existing repo instruction pattern: short summary plus a pointer to the corresponding `AGENTS.md`.
- Do not change runtime code, route behavior, or build configuration.
- Keep `applyTo` patterns narrow so instructions only load for the intended files.

## Affected files and responsibilities

- `plans/copilot-subinstruction-coverage.md`: ExecPlan for this instruction-coverage task.
- `.github/instructions/*.instructions.md`: file-scoped Copilot instructions that mirror missing `src/**/AGENTS.md` scopes.

## Proposed approach

Add one instruction file for each missing `AGENTS.md` scope under `src/`, using the established structure already used by `components.instructions.md`, `data.instructions.md`, and `pages.instructions.md`: YAML frontmatter with `applyTo`, a concise directory summary, a short list of guardrails, and a closing line that points to the full `AGENTS.md` file.

For the nested blog component scope, add a more specific instruction file for `src/components/blog/**` so those editorial rules are loaded in addition to the broader component guidance.

## Execution steps

1. Inventory the current `src/**/AGENTS.md` files and compare them against `.github/instructions/`.
2. Add missing `.instructions.md` files with narrow `applyTo` patterns and concise summaries aligned to each directory's `AGENTS.md`.
3. Verify that every relevant `AGENTS.md` scope now has a corresponding file instruction and confirm the diff remains limited to planning and instruction files.

## Validation plan

- Review `src/**/AGENTS.md` and `.github/instructions/` side by side for one-to-one coverage.
- Inspect the git diff to confirm only the intended plan and instruction files changed.

## Risks and rollback

- Overly broad `applyTo` patterns could cause irrelevant instructions to load too often. Keep patterns directory-specific.
- Summaries that drift from the source `AGENTS.md` could create conflicting guidance. Keep each instruction concise and defer detail to the source file.
- Rollback is straightforward: revert the added `.instructions.md` files if the instruction load becomes too noisy.

## Progress notes

- Inventory completed: existing instruction files cover `src/components`, `src/data`, and `src/pages` only.
- Missing scoped coverage identified for `src/constants`, `src/hooks`, `src/motion`, `src/styles`, `src/theme`, `src/types`, `src/utils`, and nested `src/components/blog`.
- Added matching instruction files for each missing scope under `.github/instructions/`.
- Validation completed by comparing the `src/**/AGENTS.md` inventory against the instruction directory and reviewing the git diff.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
