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

/* ------------------------------------------------------------------ */
/*  CV Story slide variants                                           */
/* ------------------------------------------------------------------ */

/**
 * Direction-aware slide transition for the CV story viewer.
 * Pass `custom={direction}` to the motion element (direction: 1=forward, -1=backward).
 * Uses scale + opacity + rotation for an immersive card-flip feel.
 */
export const storySlideVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.86,
    rotate: direction * 6,
    x: direction * 40,
  }),
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: easing.spring,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.86,
    rotate: direction * -6,
    x: direction * -40,
    transition: {
      duration: duration.fast,
      ease: easing.accel,
    },
  }),
};

/**
 * Slide inner content orchestration — stagger children after the slide enters.
 * Use on the content wrapper inside each slide (not scroll-triggered).
 */
export const slideContentContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.slow,
      delayChildren: 0.18,
    },
  },
};

/**
 * Child item for slide inner stagger — slightly more dramatic than fadeInUp.
 */
export const slideContentItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.decel },
  },
};
