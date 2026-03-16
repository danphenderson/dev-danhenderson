import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { duration } from '../motion';
import { SPRING_EASING_MOTION } from '../styles/springEasing';

/** Subtle vertical offset (px) for the enter slide-up effect. */
const ENTER_Y_OFFSET = 8;

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Crossfade + slide-up wrapper for route transitions.
 *
 * Wraps `<Routes>` so that navigating between pages plays a quick
 * opacity + translateY entrance and a fast opacity-only exit.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: ENTER_Y_OFFSET }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: duration.quick,
          ease: SPRING_EASING_MOTION,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
