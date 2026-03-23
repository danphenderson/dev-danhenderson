import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useReducedMotion } from 'motion/react';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFERENCES, isPaletteMode, PREFERENCE_STORAGE_KEYS } from './theme/preferences';
import {
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
  effectiveMotionIntensity: MotionIntensityLevel;
  isSystemMotionOverrideActive: boolean;
  setAppearance: (appearance: AppAppearanceKey) => void;
  setMotionIntensity: (level: MotionIntensityLevel) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: DEFAULT_PREFERENCES.theme,
  appearance: DEFAULT_PREFERENCES.appearance,
  motionIntensity: DEFAULT_PREFERENCES.motionIntensity,
  effectiveMotionIntensity: DEFAULT_PREFERENCES.motionIntensity,
  isSystemMotionOverrideActive: false,
  setAppearance: () => {},
  setMotionIntensity: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps extends PropsWithChildren<{}> {}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES.theme;

    try {
      const stored = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.theme);
      return isPaletteMode(stored) ? stored : DEFAULT_PREFERENCES.theme;
    } catch {
      return DEFAULT_PREFERENCES.theme;
    }
  });
  const [appearance, setAppearance] = useState<AppAppearanceKey>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES.appearance;

    try {
      const storedAppearance = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.appearance);
      return isAppAppearanceKey(storedAppearance)
        ? storedAppearance
        : DEFAULT_PREFERENCES.appearance;
    } catch {
      return DEFAULT_PREFERENCES.appearance;
    }
  });
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensityLevel>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES.motionIntensity;

    try {
      const stored = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
      return isMotionIntensityLevel(stored) ? stored : DEFAULT_PREFERENCES.motionIntensity;
    } catch {
      return DEFAULT_PREFERENCES.motionIntensity;
    }
  });
  const prefersReducedMotion = !!useReducedMotion();
  const effectiveMotionIntensity: MotionIntensityLevel = prefersReducedMotion
    ? 'off'
    : motionIntensity;
  const theme = useMemo(
    () => createAppTheme(mode, appearance, effectiveMotionIntensity),
    [appearance, effectiveMotionIntensity, mode]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.theme, mode);
    } catch {
      /* localStorage unavailable */
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.appearance, appearance);
    } catch {
      /* localStorage unavailable */
    }
  }, [appearance]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, motionIntensity);
    } catch {
      /* localStorage unavailable */
    }
  }, [motionIntensity]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!children) return null;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        appearance,
        motionIntensity,
        effectiveMotionIntensity,
        isSystemMotionOverrideActive: prefersReducedMotion,
        setAppearance,
        setMotionIntensity,
        toggleTheme,
      }}
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
