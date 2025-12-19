import { deepOrange } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import {
  alpha,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  SxProps,
  Theme,
  useTheme as useMuiTheme,
} from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'danhenderson-theme';

const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: '#38bdf8',
        main: '#0ea5e9',
        dark: '#0284c7',
        contrastText: '#0b1021',
      },
      secondary: {
        light: '#ffb380',
        main: deepOrange[500],
        dark: deepOrange[700],
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#e2e8f0',
        secondary: mode === 'light' ? '#475569' : '#cbd5e1',
      },
      background: {
        default: mode === 'light' ? '#e8edf4' : '#0b1120',
        paper: mode === 'light' ? '#fdfdff' : '#111827',
      },
      divider: mode === 'light' ? alpha('#0f172a', 0.12) : alpha('#e2e8f0', 0.16),
    },
    spacing: 10,
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
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

    const glassPanelSx: SxProps<Theme> = {
      background: isLight
        ? 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%)'
        : 'linear-gradient(135deg, rgba(17,24,39,0.86) 0%, rgba(17,24,39,0.92) 100%)',
      border: `1px solid ${alpha(theme.palette.divider, isLight ? 0.6 : 0.5)}`,
      boxShadow: theme.shadows[8],
      backdropFilter: 'blur(12px)',
      color: theme.palette.text.primary,
    };

    const contentCardSx: SxProps<Theme> = {
      borderRadius: 2,
      border: `1px solid ${alpha(accentColor, isLight ? 0.2 : 0.35)}`,
      backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.9 : 0.65),
      boxShadow: theme.shadows[4],
      p: { xs: 2, md: 2.5 },
    };

    const overlineSx: SxProps<Theme> = {
      color: accentColor,
      letterSpacing: 2,
      fontWeight: 700,
      textTransform: 'uppercase',
    };

    const linkStyle = { color: theme.palette.text.primary, textDecoration: 'none' as const };
    const subtleBorder = `1px solid ${alpha(theme.palette.divider, isLight ? 0.4 : 0.5)}`;
    const subtleSurface = alpha(theme.palette.background.paper, isLight ? 0.92 : 0.7);
    const accentTint = alpha(accentColor, isLight ? 0.12 : 0.24);

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
