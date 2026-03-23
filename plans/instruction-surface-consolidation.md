# Instruction Surface Consolidation

## Goal

Reduce agent-facing prompt and documentation sprawl by clarifying where instruction categories live, trimming repeated guidance from repo-wide files, and turning scoped `.instructions.md` files into lightweight shims that defer to canonical sources.

## Why

The instruction stack currently repeats high-value guidance across root docs, Copilot bootstrap instructions, engineering docs, nested `AGENTS.md` files, and `.github/instructions/*.instructions.md` shims. The overlap is not materially increasing safety in several areas; instead it makes the authoritative source harder to identify and increases maintenance overhead when rules change.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Do not change runtime code or unrelated source files.
- Keep the instruction layering intact: repo-wide guidance, canonical docs, scoped `AGENTS.md`, and auto-applied `.instructions.md` shims.
- Do not remove necessary local reinforcement for high-risk invariants.
- Narrow the scope to instruction and contributor documentation relevant to agent behavior.

## Affected files and responsibilities

- `.github/copilot-instructions.md`: bootstrap/runtime instruction entrypoint; should point to canonical sources instead of restating them.
- `AGENTS.md`: canonical repo-level workflow, decision priority, instruction discovery, and guardrails.
- `docs/engineering/agent-guide.md`: canonical architecture invariants and safe extension guidance.
- `docs/engineering/testing-strategy.md`: canonical validation matrix, command shapes, and build-variant guidance.
- `docs/README.md`: docs index and instruction/discovery map.
- `CONTRIBUTING.md`: contributor-facing guidance; should link to canonical engineering docs instead of mirroring them.
- `.github/instructions/*.instructions.md`: thin auto-applied scope shims that should defer detail to paired scoped `AGENTS.md` files.
- `src/**/AGENTS.md`: scoped canonical rules for the relevant directory.

## Proposed approach

Use a four-layer model and remove repeated detail where it does not add scope-specific value:

1. Keep `AGENTS.md` as the canonical repo-level guide for workflow, decision priority, instruction precedence, and cross-cutting repo constraints.
2. Keep `docs/engineering/agent-guide.md` as the canonical owner of architecture invariants and safe extension patterns.
3. Keep `docs/engineering/testing-strategy.md` as the canonical owner of validation matrices, build variants, and Playwright/Jest command shapes.
4. Reduce `.github/instructions/*.instructions.md` files to short, auto-applied reminders that point to the paired scoped `AGENTS.md` file for details.

Implementation will proceed from top-level sources to scoped shims so the canonical destinations exist before dependent files are shortened.

## Execution steps

1. Add this ExecPlan and define the target ownership model.
2. Refactor `.github/copilot-instructions.md` and `AGENTS.md` so repo-level instructions point to canonical docs instead of restating large sections.
3. Update `docs/engineering/agent-guide.md`, `docs/engineering/testing-strategy.md`, `docs/README.md`, and `CONTRIBUTING.md` to clarify ownership and discovery.
4. Trim the highest-duplication `.github/instructions/*.instructions.md` files to lightweight shims, keeping scoped `src/**/AGENTS.md` files as the detailed local source.
5. Review all edited files for consistency and verify there are no broken frontmatter blocks or obvious markdown issues.

## Validation plan

- Review edited markdown files for consistency, link targets, and instruction hierarchy clarity.
- Run workspace diagnostics on the edited files if available.
- Confirm `.instructions.md` frontmatter remains valid after edits.
- Report any validation not run.

## Risks and rollback

- Risk: over-trimming scoped instructions could remove context that is useful when only the shim is loaded.
- Risk: shifting ownership without clear cross-references could make the instruction surface harder to navigate.
- Risk: root guidance may become too thin if repo-level guardrails are moved out instead of linked.
- Rollback: because this work is documentation-only, individual files can be restored or adjusted independently if a layer becomes too sparse.

## Progress notes

- 2026-03-19: Audit completed. Highest duplication clusters identified in validation guidance, architecture invariants, feature-gating rules, and paired `.instructions.md` / `AGENTS.md` files.
- 2026-03-19: Implementation started with the top-level instruction stack and instruction-discovery cleanup.
- 2026-03-19: First implementation pass completed. Root instruction ownership now points to canonical docs, validation ownership moved into `docs/engineering/testing-strategy.md`, `docs/README.md` now includes an instruction map, and the highest-duplication scoped shims now defer detailed validation behavior to their paired scoped `AGENTS.md` files and the testing guide.
- 2026-03-19: Workspace diagnostics reported no errors on the edited markdown and instruction files.
- 2026-03-19: Second implementation pass trimmed the remaining lower-priority `.github/instructions/*.instructions.md` shims and shortened root `AGENTS.md` area guidance so scoped `AGENTS.md` files own more of the file-specific detail.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
