import type { ReactNode, ElementType } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { Variants, HTMLMotionProps, TargetAndTransition } from 'motion/react';
import { useRef } from 'react';
import {
  fadeInUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  hoverLift,
  tapShrink,
  hoverZoom,
  reducedFadeIn,
  reducedContainer,
} from './variants';

/* ------------------------------------------------------------------ */
/*  Shared helper: margin type cast                                   */
/* ------------------------------------------------------------------ */

/**
 * Casts a CSS margin string to the template-literal `MarginType` that
 * motion/react's `useInView` expects.  The runtime value is identical;
 * only the compile-time type changes.
 */
const asMargin = (m: string) => m as Parameters<typeof useInView>[1] extends { margin?: infer M } ? M : never;

/* ------------------------------------------------------------------ */
/*  MotionSection                                                     */
/* ------------------------------------------------------------------ */

interface MotionSectionProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  /** Variant set for the child animation. Defaults to `fadeInUp`. */
  variants?: Variants;
  /** IntersectionObserver margin. Negative bottom triggers early. */
  rootMargin?: string;
  /** Fraction of element visible before triggering. */
  threshold?: number;
  /** Play animation only once (default true). */
  once?: boolean;
  /** HTML tag to render. */
  as?: ElementType;
}

/**
 * Scroll-triggered section reveal.
 *
 * Wraps content in a `motion.div` that animates from `hidden` → `visible`
 * when the element enters the viewport. Respects reduced-motion by
 * substituting an instant-appear variant.
 */
export const MotionSection = ({
  children,
  variants = fadeInUp,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0,
  once = true,
  as: _as,
  ...rest
}: MotionSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: asMargin(rootMargin),
    amount: threshold || undefined,
  });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={prefersReduced ? reducedFadeIn : variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  StaggerChildren                                                   */
/* ------------------------------------------------------------------ */

interface StaggerChildrenProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  /** Stagger variant for the container. */
  containerVariants?: Variants;
  /** Variant applied to each child. */
  itemVariants?: Variants;
  /** IntersectionObserver margin. */
  rootMargin?: string;
  /** Play animation only once (default true). */
  once?: boolean;
}

/**
 * Scroll-triggered stagger container.
 *
 * Each direct child should be wrapped in a `motion.div` with
 * `variants={itemVariants}` for stagger to work correctly.
 * This component provides the container orchestration.
 */
export const StaggerChildren = ({
  children,
  containerVariants = staggerContainer,
  itemVariants: _itemVariants,
  rootMargin = '0px 0px -8% 0px',
  once = true,
  ...rest
}: StaggerChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: asMargin(rootMargin) });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={prefersReduced ? reducedContainer : containerVariants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  MotionCard                                                        */
/* ------------------------------------------------------------------ */

interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  /** Disable hover/tap interactions. */
  disableHover?: boolean;
  /** Custom hover state. */
  hoverState?: TargetAndTransition;
  /** Custom tap state. */
  tapState?: TargetAndTransition;
}

/**
 * Card wrapper with hover-lift and tap-shrink micro-interactions.
 *
 * The hover/tap effects are disabled when `prefers-reduced-motion`
 * is active to avoid motion sickness triggers.
 */
export const MotionCard = ({
  children,
  disableHover = false,
  hoverState,
  tapState,
  ...rest
}: MotionCardProps) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={!disableHover && !prefersReduced ? (hoverState ?? hoverLift) : undefined}
      whileTap={!disableHover && !prefersReduced ? (tapState ?? tapShrink) : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  MotionImage                                                       */
/* ------------------------------------------------------------------ */

interface MotionImageProps extends HTMLMotionProps<'img'> {
  /** Disable hover zoom. */
  disableHover?: boolean;
}

/**
 * Image element with hover-zoom micro-interaction for galleries.
 *
 * Uses `overflow: hidden` on the parent to clip the zoom effect.
 */
export const MotionImage = ({ disableHover = false, style, ...rest }: MotionImageProps) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.img
      whileHover={!disableHover && !prefersReduced ? hoverZoom : undefined}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...style }}
      {...rest}
    />
  );
};

/* ------------------------------------------------------------------ */
/*  MotionItem                                                        */
/* ------------------------------------------------------------------ */

interface MotionItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  /** Item variant. Defaults to `fadeInUp`. */
  variants?: Variants;
}

/**
 * Individual stagger-child item.
 *
 * Place inside a `StaggerChildren` container. Inherits `hidden`/`visible`
 * state from the parent and applies its own variant for the child animation.
 */
export const MotionItem = ({ children, variants = fadeInUp, ...rest }: MotionItemProps) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div variants={prefersReduced ? reducedFadeIn : variants} {...rest}>
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  MotionFadeIn                                                      */
/* ------------------------------------------------------------------ */

interface MotionFadeInProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  rootMargin?: string;
  once?: boolean;
}

/** Minimal scroll-triggered fade-in (no spatial transform). */
export const MotionFadeIn = ({
  children,
  rootMargin = '0px 0px -8% 0px',
  once = true,
  ...rest
}: MotionFadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: asMargin(rootMargin) });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={prefersReduced ? reducedFadeIn : fadeIn}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  MotionScaleIn                                                     */
/* ------------------------------------------------------------------ */

interface MotionScaleInProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  rootMargin?: string;
  once?: boolean;
}

/** Scroll-triggered scale + fade entrance. */
export const MotionScaleIn = ({
  children,
  rootMargin = '0px 0px -8% 0px',
  once = true,
  ...rest
}: MotionScaleInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: asMargin(rootMargin) });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={prefersReduced ? reducedFadeIn : scaleIn}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
