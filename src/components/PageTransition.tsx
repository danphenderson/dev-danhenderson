import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { duration, useMotionScale, scaleDuration } from '../motion';
import { SPRING_EASING_MOTION } from '../styles/springEasing';

/** Subtle vertical offset (px) for the enter slide-up effect. */
const ENTER_Y_OFFSET = 8;

interface PageTransitionProps {
  children: ReactNode;
  pathname?: string;
}

/**
 * Crossfade + slide-up wrapper for route transitions.
 *
 * Wraps `<Routes>` so that navigating between pages plays a quick
 * opacity + translateY entrance and a fast opacity-only exit.
 */
export const PageTransition = ({ children, pathname }: PageTransitionProps) => {
  const location = useLocation();
  const { duration: dFactor } = useMotionScale();
  const scaledDuration = scaleDuration(duration.quick, dFactor);
  const routePathname = pathname ?? location.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routePathname}
        initial={dFactor === 0 ? false : { opacity: 0, y: ENTER_Y_OFFSET }}
        animate={{ opacity: 1, y: 0 }}
        exit={dFactor === 0 ? undefined : { opacity: 0 }}
        transition={{
          duration: scaledDuration,
          ease: SPRING_EASING_MOTION,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
