import { useEffect } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ANIMATED_CARD_DURATION_MS } from './AnimatedContentCard';

/**
 * SVG path describing the circular motion-path entrance.
 *
 * Coordinates are relative to the element's natural (resting) position:
 *   Start (0, -250) — approximately the vertical center of the viewport above
 *                      the hero's resting spot near the bottom of the page.
 *   End   (0, 0)    — the element's natural layout position.
 *
 * The two cubic-bézier segments create a single sweeping arc that curves to
 * the left and down, then loops back to the origin, giving a circular /
 * spiral feel.
 */
const HERO_MOTION_PATH =
  'M 0 -250 C -180 -280 -240 0 -100 80 C 40 160 60 30 0 0';

/** How long (seconds) the card travels along the circular path. */
const TRAVEL_DURATION_S = 2;

/** Delay (seconds) before the path travel starts — matches the Zoom entrance. */
const ZOOM_DELAY_S = ANIMATED_CARD_DURATION_MS / 1000;

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
      style={{
        offsetPath: `path("${HERO_MOTION_PATH}")`,
        offsetRotate: '0deg',
      }}
      initial={{ offsetDistance: '0%' }}
      animate={{ offsetDistance: '100%' }}
      transition={{
        delay: ZOOM_DELAY_S,
        duration: TRAVEL_DURATION_S,
        ease: [0.4, 0, 0.2, 1],
      }}
      onAnimationComplete={() => onComplete?.()}
    >
      {children}
    </motion.div>
  );
};
