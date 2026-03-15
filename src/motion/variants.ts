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

/** Slide in from the left. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.decel },
  },
};

/** Slide in from the right. */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.decel },
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

/** Tight stagger for dense lists. */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.02,
    },
  },
};

/** Relaxed stagger for large section reveals. */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.slow,
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
