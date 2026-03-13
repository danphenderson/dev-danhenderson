import { PaletteMode } from '@mui/material';
import { alpha, createTheme } from '@mui/material/styles';
import {
  appAppearancePresets,
  resolveAppearanceTreatment,
  type AppAppearanceKey,
} from './appAppearance';

export const createAppTheme = (mode: PaletteMode, appearanceKey: AppAppearanceKey) => {
  const appearancePreset = appAppearancePresets[appearanceKey];
  const appearanceTreatment = resolveAppearanceTreatment(mode, appearanceKey);
  const bodyFontFamily = appearancePreset.typography.bodyFontFamily;
  const headingFontFamily = appearancePreset.typography.headingFontFamily;
  const resolvedPalette = appearancePreset.palette[mode];
  const textPrimary = resolvedPalette.text.primary;
  const textSecondary = resolvedPalette.text.secondary;

  return createTheme({
    appearanceTreatment,
    palette: {
      mode,
      primary: resolvedPalette.primary,
      secondary: resolvedPalette.secondary,
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      background: resolvedPalette.background,
      divider: alpha(textPrimary, mode === 'light' ? 0.14 : 0.2),
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: bodyFontFamily.join(','),
      h1: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 700,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        lineHeight: 1.1,
      },
      h2: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 700,
        fontSize: 'clamp(1.65rem, 3vw, 2.25rem)',
        lineHeight: 1.15,
      },
      h3: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 700,
        fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
        lineHeight: 1.2,
      },
      h4: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 600,
        fontSize: 'clamp(1.3rem, 2.1vw, 1.65rem)',
        lineHeight: 1.2,
      },
      h5: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 600,
        fontSize: '1.22rem',
        lineHeight: 1.25,
      },
      h6: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 600,
        fontSize: '1.06rem',
        lineHeight: 1.3,
      },
      subtitle1: {
        fontSize: '1.02rem',
        lineHeight: 1.4,
        fontWeight: 600,
      },
      subtitle2: {
        fontSize: '0.96rem',
        lineHeight: 1.35,
        fontWeight: 600,
      },
      body1: {
        fontSize: '1.02rem',
        lineHeight: 1.58,
      },
      body2: {
        fontSize: '0.97rem',
        lineHeight: 1.58,
      },
      overline: {
        fontFamily: headingFontFamily.join(','),
        fontWeight: 700,
        letterSpacing: '0.12em',
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            height: '100%',
            width: '100%',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            scrollBehavior: 'smooth',
          },
          body: {
            height: '100%',
            width: '100%',
            margin: 0,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          '#root': {
            minHeight: '100%',
          },
          a: {
            color: theme.palette.primary.main,
            textDecoration: 'none',
          },
          'a:hover': {
            textDecoration: 'underline',
          },
        }),
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(
              theme.palette.primary.contrastText,
              theme.palette.mode === 'light' ? 0.88 : 0.86
            ),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.24 : 0.36)}`,
            backdropFilter: 'blur(10px)',
          }),
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 999,
            paddingInline: 14,
          },
          outlined: ({ theme }) => ({
            borderColor: alpha(theme.palette.primary.main, 0.5),
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 999,
            borderColor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.25 : 0.45),
          }),
        },
      },
      MuiSpeedDial: {
        defaultProps: {
          FabProps: {
            size: 'medium',
          },
        },
        styleOverrides: {
          fab: ({ theme }) => ({
            color: theme.palette.text.primary,
            backgroundColor: alpha(
              theme.palette.background.paper,
              Math.min(theme.appearanceTreatment.surface.panelSurfaceAlpha + (theme.palette.mode === 'light' ? 0.18 : 0.24), 0.96)
            ),
            border: `1px solid ${alpha(theme.palette.primary.main, Math.min(theme.appearanceTreatment.surface.panelBorderAlpha + 0.08, 0.58))}`,
            boxShadow: theme.palette.mode === 'light'
              ? `0 12px 28px ${alpha(theme.palette.common.black, theme.appearanceTreatment.surface.cardShadowAlpha + 0.02)}`
              : `0 14px 30px ${alpha(theme.palette.common.black, theme.appearanceTreatment.surface.cardShadowAlpha)}`,
            backdropFilter: `blur(${theme.appearanceTreatment.surface.cardBlurPx + 2}px)`,
            '&:hover': {
              backgroundColor: alpha(
                theme.palette.background.paper,
                Math.min(theme.appearanceTreatment.surface.panelSurfaceAlpha + (theme.palette.mode === 'light' ? 0.22 : 0.3), 1)
              ),
            },
            '&:focus-visible': {
              outline: `2px solid ${alpha(theme.palette.primary.light, 0.72)}`,
              outlineOffset: 3,
            },
          }),
          actions: {
            gap: 8,
            paddingBlock: 8,
          },
        },
      },
      MuiSpeedDialAction: {
        defaultProps: {
          tooltipPlacement: 'left',
        },
        styleOverrides: {
          fab: ({ theme }) => ({
            color: theme.palette.text.primary,
            backgroundColor: alpha(
              theme.palette.background.paper,
              Math.min(theme.appearanceTreatment.surface.panelSurfaceAlpha + (theme.palette.mode === 'light' ? 0.2 : 0.28), 0.98)
            ),
            border: `1px solid ${alpha(theme.palette.primary.main, Math.min(theme.appearanceTreatment.surface.panelBorderAlpha + 0.04, 0.52))}`,
            boxShadow: theme.palette.mode === 'light'
              ? `0 10px 22px ${alpha(theme.palette.common.black, Math.max(theme.appearanceTreatment.surface.cardShadowAlpha - 0.02, 0.1))}`
              : `0 12px 24px ${alpha(theme.palette.common.black, Math.max(theme.appearanceTreatment.surface.cardShadowAlpha - 0.05, 0.22))}`,
            '&:hover': {
              backgroundColor: alpha(
                theme.palette.background.paper,
                Math.min(theme.appearanceTreatment.surface.panelSurfaceAlpha + (theme.palette.mode === 'light' ? 0.24 : 0.32), 1)
              ),
            },
            '&:focus-visible': {
              outline: `2px solid ${alpha(theme.palette.primary.light, 0.7)}`,
              outlineOffset: 3,
            },
          }),
          staticTooltipLabel: ({ theme }) => ({
            ...theme.typography.button,
            color: theme.palette.text.primary,
            backgroundColor: alpha(
              theme.palette.background.paper,
              Math.min(theme.appearanceTreatment.surface.panelSurfaceAlpha + (theme.palette.mode === 'light' ? 0.22 : 0.3), 0.98)
            ),
            border: `1px solid ${alpha(theme.palette.primary.main, theme.appearanceTreatment.surface.panelBorderAlpha)}`,
            borderRadius: 999,
            boxShadow: theme.palette.mode === 'light'
              ? `0 10px 22px ${alpha(theme.palette.common.black, Math.max(theme.appearanceTreatment.surface.cardShadowAlpha - 0.04, 0.08))}`
              : `0 12px 24px ${alpha(theme.palette.common.black, Math.max(theme.appearanceTreatment.surface.cardShadowAlpha - 0.07, 0.18))}`,
            padding: '6px 12px',
            backdropFilter: `blur(${theme.appearanceTreatment.surface.cardBlurPx + 2}px)`,
          }),
        },
      },
      MuiSpeedDialIcon: {
        styleOverrides: {
          icon: {
            fontSize: 24,
          },
          openIcon: {
            fontSize: 22,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            overflow: 'hidden',
            '&::before': {
              display: 'none',
            },
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
  });
};
