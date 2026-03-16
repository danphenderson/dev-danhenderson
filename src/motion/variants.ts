import type { Variants } from 'motion/react';
import { duration, easing, stagger } from './tokens';

/* ------------------------------------------------------------------ */
/*  Element-level variants                                            */
/* ------------------------------------------------------------------ */

/** Fade in + slide up – the workhorse section-reveal animation. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.decel },
  },
};

/** Simple opacity crossfade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
};

/** Scale up from 92 % with fade – card/panel entrance. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.spring },
  },
};

/* ------------------------------------------------------------------ */
/*  Container (stagger) variants                                      */
/* ------------------------------------------------------------------ */

/** Stagger children with default timing. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: stagger.fast,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Hover / tap micro-interaction variants                            */
/* ------------------------------------------------------------------ */

/** Subtle card lift on hover. */
export const hoverLift = {
  scale: 1.02,
  y: -4,
  transition: { duration: duration.fast, ease: easing.smooth },
} as const;

/** Gentle press for tap feedback. */
export const tapShrink = {
  scale: 0.98,
  transition: { duration: duration.instant },
} as const;

/** Image zoom on hover (for gallery thumbnails). */
export const hoverZoom = {
  scale: 1.05,
  transition: { duration: duration.normal, ease: easing.smooth },
} as const;
