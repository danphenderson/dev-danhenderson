# v1 design system redesign execution plan

## Goal

Redesign the `v1` branch design system so the shared visual language is enforceable in code, not just documented in prose: standard UI copy should flow through a single typed text API, typography-heavy surfaces should use shared compositions instead of local `Typography` styling, blog and photography should stop being design-system exceptions, and the remaining exceptions should be explicit, lint-gated, and auditable.

This work should land as a PR onto `v1` without breaking the app’s client-side SPA routing, `PUBLIC_URL` compatibility, feature-gated blog behavior, motion intensity scaling, or existing content/data ownership.

## Why

The current branch is layered, but it is not yet governable enough to support a durable redesign. The approved target state is materially stricter than the current implementation. The gap is not theoretical; it is visible in both the code and the docs.

### Current-state gap audit against the approved target

| Area | Current baseline on `v1` | Why it misses the approved target | Primary files |
| --- | --- | --- | --- |
| Governance | Repository docs and instructions still classify blog editorial surfaces and photography overlays as intentional design-system exceptions. | The approved redesign explicitly removes those exceptions and requires them to become first-class design-system contexts/compositions. | `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/design-system-reference.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/component-architecture.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/theme-and-styling.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/engineering/agent-guide.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/AGENTS.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AGENTS.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/AGENTS.md` |
| Primitive architecture | Semantic text primitives are thin wrappers over MUI variants. `TypographyPrimitives.tsx` exposes `Omit<TypographyProps, 'variant'>`, which still leaves broad `Typography` escape hatches such as unrestricted `sx`, `component`, `color`, and other low-level props. | The approved redesign requires a single role-based primitive whose semantics are enforced by role/context/tone, not direct variant inheritance. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/TypographyPrimitives.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/InlineLabelPrimitives.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/index.ts` |
| Missing middle layer | Typography is defined in `/src/theme/createAppTheme.ts`, while `/src/styles/componentStyleBuilders.ts` adds only fragments such as `overlineSx`, `sectionTitleSx`, and `metricValueTextSx`. There is no named typeset map between tokens and primitives. | The approved redesign requires `tokens -> typesets -> Text roles -> composition primitives`. Today the system jumps almost directly from theme variants to wrappers. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyleBuilders.ts` |
| Visual hierarchy | `subtitle1` and `body1` share the same size (`1.02rem`), `MetaText` and `SubsectionTitle` are both built from `subtitle2`, `overline` tracking is inconsistent (`0.12em` in the theme vs `0.18em` in the builder), and `MetricValueText` is `body2` plus a hardcoded `fontSize: '1.5rem'`. | The approved redesign requires stronger hierarchy, better rhythm, and typeset-driven styling rather than local size fixups. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyleBuilders.ts`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/TypographyPrimitives.tsx` |
| Raw `Typography` bypasses | Raw `Typography` still appears across blog, header/settings, onboarding, error UI, and CV story mode; MUI `ListItemText` also injects typography styling through `primaryTypographyProps` and `secondaryTypographyProps`. | The approved redesign requires semantic primitives as the default authoring path and practical enforcement against bypasses. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/*.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/header/HeaderSettingsPopover.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/FirstVisitCustomizeModal.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AppErrorBoundary.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/cv/CVStoryViewer.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/GlobalCommandPalette.tsx` |
| Blog editorial surfaces | Blog pages are the largest typography-heavy surface in the app, but they currently rely on raw `Typography` with local `sx` sizing, weight, spacing, and tracking overrides across hero, article header, article body, related-posts, nav, tags, callouts, blockquotes, and cards. | The redesign specifically requires blog to become a first-class prose context rather than a bypass zone. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogHero.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleHeader.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleBody.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogPostCard.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogRelatedPosts.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleNav.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogTagFilter.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogCallout.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogBlockquote.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogCodeBlock.tsx` |
| Photography overlay surfaces | Photography already starts from shared text primitives in places, but still relies on direct `rgba(...)`, direct white/opacity styling, manual overlay gradients, and ad hoc `fontSize` overrides on shared primitives. | The redesign requires overlay text and scrims to become token-driven and context-aware instead of per-callsite overrides. | `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/AlbumCard.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/AlbumLocationSummary.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/ImmersiveLightbox.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/appStyleBuilders.ts` |
| Enforcement | ESLint currently lives only in `package.json` with `react-app` defaults. There is no `no-restricted-imports` rule for `Typography`, no allowlist boundary, no `UNSAFE_Typography`, and no typed restriction on typography-affecting `sx` passed to primitives. | The redesign requires enforcement that is automatic, reviewable, and hard to bypass accidentally. | `/home/runner/work/dev-danhenderson/dev-danhenderson/package.json`, `/home/runner/work/dev-danhenderson/dev-danhenderson/.github/workflows/*.yml` |

## Constraints

- Preserve the current client-side SPA architecture, direct-link routing behavior, and `PUBLIC_URL`-safe asset handling.
- Preserve feature-gated blog behavior through `/home/runner/work/dev-danhenderson/dev-danhenderson/src/constants/featureFlags.ts` and existing route metadata.
- Preserve the current provider nesting order and motion intensity contract documented in `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/engineering/agent-guide.md`.
- Keep content flowing from the existing TypeScript data modules; do not introduce remote content or a CMS.
- Prefer staged compatibility over a flag day: existing named text primitives may remain temporarily as wrappers while consumers migrate.
- Do not widen shared-component APIs unless the redesign genuinely needs a reusable capability.
- Keep exception scope smaller than today. The IDE hero may remain an exception; CV story mode must either migrate to `Text` or be explicitly bounded through `UNSAFE_Typography`.
- Route names, stable content schemas, and public route paths must not change.
- Use enforcement that fits the repo’s existing toolchain. ESLint is already available through Create React App; do not introduce a new linting ecosystem.
- Be explicit about CI wiring: the recent completed `CI` workflow run on `v1` failed for unrelated `npm ci` reasons, so design-system enforcement should be wired into a stable validation path or land alongside that baseline repair instead of assuming the current `ci.yml` is trustworthy.

## Affected files and responsibilities

### Documentation and policy owners

- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/design-system-reference.md`: rewrite from recommendation-heavy catalog to enforceable authoring guide.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/component-architecture.md`: remove blog/photography from “do not fix” exceptions and document the new composition boundaries.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/theme-and-styling.md`: document the new text typeset layer and styling-placement rules.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/engineering/agent-guide.md`: update repo-wide invariants and exception language.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/AGENTS.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AGENTS.md`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/AGENTS.md`: align operational instructions with the new governance model.

### Theme, token, and style-builder owners

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts`: rebalance the base scale so MUI variants stop carrying semantic meaning that should move into typesets.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/appAppearance.ts`: add any appearance-driven text/overlay tokens needed for inverse tones and scrims.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/mui.d.ts`: augment theme typings if new treatment properties are added.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyleBuilders.ts`: either host or delegate the role/context/tone typeset map; remove ad hoc text fixups.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/appStyleBuilders.ts`: centralize overlay scrims and inverse surface treatments for photography.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyles.ts`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/appStyles.ts`: expose any new builder outputs through the existing memoized hooks.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/animations.ts`: reduce default heading-text glow/breathe behavior if the redesign removes it from standard headings.

### Shared type and text-layer owners

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/types/ui.ts` (or a new low-level type file under `/home/runner/work/dev-danhenderson/dev-danhenderson/src/types/`): canonical home for `TextRole`, `TextTone`, `TextContext`, and any shared exception metadata types.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/Text.tsx` (new): canonical text primitive.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/UNSAFE_Typography.tsx` (new): explicit escape hatch with required metadata.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/TypographyPrimitives.tsx`: convert existing named primitives into thin wrappers around `Text`.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/InlineLabelPrimitives.tsx`: either rebuild on `Text` or keep narrowly scoped span wrappers with the new typeset model.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/index.ts`: export the new canonical API and compatibility wrappers.

### Composition-layer owners

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/layout/SectionHeading.tsx`: rebuild on `Text` roles rather than hardcoded wrapper names.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/ProseBody.tsx` (new, or equivalent shared composition file): shared prose composition for headings, paragraphs, lists, captions, and quotes.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/OverlayMetaBar.tsx` (new, or equivalent shared composition file): shared inverse-tone overlay composition.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleHeader.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleBody.tsx`: either become wrappers around new shared compositions or absorb them while preserving consumer import stability.

### Consumer migration owners

- Standard/shared surfaces: `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/FirstVisitCustomizeModal.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/header/HeaderSettingsPopover.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AppErrorBoundary.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/GlobalCommandPalette.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/cv/CVStoryViewer.tsx`.
- Blog/editorial surfaces: `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/*.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/Blog.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/BlogPost.tsx`.
- Photography surfaces: `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/*.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/Photography.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/PhotographyCategory.tsx`.

### Enforcement, tests, and CI owners

- `/home/runner/work/dev-danhenderson/dev-danhenderson/package.json`: move beyond the inline CRA-only eslint config if needed; add an explicit lint command if the implementation chooses to gate lint in CI.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/.eslintrc.cjs` (new, preferred) or an expanded `eslintConfig` in `package.json`: host `no-restricted-imports`, allowlists, and any file overrides.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/.github/workflows/build.yml` and/or `/home/runner/work/dev-danhenderson/dev-danhenderson/.github/workflows/tests.yml`: add enforceable lint coverage in a workflow that actually validates `v1` PRs.
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/text/*.test.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/styles/*.test.ts`, `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/blog/*.test.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/photography/*.test.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/pages/{Blog,BlogPost,Photography,PhotographyCategory}.test.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/test/e2e/{blog,photography,navigation,smoke}.spec.ts`: protect the migration.

## Proposed approach

### Target architecture

The redesign should preserve the repository’s layered architecture, but make each layer stricter and narrower:

1. **Foundation tokens**
   - Raw palette, font-family, weight, tracking, spacing, scrim, and motion inputs remain in `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/appAppearance.ts` and `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts`.
   - Add overlay-specific scalar tokens only where preset-driven variation is required; otherwise derive them in the builders from the resolved theme.

2. **Typesets**
   - Introduce a dedicated role/context/tone typeset map in `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/` (prefer `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/textStyleBuilders.ts`, or split this concern out of `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyleBuilders.ts`).
   - A typeset is the canonical owner of `fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `fontFamily`, default margins, and tone-sensitive color for a named role.
   - `Text` should consume these typesets; standard consumers should not override those properties ad hoc.

3. **Semantic text primitive**
   - Add `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/Text.tsx` as the only standard text authoring API.
   - `Text` should accept `role`, `tone`, `context`, and a tightly constrained semantic-element API. It should not expose raw MUI `variant` and should not accept unrestricted `TypographyProps`.
   - Existing wrappers (`HeaderLabel`, `EntryTitle`, `MetaText`, `BodyText`, `CaptionText`, `MetricValueText`, etc.) should remain temporarily, but only as thin wrappers over `Text`.

4. **Composition primitives**
   - Keep `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/layout/SectionHeading.tsx`, but rebuild it on `Text`.
   - Add a prose composition (`ProseBody`) so blog headings, paragraphs, lists, captions, blockquotes, and dividers stop managing font sizes and margins inline.
   - Add an overlay composition (`OverlayMetaBar`) so photography overlays stop hardcoding white text, `rgba(...)`, and gradient recipes at call sites.
   - If a shared `ArticleHeader` composition is warranted, use it; otherwise keep `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleHeader.tsx` stable and make it a wrapper over shared `Text`/prose roles.

5. **Narrowly bounded exceptions**
   - Keep the IDE hero as the primary design-system exception.
   - Audit CV story mode explicitly. If its typography can use `Text`, migrate it. If not, move any surviving raw typography to `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/UNSAFE_Typography.tsx` and document the boundary.
   - Blog and photography are no longer exception zones.

### Primitive and role migration rules

- **Keep temporarily as wrappers:** `HeaderLabel`, `HeaderTitle`, `HeaderSubtitle`, `EntryTitle`, `EntrySubtitle`, `MetaText`, `StrongMetaText`, `BodyText`, `CaptionText`, `SecondaryBodyText`, `SecondaryCaptionText`, `ListItemText`, `SectionLeadText`, `SubsectionTitle`, `MetricValueText`.
- **Reclassify instead of deleting immediately:** the current domain-shaped wrappers should map onto canonical roles such as `sectionEyebrow`, `sectionTitle`, `sectionSubtitle`, `subsectionTitle`, `cardTitle`, `cardSubtitle`, `body`, `bodyMuted`, `meta`, `metaStrong`, `caption`, `label`, `metricValue`, and `metricLabel`.
- **Inline labels:** `InteractiveLabel`, `NavigationLabel`, and `ChipLabel` can remain as semantic sugar, but they should resolve through the same label typeset rather than carrying their own styling logic.
- **Remove from the “approved default path”:** direct `Typography` imports outside the text layer; typography-affecting `sx` on text consumers; photography-local white-on-image overrides; blog-local font-size and tracking overrides for standard roles.

### Migration strategy

- Build the new typeset layer and `Text` primitive before touching consumers.
- Preserve current exports while migrating consumers to avoid a branch-wide flag day.
- Migrate the simplest non-exception shared consumers first (`HeaderSettingsPopover`, `FirstVisitCustomizeModal`, `AppErrorBoundary`, `GlobalCommandPalette`, `SectionHeading`) so the core model is exercised before blog and photography.
- Migrate blog after `ProseBody` exists; do not move block-by-block typography into individual blog components.
- Migrate photography after inverse-tone tokens and overlay composition exist; do not normalize overlays via local `sx` fixups.
- Turn lint restrictions on in stages:
  1. allowlist the existing exception and text-layer boundaries,
  2. migrate consumers,
  3. shrink the allowlist to only `Text` internals plus any explicitly approved `UNSAFE_Typography` owners.
- For repetitive straightforward replacements, use a temporary codemod or search/replace helper from `/tmp` rather than manual churn. Do not commit the helper.

## Execution steps

### Phase 1 — establish the text-typeset foundation

**Objective**

Insert the missing “typeset” layer between theme tokens and text primitives, and fix the weakest baseline hierarchy issues before consumer migration begins.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/appAppearance.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/mui.d.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyleBuilders.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/componentStyles.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/textStyleBuilders.ts` (new, preferred)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/styles/componentStyleBuilders.test.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/styles/textStyleBuilders.test.ts` (new if the builder splits out)

**Key refactors**

- Define a canonical typeset registry keyed by role/context/tone.
- Rebalance the base theme scale so it stops collapsing hierarchy (`subtitle1` vs `body1`, metadata vs subsection headings, metric values, overline tracking).
- Remove hardcoded typographic fixups from the builder layer, especially `metricValueTextSx.fontSize = '1.5rem'`.
- Decide which overlay/scrim tokens must become preset-aware inputs in `/src/theme/appAppearance.ts` versus builder-derived outputs.

**Dependencies**

- None; this phase must land before new text primitives or consumer migration.

**Risks**

- Over-correcting the base theme scale can cause subtle global drift across routes that currently rely on MUI variants indirectly.
- Splitting a new builder file without updating memoized consumers can create stale or duplicated logic.

**Acceptance criteria**

- Every canonical role needed by the approved redesign has a named typeset entry.
- Overline tracking is defined once for the shared system and reused consistently.
- Metadata, subsection titles, and metric values have distinct, intentional hierarchy without local per-consumer font-size overrides.
- Unit tests cover typeset resolution across at least light/dark mode and two appearance presets.

### Phase 2 — introduce the canonical `Text` API and bounded escape hatch

**Objective**

Replace the “many thin wrappers over variants” model with one enforceable text primitive while keeping compatibility wrappers available for staged migration.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/types/ui.ts` (or equivalent low-level shared type file)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/Text.tsx` (new)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/UNSAFE_Typography.tsx` (new)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/TypographyPrimitives.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/InlineLabelPrimitives.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/index.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/text/Text.test.tsx` (new)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/text/TypographyPrimitives.test.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/text/InlineLabelPrimitives.test.tsx`

**Key refactors**

- Define `TextRole`, `TextTone`, and `TextContext` as shared, typed inputs.
- Implement `Text` so it renders MUI `Typography` internally but resolves all typographic styling from typesets instead of variant semantics.
- Constrain allowed props: no raw `variant`, no unrestricted `TypographyProps`, and only a small, explicit semantic-element API.
- Add `UNSAFE_Typography` requiring `reason`, `owner`, and `expiresBy`, and use it only where the redesign intentionally allows an exception.
- Rebuild existing named primitives as wrappers over `Text` so existing imports keep working during migration.

**Dependencies**

- Phase 1 typesets must exist first.

**Risks**

- Over-constraining props too early can break legitimate semantic element needs (`p`, `h1`-`h4`, `li`, `span`) in existing consumers.
- A runtime-only warning is weaker than lint enforcement; if the implementation cannot lint `sx` immediately, document the temporary gap explicitly.

**Acceptance criteria**

- Shared text wrappers no longer map directly to MUI variants as their styling source.
- `Text` is the canonical authoring path exported from `/src/components/text/index.ts`.
- `UNSAFE_Typography` exists and is the only sanctioned raw-typography escape hatch.
- Unit tests cover role resolution, semantic element mapping, wrapper compatibility, and the rejection/warning path for forbidden typography-affecting overrides.

### Phase 3 — migrate shared standard surfaces before editorial/image contexts

**Objective**

Prove the new model on standard UI surfaces and remove obvious drift outside blog and photography before the two large feature migrations begin.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/layout/SectionHeading.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/FirstVisitCustomizeModal.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/header/HeaderSettingsPopover.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AppErrorBoundary.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/GlobalCommandPalette.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/cv/CVStoryViewer.tsx`
- Corresponding unit tests under `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/` and `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/pages/`

**Key refactors**

- Rebuild `SectionHeading` on `Text` roles.
- Replace onboarding/settings/error raw `Typography` usage with `Text` roles or wrapper compatibility exports.
- Remove `primaryTypographyProps` / `secondaryTypographyProps` from `GlobalCommandPalette` in favor of explicit text primitives or a composition wrapper.
- Decide whether CV story mode can migrate to `Text`; if not, route it through `UNSAFE_Typography` and record the exception boundary here instead of letting it remain accidental.

**Dependencies**

- Phases 1 and 2.

**Risks**

- Shared component changes can ripple across multiple routes quickly.
- CV story mode has its own visual language; an overly aggressive normalization pass could flatten an intentionally different experience.

**Acceptance criteria**

- Standard shared surfaces no longer import raw `Typography`.
- `SectionHeading` consumers render through the new text system without layout regressions on `/climbing`, `/photography`, `/blog`, and `/cv`.
- Any remaining CV story typography is either on `Text` or explicitly fenced through `UNSAFE_Typography`.

### Phase 4 — add composition primitives and migrate blog to prose context

**Objective**

Replace the largest design-system bypass zone with shared prose-aware compositions built on `Text`.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/ProseBody.tsx` (new, or equivalent shared composition file)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogHero.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleHeader.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleBody.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogBlockquote.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogCallout.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogArticleNav.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogPostCard.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogRelatedPosts.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogTagFilter.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogMetaChips.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/BlogCodeBlock.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/Blog.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/BlogPost.tsx`
- Existing blog unit tests under `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/components/blog/`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/pages/Blog.test.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/unit/pages/BlogPost.test.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/test/e2e/blog.spec.ts`

**Key refactors**

- Introduce prose-specific roles or `context="prose"` handling inside `Text`.
- Make `BlogArticleBody` render prose blocks through `ProseBody` instead of per-block font-size/line-height overrides.
- Move article headers, hero eyebrow/title/subtitle, nav labels, cards, tags, and related-post typography onto `Text` roles.
- Keep code blocks and chips as visual exceptions only where structurally necessary, but have them compose the shared text typesets instead of inventing their own scale.

**Dependencies**

- Phases 1–3. Prose composition must exist before the article body migration.

**Risks**

- The blog is typography-dominant; small changes will be very visible.
- If prose context is too narrow, blog components will reintroduce local overrides immediately.

**Acceptance criteria**

- Raw `Typography` imports are removed from `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/`.
- Blog headings, paragraphs, lists, captions, quotes, meta lines, and hero copy derive from shared roles/typesets rather than local font-size and tracking overrides.
- `/blog` and `/blog/:slug` remain feature-gated and visually coherent at mobile and desktop sizes in light/dark mode and at least two appearance presets.

### Phase 5 — migrate photography to inverse-tone overlay context

**Objective**

Make overlay text, scrims, and inverse-tone metadata first-class design-system surfaces instead of white-on-image ad hoc styling.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/styles/appStyleBuilders.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/appAppearance.ts`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/OverlayMetaBar.tsx` (new, or equivalent shared composition file)
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/AlbumCard.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/AlbumLocationSummary.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/photography/ImmersiveLightbox.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/Photography.tsx`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/pages/PhotographyCategory.tsx`
- Photography unit tests and `/home/runner/work/dev-danhenderson/dev-danhenderson/test/e2e/photography.spec.ts`

**Key refactors**

- Add inverse-tone text and scrim treatment outputs to the builder layer.
- Remove `rgba(255,255,255,...)`, direct `common.white` opacity styling for text, and per-callsite overlay gradients from consumers where the new overlay system can own them.
- Replace `EntryTitle` font-size overrides in overlay cards with explicit overlay/hero roles or context-aware typesets.

**Dependencies**

- Phase 1 typesets and Phase 2 `Text`; Phase 3 shared migration; ideally Phase 4 if overlay compositions reuse common text infrastructure.

**Risks**

- Overlay contrast can regress quickly on different photos if scrim tokens are too weak.
- Photography’s image-first feel can get heavy if the overlay composition becomes too UI-like.

**Acceptance criteria**

- Photography overlays no longer rely on ad hoc white `rgba(...)` text styling for standard roles.
- Overlay scrims and inverse text tones come from the builder/theme pipeline.
- `/photography` and `/photography/:slug` retain the current image-first interaction model while using the shared text system.

### Phase 6 — lock the system with lint and explicit review boundaries

**Objective**

Turn the redesigned system into the easiest path and make bypasses mechanically visible in review and CI.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/package.json`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/.eslintrc.cjs` (new, preferred) or the existing `eslintConfig` in `package.json`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/.github/workflows/build.yml`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/.github/workflows/tests.yml`
- Possibly a small helper test for `UNSAFE_Typography` metadata or lint snapshots if the implementation adds local rule helpers

**Key refactors**

- Add `no-restricted-imports` so direct `@mui/material/Typography` imports are forbidden outside the text layer and any tiny explicit allowlist.
- If feasible, add a custom lint rule or repository-local pattern check that flags typography-affecting `sx` keys passed to `Text`; if that is too expensive initially, add a documented runtime/dev warning as an intermediate measure and keep the lint step on the follow-up list.
- Add a stable lint command and gate it in a workflow that actually validates `v1` PRs.
- Keep the allowlist as small as possible and point every allowed raw-typography site at `UNSAFE_Typography`.

**Dependencies**

- Consumer migration phases must be mostly complete before the lint gate flips to hard enforcement.

**Risks**

- Enabling lint too early will create a noisy, hard-to-review branch.
- Wiring lint only to the currently failing `ci.yml` will create false confidence; the implementation must use a stable workflow path or fix the baseline `npm ci` issue in the same effort.

**Acceptance criteria**

- Raw `Typography` imports outside `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/` and any explicitly documented `UNSAFE_Typography` owner fail lint.
- The allowlist is short, documented, and matches the docs exactly.
- There is an explicit command and CI path that reviewers can rely on for design-system enforcement.

### Phase 7 — rewrite docs, remove obsolete policy, and close the migration

**Objective**

Make the docs and instructions match the new implementation exactly, and eliminate policy drift that would otherwise reintroduce the old exception model.

**Files / areas likely to change**

- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/design-system-reference.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/component-architecture.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/frontend/theme-and-styling.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/docs/engineering/agent-guide.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/AGENTS.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AGENTS.md`
- `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/blog/AGENTS.md`
- Any nearby scoped instruction file that still codifies blog/photography as “do not fix” exceptions

**Key refactors**

- Add non-negotiable rules at the top of the design-system docs.
- Document the role matrix, extension checklist, and enforcement boundaries.
- Rewrite exception policy so blog and photography are contexts/compositions, not exemptions.
- Document `UNSAFE_Typography` ownership and the review expectations for any remaining exception.
- Remove stale recommendation language that would contradict the new lint policy.

**Dependencies**

- Land after the implementation direction is clear enough that the docs can describe the real system rather than an aspirational one.

**Risks**

- Updating docs too early will create a second migration problem where policy and code drift in the opposite direction.

**Acceptance criteria**

- There is no remaining doc or instruction file that tells contributors to preserve blog/photography typography as design-system exceptions.
- The docs show one canonical authoring path for UI copy and a narrow, explicit exception path.
- Reviewers can map the lint rules and code structure directly to the docs.

## Validation plan

Run validation in layers as the implementation progresses; do not defer everything to the end.

### Baseline / enforcement validation

- `npm run build`
- `npx eslint src test/unit --ext .ts,.tsx`
- `rg "Typography" /home/runner/work/dev-danhenderson/dev-danhenderson/src --glob '**/*.{ts,tsx}'`
- `rg "primaryTypographyProps|secondaryTypographyProps" /home/runner/work/dev-danhenderson/dev-danhenderson/src --glob '**/*.{ts,tsx}'`

Use the two `rg` checks as review audits, not as a replacement for lint. At the end of the migration, every remaining hit should be either:

- inside `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/`, or
- an explicitly documented `UNSAFE_Typography` owner.

### Unit / integration validation

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/text/Text.test.tsx test/unit/components/text/TypographyPrimitives.test.tsx test/unit/components/text/InlineLabelPrimitives.test.tsx test/unit/styles/componentStyleBuilders.test.ts test/unit/components/blog/BlogHero.test.tsx test/unit/components/blog/BlogArticleHeader.test.tsx test/unit/components/blog/BlogArticleBody.test.tsx test/unit/components/blog/BlogPostCard.test.tsx test/unit/components/blog/BlogRelatedPosts.test.tsx test/unit/components/blog/BlogTagFilter.test.tsx test/unit/components/photography/AlbumCard.test.tsx test/unit/components/photography/AlbumLocationSummary.test.tsx test/unit/components/photography/ImmersiveLightbox.test.tsx test/unit/pages/Blog.test.tsx test/unit/pages/BlogPost.test.tsx test/unit/pages/Photography.test.tsx test/unit/pages/PhotographyCategory.test.tsx test/unit/components/header/HeaderActions.test.tsx`

If the implementation splits the work across multiple PRs, run the narrowest relevant subset per phase and keep the broader route/component pack as the final pre-merge pass.

### Browser and E2E validation

- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/blog.spec.ts test/e2e/photography.spec.ts test/e2e/navigation.spec.ts`
- `npm run build && npm run test:e2e:smoke -- test/e2e/smoke.spec.ts`

Manual browser review checkpoints:

- `/` for home hero exception isolation
- `/climbing` for shared `SectionHeading` and standard text roles
- `/cv` and `/cv?mode=story` for shared roles and any bounded story exception
- `/blog` and `/blog/:slug` for prose context
- `/photography` and `/photography/:slug` for overlay context

At each shared-style checkpoint, review:

- desktop and a narrow/mobile viewport
- light and dark mode
- at least two appearance presets
- motion intensity `off` for route readability when animations collapse

### Branch readiness criteria

The redesign is not ready to merge until all of the following are true:

- The canonical text path is `Text` plus shared compositions, not raw `Typography`.
- Blog and photography no longer rely on exception language in code or docs.
- Remaining exceptions are explicit, owned, and routed through `UNSAFE_Typography`.
- Lint/build/unit/E2E checks pass on the chosen stable workflow path.
- Review audits for raw `Typography` and typography-affecting bypasses are clean and explainable.

## Risks and rollback

- **Global visual drift:** typography changes propagate widely. Mitigation: land the typeset layer before consumers, validate routes incrementally, and capture route screenshots at each shared-style phase.
- **Policy/code mismatch:** docs currently bless old exceptions. Mitigation: do not flip lint to hard enforcement until the implementation and docs agree.
- **Over-centralization:** a too-flexible `Text` can become a new escape hatch. Mitigation: keep the public API small and role-driven; if a role is missing, add a role instead of adding open-ended props.
- **Migration churn:** dozens of blog/photography call sites could create noisy diffs. Mitigation: keep wrapper compatibility, use codemods for trivial replacements, and migrate by composition rather than block-by-block styling.
- **CI false confidence:** the current completed `CI` run for `v1` failed for unrelated installer reasons. Mitigation: wire enforcement into a stable workflow path or repair the baseline in the same stream of work.

Rollback approach:

- Keep compatibility wrappers in place until the redesign is fully migrated.
- If a late-phase consumer migration regresses visuals, revert the consumer phase first while preserving the new foundation/typeset layer.
- If lint rollout blocks the branch, temporarily shrink the allowlist delta instead of reverting the text infrastructure.

## Progress notes

- Baseline audit completed against the current checkout before planning: `npm install`, `npm run build`, and `CI=true npm test -- --watch=false` all succeeded locally.
- The current docs still codify blog editorial and photography overlay exceptions, so the redesign requires both code migration and policy cleanup.
- The current text layer is structurally thin: `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/text/TypographyPrimitives.tsx` preserves most `TypographyProps`, and the base scale in `/home/runner/work/dev-danhenderson/dev-danhenderson/src/theme/createAppTheme.ts` still leaks semantic decisions directly into consumers.
- The strongest current bypass zone is blog; the clearest non-blog drift appears in `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/header/HeaderSettingsPopover.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/FirstVisitCustomizeModal.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/AppErrorBoundary.tsx`, `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/cv/CVStoryViewer.tsx`, and `/home/runner/work/dev-danhenderson/dev-danhenderson/src/components/GlobalCommandPalette.tsx`.
- Recent GitHub Actions audit: the `Build` workflow on `v1` is green, but the newer completed `CI` workflow run on `v1` failed for unrelated `npm ci` baseline reasons. Do not assume that workflow currently protects this redesign work.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
