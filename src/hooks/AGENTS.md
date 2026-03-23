# AGENTS.md

## Scope

These instructions apply to files under `src/hooks/`.

## Purpose

Hooks and data-fetch modules in this directory are the adaptation layer between raw data sources and the page/component layer. They normalize, derive, and memoize; they do not own types consumed by more than one file, and they do not own route orchestration logic.

Files:

- `useClimbingData.ts` — derives `TickRow[]`, `TodoRow[]`, `GradeBucket[]`, `LocationCount[]`, and `ClimbingAnalytics` from static `src/data/climbs.ts`. Exports `normalizeGrade` and `formatClimbingLocation` for downstream DataGrid use.
- `usePhotographyData.ts` — derives `PhotographyAlbumMeta[]` and summary statistics from static `src/data/photography.ts`.
- `useBlogData.ts` — derives `BlogPostMeta[]` with tag frequency counts from static `src/data/blog.ts`. Tags are sorted by descending frequency with alphabetical tie-breaking for stable UI ordering.
- `useGithubProfile.ts` — React hook that manages loading state and calls `loadGitHubProfileData`.
- `githubProfileData.ts` — module-level singleton cache + fetch logic for the GitHub API (events, repos, PR search, repo enrichment). Not a hook. Exports `GitHubProfileData` as a re-export from `src/types/cv.ts`.
- `useDocumentMetadata.ts` — sets `<title>`, Open Graph, Twitter card, and canonical link tags for the current route.
- `useFuzzySearch.ts` — generic Fuse.js wrapper; returns `search`, `setSearch`, `filtered`.
- `useHomeWelcomeSequence.ts` — coordinates the home-page welcome dialog + hint sequence with `WelcomeAudioProvider` and `WelcomeOnboardingProvider`.
- `useWebVitals.ts` — collects Core Web Vitals via `web-vitals` and exposes them as React state. Gracefully no-ops in JSDOM.

## Type handling

- Domain types consumed by more than one file outside this directory belong in `src/types/`, not here. Define the type in the appropriate `src/types/` file and import it, keeping a `export type { ... }` re-export in the hook file only if existing consumers depend on the hook import path.
- Hook-internal intermediate types (not exported, not used outside the file) may stay local.

## Rules

- Keep hooks as pure data adapters. Do not move route-level orchestration (scroll behavior, layout state, SpeedDial actions) into hooks.
- Preserve the graceful fallback behavior in `githubProfileData.ts`. The GitHub API section must degrade to static content from `src/data/cv.ts` when any request fails or is rate-limited.
- Do not introduce authenticated fetch patterns or server-side infrastructure. All data sources remain public API or static bundles.
- `useFuzzySearch` is generic and must stay that way. Do not add domain-specific logic to it.
- When modifying `useBlogData.ts` tag ordering, preserve the descending-frequency + alphabetical-tie-break sort; test assertions depend on it.
