import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const MOTION_PATH_DURATION_S = 2;
const MOTION_PATH_RADIUS = 40;

const getCirclePath = (r: number) =>
  `path("M 0 0 A ${r} ${r} 0 0 1 0 ${-2 * r} A ${r} ${r} 0 0 1 0 0")`;

type HeroMotionPathProps = {
  children: ReactNode;
  playing: boolean;
  onComplete?: () => void;
};

export const HeroMotionPath = ({ children, playing, onComplete }: HeroMotionPathProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [arrived, setArrived] = useState(false);

  const handleComplete = useCallback(() => {
    setArrived(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (playing && prefersReducedMotion) {
      handleComplete();
    }
  }, [playing, prefersReducedMotion, handleComplete]);

  if (prefersReducedMotion) {
    return <div data-testid="hero-motion-path">{children}</div>;
  }

  return (
    <motion.div
      data-testid="hero-motion-path"
      style={{
        offsetPath: getCirclePath(MOTION_PATH_RADIUS),
        offsetRotate: '0deg',
        width: '100%',
      }}
      initial={{ offsetDistance: '0%' }}
      animate={
        playing
          ? { offsetDistance: '100%' }
          : { offsetDistance: '0%' }
      }
      transition={{
        duration: MOTION_PATH_DURATION_S,
        ease: 'easeInOut',
      }}
      onAnimationComplete={() => {
        if (playing && !arrived) {
          handleComplete();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const HERO_MOTION_PATH_DURATION_MS = MOTION_PATH_DURATION_S * 1000;
