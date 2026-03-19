# Playwright Guidance Centralization

## Goal

Reduce Playwright instruction drift by making one canonical documentation source own command patterns and worker-count guidance, with nested instruction files referring to that source instead of repeating full commands.

## Why

The previous worker-count fix aligned the current command examples, but the repo still repeats Playwright invocation details across multiple AGENTS and `.instructions.md` layers. Future command or concurrency changes would require synchronized edits across many files.

## Constraints

- Keep the change narrowly scoped to documentation, instruction files, and workflow invocation paths.
- Preserve the existing Playwright runtime behavior, including 4-worker concurrency from `playwright.config.ts`.
- Do not introduce new dependencies or alter route behavior.

## Affected files and responsibilities

- `docs/engineering/testing-strategy.md`: canonical Playwright command and configuration guidance.
- `.github/copilot-instructions.md`: high-level Copilot validation guidance.
- `AGENTS.md`: root repository workflow guidance.
- `src/pages/AGENTS.md`: page-level Playwright validation mapping.
- `src/components/AGENTS.md`: shared-component validation guidance.
- `src/data/AGENTS.md`: data validation guidance for E2E-backed routes.
- `src/components/blog/AGENTS.md`: blog-specific Playwright guidance.
- `.github/instructions/pages.instructions.md`: scoped page instructions.
- `.github/instructions/blog-components.instructions.md`: scoped blog instructions.
- `.github/workflows/build.yml`: CI Playwright invocation path.

## Proposed approach

Use `docs/engineering/testing-strategy.md` as the canonical source for Playwright command shapes and worker-count ownership, because the docs set is already the repository documentation source of truth. Update the root and scoped instruction files to reference that document and focus only on route/spec mapping or build-variant requirements. Update the workflow to use the standard `npm run test:e2e` script path so CI also relies on the shared Playwright config instead of repeating worker flags.

## Execution steps

1. Update the testing strategy doc so it accurately describes the current Playwright projects, command shapes, and concurrency ownership.
2. Patch the root and scoped instruction files to defer Playwright command specifics to that canonical doc.
3. Update the build workflow to use the repo-standard Playwright script path instead of restating worker flags.
4. Validate the edited markdown, workflow, and Playwright command path.

## Validation plan

- workspace diagnostics for the changed files
- `npm run test:e2e -- --list`

## Risks and rollback

- Risk: references become too vague and make route-level validation harder to follow.
- Risk: the canonical testing doc could remain partially stale if current Playwright project details are not updated alongside the centralization.
- Rollback: revert the instruction refactor and workflow command-path updates together so guidance remains internally consistent.

## Progress notes

- Confirmed `docs/engineering/testing-strategy.md` already serves as the natural testing source of truth but contains stale Playwright details such as the old specific-spec command form and outdated project description.
- Confirmed nested AGENTS files repeat full Playwright command shapes instead of only specifying which spec should run or which build variant is required.
- Updated `docs/engineering/testing-strategy.md` to own Playwright project, worker, and command-shape guidance, then trimmed the root and nested instruction layers to reference that canonical doc instead of repeating worker flags.
- Updated `.github/workflows/build.yml` to use the repo-standard `npm run test:e2e` script path with project selection, so CI now follows the same command path as the documented local workflow.
- Validation completed with clean workspace diagnostics, no remaining `--workers=4` guidance outside the config source, and the standardized `npm run test:e2e -- --list` command path resolving successfully.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
