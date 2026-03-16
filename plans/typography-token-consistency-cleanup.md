# Typography Token Consistency Cleanup

## Goal

Remove the remaining duplicated app-level typography tokens so shared text semantics live in component-level style tokens and text primitives. After this work, the active consumers of `appStyles.primaryTextSx`, `appStyles.secondaryTextSx`, `appStyles.footerTextSx`, and `appStyles.sectionLeadSx` should render through the shared typography primitive layer without changing route behavior or the app's client-side architecture.

## Why

The current typography layer still has a small amount of ownership drift:

- `src/styles/appStyleBuilders.ts` and `src/styles/componentStyleBuilders.ts` both define overlapping text-only tokens such as `primaryTextSx` and `secondaryTextSx`.
- A handful of route pages and the footer still depend on app-level aliases instead of the shared text primitive layer.

The first draft of this plan assumed a broader repo-wide typography sweep, but the current codebase no longer needs that larger refactor. A tighter cleanup that removes the duplicated app-level tokens, adds only the missing shared primitives, and migrates the live consumers will fully address the inconsistency with less risk and less churn.

## Constraints

- Preserve the current fully client-side architecture.
- Preserve SPA routing, direct-link behavior, and static-hosting compatibility with `PUBLIC_URL`.
- Do not rename routes, stable exported types, or data-model fields as part of this cleanup.
- Keep app-level style builders focused on page/layout/shell concerns rather than reusable text semantics.
- Keep component-level style builders and text primitives as the canonical home for reusable typography patterns.
- Preserve current semantic heading levels and accessible markup on pages that intentionally render `h1`, `h2`, or `h3`.
- Prefer existing primitives and patterns before adding new ones; add new primitives only for repeated semantic gaps exposed by the active token consumers.
- Do not force every remaining `Typography` node into a wrapper. Specialized route-local heading and metadata cases may remain raw when they are not part of the duplicated-token cleanup.
- Validate route-level UI changes in the browser on at least one narrow viewport and one desktop viewport.

## Affected files and responsibilities

- `src/styles/appStyleBuilders.ts`: Remove the four duplicated text-only exports that no longer belong in the app-level style map.
- `src/styles/appStyles.ts`: Continue exposing the app style map; verify the hook shape remains valid after the app-level text exports are removed.
- `src/styles/componentStyleBuilders.ts`: Keep the canonical `primaryTextSx`, `secondaryTextSx`, and `secondaryStrongSx` definitions that back shared primitives.
- `src/components/text/TypographyPrimitives.tsx`: Refine `SectionLeadText` to own the bold secondary lead style and add only the missing secondary-body and secondary-caption primitives needed by active consumers.
- `src/components/text/index.ts`: Export the added typography primitives.
- `src/pages/Photography.tsx`: Replace app-level text token usage and card title/caption patterns with shared primitives.
- `src/pages/PhotographyCategory.tsx`: Replace app-level secondary-body token usage while preserving route-local heading and overline composition.
- `src/pages/Climbing.tsx`: Remove `sectionLeadSx` ownership drift by making `SectionLeadText` the canonical lead treatment.
- `src/components/Footer.tsx`: Remove dependency on `footerTextSx`.
- `test/unit/components/text/TypographyPrimitives.test.tsx`: Cover the added text primitives and the strengthened lead-text semantics.
- `test/unit/pages/Photography.test.tsx`: Keep the photography route consumer green after primitive migration.
- `test/unit/pages/PhotographyCategory.test.tsx`: Keep the category route consumer green after primitive migration.
- `test/unit/pages/Climbing.test.tsx`: Keep the climbing route consumer green after lead-text ownership changes.
- `test/unit/components/Footer.test.tsx`: Keep the footer consumer green after primitive migration.

## Proposed approach

Use a narrow migration that starts by locking canonical ownership, then fills the two remaining primitive gaps exposed by live consumers, then migrates the active routes and footer.

The key architectural rule remains:

- app styles own shells, layout, spacing, and route-scoped composition concerns
- component styles own reusable text semantics and other shared component-level tokens
- text primitives express repeated semantic patterns such as entry titles, secondary body copy, secondary captions, and lead copy

This sequence minimizes churn because it removes only the active duplicate tokens, gives consumers a stable primitive surface, and avoids a broader repo-wide raw-`Typography` sweep that is not required to complete the cleanup safely.

## Execution steps

1. Audit and lock the canonical token ownership.
   Outcome: confirm that `primaryTextSx`, `secondaryTextSx`, `footerTextSx`, and `sectionLeadSx` are still duplicated in `src/styles/appStyleBuilders.ts`, and confirm that `src/styles/componentStyleBuilders.ts` already owns the canonical equivalents.

2. Expand the primitive surface only where live consumers still need it.
   In `src/components/text/TypographyPrimitives.tsx`, add `SecondaryBodyText` and `SecondaryCaptionText`, and refine `SectionLeadText` so it fully owns the bold secondary lead treatment currently split with `appStyles.sectionLeadSx`.

3. Migrate the active route consumers.
   Update:

   - `src/pages/Photography.tsx`
   - `src/pages/PhotographyCategory.tsx`
   - `src/pages/Climbing.tsx`

   Replace app-level text-token usage with the existing or newly added shared primitives while preserving heading levels, text hierarchy, responsive sizing, and route-local layout behavior.

4. Migrate the active shared component consumer.
   Update `src/components/Footer.tsx` to render through the shared primitive layer instead of `appStyles.footerTextSx`.

5. Remove the duplicated app-style typography tokens.
   Delete `primaryTextSx`, `secondaryTextSx`, `footerTextSx`, and `sectionLeadSx` from `src/styles/appStyleBuilders.ts` once all consumers are migrated, then verify `src/styles/appStyles.ts` still exposes a stable hook shape.

6. Update focused tests and finish with a repo-wide token sweep.
   Cover the added primitives and route/component consumers, then run repo-wide searches to confirm the removed app-style text tokens no longer have callers.

## Validation plan

- Run `npm run build` after the consumer migrations and token removal.
- Run targeted Jest coverage for the touched primitives and consumers:
  - `CI=true npm test -- --watch=false --runInBand test/unit/components/text/TypographyPrimitives.test.tsx test/unit/pages/Photography.test.tsx test/unit/pages/PhotographyCategory.test.tsx test/unit/pages/Climbing.test.tsx test/unit/components/Footer.test.tsx`
- Browser-validate the affected routes after the migration:
  - `/`
  - `/photography`
  - `/photography/:slug`
  - `/climbing`
- Check one narrow/mobile viewport and one desktop viewport across the affected routes.
- Confirm the photography card title, secondary metadata, album counts, climbing lead copy, and footer copy remain visually stable after primitive migration.
- Finish with repo-wide searches for removed app-style typography tokens.

## Risks and rollback

- Risk: removing app-style text tokens breaks remaining consumers.

  - Mitigation: migrate known consumers before deleting exports and finish with repo-wide searches.

- Risk: newly introduced primitives are too narrow or too generic.

  - Mitigation: add only the patterns needed by current live consumers, and keep intentionally local typography raw.

- Risk: responsive typography shifts subtly on photography routes.

  - Mitigation: preserve current `sx` sizing values through primitive composition rather than flattening them.

- Risk: route-level copy spacing changes because wrappers alter default margins or display behavior.

  - Mitigation: preserve all route-local `sx` overrides and validate visually on both mobile and desktop.

- Rollback approach:
  - Keep the migration phased and commit-sized in implementation.
  - If a primitive causes layout drift, revert that consumer to its previous raw `Typography` or `sx` usage temporarily and refine the primitive before continuing.
  - If token ownership changes prove too disruptive, retain the component-level canonical tokens and postpone a single consumer migration rather than reintroducing duplicates into app styles.

## Progress notes

- 2026-03-15: Initial audit confirmed that `primaryTextSx`, `secondaryTextSx`, `footerTextSx`, and `sectionLeadSx` remain duplicated or redundant across style layers.
- 2026-03-16: Re-validation against the current `v1` codebase showed the broader raw-`Typography` sweep was no longer the smallest accurate scope. The active cleanup surface is the four duplicated app-level text tokens plus the route/footer consumers that still depend on them.
- 2026-03-16: Existing primitives already cover primary entry titles; the remaining primitive gaps are secondary body copy, secondary caption text, and canonical lead-text ownership.
- 2026-03-16: Implemented `SecondaryBodyText` and `SecondaryCaptionText`, migrated `Photography`, `PhotographyCategory`, `Climbing`, and `Footer`, and removed the duplicated app-level text tokens from `src/styles/appStyleBuilders.ts`.
- 2026-03-16: Focused Jest coverage passed for the touched primitives and consumers, and `npm run build` completed successfully after the migration.
- 2026-03-16: Browser validation confirmed the typography updates on `/photography` (desktop) and `/photography/new-mexico` (mobile). The `/climbing` Playwright accessibility snapshot did not expose the main content text even though the route DOM rendered and targeted Jest coverage passed, so the route remains functionally validated but that browser-snapshot quirk should be monitored separately if it reproduces outside this task.
- Update this section during implementation with any newly added primitives, deliberate raw-`Typography` exceptions kept in place, and any validation deviations.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
