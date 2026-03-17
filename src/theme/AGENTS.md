# AGENTS.md

## Scope

These instructions apply to files under `src/theme/`.

## Purpose

This directory owns the MUI theme assembly and appearance-preset system.

Files:

- `appAppearance.ts` — the source of truth for the six appearance presets (`atlas`, `evergreen`, `ember`, `solstice`, `drift`, `graphite`), each carrying `palette` (light + dark), `typography` (font family stacks), `AppSurfaceTreatment` tokens (card blur, glow strengths, overlay opacities, etc.), and `AppMotionTreatment` tokens (shimmer, pulse, wave timings). `resolveAppearanceTreatment` combines a preset with a palette mode into an `AppResolvedTreatment`.
- `createAppTheme.ts` — assembles the MUI `Theme` from a `PaletteMode` + `AppAppearanceKey`. All palette derivations, typography scale, shape radius, and component overrides live here.
- `mui.d.ts` — extends the MUI `Theme` and `ThemeOptions` interfaces with `appearanceTreatment: AppResolvedTreatment`. Do not add further augmentations unless a new top-level MUI interface needs a custom field.

## Rules

- Add new appearance-driven values to `appAppearance.ts`, not to component `sx` props. Components read appearance values via `theme.appearanceTreatment`.
- Do not hardcode palette color literals in components. Derive from `theme.palette` or `theme.appearanceTreatment.surface`.
- Add new appearance presets as a full entry in `appAppearancePresets` in `appAppearance.ts`. All presets must carry both `light` and `dark` palette entries.
- Typography scale changes go in `createAppTheme.ts`. Font families are controlled per-preset in `appAppearance.ts`.
- Theme assembly logic stays in `createAppTheme.ts`. Do not duplicate theme construction in `ThemeProvider.tsx`; that file manages state and subscribes to `createAppTheme`.
- Shape radius and component-level MUI override defaults go in `createAppTheme.ts`, not in individual components.
- `AppSurfaceTreatment` and `AppMotionTreatment` tokens drive visual consistency across all appearance presets. Use existing token names before adding new ones; prefer interpolating existing strength/opacity fields over introducing parallel properties.

## Validation

Any change to an appearance preset or theme assembly requires browser validation across at least light and dark modes on one route. Changes to `AppSurfaceTreatment` or `AppMotionTreatment` token names or fields require updating every reference in `componentStyleBuilders.ts` and `appStyleBuilders.ts`.
