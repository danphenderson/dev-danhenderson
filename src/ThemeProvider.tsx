import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  APP_APPEARANCE_STORAGE_KEY,
  MOTION_INTENSITY_STORAGE_KEY,
  defaultAppAppearanceKey,
  defaultMotionIntensity,
  isAppAppearanceKey,
  isMotionIntensityLevel,
  type AppAppearanceKey,
  type MotionIntensityLevel,
} from './theme/appAppearance';
import { createAppTheme } from './theme/createAppTheme';

const THEME_STORAGE_KEY = 'danhenderson-theme';
const DEFAULT_THEME_MODE: PaletteMode = 'dark';

type ThemeContextValue = {
  mode: PaletteMode;
  appearance: AppAppearanceKey;
  motionIntensity: MotionIntensityLevel;
  setAppearance: (appearance: AppAppearanceKey) => void;
  setMotionIntensity: (level: MotionIntensityLevel) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: DEFAULT_THEME_MODE,
  appearance: defaultAppAppearanceKey,
  motionIntensity: defaultMotionIntensity,
  setAppearance: () => {},
  setMotionIntensity: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps extends PropsWithChildren<{}> {}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_MODE;

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as PaletteMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return DEFAULT_THEME_MODE;
  });
  const [appearance, setAppearance] = useState<AppAppearanceKey>(() => {
    if (typeof window === 'undefined') return defaultAppAppearanceKey;

    const storedAppearance = window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY);
    return isAppAppearanceKey(storedAppearance) ? storedAppearance : defaultAppAppearanceKey;
  });
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensityLevel>(() => {
    if (typeof window === 'undefined') return defaultMotionIntensity;

    const stored = window.localStorage.getItem(MOTION_INTENSITY_STORAGE_KEY);
    return isMotionIntensityLevel(stored) ? stored : defaultMotionIntensity;
  });
  const theme = useMemo(
    () => createAppTheme(mode, appearance, motionIntensity),
    [appearance, mode, motionIntensity]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appearance);
  }, [appearance]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MOTION_INTENSITY_STORAGE_KEY, motionIntensity);
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
