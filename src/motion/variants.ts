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
 * Uses scale + opacity + rotation + blur for a cinematic sweep.
 */
export const storySlideVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.88,
    rotate: direction * 4,
    x: direction * 60,
    filter: 'blur(4px)',
  }),
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: duration.slow,
      ease: easing.spring,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.88,
    rotate: direction * -4,
    x: direction * -60,
    filter: 'blur(4px)',
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

/* ------------------------------------------------------------------ */
/*  CV Story per-element reveal variants                              */
/* ------------------------------------------------------------------ */

/**
 * Enhanced story-mode content orchestration with wider timing for
 * breathing room between per-element reveals.
 */
export const storyContentContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.25,
    },
  },
};

/** Overline label — slide in from the left with spring overshoot. */
export const storyLabelReveal: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.fast, ease: easing.spring },
  },
};

/** Heading title — scale up with blur dissolve for a dramatic unveiling. */
export const storyTitleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: duration.slow, ease: easing.decel },
  },
};

/** Meta text (dates, locations) — fade in from the right. */
export const storyMetaReveal: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
};

/** Body text — gentle fade with subtle upward float. */
export const storyBodyReveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.decel },
  },
};

/** Skills chip container — scale from center with spring overshoot. */
export const storyChipsReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.spring },
  },
};

/** Link elements — subtle fade with upward drift, typically appears last. */
export const storyLinkReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
};

/** Nested stagger container for bullet lists inside story slides. */
export const storyBulletContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

/** Individual bullet item — slide in from the left. */
export const storyBulletItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.fast, ease: easing.decel },
  },
};

/* ------------------------------------------------------------------ */
/*  CV Story scroll-narrative variants                                */
/* ------------------------------------------------------------------ */

/** Section divider line — grow from center. */
export const storyDividerReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.decel },
  },
};
