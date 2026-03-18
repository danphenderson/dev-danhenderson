import { useTheme } from '@mui/material/styles';
import { useReducedMotion } from 'motion/react';
import { motionIntensityScales, type MotionScaleFactors } from '../theme/appAppearance';

/**
 * Single access point for the global motion scale factors.
 *
 * Reads the resolved `motionScale` from the MUI theme and forces the
 * `'off'` scale when the OS `prefers-reduced-motion` media query is active.
 */
export const useMotionScale = (): MotionScaleFactors => {
  const theme = useTheme();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return motionIntensityScales.off;
  }

  return theme.appearanceTreatment.motionScale;
};
