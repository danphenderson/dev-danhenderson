import { keyframes } from '@emotion/react';

/**
 * Shimmer sweep – a translucent highlight that slides across an element.
 * Applied via a `::after` pseudo-element with a linear-gradient background.
 * Used on: section overline labels, GitHub section header.
 */
export const shimmerSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

/**
 * Ambient pulse – fades a pseudo-element's opacity in and out.
 * The pseudo-element carries a themed box-shadow that acts as a glow.
 * Used on: industry tags, skill chips, contribution chips.
 */
export const ambientPulse = keyframes`
  0%, 100% { opacity: 0; }
  50%      { opacity: 1; }
`;

/**
 * Background sweep – slides a background-position shimmer across the element.
 * Used directly on chip background-image gradients.
 * Used on: GitHub activity rows, skill chip wave.
 */
export const backgroundSweep = keyframes`
  0%       { background-position: 200% center; }
  100%     { background-position: -200% center; }
`;

/**
 * Breathe – a very gentle opacity oscillation for inline text.
 * Used on: "Open to opportunities" status text.
 */
export const breathe = keyframes`
  0%, 100% { opacity: 0.78; }
  50%      { opacity: 1; }
`;

/** Disable all ambient animations when the user prefers reduced motion. */
export const reducedMotionSx = {
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none !important',
    '&::before, &::after': {
      animation: 'none !important',
    },
  },
} as const;
