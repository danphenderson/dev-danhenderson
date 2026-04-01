# Resume Directory Relocation

## Goal

Move the repository's resume source directory from `resume/` to `public/resume/` without changing the app's existing downloadable resume behavior.

## Why

The repository layout should place the resume source under `public/resume/` while preserving the current `/cv` download path, documentation accuracy, and agent-instruction discovery.

## Constraints

- Preserve the current client-side SPA architecture and `PUBLIC_URL` compatibility.
- Keep the downloadable resume URL in `src/data/cv.ts` unchanged unless a path change is explicitly required.
- Keep the change narrowly scoped to the directory relocation, supporting docs, and workflow/instruction references.
- Avoid disturbing unrelated working tree changes already present in `plans/` and other files.
- Be explicit about the consequence that files under `public/` are copied into `build/`.

## Affected files and responsibilities

- `public/resume/`: new home for the resume source directory and scoped `AGENTS.md`.
- `.gitignore`: keep generated LaTeX outputs ignored after the path move.
- `AGENTS.md`: update repo instruction discovery and repository map references.
- `.github/copilot-instructions.md`: update the scoped-instruction path reference.
- `docs/README.md`: update the instruction map entry.
- `CONTRIBUTING.md`: update contributor guidance, CI notes, and repository structure references.
- `.github/workflows/build.yml`: keep workflow path filters aligned with the moved resume source path if resume-only changes should remain ignored.
- `.github/workflows/codecov.yml`: keep coverage workflow path filters aligned with the moved resume source path if resume-only changes should remain ignored.

## Proposed approach

Relocate the directory to `public/resume/`, preserve the existing published resume PDF path in `public/assets/`, and update the repo metadata that refers to the old root-level location. Keep generated LaTeX byproducts ignored at the new path while allowing the source `.tex` file and scoped `AGENTS.md` to exist at the new location.

## Execution steps

1. Create this ExecPlan and confirm all current references to `resume/`.
2. Move the directory to `public/resume/`.
3. Update `.gitignore` for the new path.
4. Update agent-instruction references and contributor/docs references to `public/resume/`.
5. Update CI path filters if resume-source-only changes should continue to bypass build and coverage workflows.
6. Validate references, inspect git state, and run `npm run build`.

## Validation plan

- `rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' "resume/|public/resume" .`
- `git --no-pager status --short --untracked-files=all`
- `npm run build`

## Risks and rollback

- Moving source under `public/` makes the directory eligible for copying into `build/`; ignore rules and docs must make that explicit.
- CI path filters can silently drift if they still point at `resume/**` after the move.
- The repository currently has unrelated deleted plan files and untracked images; those must remain untouched.
- Rollback is straightforward: move `public/resume/` back to `resume/` and restore the old path references.

## Progress notes

- Confirmed the runtime app still downloads the published resume from `public/assets/daniel-henderson-resume.pdf`; no app code change is required unless the download URL should move.
- Confirmed hidden references in `.gitignore`, `.github/workflows/build.yml`, `.github/workflows/codecov.yml`, and `.github/copilot-instructions.md` require updates.
- Confirmed the PDF inside the source directory differs from `public/assets/daniel-henderson-resume.pdf`, so the published download path should remain unchanged unless explicitly requested.
- Moved the directory to `public/resume/`, updated repo docs/instruction maps to the new path, and preserved the previous workflow behavior where resume-source-only changes bypass `Build` and `Codecov`.
- `npm run build` succeeds after the move. Because the directory now lives under `public/`, any files present in `public/resume/` are copied into `build/resume/` during production builds.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
