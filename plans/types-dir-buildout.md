# Type Centralization and Architecture Patch

## Status

- [ ] Not started
- [ ] In progress
- [x] Complete

## Goal

Move all exported domain and shared-UI types that are consumed by more than one file out of hooks, data modules, and components into the canonical `src/types/` directory. Remove one dead re-export block and tighten two types whose `export` keyword has no external consumers.

The codebase will have a single, predictable layer for shared type definitions: `src/types/data.ts` (data domain), `src/types/cv.ts` (CV domain), `src/types/blog.ts` (blog domain, unchanged), and a new `src/types/ui.ts` (shared UI primitives).

## Why

The audit identified:

1. **Layering violation** — `src/data/cv.ts` uses an inline `import()` expression to reference `CVSectionKey` from `src/components/cv/cvSectionMetadata.ts`. A data module must not depend on a component module. The fix is to move `CVSectionKey` and `CVStoryChapter` to `src/types/cv.ts`.

2. **Hook-hosted domain types with multiple external consumers** — `TickRow`, `TodoRow`, `GradeBucket`, `LocationCount`, and `ClimbingAnalytics` are defined in `src/hooks/useClimbingData.ts` and imported by both the page layer and the component layer. By convention these belong in `src/types/`.

3. **Data-module-hosted domain type with component-layer consumers** — `CVStoryItem` is defined in `src/data/cvStoryItems.ts` and imported by three components. It belongs in `src/types/cv.ts`.

4. **Component-hosted UI types with multi-layer consumers** — `AppSpeedDialAction`/`AppSpeedDialLayer`, `TabPanelItem`/`TabPanelRenderContext`, `WebVitalEntry`/`WebVitalsState`, and `TerminalLine` are defined in component or hook files and imported across pages, other components, and hooks. A new `src/types/ui.ts` collects these.

5. **Dead re-export block** — `src/data/cv.ts` re-exports ~12 types from `src/types/cv.ts`. No file in the codebase imports those types via `data/cv`; all consumers already import directly from `types/cv`. The block is unused noise.

6. **Dead exports** — `PhotographyAlbumMeta` (exported from `usePhotographyData.ts` but never imported), `AppSpeedDialLayer` (used only internally), and `WebVitalsState` (never imported externally) carry misleading `export` keywords.

## Constraints

- The app remains fully client-side; no runtime behaviour changes.
- No component props, hook signatures, or data shapes change — only the file location of type definitions.
- `src/data/climbs.ts`, `src/data/photography.ts`, and `src/data/blog.ts` content is not edited (schema is stable).
- Public component APIs (`TabPanel`, `AppSpeedDial`, `TerminalHeroContent`) remain unchanged at the import surface; their props types may simply re-export from `src/types/ui.ts`.
- Route names and stable exported constants are untouched.
- All import paths updated in the same commit as each type move to keep the build green at every step.

## Affected files and responsibilities

### New file

- `src/types/ui.ts` — introduce shared UI primitive types: `AppSpeedDialAction`, `AppSpeedDialLayer`, `TabPanelItem`, `TabPanelRenderContext`, `WebVitalEntry`, `WebVitalsState`, `TerminalLine`

### Types files extended

- `src/types/data.ts` — add `TickRow`, `TodoRow`, `GradeBucket`, `LocationCount`, `ClimbingAnalytics`, `PhotographyAlbumMeta`
- `src/types/cv.ts` — add `CVSectionKey`, `CVStoryChapter`, `CVStoryItem`, `GitHubProfileData`

### Source files stripped of type definitions (types move out, import path updated)

- `src/hooks/useClimbingData.ts` — remove `TickRow`, `TodoRow`, `GradeBucket`, `LocationCount`, `ClimbingAnalytics`; import from `../types/data`
- `src/hooks/usePhotographyData.ts` — remove `PhotographyAlbumMeta`; remove `export` keyword (or import from `../types/data`)
- `src/hooks/githubProfileData.ts` — remove `GitHubProfileData`; import from `../types/cv`
- `src/hooks/useWebVitals.ts` — remove `WebVitalEntry`, `WebVitalsState`; import from `../types/ui`
- `src/data/cv.ts` — remove `CVStoryChapter`; remove the dead `export type { … } from '../types/cv'` re-export block; add `import type { CVStoryChapter } from '../types/cv'` where needed
- `src/data/cvStoryItems.ts` — remove `CVStoryItem`; import from `../types/cv`
- `src/components/AppSpeedDial.tsx` — remove `AppSpeedDialAction`, `AppSpeedDialLayer`; import from `../types/ui`
- `src/components/TabPanel.tsx` — remove `TabPanelItem`, `TabPanelRenderContext`; import from `../types/ui`
- `src/components/TerminalHeroContent.tsx` — remove `export type { TerminalLine }`; import `TerminalLine` directly from `../types/ui` for its own prop type; the existing re-export comment can be removed
- `src/components/text/useTerminalTypewriter.ts` — remove `TerminalLine` definition; import from `../../types/ui`
- `src/components/cv/cvSectionMetadata.ts` — remove `CVSectionKey` type definition; import from `../../types/cv`; keep the runtime constants (`cvSectionMetadata`, `cvSectionNavigationOrder`, `cvSectionAnchorSx`, `cvSectionViewportMetrics`) in place

### Import-path-only updates (no type changes)

- `src/pages/Climbing.tsx` — update `TickRow`, `TodoRow` import to `../types/data`
- `src/pages/CV.tsx` — update `CVSectionKey` import to `../types/cv`; update `AppSpeedDialAction` import to `../types/ui`
- `src/pages/cvPageLayout.ts` — update `CVSectionKey` import to `../types/cv`
- `src/pages/Home.tsx` — update `TerminalLine` import to `../components/text/useTerminalTypewriter` or directly `../types/ui`
- `src/components/climbing/ClimbingAnalytics.tsx` — update `ClimbingAnalytics` import to `../../types/data` (removing the `as ClimbingAnalyticsType` alias since the name collision with the component is resolved by the qualified import anyway)
- `src/components/header/HeaderAppearanceDial.tsx` — update `AppSpeedDialAction` import to `../types/ui` (or re-export from `AppSpeedDial.tsx` — see Proposed Approach)
- `src/components/cv/CVSectionNavigator.tsx` — update `AppSpeedDialAction`, `CVSectionKey` import paths
- `src/components/cv/CVStoryNavBar.tsx` — update `CVStoryItem` import to `../../types/cv`
- `src/components/cv/CVStorySlideRenderer.tsx` — update `CVStoryItem` import to `../../types/cv`
- `src/components/cv/CVStoryViewer.tsx` — update `CVStoryItem` import to `../../types/cv`
- `src/components/cv/CVStoryChapterHeading.tsx` — update `CVStoryChapter` import to `../../types/cv`
- `src/components/cv/EducationSection.tsx` — update `TabPanelItem`, `TabPanelRenderContext` import to `../../types/ui`
- `src/components/cv/ExperienceList.tsx` — update `TabPanelItem`, `TabPanelRenderContext` import to `../../types/ui`
- `src/components/cv/VolunteeringList.tsx` — update `TabPanelItem`, `TabPanelRenderContext` import to `../../types/ui`
- `src/components/cv/CodingExamplesSection.tsx` — update `TabPanelItem`, `TabPanelRenderContext` import to `../../types/ui`
- `src/components/terminal/VscodeTerminalPanel.tsx` — update `TerminalLine` import to `../../types/ui`
- `src/components/PerformanceScorecard.tsx` — update `WebVitalEntry` import to `../types/ui`
- `src/constants/commandPaletteActions.ts` — update `CVSectionKey` import to `../types/cv`
- `src/hooks/useGithubProfile.ts` — no type import change needed; `GitHubProfileData` is accessed via the `loadGitHubProfileData` return value

## Proposed approach

**One type group per commit, build-verified at each step.** The steps below are ordered to eliminate forward-reference risks:

1. Pure additions first — add all new type declarations to `src/types/` files (and create `src/types/ui.ts`) before touching any source file. At this point the codebase compiles with the types defined in two places.
2. Move each group's source definition and update all affected import paths in the same edit pass.
3. Remove the dead re-export block from `src/data/cv.ts` last, after all direct consumers already point to `src/types/cv`.

**Re-export strategy for `AppSpeedDial` and `TabPanel`:** These components are imported by their own consumers both for the component _and_ the associated type. To avoid forcing every consumer to maintain two import lines, keep a `export type { AppSpeedDialAction, AppSpeedDialLayer }` re-export in `src/components/AppSpeedDial.tsx` even after the canonical definition moves to `src/types/ui.ts`. Apply the same pattern to `TabPanel.tsx`. This preserves existing consumer import paths as valid (both old and new paths compile), reducing churn. Re-exports can be removed in a follow-up cleanup if desired.

**`CVSectionKey` in `cvSectionMetadata.ts`:** The runtime constants file keeps its exports. Only the `export type CVSectionKey` line is replaced with an import + re-export from `types/cv`. Callers that import `CVSectionKey` from `cvSectionMetadata` continue to work; the canonical source is now `types/cv`.

## Execution steps

### Phase 1 — Create `src/types/ui.ts` and extend existing type files

1. Create `src/types/ui.ts` with: `AppSpeedDialAction`, `AppSpeedDialLayer`, `TabPanelItem`, `TabPanelRenderContext`, `WebVitalEntry`, `WebVitalsState`, `TerminalLine`. Copy definitions verbatim from their current locations; do not remove from source yet.
2. Add to `src/types/data.ts`: `TickRow`, `TodoRow`, `GradeBucket`, `LocationCount`, `ClimbingAnalytics`, `PhotographyAlbumMeta`. (`TickRow`/`TodoRow` reference `Tick`/`Todo` already in the file.)
3. Add to `src/types/cv.ts`: `CVSectionKey` (derived from `typeof cvSectionMetadata` — express as a plain string union `'about' | 'experience' | 'education' | 'volunteering' | 'github' | 'certificates' | 'coding'` to avoid a circular import back into `cvSectionMetadata.ts`), `CVStoryChapter`, `CVStoryItem`, `GitHubProfileData`.
4. Run `npm run build` — should pass (types are duplicated, not yet removed).

### Phase 2 — Migrate climbing and photography types

5. `src/hooks/useClimbingData.ts`: remove the five type definitions; add `import type { TickRow, TodoRow, GradeBucket, LocationCount, ClimbingAnalytics } from '../types/data'`.
6. `src/hooks/usePhotographyData.ts`: remove `PhotographyAlbumMeta` definition; add import from `../types/data`; remove `export` keyword.
7. `src/pages/Climbing.tsx`: update import of `TickRow`, `TodoRow` to `../types/data`.
8. `src/components/climbing/ClimbingAnalytics.tsx`: update import of `ClimbingAnalytics` to `../../types/data`; remove the `as ClimbingAnalyticsType` alias.
9. Run `npm run build`.

### Phase 3 — Migrate CV story and section types

10. `src/data/cvStoryItems.ts`: remove `CVStoryItem` definition; add `import type { CVStoryItem } from '../types/cv'`.
11. `src/data/cv.ts`: remove `CVStoryChapter` definition; import it from `../types/cv`; remove the entire dead `export type { … } from '../types/cv'` block.
12. `src/components/cv/cvSectionMetadata.ts`: remove `export type CVSectionKey`; add `export type { CVSectionKey } from '../../types/cv'` (re-export keeps existing callers valid).
13. Update all `CVStoryItem`/`CVStoryChapter`/`CVSectionKey` consumers (see affected files list): `CVStoryNavBar`, `CVStorySlideRenderer`, `CVStoryViewer`, `CVStoryChapterHeading`, `CVSectionNavigator`, `CV.tsx`, `cvPageLayout.ts`, `commandPaletteActions.ts`.
14. Run `npm run build`.

### Phase 4 — Migrate GitHub domain types

15. `src/hooks/githubProfileData.ts`: remove `GitHubProfileData` definition; add `import type { GitHubProfileData } from '../types/cv'`.
16. Run `npm run build`.

### Phase 5 — Migrate UI primitive types

17. `src/components/AppSpeedDial.tsx`: remove type definitions; add `import type { AppSpeedDialAction, AppSpeedDialLayer } from '../types/ui'`; add `export type { AppSpeedDialAction, AppSpeedDialLayer }` re-export so upstream consumers keep working.
18. `src/components/TabPanel.tsx`: remove type definitions; add `import type { TabPanelItem, TabPanelRenderContext } from '../types/ui'`; add corresponding re-exports.
19. `src/components/text/useTerminalTypewriter.ts`: remove `TerminalLine` definition; add import from `../../types/ui`.
20. `src/components/TerminalHeroContent.tsx`: remove the `export type { TerminalLine }` re-export. Consumers still get `TerminalLine` from its canonical home.
21. `src/components/terminal/VscodeTerminalPanel.tsx`: update import to `../../types/ui`.
22. `src/pages/Home.tsx`: update `TerminalLine` import to `../types/ui` (or `../components/text/useTerminalTypewriter` — either compiles since `useTerminalTypewriter` now imports from `types/ui`).
23. `src/hooks/useWebVitals.ts`: remove `WebVitalEntry`/`WebVitalsState` definitions; import from `../types/ui`; remove `export` keyword from `WebVitalsState` (no external consumers).
24. `src/components/PerformanceScorecard.tsx`: update import to `../types/ui`.
25. `src/components/header/HeaderAppearanceDial.tsx` and `src/components/cv/CVSectionNavigator.tsx`: update `AppSpeedDialAction` import path.
26. Update four CV tab-consumer components (`EducationSection`, `ExperienceList`, `VolunteeringList`, `CodingExamplesSection`): update `TabPanelItem`/`TabPanelRenderContext` imports to `../../types/ui`.
27. Run `npm run build`.

### Phase 6 — Validation and cleanup

28. Run `CI=true npm test -- --watch=false` and confirm no new failures introduced by this change set.
29. Run a targeted build-and-visual check on `/cv`, `/climbing`, and `/` via the webdev MCP server.
30. Verify `CVAboutBioTypewriterProps` (component-private, single consumer — intentionally left in place) is not affected.
31. Confirm `src/types/ui.ts`, `src/types/data.ts`, and `src/types/cv.ts` have no circular imports by inspecting their import statements (they should import only from each other and from external packages, never from `src/components/` or `src/hooks/`).

## Validation plan

- `npm run build` — after each phase (steps 4, 9, 14, 16, 27)
- `CI=true npm test -- --watch=false` — after phase 6
- Browser validation on `/cv`, `/climbing`, `/` via webdev MCP after phase 6
- Confirm `src/types/ui.ts` does not import from `src/components/` or `src/hooks/`
- Confirm `src/data/cv.ts` no longer contains an inline `import('...')` expression
- Confirm `src/hooks/useClimbingData.ts` exports no types (search for `^export type`)
- Confirm no file imports from `'../../data/cvStoryItems'` for the `CVStoryItem` type (should be `types/cv`)

## Risks and rollback

- **Re-export churn:** If the re-export strategy for `AppSpeedDial` and `TabPanel` is skipped, ~8 component files need immediate import-path updates in step 17–18 or they will error. Keep the re-exports unless explicitly cleaning them up.
- **`CVSectionKey` derivation:** If `CVSectionKey` is defined in `types/cv.ts` as a plain string union rather than `keyof typeof cvSectionMetadata`, it could drift if new sections are added without updating both files. The string union is acceptable for now; a comment noting the derivation source prevents drift. Alternatively, export the constant from a shared location — but that risks reintroducing a component → types dependency. **Recommended:** plain union in types, with a comment referencing `cvSectionMetadata`.
- **`ClimbingAnalytics` name collision:** The component `ClimbingAnalytics` and the type `ClimbingAnalytics` share a name. The component file currently imports the type aliased as `ClimbingAnalyticsType`. After the move, the import path changes but the alias can be removed since the component symbol and the type symbol are in separate namespaces (value vs. type). Verify the component file compiles cleanly.
- **Dead re-export block removal from `data/cv.ts`:** Any undiscovered consumer importing a CV type through `data/cv` will break at this step. The grep audit found zero such consumers, but a full `npm run build` after step 11 will surface any missed ones.
- **Rollback:** Each phase is independently reversible — restore the type definition to its original location and revert the import-path updates in that phase's affected files. No runtime data or user-facing behavior is at risk.

## Progress notes

- Audit completed 2026-03-16. No changes implemented yet.
- Implementation completed 2026-03-16. All six phases executed with `npm run build` verified at each phase boundary.
- `CVAboutBioTypewriterProps` is component-private (single consumer = itself) and is intentionally excluded from this plan.
- `GitHubLinkChipItem` in `src/components/cv/GitHubLinkChipList.tsx` has only one external consumer (itself) — also excluded.
- `CVLayoutMode` and `CVSectionRegion` in `src/pages/cvPageLayout.ts` are only consumed by `src/pages/CV.tsx` — page-local layout types, excluded from centralization.
- `TypewriterTextProps` / `TypewriterLoopTextProps` are component-private props interfaces — excluded.
- `HeaderAppearanceDialProps` is a component-private props interface — excluded.
- `CommonLinkProps` is a component-private type alias — excluded.
- `ContentCardProps` is a generic component-private props type — excluded.
