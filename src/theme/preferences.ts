import type { PaletteMode } from '@mui/material';
import type { AudioConsent } from '../types/ui';
import {
  defaultAppAppearanceKey,
  defaultMotionIntensity,
  type AppAppearanceKey,
  type MotionIntensityLevel,
} from './appAppearance';

type UserPreferences = {
  theme: PaletteMode;
  appearance: AppAppearanceKey;
  motionIntensity: MotionIntensityLevel;
  audioConsent: AudioConsent;
};

export const PREFERENCE_STORAGE_KEYS = {
  theme: 'danhenderson-theme',
  appearance: 'danhenderson-appearance',
  motionIntensity: 'danhenderson-motion',
  audioConsent: 'danhenderson-welcome-audio-consent',
} as const;

export const LEGACY_AUDIO_PROMPT_STORAGE_KEY = 'danhenderson-welcome-audio-prompt';

export const DEFAULT_PREFERENCES: Readonly<UserPreferences> = {
  theme: 'dark',
  appearance: defaultAppAppearanceKey,
  motionIntensity: defaultMotionIntensity,
  audioConsent: 'unknown',
};

export const isPaletteMode = (value: string | null): value is PaletteMode =>
  value === 'light' || value === 'dark';

export const isAudioConsent = (value: string | null): value is AudioConsent =>
  value === 'unknown' || value === 'granted' || value === 'declined';
