# AGENTS.md

## Scope

These instructions apply to files under `src/utils/`.

## Purpose

Pure, framework-agnostic helper functions. No React, no hooks, no MUI.

Files:

- `appEnvironment.ts` — central compatibility surface for `PUBLIC_URL`, `NODE_ENV`, and `REACT_APP_*` reads. Source files should import its helpers instead of reading `process.env` directly so build-tool migration stays isolated.
- `assets.ts` — `resolvePublicAssetPath(src, publicUrl?)`: the only correct way to construct local asset URLs. Handles `PUBLIC_URL` prefixing, relative-path normalization, and passthrough for absolute/data/blob URLs. Use this everywhere a local asset path appears.
- `date.ts` — `getIsoDateUtcTimestamp` and `formatIsoDateAsUtcCalendar`: UTC-safe ISO `YYYY-MM-DD` parsing that avoids timezone-shift bugs. Use these for all climbing tick date operations.
- `dom.ts` — `getMaxScrollLeft`, `isElementInViewport`: lightweight DOM measurement helpers with no dependencies.
- `easing.ts` — `easeOutCubic`: a pure math easing function for programmatic animation progress. Not for CSS easing constants (those live in `src/styles/springEasing.ts`).
- `sx.ts` — `normalizeSxProp`: normalizes a `SxProps<Theme>` value into an array for safe spreading in MUI `sx` array composition.
- `buildInfo.ts` — `buildInfo`: build-time constants read from `REACT_APP_*` env vars (`gitSha`, `buildTime`, `version`, `nodeEnv`).
- `commandPaletteSearch.ts` — `normalizeCommandPaletteSearchValue` and `matchesCommandPaletteAction`: search-matching logic for the command palette, kept separate from the action registry so it can be tested in isolation.
- `serviceWorkerRegistration.ts` — service-worker registration helpers that use the shared app-environment abstraction and public-asset resolver. Do not modify unless explicitly working on PWA or offline behavior.

## Rules

- All functions here must be pure (or at worst browser-API-dependent in the case of `dom.ts` and `buildInfo.ts`). No hooks, no component imports, no MUI imports.
- App-level environment reads should flow through `appEnvironment.ts` rather than appearing inline throughout the app.
- Always use `resolvePublicAssetPath` when building local asset URLs. Do not concatenate `process.env.PUBLIC_URL` manually anywhere else.
- Do not add CSS easing constants here. They live in `src/styles/springEasing.ts`.
- Do not add TypeScript type definitions here that are consumed by more than one file. Those belong in `src/types/`.
- New helpers should be pure functions. If a helper needs React state or context it belongs in `src/hooks/`, not here.
