# Photography Overlay Text Alignment

## Goal

Keep the repeated photography overlay title, description, metadata, and caption copy on the shared global text primitives while preserving the current white-on-image presentation.

## Why

The staged overlay text change introduced a photography-local text primitive file and matching style-map entries. That conflicts with the repository guidance to start from the shared semantic text primitives before introducing a subsystem-local abstraction.

## Constraints

- Do not keep a text primitive file inside `src/components/photography/`.
- Preserve the documented photography exception: the overlays can keep their bespoke white-on-image visual language.
- Preserve existing route behavior, semantics, and responsive layout on `/photography` and `/photography/:slug`.
- Keep the change narrowly scoped to the overlay text consumers, their docs, and the tests directly affected by the removed local primitive layer.

## Affected files and responsibilities

- `src/components/photography/AlbumCard.tsx`: keep the overlay title/body/meta/count on shared text primitives.
- `src/components/photography/AlbumLocationSummary.tsx`: render overlay metadata with shared text primitives plus overlay-specific `sx`.
- `src/components/photography/ImmersiveLightbox.tsx`: replace raw/local overlay wrappers with shared title/body primitives.
- `src/pages/PhotographyCategory.tsx`: use shared title/body/caption primitives for the album hero overlay.
- `src/styles/componentStyleBuilders.ts`: remove overlay text style entries that only existed for the deleted local primitive file.
- `docs/design-system-reference.md`: document the corrected guidance for photography overlay copy.
- `test/unit/components/photography/PhotoTextPrimitives.test.tsx`: remove obsolete coverage for the deleted local primitive layer.

## Proposed approach

Reuse `EntryTitle`, `SecondaryBodyText`, and `SecondaryCaptionText` in the photography overlay consumers, then preserve the white-on-image treatment through local `sx` overrides where needed. Remove `PhotoTextPrimitives.tsx` and the dedicated component-style keys that existed only to support it.

## Execution steps

1. Remove the photography-local primitive file and its dedicated style-map entries.
2. Repoint the overlay consumers to the shared text primitives while preserving the current overlay contrast and responsive sizing.
3. Correct the design-system reference and remove tests that only cover the deleted local abstraction.
4. Run focused photography validation and keep the ExecPlan in sync with the corrected implementation.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/photography/AlbumCard.test.tsx test/unit/components/photography/AlbumLocationSummary.test.tsx test/unit/components/photography/ImmersiveLightbox.test.tsx`
- `npm run build`
- browser validation on `/photography` and `/photography/landscape` at desktop and mobile widths

## Risks and rollback

- Risk: accidentally changing the overlay hierarchy or heading semantics while swapping primitives.
- Risk: shifting contrast if the white/opacity overrides drift from the current overlay presentation.
- Rollback: restore the previous overlay text usage in the four consumers and defer the cleanup rather than reintroducing a photography-local primitive layer.

## Progress notes

- 2026-03-18: Audited the staged diff and confirmed it introduced a photography-local text primitive layer plus dedicated style-map keys.
- 2026-03-18: Revised the plan to keep photography overlays on the shared text primitives with local overlay-specific `sx` overrides instead.
- 2026-03-18: Removed `src/components/photography/PhotoTextPrimitives.tsx`, rewired the overlay consumers back to `EntryTitle`, `SecondaryBodyText`, and `SecondaryCaptionText`, and dropped the obsolete dedicated test file.
- 2026-03-18: Validation completed: the targeted photography Jest suites passed, `npm run build` compiled successfully, and browser validation passed on `/photography` and `/photography/landscape` at desktop and mobile widths.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
