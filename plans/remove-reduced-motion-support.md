# Remove reduced-motion support

## Goal

Remove the app's reduced-motion handling so all appearances consistently use the existing expressive motion behavior, including shared ambient motion and component-level entrance/scroll animations.

## Why

The repository already applies a shared motion treatment to every appearance preset, but many components still carry reduced-motion branches that disable those animations. That mismatch creates maintenance overhead and leaves theme copy implying some presets animate differently when the implementation goal is now consistent expressive motion across the site.

## Constraints

- Keep the app fully client-side and preserve SPA routing.
- Keep changes narrowly scoped to motion behavior and directly related theme copy/tests.
- Do not change appearance keys, route names, or unrelated component APIs.
- Preserve the existing expressive motion timing tokens and spring easing behavior instead of introducing a new motion system.
- Validate shared-component changes with targeted tests, a full build/test pass, and browser checks with screenshots.

## Affected files and responsibilities

- `src/components/*.tsx`: shared animation and scroll components that currently branch on reduced-motion behavior.
- `src/components/cv/*.tsx`: CV components that currently skip typewriter/scroll motion under reduced motion.
- `src/components/text/useTypewriterProgress.ts`: shared typewriter progression logic that currently short-circuits for reduced motion.
- `src/styles/animations.ts`: shared animation helpers, including the reduced-motion CSS override.
- `src/theme/appAppearance.ts`: appearance metadata copy that should align with the now-uniform expressive motion treatment.
- `test/unit/**/*.test.{ts,tsx}`: focused tests that currently assert reduced-motion bypass behavior and need to be updated or removed.

## Proposed approach

Delete the reduced-motion hook and remove all component branches that depend on it so the existing expressive motion path is the only runtime path. Remove the CSS reduced-motion override helper from shared styles, keep the existing shared motion tokens in place for every theme, and update appearance descriptions so they no longer imply reduced or minimal motion. Update the narrow set of tests that encoded reduced-motion-specific behavior and keep the broader timing/animation assertions intact.

## Execution steps

1. Add this ExecPlan and capture the baseline build/test status.
2. Remove the reduced-motion hook usage from shared components, CV components, and typewriter logic.
3. Remove the shared reduced-motion style helper and any related dead code.
4. Update appearance descriptions to match the always-expressive motion behavior.
5. Update or delete focused tests that asserted reduced-motion bypasses, and add assertions for the remaining always-animated behavior where helpful.
6. Run targeted tests for touched components, then full build/tests.
7. Run browser validation on affected routes (`/` and `/cv`) at desktop and mobile widths and capture screenshots.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false`
- targeted Jest runs for touched motion-related tests while iterating
- browser validation for `/` and `/cv` in desktop and mobile viewports with screenshots

## Risks and rollback

- Shared animation components are reused across routes, so removing bypass branches could regress delayed entrance timing or controlled visibility behavior if the always-animated path is not preserved correctly.
- CV sequencing depends on animation completion callbacks; simplifying reduced-motion shortcuts must not break the existing ordered reveal flow.
- Rollback is straightforward by reverting the PR because the change is isolated to motion/theme logic and tests.

## Progress notes

- Baseline after `npm install`: `npm run build` and `CI=true npm test -- --watch=false` pass.
- The existing appearance presets already share one motion token set; the main work is deleting obsolete reduced-motion branches and aligning copy/tests with that reality.

## Completion Status

- [ ] Not started
- [x] In progress
- [ ] Complete
