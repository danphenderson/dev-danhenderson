---
applyTo: 'src/theme/**/*.ts,src/theme/**/*.tsx'
---

These files own appearance presets and MUI theme assembly. Keep appearance-driven values centralized and preserve the existing theme state boundary.

- Add appearance tokens and presets in `appAppearance.ts`, not ad hoc in component `sx` props.
- Keep theme construction in `createAppTheme.ts` and state management in `ThemeProvider.tsx`.
- Derive colors from `theme.palette` or `theme.appearanceTreatment` instead of hardcoding literals.
- Update all affected style-builder consumers when changing appearance token names or fields.

For more detail, follow `src/theme/AGENTS.md`.
