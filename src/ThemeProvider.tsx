import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  APP_APPEARANCE_STORAGE_KEY,
  defaultAppAppearanceKey,
  isAppAppearanceKey,
  type AppAppearanceKey,
} from './theme/appAppearance';
import { createAppTheme } from './theme/createAppTheme';

const THEME_STORAGE_KEY = 'danhenderson-theme';

type ThemeContextValue = {
  mode: PaletteMode;
  appearance: AppAppearanceKey;
  setAppearance: (appearance: AppAppearanceKey) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  appearance: defaultAppAppearanceKey,
  setAppearance: () => {},
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

    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const [appearance, setAppearance] = useState<AppAppearanceKey>(() => {
    if (typeof window === 'undefined') return defaultAppAppearanceKey;

    const storedAppearance = window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY);
    return isAppAppearanceKey(storedAppearance) ? storedAppearance : defaultAppAppearanceKey;
  });
  const theme = useMemo(() => createAppTheme(mode, appearance), [appearance, mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appearance);
  }, [appearance]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!children) return null;

  return (
    <ThemeContext.Provider value={{ mode, appearance, setAppearance, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);

export default ThemeProvider;
