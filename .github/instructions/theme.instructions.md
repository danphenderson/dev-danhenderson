---
applyTo: 'src/theme/**/*.ts,src/theme/**/*.tsx'
---

These files own appearance presets and MUI theme assembly. Keep appearance-driven values centralized and preserve the existing theme state boundary.

- Add appearance presets and appearance-driven values in `appAppearance.ts`, not ad hoc in component `sx`.
- Keep theme construction in `createAppTheme.ts` and state management in `ThemeProvider.tsx`.
- Consume resolved values from `theme.appearanceTreatment` instead of reconstructing preset resolution.
- Follow `src/theme/AGENTS.md` for token ownership and validation expectations.

For more detail, follow `src/theme/AGENTS.md`.
