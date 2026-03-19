# AGENTS.md

## Scope

These instructions apply to files under `src/styles/`.

## Purpose

This directory holds theme-conditioned style maps, shared animation keyframes, and the spring-easing constants. It is the bridge between the MUI theme and the `sx`/`transition` values that components consume.

Source-of-truth doc: `docs/frontend/theme-and-styling.md`.

Files:

- `springEasing.ts` — single source for the spring-physics curve: `SPRING_EASING_CSS` (CSS `cubic-bezier()`) and `SPRING_EASING_MOTION` (numeric tuple for the Motion library). All animated surfaces use these.
- `animations.ts` — Emotion `keyframes` definitions: `shimmerSweep`, `ambientPulse`, `backgroundSweep`, `breathe`. Each keyframe is documented with the surfaces it is used on.
- `appStyleBuilders.ts` / `appStyles.ts` — theme-conditioned style maps for page-level surfaces: background overlays, hero shells, loading bars, photo placeholders, floating action surfaces. `appStyleBuilders.ts` contains the pure builder; `appStyles.ts` exports the `useAppStyles` hook.
- `componentStyleBuilders.ts` / `componentStyles.ts` — theme-conditioned style maps for CV section layouts, tab panels, section containers, card variants, and GitHub chip styles. Also owns the motion timing constants (`itemOffsetMs`, `itemStaggerMs`, `sectionStaggerMs`, `githubSubsectionStaggerMs`, `accordionChipStaggerMs`) and delay helpers (`getSectionDelayMs`, `getItemDelayMs`). `componentStyles.ts` exports the `useComponentStyles` hook.

## Rules

- Theme-conditional reusable surfaces belong in `createComponentStyleMap(theme)` or `createAppStyleMap(theme)`, not inline component `sx` objects that read `theme.appearanceTreatment` directly.
- Do not define easing constants here other than in `springEasing.ts`. If a component needs the spring easing curve, import `SPRING_EASING_CSS` or `SPRING_EASING_MOTION` from there.
- Do not define animation duration values here. Duration tokens live in `src/motion/tokens.ts`; use `cssDuration.*` in `transition` shorthands.
- Do not add new `keyframes` inline in components. Add them to `animations.ts` with a usage comment, then import.
- Keep `appStyleBuilders.ts` and `componentStyleBuilders.ts` as pure functions parametrized on `Theme`. They must not call hooks or read React state.
- Inline `sx` is acceptable for one-off spacing or simple conditional visibility, but not for new shared surface treatments or appearance-driven logic.
- Motion timing token changes (`itemOffsetMs` etc.) in `componentStyleBuilders.ts` affect all CV section animations simultaneously. Validate the full CV route when changing them.
- Do not duplicate style logic that already exists in the builders. Prefer surfacing a new helper from the relevant builder rather than repeating `alpha(theme.palette..., ...)` inline.
