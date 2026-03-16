# Typography Token Consistency Cleanup

## Goal

Normalize the repository's typography patterns so shared text semantics live in component-level style tokens and text primitives instead of being split across app-level style builders, page-local `sx` fragments, and repeated raw `Typography` usage. After this work, route pages and shared components should rely on a clearer shared vocabulary for headings, secondary body copy, captions, and lead text without changing route behavior or the app's client-side architecture.

## Why

The current typography layer has drifted in two directions:

- `src/styles/appStyleBuilders.ts` and `src/styles/componentStyleBuilders.ts` both define overlapping text-only tokens such as `primaryTextSx` and `secondaryTextSx`.
- Several route pages and shared components still use raw `Typography` for patterns that are already shared or nearly shared, which weakens consistency and makes future visual refinements harder.

The user explicitly wants a broad consistency pass rather than a narrow fix. This plan turns the existing audit notes into an execution-ready work order that centralizes ownership of reusable text semantics, expands the primitive surface where real gaps exist, and migrates consumers in an ordered way.

## Constraints

- Preserve the current fully client-side architecture.
- Preserve SPA routing, direct-link behavior, and static-hosting compatibility with `PUBLIC_URL`.
- Do not rename routes, stable exported types, or data-model fields as part of this cleanup.
- Keep app-level style builders focused on page/layout/shell concerns rather than reusable text semantics.
- Keep component-level style builders and text primitives as the canonical home for reusable typography patterns.
- Preserve current semantic heading levels and accessible markup on pages that intentionally render `h1`, `h2`, or `h3`.
- Prefer existing primitives and patterns before adding new ones; add new primitives only for repeated semantic gaps.
- Do not force every remaining `Typography` node into a wrapper. Some intentionally specialized inline or metric-display cases may remain raw.
- Validate route-level UI changes in the browser on at least one narrow viewport and one desktop viewport.

## Affected files and responsibilities

- `src/styles/appStyleBuilders.ts`: Remove typography-only duplicates that do not belong in the app-level style map.
- `src/styles/appStyles.ts`: Continue exposing the app style map; expected to stay stable unless removed exports force a shape update.
- `src/styles/componentStyleBuilders.ts`: Keep or absorb the canonical text-only tokens and semantic text styles.
- `src/styles/componentStyles.ts`: Existing hook used by both pages and shared components to consume canonical component-level tokens.
- `src/components/text/TypographyPrimitives.tsx`: Add or refine shared text primitives that cover repeated patterns across routes and shared UI.
- `src/components/text/index.ts`: Export any new or renamed typography primitives.
- `src/pages/Photography.tsx`: Replace app-level text token usage and raw title/caption typography with shared primitives or component-level tokens.
- `src/pages/PhotographyCategory.tsx`: Normalize page-level overline, heading, secondary body copy, and count text while preserving responsive sizing and semantic headings.
- `src/pages/Home.tsx`: Normalize dialog copy where it maps cleanly to shared primitives.
- `src/pages/NotFound.tsx`: Define the shared page-heading and explanatory-copy pattern for error/not-found routes.
- `src/pages/Climbing.tsx`: Remove `sectionLeadSx` ownership drift by making `SectionLeadText` the canonical lead treatment.
- `src/components/Footer.tsx`: Remove dependency on `footerTextSx`.
- `src/components/header/HintPopover.tsx`: Replace repeated popover-title/body typography with shared primitives if the pattern justifies it.
- `src/components/GlobalCommandPalette.tsx`: Normalize reusable caption/body patterns where they fit the shared primitive surface.
- `src/components/PerformanceScorecard.tsx`: Normalize repeated caption/body/overline patterns while keeping intentionally specialized metric display cases intact.
- `src/components/RouteRecoveryPanel.tsx`: Normalize repeated subtitle/body/caption patterns where shared primitives improve consistency.
- `src/components/photography/AlbumLocationSummary.tsx`: Candidate for secondary body-copy normalization.
- `src/components/photography/ImmersiveLightbox.tsx`: Candidate for caption/body normalization with explicit white-on-dark exceptions.
- `src/components/cv/CVStoryChapterHeading.tsx`: Small typography composition component that may be simplified with shared primitives.
- `src/components/cv/CVStoryHeader.tsx`: Small secondary-caption usage to normalize.
- `src/components/cv/CVGitHubStatusTooltip.tsx`: Review for primitive fit versus intentionally local raw typography.

## Proposed approach

Use a phased migration that starts by fixing ownership, then fills genuine gaps in the primitive layer, then migrates high-value route files before moving into shared components.

The key architectural rule is:

- app styles own shells, layout, spacing, and route-scoped composition concerns
- component styles own reusable text semantics and other shared component-level tokens
- text primitives express repeated semantic patterns such as entry titles, captions, lead copy, and shared page headings

This sequence minimizes churn because the cleanup first establishes a single source of truth for text tokens, then gives consumers a stable primitive surface to migrate toward. It also avoids blindly replacing every `Typography` node; instead, the work should identify repeated patterns and only wrap those patterns that actually improve consistency and future maintainability.

## Execution steps

1. Audit and lock the canonical token ownership.
   Outcome: a confirmed list of typography-only exports that must move or disappear from `src/styles/appStyleBuilders.ts`, plus confirmation of which component-level tokens already cover those semantics.

2. Consolidate duplicated text tokens in the style builders.
   Update `src/styles/appStyleBuilders.ts` to remove exact typography-only duplicates such as `primaryTextSx`, `secondaryTextSx`, `footerTextSx`, and `sectionLeadSx` after all consumer migrations are ready. Keep the canonical equivalents in `src/styles/componentStyleBuilders.ts`.

3. Expand the text primitive surface for repeated gaps.
   In `src/components/text/TypographyPrimitives.tsx`, add the minimum new primitives needed for the repeated patterns uncovered by the audit. The current recommended additions are:

   - `Body1Text` for repeated body1 prose
   - `SecondaryBodyText` for repeated secondary-colored body copy
   - `SecondaryCaptionText` for repeated caption text using secondary color
   - `PageHeading` or an equivalent heading primitive that supports semantic `component` overrides and responsive `sx`

4. Normalize lead-text ownership.
   Refine `SectionLeadText` and its backing component-style tokens so it fully owns the bold secondary lead pattern currently split between the primitive and `appStyles.sectionLeadSx`. Then remove the extra `sx` layering in `src/pages/Climbing.tsx`.

5. Migrate the first-pass route pages.
   Update the highest-value route files in this order:

   - `src/pages/Photography.tsx`
   - `src/pages/PhotographyCategory.tsx`
   - `src/pages/Home.tsx`
   - `src/pages/NotFound.tsx`
   - `src/pages/Climbing.tsx`

   For each file, replace app-level text-token usage and raw `Typography` where the pattern maps cleanly to an existing or newly added primitive. Preserve heading levels, text hierarchy, responsive font sizing, and local spacing behavior.

6. Migrate the priority shared components.
   Update shared components that repeat the same typography patterns across the app:

   - `src/components/Footer.tsx`
   - `src/components/header/HintPopover.tsx`
   - `src/components/GlobalCommandPalette.tsx`
   - `src/components/PerformanceScorecard.tsx`
   - `src/components/RouteRecoveryPanel.tsx`
   - `src/components/photography/AlbumLocationSummary.tsx`
   - `src/components/photography/ImmersiveLightbox.tsx`
   - `src/components/cv/CVStoryChapterHeading.tsx`
   - `src/components/cv/CVStoryHeader.tsx`
   - `src/components/cv/CVGitHubStatusTooltip.tsx`

   Keep intentionally specialized inline cases raw when wrapping would reduce clarity.

7. Perform a final exception sweep.
   Run repo-wide searches for removed app-style typography tokens and for raw `<Typography` usage. For each remaining raw `Typography` node, classify it as one of:

   - intentionally raw and semantically local
   - migrated to a shared primitive
   - evidence that one more shared primitive is still needed

8. Update the plan progress notes with any implementation discoveries.
   If the primitive surface changes materially, record the new canonical ownership rule and any deliberate exceptions before finishing.

## File-by-file work order

### Phase 1: Ownership and token consolidation

- `src/styles/componentStyleBuilders.ts`

  - Confirm canonical definitions for `primaryTextSx`, `secondaryTextSx`, and the bold secondary lead treatment.
  - Decide whether `secondaryStrongSx` should fully back `SectionLeadText` or whether a distinct lead token is warranted.
  - Ensure any canonical token used by primitives is defined here rather than in app styles.

- `src/styles/appStyleBuilders.ts`

  - Remove `primaryTextSx` and `secondaryTextSx` once route/component consumers are migrated.
  - Remove `footerTextSx` because it duplicates secondary body text semantics.
  - Remove `sectionLeadSx` after `SectionLeadText` fully owns that semantic role.
  - Check for any additional text-only aliases that are purely duplicative and migrate them out of the app map.

- `src/styles/appStyles.ts`
  - Verify the resulting hook shape remains valid after removing app-style exports.
  - Adjust any inferred type expectations only if necessary.

### Phase 2: Primitive expansion

- `src/components/text/TypographyPrimitives.tsx`

  - Add `Body1Text`.
  - Add `SecondaryBodyText`.
  - Add `SecondaryCaptionText`.
  - Add a shared page-heading primitive that accepts semantic `component` overrides and responsive `sx` overrides.
  - Refine `SectionLeadText` so it directly expresses the bold secondary lead pattern used in climbing and related route intros.
  - Reuse existing `SectionLabel`, `EntryTitle`, `BodyText`, and `CaptionText` where they already fit; avoid creating near-duplicates.

- `src/components/text/index.ts`
  - Export all added primitives.
  - Keep the exported surface grouped clearly with the existing text primitives.

### Phase 3: Route migration

- `src/pages/Photography.tsx`

  - Replace `appStyles.secondaryTextSx` usage on album counts, descriptions, and photo counts with shared primitives or component-level tokens.
  - Replace the raw `Typography` card title with `EntryTitle` or another canonical title primitive.
  - Replace secondary caption metadata with `SecondaryCaptionText` if added.

- `src/pages/PhotographyCategory.tsx`

  - Replace app-level secondary text token usage with shared primitives or component styles.
  - Migrate the album overline to an existing shared label primitive if it fits.
  - Migrate the album page heading and missing-album heading to the shared page-heading primitive while preserving semantic components and responsive sizes.
  - Migrate secondary descriptive copy and count text to the new shared body/caption primitives.

- `src/pages/Home.tsx`

  - Replace dialog body copy with `Body1Text` if added.
  - Review the error caption; keep it raw if the error-color semantic remains too specific for a shared primitive.

- `src/pages/NotFound.tsx`

  - Use the shared page-heading primitive for the main heading while preserving the intended heading level.
  - Migrate explanatory body copy and caption copy to shared primitives.
  - Preserve spacing, opacity, and block-display behavior through `sx` composition.

- `src/pages/Climbing.tsx`
  - Remove `appStyles.sectionLeadSx` usage.
  - Let `SectionLeadText` and the component-style token define the canonical visual treatment.

### Phase 4: Shared component migration

- `src/components/Footer.tsx`

  - Replace `appStyles.footerTextSx` with a shared primitive or component-level text token.

- `src/components/header/HintPopover.tsx`

  - Replace the title and body typography with shared primitives if the pattern is now covered.
  - If only the body maps cleanly, keep the title raw or introduce a very small shared subtitle primitive only if the same pattern repeats elsewhere.

- `src/components/GlobalCommandPalette.tsx`

  - Normalize repeated caption/body copy where the semantics match the primitive surface.
  - Keep command/result-specific inline uses raw if wrapping adds indirection without reuse.

- `src/components/PerformanceScorecard.tsx`

  - Normalize repeated body/caption/overline uses where they are semantically shared.
  - Leave metric-value typography and inline `span` variants raw unless a clear reusable pattern emerges.

- `src/components/RouteRecoveryPanel.tsx`

  - Normalize repeated subtitle/body/caption patterns if the new primitives improve consistency without reducing readability.

- `src/components/photography/AlbumLocationSummary.tsx`

  - Replace repeated secondary body copy with `SecondaryBodyText` or the equivalent shared primitive.

- `src/components/photography/ImmersiveLightbox.tsx`

  - Normalize body/caption patterns where they remain semantically reusable.
  - Preserve explicit white-on-dark color treatment through `sx` overrides or a narrow primitive extension only if reuse is real.

- `src/components/cv/CVStoryChapterHeading.tsx`

  - Review whether this small composition component can directly use the shared overline, title, and body primitives without losing semantics.

- `src/components/cv/CVStoryHeader.tsx`

  - Normalize the repeated secondary caption pattern if it now maps to `SecondaryCaptionText`.

- `src/components/cv/CVGitHubStatusTooltip.tsx`
  - Migrate only if the tooltip text matches existing semantic primitives.
  - Leave raw typography intact if this remains a specific tooltip composition with little reuse value.

### Phase 5: Final repo sweep

- Whole repo
  - Search for `appStyles.primaryTextSx`.
  - Search for `appStyles.secondaryTextSx`.
  - Search for `appStyles.footerTextSx`.
  - Search for `appStyles.sectionLeadSx`.
  - Search for raw `<Typography` usage.
  - Document intentional exceptions and any remaining primitive gap.

## Validation plan

- Run `npm run build` after Phase 1 token consolidation.
- Run `npm run build` again after the final migration pass.
- Browser-validate the affected routes after route migration:
  - `/`
  - `/photography`
  - `/photography/:slug`
  - an unknown route that resolves to the not-found page
- Check one narrow/mobile viewport and one desktop viewport for each affected route.
- Confirm semantic heading levels remain correct on the photography category page and the not-found page.
- Confirm responsive heading sizes and secondary-copy spacing remain visually stable after primitive migration.
- If the branch's Playwright coverage is present and stable, run the narrowest relevant route specs after a build:
  - photography route coverage
  - not-found route coverage
- Finish with repo-wide searches for removed app-style typography tokens and remaining raw `Typography` nodes.

## Risks and rollback

- Risk: removing app-style text tokens breaks remaining consumers.

  - Mitigation: migrate known consumers before deleting exports and finish with repo-wide searches.

- Risk: newly introduced primitives are too narrow or too generic.

  - Mitigation: add only patterns that repeat across files, and keep intentionally local typography raw.

- Risk: semantic heading levels drift during page-heading normalization.

  - Mitigation: require explicit `component` handling in the page-heading primitive and verify headings during browser checks.

- Risk: responsive typography shifts subtly on photography and not-found routes.

  - Mitigation: preserve current `sx` sizing values through primitive composition rather than flattening them.

- Risk: route-level copy spacing or opacity changes because wrappers alter default margins or display behavior.

  - Mitigation: preserve all route-local `sx` overrides and validate visually on both mobile and desktop.

- Risk: forcing raw `Typography` into wrappers creates unnecessary indirection.

  - Mitigation: allow explicit exceptions for inline spans, metric values, and highly localized compositions.

- Rollback approach:
  - Keep the migration phased and commit-sized in implementation.
  - If a primitive causes layout drift, revert that consumer to raw `Typography` temporarily and refine the primitive before continuing.
  - If token ownership changes prove too disruptive, retain a temporary compatibility layer in component styles rather than reintroducing duplicates into app styles.

## Progress notes

- 2026-03-15: Initial audit confirmed that `primaryTextSx`, `secondaryTextSx`, `footerTextSx`, and `sectionLeadSx` remain duplicated or redundant across style layers.
- 2026-03-15: The original notes about raw `Typography` were partly stale; some locations were already migrated, but the broader route and shared-component cleanup remains valid.
- 2026-03-15: This ExecPlan intentionally broadens scope to a repo-wide design-pattern consistency pass, per user direction.
- Update this section during implementation with any newly added primitives, any deliberate raw-`Typography` exceptions, and any validation deviations.

## Completion Status

- [ ] Not started
- [ ] In progress
- [ ] Complete
