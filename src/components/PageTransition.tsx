import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SPRING_EASING_MOTION } from '../styles/springEasing';

/** Duration in seconds for the page crossfade transition. */
const PAGE_TRANSITION_DURATION_S = 0.18;

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
 * Respects `prefers-reduced-motion` by skipping animation entirely.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: ENTER_Y_OFFSET }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: PAGE_TRANSITION_DURATION_S,
          ease: SPRING_EASING_MOTION,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
