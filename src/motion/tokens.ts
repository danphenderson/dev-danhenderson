import type { Transition } from 'motion/react';
import { SPRING_EASING_MOTION } from '../styles/springEasing';

/* ------------------------------------------------------------------ */
/*  Duration tokens (seconds)                                         */
/* ------------------------------------------------------------------ */

export const duration = {
  /** Micro-interactions: hover states, button presses. */
  instant: 0.12,
  /** CSS micro-transitions: interactive surface hover, icon-button feedback. */
  quick: 0.18,
  /** Quick feedback: toggles, small reveals. */
  fast: 0.2,
  /** Default UI transitions: cards, panels. */
  normal: 0.35,
  /** Larger reveals: sections, hero entrances. */
  slow: 0.5,
  /** Dramatic reveals: page-level choreography. */
  dramatic: 0.7,
} as const;

/* ------------------------------------------------------------------ */
/*  CSS-formatted duration strings                                     */
/* ------------------------------------------------------------------ */

/**
 * CSS-formatted counterparts of the `duration` tokens.
 *
 * Use these in CSS `transition` shorthands and Emotion `sx` props
 * instead of hard-coding raw millisecond or second strings.
 *
 * Example:
 *   transition: `opacity ${cssDuration.fast} ${SPRING_EASING_CSS}`
 */
export const cssDuration = {
  instant: `${duration.instant}s`,
  quick: `${duration.quick}s`,
  fast: `${duration.fast}s`,
  normal: `${duration.normal}s`,
  slow: `${duration.slow}s`,
  dramatic: `${duration.dramatic}s`,
} as const;

/* ------------------------------------------------------------------ */
/*  Easing tokens                                                     */
/* ------------------------------------------------------------------ */

export const easing = {
  /** Standard ease-out for most transitions. */
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  /** Spring-like overshoot for playful entrances. */
  spring: SPRING_EASING_MOTION,
  /** Deceleration curve for incoming content. */
  decel: [0, 0, 0.2, 1] as [number, number, number, number],
  /** Acceleration curve for exiting content. */
  accel: [0.4, 0, 1, 1] as [number, number, number, number],
} as const;

/* ------------------------------------------------------------------ */
/*  Stagger tokens (seconds)                                          */
/* ------------------------------------------------------------------ */

export const stagger = {
  /** Tight stagger for related items in a list. */
  fast: 0.04,
  /** Default stagger for card grids and section items. */
  normal: 0.08,
  /** Relaxed stagger for large sections. */
  slow: 0.12,
} as const;

/* ------------------------------------------------------------------ */
/*  IntersectionObserver defaults                                     */
/* ------------------------------------------------------------------ */

/** Default IntersectionObserver threshold shared by animated components. */
export const DEFAULT_INTERSECTION_THRESHOLD = 0;

/**
 * Default IntersectionObserver rootMargin shared by animated components.
 *
 * Triggers callbacks when the target is within 10% of the bottom viewport
 * edge, creating a "slightly before it scrolls into view" entrance effect.
 */
export const DEFAULT_INTERSECTION_ROOT_MARGIN = '0px 0px -10% 0px';

/* ------------------------------------------------------------------ */
/*  Composite transition presets                                      */
/* ------------------------------------------------------------------ */

export const transition: Record<string, Transition> = {
  /** Physics-based spring for natural movement. */
  spring: { type: 'spring', stiffness: 260, damping: 22 },
  /** Smooth ease-out for general-purpose reveals. */
  smooth: { duration: duration.normal, ease: easing.smooth },
  /** Fast ease-out for micro-interactions. */
  snappy: { duration: duration.fast, ease: easing.smooth },
  /** Slow reveal for section entrances. */
  reveal: { duration: duration.slow, ease: easing.decel },
  /** Dramatic entrance with spring overshoot. */
  dramatic: { duration: duration.dramatic, ease: easing.spring },
} as const;
