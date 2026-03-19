import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PREFERENCES,
  isPaletteMode,
  PREFERENCE_STORAGE_KEYS,
} from './constants/preferences';
import {
  defaultAppAppearanceKey,
  defaultMotionIntensity,
  isAppAppearanceKey,
  isMotionIntensityLevel,
  type AppAppearanceKey,
  type MotionIntensityLevel,
} from './theme/appAppearance';
import { createAppTheme } from './theme/createAppTheme';

type ThemeContextValue = {
  mode: PaletteMode;
  appearance: AppAppearanceKey;
  motionIntensity: MotionIntensityLevel;
  setAppearance: (appearance: AppAppearanceKey) => void;
  setMotionIntensity: (level: MotionIntensityLevel) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: DEFAULT_PREFERENCES.theme,
  appearance: defaultAppAppearanceKey,
  motionIntensity: defaultMotionIntensity,
  setAppearance: () => {},
  setMotionIntensity: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps extends PropsWithChildren<{}> {}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES.theme;

    const stored = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.theme);
    return isPaletteMode(stored) ? stored : DEFAULT_PREFERENCES.theme;
  });
  const [appearance, setAppearance] = useState<AppAppearanceKey>(() => {
    if (typeof window === 'undefined') return defaultAppAppearanceKey;

    const storedAppearance = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.appearance);
    return isAppAppearanceKey(storedAppearance) ? storedAppearance : defaultAppAppearanceKey;
  });
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensityLevel>(() => {
    if (typeof window === 'undefined') return defaultMotionIntensity;

    const stored = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
    return isMotionIntensityLevel(stored) ? stored : defaultMotionIntensity;
  });
  const theme = useMemo(
    () => createAppTheme(mode, appearance, motionIntensity),
    [appearance, mode, motionIntensity]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.theme, mode);
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.appearance, appearance);
  }, [appearance]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, motionIntensity);
  }, [motionIntensity]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!children) return null;

  return (
    <ThemeContext.Provider
      value={{ mode, appearance, motionIntensity, setAppearance, setMotionIntensity, toggleTheme }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);

export default ThemeProvider;
