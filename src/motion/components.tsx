import type { ReactNode, RefObject } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { Variants, HTMLMotionProps, TargetAndTransition } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';
import { springOptions } from './tokens';
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
  initial,
  animate,
  ...rest
}: StaggerChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(ref, rootMargin, once);

  return (
    <motion.div
      ref={ref}
      initial={initial ?? 'hidden'}
      animate={animate ?? (isInView ? 'visible' : 'hidden')}
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

/* ------------------------------------------------------------------ */
/*  MotionTiltCard                                                     */
/* ------------------------------------------------------------------ */

interface MotionTiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Multiplier on the base tilt magnitude. At 1 the axis rotation peaks at ±12°. */
  intensity?: number;
  /** Disables all pointer-follow updates when true. */
  disabled?: boolean;
}

const TILT_DEG = 6;

/**
 * 3D mouse-follow tilt card.
 *
 * Tracks the pointer within the element and applies spring-animated
 * `rotateX` / `rotateY` transforms for a subtle depth effect.
 * Fully suppressed when `prefers-reduced-motion` is set or `disabled` is true.
 */
export const MotionTiltCard = ({
  children,
  className,
  style,
  intensity = 1,
  disabled = false,
}: MotionTiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const tiltEnabled = !disabled && !prefersReduced;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, springOptions.tilt);
  const rotateY = useSpring(rawX, springOptions.tilt);

  const setWillChange = useCallback((active: boolean) => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.style.willChange = active ? 'transform' : '';
  }, []);

  useEffect(() => {
    if (!tiltEnabled) {
      setWillChange(false);
    }
  }, [setWillChange, tiltEnabled]);

  const handleMouseEnter = useCallback(() => {
    if (!tiltEnabled) {
      return;
    }

    setWillChange(true);
  }, [setWillChange, tiltEnabled]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltEnabled) return;
      setWillChange(true);
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(nx * TILT_DEG * 2 * intensity);
      rawY.set(-ny * TILT_DEG * 2 * intensity);
    },
    [rawX, rawY, intensity, setWillChange, tiltEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setWillChange(false);
  }, [rawX, rawY, setWillChange]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};
