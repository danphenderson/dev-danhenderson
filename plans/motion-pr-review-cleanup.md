# Motion PR Review Cleanup

## Goal

Review the motion-system PR end to end, fix any concrete integration regressions or obvious API cruft in the new motion primitives, and verify that the upgraded route-level motion still fits the site's existing SPA architecture and layout patterns.

## Why

The PR introduces a new shared motion foundation and rewires multiple routes to use it. That kind of cross-cutting UI work is prone to subtle regressions: wrapper elements can alter grid behavior, shared APIs can accumulate unused props, and page-level motion can bypass existing composition constraints. The cleanup should remove confirmed technical debt while preserving the intended motion rollout.

## Constraints

- Keep the app fully client-side and preserve SPA route behavior.
- Keep static asset usage compatible with `PUBLIC_URL`.
- Limit changes to issues directly related to the motion-system integration or technical debt introduced by this PR.
- Preserve the project direction that reduced-motion support is intentionally removed on this branch.
- Validate touched routes in the browser because these changes affect layout, animation, and viewport-triggered behavior.

## Affected files and responsibilities

- `src/motion/components.tsx`: shared motion primitives; remove or resolve API cruft and integration issues.
- `src/pages/Photography.tsx`: photography grid integration with stagger/motion wrappers.
- `src/pages/Home.tsx`: page-level hero motion wiring.
- `src/components/Footer.tsx`: shared footer motion integration.
- `src/pages/CV.tsx` and CV motion-related components/tests if needed: validate header/story-mode integration.
- `test/` and `e2e/`: update targeted coverage only if necessary for corrected behavior.

## Proposed approach

First, review the new motion primitives and route wrappers for actual behavioral regressions or dead API surface. Then apply the smallest code changes needed to restore layout correctness and tighten the shared motion API. Finally, run build, targeted tests, and browser validation on the touched routes to confirm the motion system is integrated cleanly.

## Execution steps

1. Review motion primitive APIs and page integrations to identify concrete regressions and technical debt worth fixing.
2. Patch confirmed issues in the narrowest relevant files, preserving existing route composition and shared component contracts.
3. Run `npm run build` and targeted Jest/Playwright validation for affected routes.
4. Perform browser checks on the changed routes at desktop and mobile widths.
5. Summarize review findings, fixes made, and any residual risks.

## Validation plan

- `npm run build`
- Targeted Jest tests for touched motion/CV components if relevant
- Narrow Playwright specs for `/cv`, `/photography`, and route-level motion consumers when applicable
- Browser validation for `/`, `/cv`, `/photography`, and `/photography/:slug` at desktop and mobile widths

## Risks and rollback

- Risk: extra wrapper nodes can change grid sizing or card height behavior. Mitigation: restore lost item-level styles and validate Photography in-browser.
- Risk: tightening shared motion APIs can break current consumers. Mitigation: keep changes backward compatible or update all in-repo consumers together.
- Risk: page-level parallax can affect layout or readability. Mitigation: validate the home route in-browser and keep motion scoped to the hero container only.
- Rollback: revert the focused motion cleanup commits or individual file changes if validation shows degraded route behavior.

## Progress notes

- Identified likely Photography grid regression from replacing `photographyGridItemSx` wrappers with bare `MotionItem` nodes.
- Identified API cruft in `src/motion/components.tsx`, including currently ignored `as` and `itemVariants` props.
- Confirmed the Photography grid still renders correctly in desktop and mobile browser checks; the lost wrapper style was functionally replicated via `minWidth: 0`, so no additional layout patch was required.
- Removed the unused `as` and `itemVariants` props from the shared motion primitives and deduplicated the in-view hook logic in `src/motion/components.tsx`.
- Identified a stale Home Playwright assertion that still expected old theme-hint copy; updated the spec to match the current hint title and re-ran route-level validation.
- Validation completed: `npm run build`, targeted unit tests for touched pages/components, Playwright specs for `home`, `photography`, `cv.github`, `climbing`, and `not-found`, plus manual browser checks on `/`, `/photography`, `/photography/new-mexico`, and `/cv` at desktop/mobile widths.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
