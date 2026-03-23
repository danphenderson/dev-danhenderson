# Text Canonicalization Cleanup

## Goal

Make `Text` plus the typeset registry the only semantic text authoring path in the repository.

After this change, standard UI and prose text should be authored directly with `Text` roles, tones, and contexts; local typography bypasses should be removed; and the compatibility wrappers in `src/components/text/` should be gone.

## Why

The current text system still has split ownership and multiple bypass paths:

- `TypographyPrimitives` and `InlineLabelPrimitives` remain as a second public authoring path even though `Text` is the documented canonical API.
- semantic typography styling is split between `src/styles/textStyleBuilders.ts` and `src/styles/componentStyleBuilders.ts`
- local micro-primitives and ad hoc text styling still appear in settings/onboarding flows
- `GlobalCommandPalette` still uses `primaryTypographyProps` / `secondaryTypographyProps` instead of the canonical text layer

This makes roles like `sectionEyebrow`, `meta`, and `metricValue` harder to change safely because there are multiple places to inspect and multiple ways to bypass the intended system.

## Constraints

- Preserve the client-side SPA architecture, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep `UnsafeTypography` as the only sanctioned escape hatch for intentional exception areas.
- Keep blog feature gating and current route structure intact.
- Do not revert or overwrite unrelated in-progress work already present in the branch.
- Keep changes narrowly scoped to text-system ownership, consumer migrations, docs, and focused validation.

## Affected files and responsibilities

- `src/types/text.ts` — authoritative semantic text model
- `src/styles/textStyleBuilders.ts` — single source of truth for semantic typography
- `src/components/text/Text.tsx` — canonical runtime text primitive
- `src/styles/componentStyleBuilders.ts` — remove semantic text fragments that duplicate registry ownership
- `src/components/text/TypographyPrimitives.tsx` — delete after migration
- `src/components/text/InlineLabelPrimitives.tsx` — delete after migration
- `src/components/text/index.ts` — remove wrapper exports and keep canonical text exports
- shared consumers in `src/components/`, `src/pages/`, and feature directories — migrate wrapper imports/usages to direct `Text`
- `src/components/GlobalCommandPalette.tsx` — remove MUI typography-props bypass
- `src/components/header/HeaderSettingsPopover.tsx` — remove private section-label micro-primitive
- `src/components/FirstVisitCustomizeModal.tsx` — remove duplicated compact section-label override
- `src/components/FirstVisitSettingsHintPopover.tsx` — remove duplicated compact section-label override
- docs under `docs/` — align architecture/design-system guidance with the implementation
- focused unit and E2E tests — cover the direct `Text` path and migrated consumers

## Proposed approach

1. Expand the text model only where the wrapper layer proves a missing semantic rather than a reusable abstraction.
2. Move semantic typography ownership into `src/styles/textStyleBuilders.ts` so roles and tones, not wrapper-specific `sx`, define canonical output.
3. Migrate all in-repo wrapper consumers to direct `Text` usage.
4. Remove the compatibility wrapper files and exports.
5. Delete duplicated semantic text fragments from `componentStyleBuilders` once no consumer depends on them.
6. Update docs and focused tests to reflect the direct `Text` authoring path.

## Execution steps

1. Add this ExecPlan and keep it updated as work progresses.
2. Refactor the text core:
   - add missing semantic roles and tones needed to replace wrapper-only behavior
   - type `Typeset.variant` with the real MUI variant union
   - make `Text` stop relying on `as Variant`
   - align default role styling with the canonical semantic output
3. Migrate high-reuse shared consumers and the known bypass sites to direct `Text`.
4. Migrate remaining wrapper consumers across CV, climbing, header, and route-recovery surfaces.
5. Delete `TypographyPrimitives.tsx` and `InlineLabelPrimitives.tsx`, then remove their barrel exports.
6. Remove obsolete semantic text fragments from `componentStyleBuilders.ts`.
7. Update docs and focused tests.
8. Run build, focused Jest coverage, relevant Playwright coverage, and browser validation.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/text/Text.test.tsx test/unit/styles/textStyleBuilders.test.ts test/unit/components/GlobalCommandPalette.test.tsx test/unit/components/header/HeaderActions.test.tsx test/unit/components/FirstVisitCustomizeModal.test.tsx`
- add focused consumer suites as needed for migrated shared surfaces
- `npm run build:e2e && npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/cv.github.spec.ts test/e2e/blog.spec.ts test/e2e/photography.spec.ts test/e2e/not-found.spec.ts`
- browser validation on `/`, `/cv`, one blog post route, and `/photography` at mobile and desktop widths

## Risks and rollback

- semantic defaults may drift if roles are changed without checking existing direct `Text` consumers
- deleting wrappers too early could strand imports or tests
- removing semantic fragments from `componentStyleBuilders.ts` could unintentionally drop color or motion decoration from migrated surfaces

Rollback approach:

- if the semantic refactor is too disruptive, keep the core role/tone updates and migrate consumers in smaller batches before deleting the wrapper files
- if a migrated surface needs unusual typography behavior, add a missing canonical role or tone instead of reintroducing a wrapper or local typography bypass

## Progress notes

- Existing branch work already removed the old `as unknown as` text-wrapper escapes; the remaining issue is ownership, public wrapper APIs, and local bypasses.
- The onboarding compact section-label override appears in both first-visit surfaces and the header settings popover, so that defect class should be fixed together.
- `SectionLabel` from `TypographyPrimitives.tsx` currently appears unused outside its own test coverage and should be deleted rather than preserved.
- Added canonical `settingsSectionLabel`, `inlineLabel`, and `support` tone semantics to the text model and moved `Text` to typed variants without `as Variant`.
- Migrated shared layout, onboarding, command palette, recovery, blog, photography, climbing, and CV consumers to direct `Text` usage.
- Deleted `src/components/text/TypographyPrimitives.tsx` and `src/components/text/InlineLabelPrimitives.tsx`, then removed their barrel exports.
- Removed obsolete semantic text fragments from `componentStyleBuilders.ts` that were only supporting the deleted wrapper layer.
- Updated architecture/design-system docs to describe `Text` plus `textStyleBuilders.ts` as the single semantic text authoring path.
- Validation passed: `npm run build`, `export CI=true && npm test -- --watch=false --runTestsByPath test/unit/components/text/Text.test.tsx test/unit/styles/textStyleBuilders.test.ts test/unit/components/RouteRecoveryPanel.test.tsx test/unit/components/cv/CVAboutSection.test.tsx test/unit/components/climbing/ClimbingAnalytics.test.tsx test/unit/pages/Climbing.test.tsx test/unit/components/GlobalCommandPalette.test.tsx test/unit/components/TabPanel.test.tsx test/unit/components/FirstVisitCustomizeModal.test.tsx test/unit/components/header/HeaderActions.test.tsx test/unit/components/SkillsChipList.test.tsx test/unit/components/PerformanceScorecard.test.tsx test/unit/components/AppSpeedDial.test.tsx`, `npm run build:e2e`, and `npm run test:e2e:chromium -- test/e2e/home.spec.ts test/e2e/cv.github.spec.ts test/e2e/blog.spec.ts test/e2e/photography.spec.ts test/e2e/climbing.spec.ts test/e2e/not-found.spec.ts`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
