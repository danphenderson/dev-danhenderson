import type { RefObject } from 'react';
import type { AppResolvedTreatment } from './appAppearance';

declare module '@mui/material/styles' {
  interface Theme {
    appearanceTreatment: AppResolvedTreatment;
  }

  interface ThemeOptions {
    appearanceTreatment?: AppResolvedTreatment;
  }
}

declare module '@mui/material/Slide' {
  interface SlideProps {
    nodeRef?: RefObject<HTMLElement>;
  }
}

export {};
