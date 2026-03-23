# Type Safety Escapes In Text Primitives

## Goal

Remove the current `as unknown as` type escapes from the shared text primitives and `AnimatedSlideList` so the text and transition layers express their real contracts in TypeScript without changing runtime behavior.

## Why

The current text wrappers and animated slide list compile by bypassing the type system in five places:

- `src/components/text/TypographyPrimitives.tsx` casts forwarded props through `unknown`
- `src/components/text/InlineLabelPrimitives.tsx` repeats the same pattern three times
- `src/components/AnimatedSlideList.tsx` casts `Slide` so `nodeRef` can be passed

These casts defeat static verification in widely reused render paths, which makes regressions harder to catch and obscures the real component boundaries.

## Constraints

- Preserve existing public imports from `src/components/text`.
- Preserve current runtime semantics for wrapper components, including semantic element overrides, `color` compatibility, and ARIA/DOM prop passthrough.
- Keep the app client-side and preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep the change narrowly scoped to text-primitive typing, the `AnimatedSlideList` Slide typing, and focused regression coverage.
- Do not broaden this work into repo-wide wrapper removal, theme changes, or a broader text-system redesign.

## Affected files and responsibilities

- `src/components/text/Text.tsx` — canonical text primitive; source of truth for forwarded prop typing.
- `src/components/text/TypographyPrimitives.tsx` — shared block-level compatibility wrappers that currently cast forwarded props.
- `src/components/text/InlineLabelPrimitives.tsx` — shared span-based compatibility wrappers that currently cast forwarded props.
- `src/types/text.ts` — candidate home for any shared text-prop helper types if they are reused across files.
- `src/theme/mui.d.ts` — MUI module augmentation point for `SlideProps.nodeRef`.
- `src/components/AnimatedSlideList.tsx` — remove the local `SlideWithNodeRef` cast and rely on augmented typing.
- `test/unit/components/text/Text.test.tsx` — direct `Text` passthrough contract coverage.
- `test/unit/components/text/TypographyPrimitives.test.tsx` — compatibility-wrapper passthrough coverage.
- `test/unit/components/text/InlineLabelPrimitives.test.tsx` — inline-wrapper passthrough coverage.
- `test/unit/components/AnimatedSlideList.test.tsx` — verify `nodeRef` reaches `Slide`.

## Proposed approach

1. Make `Text` own an honest pass-through prop surface derived from MUI `TypographyProps`, while reserving the semantic `role` prop for the text-system role union and constraining `component` to `TextElement`.
2. Rebuild the wrapper prop types from that `Text` contract plus the legacy `color` compatibility prop so wrapper implementations can spread props directly without `unknown` bridges.
3. Add a narrow MUI module augmentation for `SlideProps.nodeRef` and remove the local `SlideWithNodeRef` alias.
4. Lock the new contracts in with focused unit tests instead of relying on compile-time silence from casts.

## Execution steps

1. Update `Text` prop typing in `src/components/text/Text.tsx`, introducing shared helper types in `src/types/text.ts` only if reuse requires it.
2. Refactor `src/components/text/TypographyPrimitives.tsx` to derive wrapper props from `Text` and remove the `ForwardedTextProps` escape.
3. Refactor `src/components/text/InlineLabelPrimitives.tsx` to derive wrapper props from `Text` and remove the three `ForwardedInlineTextProps` escapes.
4. Extend `src/theme/mui.d.ts` with `SlideProps.nodeRef` and simplify `src/components/AnimatedSlideList.tsx` to use `Slide` directly.
5. Update focused unit tests for `Text`, text wrappers, and `AnimatedSlideList`.
6. Run focused validation, then `npm run build`.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/text/Text.test.tsx test/unit/components/text/TypographyPrimitives.test.tsx test/unit/components/text/InlineLabelPrimitives.test.tsx test/unit/components/AnimatedSlideList.test.tsx`
- `npm run build`

## Risks and rollback

- Widening `Text` props too far could accidentally reintroduce styling escape hatches that the text system is meant to own.
- Tightening wrapper prop types incorrectly could break existing consumers that rely on ARIA or DOM passthrough.
- Changing `AnimatedSlideList` typing must not change node-ref behavior at runtime.

Rollback approach:

- If wrapper typing changes destabilize consumers, revert the wrapper/type files first while keeping the plan and test additions for reference.
- If the MUI augmentation proves incompatible, fall back to a small local typed wrapper component for `Slide` without reintroducing `unknown` casts.

## Progress notes

- The blog h4/context/lint follow-up plan already appears implemented in the current workspace; this task is now scoped strictly to the remaining type-safety escapes.
- `Text` already backs the compatibility wrappers at runtime; the remaining issue is that the wrapper props are still modelled more broadly than `Text` can safely express.
- `SlideProps` in the installed MUI package is declared as an interface, so module augmentation is viable for `nodeRef`.
- Implemented a shared `TextPassthroughProps` type in `src/types/text.ts` for safe DOM, ARIA, data, and selected layout prop forwarding without re-exposing the full MUI Typography styling surface.
- Removed the `unknown` prop bridges from `src/components/text/TypographyPrimitives.tsx` and `src/components/text/InlineLabelPrimitives.tsx` by deriving wrapper props from `TextProps` plus the legacy compatibility `color` prop.
- Added `SlideProps.nodeRef` augmentation in `src/theme/mui.d.ts` and deleted the local `SlideWithNodeRef` cast from `src/components/AnimatedSlideList.tsx`.
- Focused unit validation passed for `Text`, typography wrappers, inline label wrappers, and `AnimatedSlideList` (76 tests total). Production build compiled successfully.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
