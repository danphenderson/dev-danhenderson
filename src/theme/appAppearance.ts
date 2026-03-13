import { PaletteMode } from '@mui/material';

export type AppAppearanceKey = 'atlas' | 'evergreen' | 'ember';

type AppAppearancePalette = {
  primary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    light: string;
    main: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  background: {
    default: string;
    paper: string;
  };
};

type AppAppearanceTypography = {
  bodyFontFamily: string[];
  headingFontFamily: string[];
};

export type AppSurfaceTreatment = {
  backgroundOverlayOpacity: number;
  cardGradientStartAlpha: number;
  cardGradientEndAlpha: number;
  cardBorderAlpha: number;
  cardShadowAlpha: number;
  cardBlurPx: number;
  panelSurfaceAlpha: number;
  panelBorderAlpha: number;
  accentTintAlpha: number;
  secondaryTintAlpha: number;
  secondaryBorderAlpha: number;
  selectedSurfaceAlpha: number;
  glowStrength: number;
  textGlowStrength: number;
  secondaryGlowStrength: number;
  sectionBottomGlowOpacity: number;
  sectionBorderSweepOpacity: number;
};

export type AppMotionTreatment = {
  tabHoverShimmerMs: number | null;
  pillPulseEnabled: boolean;
  pillPulseMs: number;
  chipWaveEnabled: boolean;
  chipWaveMs: number;
  chipWaveDelaySeconds: number;
  borderGlowEnabled: boolean;
  borderGlowMs: number;
  sectionBorderSweepEnabled: boolean;
  sectionBorderSweepMs: number;
  sectionBottomGlowAnimated: boolean;
  sectionBottomGlowMs: number;
  statusBreatheEnabled: boolean;
  statusBreatheMs: number;
  headingBreatheEnabled: boolean;
  headingBreatheMs: number;
};

export type AppResolvedTreatment = {
  key: AppAppearanceKey;
  surface: AppSurfaceTreatment;
  motion: AppMotionTreatment;
};

export type AppAppearancePreset = {
  key: AppAppearanceKey;
  label: string;
  shortDescription: string;
  palette: Record<PaletteMode, AppAppearancePalette>;
  typography: AppAppearanceTypography;
  surface: Record<PaletteMode, AppSurfaceTreatment>;
  motion: AppMotionTreatment;
};

export const APP_APPEARANCE_STORAGE_KEY = 'danhenderson-appearance';
export const defaultAppAppearanceKey: AppAppearanceKey = 'evergreen';

const serifHeadingFamily = [
  'Iowan Old Style',
  'Palatino Linotype',
  'Book Antiqua',
  'Georgia',
  'serif',
];

export const appAppearancePresets: Record<AppAppearanceKey, AppAppearancePreset> = {
  atlas: {
    key: 'atlas',
    label: 'Atlas',
    shortDescription: 'Balanced technical surfaces with restrained motion.',
    palette: {
      light: {
        primary: {
          light: '#67bdd0',
          main: '#0f8fae',
          dark: '#0a647b',
          contrastText: '#071822',
        },
        secondary: {
          light: '#dca77a',
          main: '#b97741',
          dark: '#8d5528',
        },
        text: {
          primary: '#132433',
          secondary: '#526170',
        },
        background: {
          default: '#d3dee6',
          paper: '#f6fbfc',
        },
      },
      dark: {
        primary: {
          light: '#6ec9db',
          main: '#2ea7c6',
          dark: '#187694',
          contrastText: '#081622',
        },
        secondary: {
          light: '#e1b38c',
          main: '#bf8352',
          dark: '#955d33',
        },
        text: {
          primary: '#e7eef2',
          secondary: '#b4c5ce',
        },
        background: {
          default: '#0b1820',
          paper: '#12242e',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'],
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.46,
        cardGradientStartAlpha: 0.94,
        cardGradientEndAlpha: 0.88,
        cardBorderAlpha: 0.24,
        cardShadowAlpha: 0.14,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.8,
        panelBorderAlpha: 0.18,
        accentTintAlpha: 0.12,
        secondaryTintAlpha: 0.1,
        secondaryBorderAlpha: 0.2,
        selectedSurfaceAlpha: 0.08,
        glowStrength: 0.6,
        textGlowStrength: 0.35,
        secondaryGlowStrength: 0.5,
        sectionBottomGlowOpacity: 0.3,
        sectionBorderSweepOpacity: 0.46,
      },
      dark: {
        backgroundOverlayOpacity: 0.58,
        cardGradientStartAlpha: 0.86,
        cardGradientEndAlpha: 0.9,
        cardBorderAlpha: 0.36,
        cardShadowAlpha: 0.32,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.64,
        panelBorderAlpha: 0.32,
        accentTintAlpha: 0.18,
        secondaryTintAlpha: 0.14,
        secondaryBorderAlpha: 0.28,
        selectedSurfaceAlpha: 0.16,
        glowStrength: 0.65,
        textGlowStrength: 0.4,
        secondaryGlowStrength: 0.56,
        sectionBottomGlowOpacity: 0.36,
        sectionBorderSweepOpacity: 0.5,
      },
    },
    motion: {
      tabHoverShimmerMs: 500,
      pillPulseEnabled: true,
      pillPulseMs: 5200,
      chipWaveEnabled: true,
      chipWaveMs: 8600,
      chipWaveDelaySeconds: 0.75,
      borderGlowEnabled: true,
      borderGlowMs: 8200,
      sectionBorderSweepEnabled: true,
      sectionBorderSweepMs: 6800,
      sectionBottomGlowAnimated: true,
      sectionBottomGlowMs: 5600,
      statusBreatheEnabled: true,
      statusBreatheMs: 3600,
      headingBreatheEnabled: true,
      headingBreatheMs: 3800,
    },
  },
  evergreen: {
    key: 'evergreen',
    label: 'Evergreen',
    shortDescription: 'Calm editorial surfaces with minimal ambient motion.',
    palette: {
      light: {
        primary: {
          light: '#5b7f74',
          main: '#34594f',
          dark: '#223e36',
          contrastText: '#f8f3ec',
        },
        secondary: {
          light: '#bf8e66',
          main: '#9b6744',
          dark: '#74492b',
        },
        text: {
          primary: '#1f2a2a',
          secondary: '#5b6460',
        },
        background: {
          default: '#e8e0d5',
          paper: '#faf6ef',
        },
      },
      dark: {
        primary: {
          light: '#88b3a4',
          main: '#6b9989',
          dark: '#507266',
          contrastText: '#0f1816',
        },
        secondary: {
          light: '#d4ad89',
          main: '#ba8358',
          dark: '#8e603a',
        },
        text: {
          primary: '#edf0ea',
          secondary: '#bcc5bd',
        },
        background: {
          default: '#101917',
          paper: '#172421',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: serifHeadingFamily,
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.56,
        cardGradientStartAlpha: 0.96,
        cardGradientEndAlpha: 0.92,
        cardBorderAlpha: 0.18,
        cardShadowAlpha: 0.12,
        cardBlurPx: 6,
        panelSurfaceAlpha: 0.88,
        panelBorderAlpha: 0.14,
        accentTintAlpha: 0.08,
        secondaryTintAlpha: 0.12,
        secondaryBorderAlpha: 0.18,
        selectedSurfaceAlpha: 0.06,
        glowStrength: 0.2,
        textGlowStrength: 0.15,
        secondaryGlowStrength: 0.48,
        sectionBottomGlowOpacity: 0.16,
        sectionBorderSweepOpacity: 0,
      },
      dark: {
        backgroundOverlayOpacity: 0.68,
        cardGradientStartAlpha: 0.92,
        cardGradientEndAlpha: 0.94,
        cardBorderAlpha: 0.26,
        cardShadowAlpha: 0.28,
        cardBlurPx: 6,
        panelSurfaceAlpha: 0.74,
        panelBorderAlpha: 0.22,
        accentTintAlpha: 0.12,
        secondaryTintAlpha: 0.16,
        secondaryBorderAlpha: 0.24,
        selectedSurfaceAlpha: 0.12,
        glowStrength: 0.22,
        textGlowStrength: 0.18,
        secondaryGlowStrength: 0.52,
        sectionBottomGlowOpacity: 0.18,
        sectionBorderSweepOpacity: 0,
      },
    },
    motion: {
      tabHoverShimmerMs: 500,
      pillPulseEnabled: true,
      pillPulseMs: 5200,
      chipWaveEnabled: true,
      chipWaveMs: 8600,
      chipWaveDelaySeconds: 0.75,
      borderGlowEnabled: true,
      borderGlowMs: 8200,
      sectionBorderSweepEnabled: true,
      sectionBorderSweepMs: 6800,
      sectionBottomGlowAnimated: true,
      sectionBottomGlowMs: 5600,
      statusBreatheEnabled: true,
      statusBreatheMs: 3600,
      headingBreatheEnabled: true,
      headingBreatheMs: 3800,
    },
  },
  ember: {
    key: 'ember',
    label: 'Ember',
    shortDescription: 'Richer copper surfaces with the most expressive motion.',
    palette: {
      light: {
        primary: {
          light: '#cc8752',
          main: '#b96e34',
          dark: '#8b4e21',
          contrastText: '#1a1010',
        },
        secondary: {
          light: '#8db5c4',
          main: '#5f8ea4',
          dark: '#456879',
        },
        text: {
          primary: '#202634',
          secondary: '#5f6a7d',
        },
        background: {
          default: '#e8e3db',
          paper: '#f8f4ef',
        },
      },
      dark: {
        primary: {
          light: '#d99561',
          main: '#c7793f',
          dark: '#995627',
          contrastText: '#180f0f',
        },
        secondary: {
          light: '#8cbbcd',
          main: '#669db5',
          dark: '#4b7386',
        },
        text: {
          primary: '#f2f2f1',
          secondary: '#c5cbd4',
        },
        background: {
          default: '#111722',
          paper: '#1a2433',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'],
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.36,
        cardGradientStartAlpha: 0.95,
        cardGradientEndAlpha: 0.86,
        cardBorderAlpha: 0.3,
        cardShadowAlpha: 0.18,
        cardBlurPx: 12,
        panelSurfaceAlpha: 0.76,
        panelBorderAlpha: 0.24,
        accentTintAlpha: 0.18,
        secondaryTintAlpha: 0.18,
        secondaryBorderAlpha: 0.28,
        selectedSurfaceAlpha: 0.12,
        glowStrength: 1.1,
        textGlowStrength: 0.9,
        secondaryGlowStrength: 0.82,
        sectionBottomGlowOpacity: 0.5,
        sectionBorderSweepOpacity: 0.78,
      },
      dark: {
        backgroundOverlayOpacity: 0.5,
        cardGradientStartAlpha: 0.82,
        cardGradientEndAlpha: 0.9,
        cardBorderAlpha: 0.46,
        cardShadowAlpha: 0.4,
        cardBlurPx: 12,
        panelSurfaceAlpha: 0.6,
        panelBorderAlpha: 0.4,
        accentTintAlpha: 0.28,
        secondaryTintAlpha: 0.24,
        secondaryBorderAlpha: 0.36,
        selectedSurfaceAlpha: 0.22,
        glowStrength: 1.18,
        textGlowStrength: 0.95,
        secondaryGlowStrength: 0.9,
        sectionBottomGlowOpacity: 0.62,
        sectionBorderSweepOpacity: 0.82,
      },
    },
    motion: {
      tabHoverShimmerMs: 500,
      pillPulseEnabled: true,
      pillPulseMs: 5200,
      chipWaveEnabled: true,
      chipWaveMs: 8600,
      chipWaveDelaySeconds: 0.75,
      borderGlowEnabled: true,
      borderGlowMs: 8200,
      sectionBorderSweepEnabled: true,
      sectionBorderSweepMs: 6800,
      sectionBottomGlowAnimated: true,
      sectionBottomGlowMs: 5600,
      statusBreatheEnabled: true,
      statusBreatheMs: 3600,
      headingBreatheEnabled: true,
      headingBreatheMs: 3800,
    },
  },
};

export const appAppearanceOptions = Object.values(appAppearancePresets);

export const resolveAppearanceTreatment = (
  mode: PaletteMode,
  appAppearanceKey: AppAppearanceKey
): AppResolvedTreatment => {
  const preset = appAppearancePresets[appAppearanceKey];

  return {
    key: preset.key,
    surface: preset.surface[mode],
    motion: preset.motion,
  };
};

export const isAppAppearanceKey = (value: string | null): value is AppAppearanceKey =>
  value !== null && value in appAppearancePresets;
