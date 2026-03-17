# AGENTS.md

## Scope

These instructions apply to files under `src/types/`.

## Purpose

`src/types/` is the canonical home for shared TypeScript type definitions. A type belongs here when it is consumed by more than one non-type file, regardless of whether the first consumer was a hook, data module, or component.

Files:

- `data.ts` — data-domain types: `Tick`, `Todo`, `TickRow`, `TodoRow`, `GradeBucket`, `LocationCount`, `ClimbingAnalytics`, `PhotographyAlbumMeta`, `PhotoItem`, `PhotoCategory`, and shared data status primitives (`SharedDataStatus`, `SharedDataFreshness`, etc.)
- `cv.ts` — CV-domain types: `AboutMe`, `Experience`, `Education*`, `Certificate`, `VolunteeringEntry`, `CodingExample*`, `GitHubActivityItem`, `GitHubContribution`, `GitHubProfileData`, `CVSectionKey`, `CVStoryChapter`, `CVStoryItem`
- `blog.ts` — blog-domain types: `BlogPost`, `BlogPostMeta`, `BlogContentBlock`
- `ui.ts` — shared UI primitive types: `AppSpeedDialAction`, `AppSpeedDialLayer`, `TabPanelItem`, `TabPanelRenderContext`, `WebVitalEntry`, `WebVitalsState`, `TerminalLine`

## What goes here

- Any type consumed by two or more files outside `src/types/` itself.
- Types that cross layer boundaries (e.g. a hook-defined type that component or page layers also import, or a data-module type imported by pages directly).

## What stays local

- Component-private props interfaces with a single consumer — keep them in the component file.
- Page-local layout types consumed only by one page (e.g. `CVLayoutMode`, `CVSectionRegion` in `cvPageLayout.ts`).
- Hook-internal intermediate types used only within the hook file.

## Layering rules

Files in `src/types/` must not import from `src/components/`, `src/hooks/`, `src/pages/`, or `src/data/`. Permitted imports:

- Other files within `src/types/` (e.g. `cv.ts` imports `SharedDataStatus` from `./data`).
- External packages where structurally necessary (e.g. `react` for `ReactNode` in `ui.ts`).

This keeps `src/types/` at the bottom of the dependency graph with no circular-import risk.

## Adding a type

1. Pick the right file by domain: data-domain → `data.ts`; CV-domain → `cv.ts`; blog-domain → `blog.ts`; shared UI primitive → `ui.ts`.
2. Copy the definition verbatim from its current location; do not reshape it during the move.
3. Update all import paths in the same change set so the build stays green at every step.
4. If the originating file exported the type for downstream consumers, keep a `export type { ... }` re-export there until all consumers are migrated.
5. Remove the original definition only after every consumer imports from the canonical path.

## Editing a type

- Backward-compatible additions (new optional field, new union arm) require a build check.
- Breaking changes (field rename, type narrowing, removal) require updating every consumer in the same change set.

## CVSectionKey note

`CVSectionKey` is defined as a plain string union rather than `keyof typeof cvSectionMetadata` to avoid a circular import back into `src/components/`. The comment in `cv.ts` cites `cvSectionMetadata.ts` as the reference. When a CV section is added or renamed, update both definitions.
