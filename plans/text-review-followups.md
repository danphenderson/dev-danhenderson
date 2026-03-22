# Text Review Follow-Ups

## Goal

Resolve the three review findings in the current design-system redesign branch without reopening the full redesign scope:

1. restore visible h2/h3/h4 hierarchy in blog article bodies
2. remove the current typography-enforcement bypass by routing compatibility wrappers through the `Text` primitive and tightening lint exemptions
3. make `Text` context produce real styling differences instead of acting as a no-op lookup key

The finished change should preserve the current client-side SPA architecture, `PUBLIC_URL` compatibility, feature-gated blog behavior, and existing public imports from `src/components/text` while eliminating the concrete defects called out in review.

## Why

The current branch introduced the right abstractions (`Text`, text roles, tone, context, lint guidance), but three follow-up gaps keep the system from being trustworthy:

- `BlogArticleBody` preserves semantic heading levels but collapses h3 and h4 onto the same visual treatment.
- raw `Typography` is still indirectly reachable through exported wrapper components plus a directory-wide lint exemption.
- `context` is part of the public `Text` API and the style-map key space, but it does not currently change any resolved `variant` or `sx`.

These are small enough to fix in a focused follow-up, but they are cross-cutting enough that they need an ExecPlan rather than ad hoc edits.

## Constraints

- Preserve the current SPA routing model, direct-link behavior, and `PUBLIC_URL`-safe asset handling.
- Preserve blog feature gating and existing blog/editorial component structure.
- Keep changes narrowly scoped to text roles, text wrappers, lint policy, blog article rendering, and the relevant unit/browser validation.
- Do not broaden this follow-up into a full repo-wide wrapper-removal migration.
- Keep existing exports from `src/components/text/index.ts` available in this pass for compatibility, but ensure those exports no longer bypass the `Text` system internally.
- Preserve `UnsafeTypography` as the explicit escape hatch for sanctioned exceptions.
- Preserve existing public props for wrapper components unless a change is required for correctness.
- Avoid unrelated theme-scale changes or additional redesign work outside the three findings.

## Affected files and responsibilities

- `src/types/text.ts` — add the missing prose heading role for h4 and keep the role/context contract authoritative.
- `src/styles/textStyleBuilders.ts` — define the distinct h4 prose typeset and add context-specific adjustments so `ui`, `prose`, and `overlay` do not resolve identically.
- `src/components/text/Text.tsx` — map the new h4 prose role to its semantic default element and keep `context` flowing into the resolver.
- `src/components/text/TypographyPrimitives.tsx` — convert legacy block wrappers from raw `Typography` renders into thin compatibility adapters over `Text` plus existing non-typographic style fragments.
- `src/components/text/InlineLabelPrimitives.tsx` — convert inline-label wrappers to `Text`-backed span adapters so they stop requiring direct `Typography` imports.
- `src/components/text/index.ts` — keep compatibility exports, but ensure the barrel points at wrappers that are now `Text`-backed rather than raw-`Typography` backed.
- `src/components/text/UNSAFE_Typography.tsx` — remain the only sanctioned raw `Typography` escape hatch besides the internal `Text` renderer.
- `src/components/blog/BlogArticleBody.tsx` — map level 2/3/4 headings onto distinct prose roles without changing semantic heading tags or anchor behavior.
- `package.json` — narrow `no-restricted-imports` overrides from the whole text tree to only the files that still must import raw `Typography` after wrapper conversion.
- `test/unit/components/blog/BlogArticleBody.test.tsx` — add h4 coverage and assert the hierarchy no longer collapses.
- `test/unit/components/text/Text.test.tsx` — add assertions that context changes resolved output and that the new prose heading role resolves correctly.
- `test/unit/components/text/TypographyPrimitives.test.tsx` — update compatibility-wrapper tests to reflect `Text`-backed behavior.
- `test/unit/components/text/InlineLabelPrimitives.test.tsx` — update span-wrapper tests to reflect `Text`-backed behavior.

## Proposed approach

Use the smallest change set that fixes the root cause of each review issue while keeping the current branch architecture intact.

### Decision 1: Add a dedicated prose role for h4

Implement a third prose-heading role dedicated to level-4 article headings. Recommended name: `proseMinorHeading`.

Role mapping after the change:

- h2 -> `proseHeading`
- h3 -> `proseSubheading`
- h4 -> `proseMinorHeading`

This is safer than removing h4 support from the blog content model and narrower than introducing a general heading-schema system.

### Decision 2: Keep wrapper exports for compatibility, but stop them from bypassing `Text`

Do not attempt a full repo-wide migration away from `BodyText`, `EntryTitle`, `HeaderTitle`, `NavigationLabel`, and similar wrappers in this follow-up. There are broad existing consumers across pages, CV components, layout, and shared UI.

Instead:

- rewrite those wrappers to delegate to `Text`
- keep their public props and semantic behavior stable where possible
- preserve wrapper exports from `src/components/text/index.ts`
- narrow lint exemptions so only the internal `Text` renderer and `UNSAFE_Typography` still need raw `Typography`

This removes the actual enforcement bypass without turning the review fix into a repo-wide migration.

### Decision 3: Make `context` meaningful through targeted style deltas, not a public API redesign

Do not remove or rename `context`. Make it real inside `createTextStyleMap()`.

Implement context-specific adjustments through a small internal helper in `src/styles/textStyleBuilders.ts` that applies role-aware overrides before the final `Typeset` is stored.

Recommended minimum behavior for this pass:

- `overlay` context changes at least the roles already used in photography overlays: `cardTitle`, `body`, and `caption`
- `prose` context changes at least one shared role family (`body` and/or `caption`) so it no longer resolves identically to `ui`
- dedicated prose roles (`proseParagraph`, `proseHeading`, `proseSubheading`, `proseMinorHeading`, `proseCaption`, `proseQuote`) keep their role-driven base identity and do not need redundant context-specific remapping

This keeps the change small, satisfies the review issue, and improves the currently active photography call sites that already pass `context="overlay"`.

## Execution steps

1. Update `src/types/text.ts` to add `proseMinorHeading` to the prose-role union and keep `TextContext` unchanged.
2. Update `src/styles/textStyleBuilders.ts` to add a distinct typeset for `proseMinorHeading` and make `overlay` and `prose` contexts return output that differs from `ui` for at least the targeted roles used today.
3. Update `src/components/text/Text.tsx` so the new role defaults to `h4` and continues resolving through `resolveTypeset(role, tone, context)`.
4. Update `src/components/blog/BlogArticleBody.tsx` so heading levels map as level 2 -> `proseHeading`, level 3 -> `proseSubheading`, and level 4 -> `proseMinorHeading`.
5. Refactor `src/components/text/TypographyPrimitives.tsx` so each exported wrapper renders `Text` with the correct canonical role and then layers on any existing non-typographic style fragments.
6. Refactor `src/components/text/InlineLabelPrimitives.tsx` so inline-label wrappers render through `Text` with `component="span"` and the appropriate label role/tone/context combination.
7. Narrow the `package.json` lint override from `src/components/text/**/*.ts(x)` to the smallest remaining allowlist after wrapper conversion.
8. Extend the focused unit tests for blog and text rendering to cover the new role and non-no-op context behavior.
9. Run focused build, unit, and route validation on blog and photography.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/blog/BlogArticleBody.test.tsx test/unit/components/text/Text.test.tsx test/unit/components/text/TypographyPrimitives.test.tsx test/unit/components/text/InlineLabelPrimitives.test.tsx`
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts test/e2e/photography.spec.ts`
- Browser validation on a blog post route and photography overlay flow at mobile and desktop widths

## Risks and rollback

- Wrapper-to-`Text` delegation could subtly change spacing, inherited display mode, or DOM semantics for heavily used components.
- Narrowing the lint override may expose a text-layer file that still imports raw `Typography` unexpectedly.
- Overlay context adjustments could change line wrapping or contrast in photography surfaces.

Rollback approach:

- If wrapper delegation causes broad regressions, revert the wrapper internals first while keeping the h4 and context fixes isolated.
- If the context delta is too visually disruptive, reduce the first pass to a smaller role subset while keeping the test coverage and helper structure in place.
- Do not roll back to the previous directory-wide lint exemption unless a concrete blocker is identified and documented.

## Progress notes

- Discovery confirmed that `BlogArticleBody` is the only place collapsing heading levels; the current tests cover h2 and h3 but not h4.
- Discovery confirmed broad wrapper usage across pages, CV components, layout, and shared UI, so a full wrapper-export removal is too wide for this follow-up.
- Discovery confirmed that current `context="overlay"` usage is concentrated in photography and that `context="prose"` is mostly unexercised today.
- Implementation has not started yet.

## Completion Status

- [x] Not started
- [ ] In progress
- [ ] Complete
