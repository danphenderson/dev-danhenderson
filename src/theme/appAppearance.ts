import { PaletteMode } from '@mui/material';

export type AppAppearanceKey = 'atlas' | 'evergreen' | 'ember' | 'solstice' | 'drift' | 'graphite';

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
  appBar: {
    background: string;
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

export type MotionIntensityLevel = 'off' | 'subtle' | 'default' | 'expressive';

export type MotionScaleFactors = {
  duration: number;
  tilt: number;
  stagger: number;
  cssAnimations: boolean;
};

export const MOTION_INTENSITY_STORAGE_KEY = 'danhenderson-motion';
export const defaultMotionIntensity: MotionIntensityLevel = 'default';

export const isMotionIntensityLevel = (value: string | null): value is MotionIntensityLevel =>
  value === 'off' || value === 'subtle' || value === 'default' || value === 'expressive';

export const motionIntensityScales: Record<MotionIntensityLevel, MotionScaleFactors> = {
  off: { duration: 0, tilt: 0, stagger: 0, cssAnimations: false },
  subtle: { duration: 0.5, tilt: 0.3, stagger: 0.5, cssAnimations: false },
  default: { duration: 1, tilt: 1, stagger: 1, cssAnimations: true },
  expressive: { duration: 1.3, tilt: 1.2, stagger: 1.3, cssAnimations: true },
};

export type AppResolvedTreatment = {
  key: AppAppearanceKey;
  surface: AppSurfaceTreatment;
  motion: AppMotionTreatment;
  motionScale: MotionScaleFactors;
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

const sharedMotion: AppMotionTreatment = {
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
};

export const appAppearancePresets: Record<AppAppearanceKey, AppAppearancePreset> = {
  atlas: {
    key: 'atlas',
    label: 'Atlas',
    shortDescription: 'Balanced technical surfaces with expressive motion.',
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
        appBar: {
          background: '#0a1e2c',
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
        appBar: {
          background: '#060f18',
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
    motion: sharedMotion,
  },
  evergreen: {
    key: 'evergreen',
    label: 'Evergreen',
    shortDescription: 'Calm editorial surfaces with expressive motion.',
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
        appBar: {
          background: '#1c2c26',
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
        appBar: {
          background: '#0a1412',
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
    motion: sharedMotion,
  },
  ember: {
    key: 'ember',
    label: 'Ember',
    shortDescription: 'Richer copper surfaces with expressive motion.',
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
        appBar: {
          background: '#1c1614',
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
        appBar: {
          background: '#0e0c10',
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
    motion: sharedMotion,
  },
  solstice: {
    key: 'solstice',
    label: 'Solstice',
    shortDescription: 'Golden amber and twilight violet for a celestial warmth.',
    palette: {
      light: {
        primary: {
          light: '#d4a254',
          main: '#b8860b',
          dark: '#886308',
          contrastText: '#1c1408',
        },
        secondary: {
          light: '#a78bbd',
          main: '#7b5ea2',
          dark: '#5a3f7a',
        },
        text: {
          primary: '#2a2118',
          secondary: '#6e5f52',
        },
        background: {
          default: '#ede4d4',
          paper: '#faf5ea',
        },
        appBar: {
          background: '#201a10',
        },
      },
      dark: {
        primary: {
          light: '#e2b86a',
          main: '#d4a030',
          dark: '#a07820',
          contrastText: '#14100a',
        },
        secondary: {
          light: '#b89fd0',
          main: '#8e6fb5',
          dark: '#694d8e',
        },
        text: {
          primary: '#f2ece0',
          secondary: '#c4b8a4',
        },
        background: {
          default: '#141018',
          paper: '#1e1824',
        },
        appBar: {
          background: '#100c16',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: serifHeadingFamily,
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.5,
        cardGradientStartAlpha: 0.95,
        cardGradientEndAlpha: 0.9,
        cardBorderAlpha: 0.22,
        cardShadowAlpha: 0.14,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.84,
        panelBorderAlpha: 0.16,
        accentTintAlpha: 0.1,
        secondaryTintAlpha: 0.12,
        secondaryBorderAlpha: 0.2,
        selectedSurfaceAlpha: 0.08,
        glowStrength: 0.45,
        textGlowStrength: 0.3,
        secondaryGlowStrength: 0.55,
        sectionBottomGlowOpacity: 0.24,
        sectionBorderSweepOpacity: 0.32,
      },
      dark: {
        backgroundOverlayOpacity: 0.62,
        cardGradientStartAlpha: 0.88,
        cardGradientEndAlpha: 0.92,
        cardBorderAlpha: 0.32,
        cardShadowAlpha: 0.34,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.68,
        panelBorderAlpha: 0.28,
        accentTintAlpha: 0.16,
        secondaryTintAlpha: 0.16,
        secondaryBorderAlpha: 0.26,
        selectedSurfaceAlpha: 0.14,
        glowStrength: 0.5,
        textGlowStrength: 0.35,
        secondaryGlowStrength: 0.6,
        sectionBottomGlowOpacity: 0.28,
        sectionBorderSweepOpacity: 0.36,
      },
    },
    motion: sharedMotion,
  },
  drift: {
    key: 'drift',
    label: 'Drift',
    shortDescription: 'Ocean blue and coral warmth inspired by coastal horizons.',
    palette: {
      light: {
        primary: {
          light: '#5da8c9',
          main: '#2e7da6',
          dark: '#1d5a7a',
          contrastText: '#f4f8fa',
        },
        secondary: {
          light: '#e8967c',
          main: '#d06b4e',
          dark: '#a04d35',
        },
        text: {
          primary: '#18262e',
          secondary: '#506874',
        },
        background: {
          default: '#dbe8ee',
          paper: '#f4f9fb',
        },
        appBar: {
          background: '#0e2232',
        },
      },
      dark: {
        primary: {
          light: '#6ebad8',
          main: '#3e94bd',
          dark: '#286d90',
          contrastText: '#0a1418',
        },
        secondary: {
          light: '#eda48e',
          main: '#d87c62',
          dark: '#b05a42',
        },
        text: {
          primary: '#e8f0f4',
          secondary: '#a8c0cc',
        },
        background: {
          default: '#0c161c',
          paper: '#142028',
        },
        appBar: {
          background: '#08121a',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'],
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.48,
        cardGradientStartAlpha: 0.94,
        cardGradientEndAlpha: 0.88,
        cardBorderAlpha: 0.2,
        cardShadowAlpha: 0.12,
        cardBlurPx: 10,
        panelSurfaceAlpha: 0.82,
        panelBorderAlpha: 0.16,
        accentTintAlpha: 0.1,
        secondaryTintAlpha: 0.1,
        secondaryBorderAlpha: 0.18,
        selectedSurfaceAlpha: 0.07,
        glowStrength: 0.5,
        textGlowStrength: 0.28,
        secondaryGlowStrength: 0.52,
        sectionBottomGlowOpacity: 0.26,
        sectionBorderSweepOpacity: 0.38,
      },
      dark: {
        backgroundOverlayOpacity: 0.6,
        cardGradientStartAlpha: 0.86,
        cardGradientEndAlpha: 0.9,
        cardBorderAlpha: 0.34,
        cardShadowAlpha: 0.3,
        cardBlurPx: 10,
        panelSurfaceAlpha: 0.66,
        panelBorderAlpha: 0.3,
        accentTintAlpha: 0.16,
        secondaryTintAlpha: 0.14,
        secondaryBorderAlpha: 0.26,
        selectedSurfaceAlpha: 0.14,
        glowStrength: 0.55,
        textGlowStrength: 0.32,
        secondaryGlowStrength: 0.58,
        sectionBottomGlowOpacity: 0.3,
        sectionBorderSweepOpacity: 0.42,
      },
    },
    motion: sharedMotion,
  },
  graphite: {
    key: 'graphite',
    label: 'Graphite',
    shortDescription: 'Cool slate surfaces with rose-gold accents for a refined edge.',
    palette: {
      light: {
        primary: {
          light: '#8895a4',
          main: '#5a6978',
          dark: '#3e4c5a',
          contrastText: '#faf8f6',
        },
        secondary: {
          light: '#d4a8a0',
          main: '#b8796e',
          dark: '#8e584e',
        },
        text: {
          primary: '#1e2228',
          secondary: '#5c636e',
        },
        background: {
          default: '#e2e4e8',
          paper: '#f6f6f8',
        },
        appBar: {
          background: '#1e2228',
        },
      },
      dark: {
        primary: {
          light: '#96a4b4',
          main: '#6e7f92',
          dark: '#4e5e6e',
          contrastText: '#0e1014',
        },
        secondary: {
          light: '#deb4ac',
          main: '#c48e84',
          dark: '#9c6860',
        },
        text: {
          primary: '#eaecf0',
          secondary: '#b0b6be',
        },
        background: {
          default: '#101216',
          paper: '#181c22',
        },
        appBar: {
          background: '#0a0e14',
        },
      },
    },
    typography: {
      bodyFontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'],
      headingFontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'],
    },
    surface: {
      light: {
        backgroundOverlayOpacity: 0.52,
        cardGradientStartAlpha: 0.96,
        cardGradientEndAlpha: 0.9,
        cardBorderAlpha: 0.2,
        cardShadowAlpha: 0.12,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.86,
        panelBorderAlpha: 0.14,
        accentTintAlpha: 0.08,
        secondaryTintAlpha: 0.1,
        secondaryBorderAlpha: 0.16,
        selectedSurfaceAlpha: 0.06,
        glowStrength: 0.3,
        textGlowStrength: 0.2,
        secondaryGlowStrength: 0.42,
        sectionBottomGlowOpacity: 0.2,
        sectionBorderSweepOpacity: 0.28,
      },
      dark: {
        backgroundOverlayOpacity: 0.64,
        cardGradientStartAlpha: 0.9,
        cardGradientEndAlpha: 0.94,
        cardBorderAlpha: 0.3,
        cardShadowAlpha: 0.3,
        cardBlurPx: 8,
        panelSurfaceAlpha: 0.7,
        panelBorderAlpha: 0.26,
        accentTintAlpha: 0.14,
        secondaryTintAlpha: 0.14,
        secondaryBorderAlpha: 0.24,
        selectedSurfaceAlpha: 0.12,
        glowStrength: 0.34,
        textGlowStrength: 0.24,
        secondaryGlowStrength: 0.48,
        sectionBottomGlowOpacity: 0.24,
        sectionBorderSweepOpacity: 0.32,
      },
    },
    motion: sharedMotion,
  },
};

export const appAppearanceOptions = Object.values(appAppearancePresets);

export const resolveAppearanceTreatment = (
  mode: PaletteMode,
  appAppearanceKey: AppAppearanceKey,
  motionIntensity: MotionIntensityLevel = 'default'
): AppResolvedTreatment => {
  const preset = appAppearancePresets[appAppearanceKey];
  const scale = motionIntensityScales[motionIntensity];
  const baseMotion = preset.motion;

  const motion: AppMotionTreatment = scale.cssAnimations
    ? baseMotion
    : {
        ...baseMotion,
        pillPulseEnabled: false,
        chipWaveEnabled: false,
        borderGlowEnabled: false,
        sectionBorderSweepEnabled: false,
        sectionBottomGlowAnimated: false,
        statusBreatheEnabled: false,
        headingBreatheEnabled: false,
      };

  return {
    key: preset.key,
    surface: preset.surface[mode],
    motion,
    motionScale: scale,
  };
};

export const isAppAppearanceKey = (value: string | null): value is AppAppearanceKey =>
  value !== null && value in appAppearancePresets;
