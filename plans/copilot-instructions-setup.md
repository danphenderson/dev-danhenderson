# Copilot instructions setup

## Goal

Add the official GitHub Copilot repository instruction files so Copilot can pick up the repository's existing guidance without replacing the current `AGENTS.md` workflow.

## Why

The repository already contains detailed agent guidance in `AGENTS.md` and nested `src/**/AGENTS.md` files, but it does not yet expose equivalent repository-wide and path-specific custom instructions in the `.github/` locations that GitHub Copilot expects. Adding those files reduces repeated repo exploration and aligns the repository with current Copilot best practices.

## Constraints

- Preserve the current client-side React SPA architecture and static-hosting model.
- Keep the change narrowly scoped to repository instruction and directly related documentation files.
- Build on the existing `AGENTS.md` and `PLANS.md` guidance instead of replacing or contradicting it.
- Keep instruction files concise so they remain effective for Copilot features with shorter context limits.
- Do not change source, route, or content behavior.

## Affected files and responsibilities

- `.github/copilot-instructions.md`: repository-wide Copilot instructions for architecture, workflow, and validation.
- `.github/instructions/components.instructions.md`: path-specific guidance for `src/components/**`.
- `.github/instructions/pages.instructions.md`: path-specific guidance for `src/pages/**`.
- `.github/instructions/data.instructions.md`: path-specific guidance for `src/data/**`.
- `README.md`: brief documentation of where Copilot custom instructions live.

## Proposed approach

Create a short repository-wide Copilot instructions file that summarizes the repo purpose, stack, key directories, and validated command order while explicitly deferring to the existing `AGENTS.md` and `PLANS.md` files for deeper agent behavior. Add three path-specific instruction files with `applyTo` frontmatter that mirror the existing nested `AGENTS.md` scope boundaries for components, pages, and data. Update `README.md` just enough to mention the new instruction locations so the setup is discoverable.

## Execution steps

1. Add `.github/copilot-instructions.md` with repository-wide guidance based on verified repo structure and command behavior.
2. Add `.github/instructions/*.instructions.md` files for `src/components`, `src/pages`, and `src/data` using the existing nested `AGENTS.md` guidance as the source of truth.
3. Update `README.md` with a short note about the Copilot custom instruction files.
4. Re-run the narrowest relevant validation (`npm run build`) and review the diff for scope.

## Validation plan

- `npm run build`
- Manual review of the new instruction files for consistency with `AGENTS.md`, nested `AGENTS.md`, and `PLANS.md`

## Risks and rollback

- Risk: duplicated or conflicting guidance between `.github` instruction files and existing `AGENTS.md` files. Mitigation: keep the new files concise and explicitly defer to existing agent docs for deeper rules.
- Risk: overly long instruction files become less effective in Copilot code review. Mitigation: summarize instead of copying the full agent docs.
- Rollback: revert the new `.github` instruction files and the README update together if they cause confusion.

## Progress notes

- Verified official GitHub Copilot support for `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, and `AGENTS.md`.
- Verified `npm install` is required before local validation in this environment.
- Verified `npm run build` passes locally.
- Verified `CI=true npm test -- --watch=false` currently has unrelated pre-existing CV test failures in this branch baseline.
- Added repository-wide and path-specific Copilot instruction files that defer to the existing `AGENTS.md` hierarchy for deeper guidance.
- Added a brief `README.md` section so contributors can find the new instruction files.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
