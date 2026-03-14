import { motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from '@mui/material/styles';

/**
 * Thin accent-coloured progress bar fixed to the top of the viewport.
 *
 * Uses the Motion library's `useScroll` to track vertical scroll progress
 * and `useSpring` for smooth, physics-based interpolation. The bar is
 * invisible at the top of the page and fills to 100 % at the bottom.
 *
 * Hidden when the user prefers reduced motion (continuous animation of
 * the bar could be distracting).
 */
export const ScrollProgressBar = () => {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      data-testid="scroll-progress-bar"
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        zIndex: theme.zIndex.appBar + 2,
        pointerEvents: 'none',
      }}
    />
  );
};
