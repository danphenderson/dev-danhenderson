import { deepOrange } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import {
  alpha,
  createTheme,
  SxProps,
  Theme,
  ThemeProvider as MuiThemeProvider,
  useTheme as useMuiTheme,
} from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'danhenderson-theme';

const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: '#61cef5',
        main: '#1ba8e0',
        dark: '#067daf',
        contrastText: '#061426',
      },
      secondary: {
        light: '#ffbf9d',
        main: deepOrange[500],
        dark: deepOrange[700],
      },
      text: {
        primary: mode === 'light' ? '#102238' : '#e6eef9',
        secondary: mode === 'light' ? '#3b516d' : '#b7c7de',
      },
      background: {
        default: mode === 'light' ? '#dbe6f1' : '#0a1525',
        paper: mode === 'light' ? '#f6fbff' : '#0f1f35',
      },
      divider: mode === 'light' ? alpha('#102238', 0.14) : alpha('#e6eef9', 0.2),
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: ['Source Sans 3', 'Helvetica Neue', 'Arial', 'sans-serif'].join(','),
      h1: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 700,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        lineHeight: 1.1,
      },
      h2: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 700,
        fontSize: 'clamp(1.65rem, 3vw, 2.25rem)',
        lineHeight: 1.15,
      },
      h3: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 700,
        fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
        lineHeight: 1.2,
      },
      h4: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 650,
        fontSize: 'clamp(1.3rem, 2.1vw, 1.65rem)',
        lineHeight: 1.2,
      },
      h5: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 650,
        fontSize: '1.22rem',
        lineHeight: 1.25,
      },
      h6: {
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
        fontWeight: 650,
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
        fontFamily: ['Space Grotesk', 'Source Sans 3', 'sans-serif'].join(','),
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
            backgroundColor:
              theme.palette.mode === 'light'
                ? alpha('#0f253f', 0.88)
                : alpha('#08111f', 0.86),
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
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            overflow: 'hidden',
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

type ThemeContextValue = {
  theme: Theme;
  mode: PaletteMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: createAppTheme('light'),
  mode: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps extends PropsWithChildren<{}> {}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as PaletteMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!children) return null;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const useCvStyles = () => {
  const theme = useMuiTheme();

  const styles = useMemo(() => {
    const accentColor = theme.palette.primary.main;
    const isLight = theme.palette.mode === 'light';
    const cardBackground = isLight
      ? 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(242,250,255,0.84) 100%)'
      : 'linear-gradient(145deg, rgba(11,25,46,0.84) 0%, rgba(9,20,37,0.88) 100%)';

    const glassPanelSx: SxProps<Theme> = {
      background: cardBackground,
      border: `1px solid ${alpha(accentColor, isLight ? 0.24 : 0.36)}`,
      boxShadow: isLight
        ? '0 12px 32px rgba(15, 34, 56, 0.18)'
        : '0 14px 36px rgba(0, 0, 0, 0.38)',
      backdropFilter: 'blur(12px)',
      color: theme.palette.text.primary,
    };

    const contentCardSx: SxProps<Theme> = {
      borderRadius: 3,
      border: `1px solid ${alpha(accentColor, isLight ? 0.26 : 0.4)}`,
      background: cardBackground,
      boxShadow: isLight
        ? '0 10px 28px rgba(15, 34, 56, 0.16)'
        : '0 12px 32px rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(10px)',
      p: { xs: 2, md: 2.5 },
      transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
    };

    const overlineSx: SxProps<Theme> = {
      color: accentColor,
      letterSpacing: '0.18em',
      fontWeight: 700,
      textTransform: 'uppercase',
    };

    const linkStyle = { color: theme.palette.primary.light, textDecoration: 'none' as const };
    const subtleBorder = `1px solid ${alpha(accentColor, isLight ? 0.2 : 0.38)}`;
    const subtleSurface = alpha(theme.palette.background.paper, isLight ? 0.74 : 0.58);
    const accentTint = alpha(accentColor, isLight ? 0.14 : 0.24);

    return {
      accentColor,
      accentTint,
      glassPanelSx,
      contentCardSx,
      overlineSx,
      linkStyle,
      subtleBorder,
      subtleSurface,
    };
  }, [theme]);

  return styles;
};

export default ThemeProvider;
