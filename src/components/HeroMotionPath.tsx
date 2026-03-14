import { useEffect } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * Keyframes that define the circular / spiral entrance path.
 *
 * Coordinates are **transform offsets** relative to the element's natural
 * (resting) layout position, so (0, 0) = final resting spot.
 *
 * The sequence traces a counter-clockwise arc:
 *   center → left-and-down → far-left at resting height → swing right
 *   below resting → slight overshoot right → settle at origin.
 *
 * Scale is intentionally omitted — the nested AnimatedContentCard's MUI Zoom
 * transition already handles the zoom-in entrance, so adding scale here would
 * cause a double-scale effect.
 */
const PATH_X = [0, 0, -80, -130, -60, 15, 0];
const PATH_Y = [-250, -250, -180, -20, 50, 10, 0];

/**
 * Normalised time stops for each keyframe (0 → 1).
 *
 *   0.00 → 0.12 : hold at centre while the inner Zoom entrance plays (~280 ms)
 *   0.12 → 1.00 : circular travel to resting position
 */
const PATH_TIMES = [0, 0.12, 0.3, 0.52, 0.72, 0.9, 1];

/** Total entrance duration in seconds (hold + travel). */
const ENTRANCE_DURATION_S = 2.5;

interface HeroMotionPathProps {
  /** When true the entrance animation sequence begins. */
  active: boolean;
  children: React.ReactNode;
  /** Fires once the full motion-path animation has completed. */
  onComplete?: () => void;
}

export const HeroMotionPath = ({
  active,
  children,
  onComplete,
}: HeroMotionPathProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (active && prefersReducedMotion) {
      onComplete?.();
    }
  }, [active, prefersReducedMotion, onComplete]);

  if (!active || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ x: PATH_X[0], y: PATH_Y[0] }}
      animate={{ x: PATH_X, y: PATH_Y }}
      transition={{
        duration: ENTRANCE_DURATION_S,
        times: PATH_TIMES,
        ease: [0.4, 0, 0.2, 1],
      }}
      onAnimationComplete={() => onComplete?.()}
    >
      {children}
    </motion.div>
  );
};
