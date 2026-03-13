import type { AppResolvedTreatment } from './appAppearance';

declare module '@mui/material/styles' {
  interface Theme {
    appearanceTreatment: AppResolvedTreatment;
  }

  interface ThemeOptions {
    appearanceTreatment?: AppResolvedTreatment;
  }
}

export {};
