import type { PaletteMode } from '@mui/material';
import type { AppAppearanceKey, MotionIntensityLevel } from '../theme/appAppearance';

/**
 * Consent state for the welcome-audio feature.
 *
 * - `'unknown'` — the user has not yet been prompted.
 * - `'granted'` — the user opted in; the audio widget may load and play.
 * - `'declined'` — the user opted out; the audio widget must not load.
 */
export type AudioConsent = 'unknown' | 'granted' | 'declined';

/**
 * Persisted user preferences.
 *
 * Each field maps to a `localStorage` key defined in
 * `PREFERENCE_STORAGE_KEYS` (`src/constants/preferences.ts`).
 */
export type UserPreferences = {
  /** Active colour-scheme mode. */
  theme: PaletteMode;
  /** Active appearance preset key. */
  appearance: AppAppearanceKey;
  /** Active motion-intensity level. */
  motionIntensity: MotionIntensityLevel;
  /** Welcome-audio consent state. */
  audioConsent: AudioConsent;
};
