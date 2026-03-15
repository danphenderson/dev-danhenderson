import type { ReactNode, RefObject } from 'react';
import { motion, useInView } from 'motion/react';
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
} from './variants';

/* ------------------------------------------------------------------ */
/*  Shared helper: margin type cast                                   */
/* ------------------------------------------------------------------ */

/**
 * Casts a CSS margin string to the template-literal `MarginType` that
 * motion/react's `useInView` expects.  The runtime value is identical;
 * only the compile-time type changes.
 */
const asMargin = (m: string) =>
  m as Parameters<typeof useInView>[1] extends { margin?: infer M } ? M : never;

const useMotionInView = <Element extends HTMLElement>(
  ref: RefObject<Element>,
  rootMargin: string,
  once: boolean,
  threshold?: number
) =>
  useInView(ref, {
    once,
    margin: asMargin(rootMargin),
    amount: threshold || undefined,
  });

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
}

/**
 * Scroll-triggered section reveal.
 *
 * Wraps content in a `motion.div` that animates from `hidden` → `visible`
 * when the element enters the viewport.
 */
export const MotionSection = ({
  children,
  variants = fadeInUp,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0,
  once = true,
  ...rest
}: MotionSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(ref, rootMargin, once, threshold);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
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
  /** IntersectionObserver margin. */
  rootMargin?: string;
  /** Play animation only once (default true). */
  once?: boolean;
}

/**
 * Scroll-triggered stagger container.
 *
 * Each direct child should be wrapped in a `MotionItem` or `motion.div`
 * with its own `variants` prop for stagger to work correctly.
 * This component provides the container orchestration.
 */
export const StaggerChildren = ({
  children,
  containerVariants = staggerContainer,
  rootMargin = '0px 0px -8% 0px',
  once = true,
  ...rest
}: StaggerChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(ref, rootMargin, once);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
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
 */
export const MotionCard = ({
  children,
  disableHover = false,
  hoverState,
  tapState,
  ...rest
}: MotionCardProps) => {
  return (
    <motion.div
      whileHover={!disableHover ? hoverState ?? hoverLift : undefined}
      whileTap={!disableHover ? tapState ?? tapShrink : undefined}
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
  return (
    <motion.img
      whileHover={!disableHover ? hoverZoom : undefined}
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
  return (
    <motion.div variants={variants} {...rest}>
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
  const isInView = useMotionInView(ref, rootMargin, once);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeIn}
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
  const isInView = useMotionInView(ref, rootMargin, once);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleIn}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
