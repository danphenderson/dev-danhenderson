import type { PaletteMode } from '@mui/material';
import { defaultAppAppearanceKey, defaultMotionIntensity } from '../theme/appAppearance';
import type { UserPreferences } from '../types/preferences';

/* ------------------------------------------------------------------ */
/*  Storage keys                                                      */
/* ------------------------------------------------------------------ */

/** `localStorage` keys for each persisted user preference. */
export const PREFERENCE_STORAGE_KEYS = {
  theme: 'danhenderson-theme',
  appearance: 'danhenderson-appearance',
  motionIntensity: 'danhenderson-motion',
  audioConsent: 'danhenderson-welcome-audio-consent',
} as const;

/** @deprecated Retained for backward-compatible migration only. */
export const LEGACY_AUDIO_PROMPT_STORAGE_KEY = 'danhenderson-welcome-audio-prompt';

/* ------------------------------------------------------------------ */
/*  Defaults                                                          */
/* ------------------------------------------------------------------ */

/** Default preference values when no stored value exists. */
export const DEFAULT_PREFERENCES: Readonly<UserPreferences> = {
  theme: 'dark' as PaletteMode,
  appearance: defaultAppAppearanceKey,
  motionIntensity: defaultMotionIntensity,
  audioConsent: 'unknown',
};

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

/** Type-guard for `PaletteMode`. */
export const isPaletteMode = (value: string | null): value is PaletteMode =>
  value === 'light' || value === 'dark';

/** Type-guard for `AudioConsent`. */
export const isAudioConsent = (
  value: string | null
): value is UserPreferences['audioConsent'] =>
  value === 'unknown' || value === 'granted' || value === 'declined';
