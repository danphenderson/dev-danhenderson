# Blog Feature Flag Removal

## Goal

Launch the blog publicly by removing the production-only route gate so `/blog` and `/blog/:slug` are always available in the shipped app.

## Why

The blog implementation is already present, tested, and bundled. The current feature flag now serves as a launch toggle rather than a technical safeguard, so leaving it in place keeps production behavior, smoke coverage, and contributor guidance out of sync with the intended public route surface.

## Constraints

- Preserve the existing client-side SPA architecture and direct-link routing behavior.
- Keep route metadata centralized in `src/constants/siteRoutes.ts`.
- Keep the change narrowly scoped to removing the blog production gate; do not redesign the blog or change its data model.
- Keep `PUBLIC_URL`-safe asset and router behavior intact.
- Update documentation and instructions that currently describe blog as dev/test-only.

## Affected files and responsibilities

- `src/constants/runtimeEnvironment.ts`: retain runtime-environment helpers while removing the blog flag API.
- `src/constants/siteRoutes.ts`: make blog route metadata unconditional and simplify enabled-route exports.
- `src/App.tsx`: register blog routes unconditionally and simplify lazy route selection.
- `src/constants/commandPaletteActions.ts`: always include blog post actions.
- `test/unit/App.test.tsx`: remove disabled-blog routing expectations.
- `test/unit/constants/runtimeEnvironment.test.ts`: keep runtime-environment tests, remove blog-flag assertions.
- `test/unit/constants/siteRoutes.test.ts`: update route metadata and production-route expectations.
- `test/e2e/smoke.spec.ts`: change production smoke coverage to expect public blog routes and header nav.
- `README.md` and docs/instruction files: reflect blog as a public route instead of a gated one.

## Proposed approach

Remove the blog flag from the runtime path in one pass: simplify the constants and App routing layer first, then rewrite tests and smoke coverage to define the new production contract, and finally update the documentation and instruction surface so future contributors are not told to preserve a gate that no longer exists.

## Execution steps

1. Remove the blog gate from route metadata, route registration, and command palette derivation.
2. Update unit and smoke tests so production now expects the blog to be routable and discoverable.
3. Update README, engineering docs, and scoped instructions that still describe blog as gated.
4. Run targeted validation for the changed runtime and route behavior.
5. Perform direct browser checks on `/blog` and `/blog/:slug` in desktop and mobile layouts.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false test/unit/App.test.tsx test/unit/constants/runtimeEnvironment.test.ts test/unit/constants/siteRoutes.test.ts`
- `npm run build && npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`
- browser validation on `/blog` and `/blog/fixing-and-enforcing-none-type-drift-with-a-codemod` at desktop and mobile widths

## Risks and rollback

- Smoke coverage currently encodes the old production contract; if not updated, rollout work will look broken even when runtime code is correct.
- Multiple docs and instruction files currently tell contributors to preserve blog gating; leaving them stale would reintroduce drift quickly.
- Rollback is straightforward: restore the blog flag in route metadata, App route registration, and smoke coverage if public launch needs to be reversed.

## Progress notes

- Initial assessment found the runtime gate centralized in route metadata, App routing, and command palette derivation.
- Production smoke and contributor docs currently assume blog is hidden in production, so this work is a launch change rather than a pure cleanup.
- Runtime code, unit tests, smoke coverage, and contributor docs were updated together so the new public blog contract is consistent across source, validation, and instructions.
- Validation completed with `npm run build`, focused App/constants Jest coverage, `npm run build:e2e` plus `test/e2e/blog.spec.ts`, `npm run build` plus `test/e2e/smoke.spec.ts`, and manual desktop/mobile browser checks against the production build.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
