import { motion, useScroll, useSpring } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useTheme } from '@mui/material/styles';
import { useMotionScale } from '../motion';

const BASE_STIFFNESS = 120;
const BASE_DAMPING = 28;

type ProgressBarProps = {
  scaleX: MotionValue<number>;
  background: string;
  zIndex: number;
};

const ProgressBar = ({ scaleX, background, zIndex }: ProgressBarProps) => (
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
      background,
      zIndex,
      pointerEvents: 'none',
    }}
  />
);

type SmoothedProgressBarProps = {
  scrollYProgress: MotionValue<number>;
  durationFactor: number;
  background: string;
  zIndex: number;
};

const SmoothedProgressBar = ({
  scrollYProgress,
  durationFactor,
  background,
  zIndex,
}: SmoothedProgressBarProps) => {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: BASE_STIFFNESS / durationFactor,
    damping: BASE_DAMPING,
    restDelta: 0.001,
  });

  return <ProgressBar scaleX={scaleX} background={background} zIndex={zIndex} />;
};

/**
 * Thin accent-coloured progress bar fixed to the top of the viewport.
 *
 * Uses the Motion library's `useScroll` to track vertical scroll progress
 * and `useSpring` for smooth, physics-based interpolation. The bar is
 * invisible at the top of the page and fills to 100 % at the bottom.
 */
export const ScrollProgressBar = () => {
  const theme = useTheme();
  const { duration: dFactor } = useMotionScale();
  const { scrollYProgress } = useScroll();
  const background = `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const zIndex = theme.zIndex.appBar + 2;

  if (dFactor === 0) {
    return <ProgressBar scaleX={scrollYProgress} background={background} zIndex={zIndex} />;
  }

  return (
    <SmoothedProgressBar
      scrollYProgress={scrollYProgress}
      durationFactor={dFactor}
      background={background}
      zIndex={zIndex}
    />
  );
};
