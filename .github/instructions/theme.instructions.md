---
applyTo: 'src/theme/**/*.ts,src/theme/**/*.tsx'
---

These files own appearance presets and MUI theme assembly. Keep appearance-driven values centralized and preserve the existing theme state boundary.

- Add appearance tokens and presets in `appAppearance.ts`, not ad hoc in component `sx` props.
- Theme resolution flows through `ThemeProvider` into `createAppTheme.ts`, which exposes resolved appearance values on `theme.appearanceTreatment.{surface,motion,motionScale}`.
- Keep theme construction in `createAppTheme.ts` and state management in `ThemeProvider.tsx`.
- Have components and style builders consume resolved values from `theme.appearanceTreatment` rather than reconstructing preset resolution from raw appearance records.
- Derive colors from `theme.palette` or `theme.appearanceTreatment` instead of hardcoding literals.
- Update all affected style-builder consumers when changing appearance token names or fields.

For more detail, follow `src/theme/AGENTS.md`.
