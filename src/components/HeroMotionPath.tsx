import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactElement } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { normalizeSxProp } from '../utils/sx';

/**
 * Total entrance duration in seconds:
 * - initial hold so the nested MUI Zoom can play
 * - spiral travel to resting position
 */
const ENTRANCE_DURATION_S = 3.6;

/** Hold at the starting position while the inner Zoom entrance completes. */
const HOLD_FRACTION = 0.08;

/**
 * Spiral tuning:
 * - more turns => tighter / more obviously circular
 * - higher falloff => radius collapses faster near the end
 * - more samples => smoother motion
 */
const SPIRAL_TURNS = 1.35;
const RADIUS_FALLOFF = 1.15;
const SAMPLE_COUNT = 48;
const SETTLED_BORDER_RADIUS = '16px';
const SHELL_KEYFRAME_TIMES = [0, HOLD_FRACTION, 0.34, 0.6, 0.82, 1];
const SHELL_SCALE_KEYFRAMES = [1, 1, 0.94, 1.03, 0.985, 1];
const SHELL_ROTATE_KEYFRAMES = [0, 0, -7, 5, -2, 0];
const SHELL_BORDER_RADIUS_KEYFRAMES = [
  SETTLED_BORDER_RADIUS,
  SETTLED_BORDER_RADIUS,
  '28px 18px 30px 20px',
  '20px 30px 18px 28px',
  '18px 22px 16px 20px',
  SETTLED_BORDER_RADIUS,
];

interface HeroMotionPathProps {
  /** When true the entrance animation sequence begins. */
  active: boolean;
  children: React.ReactNode;
  /** Fires once the full motion-path animation has completed. */
  onComplete?: () => void;
}

interface SpiralKeyframes {
  x: number[];
  y: number[];
  times: number[];
}

type SxCapableElementProps = {
  sx?: SxProps<Theme>;
};

/**
 * Build a smooth spiral from the measured start offset (viewport centre)
 * back to the element's natural resting position (0, 0).
 *
 * Coordinates are transform offsets relative to the element's final layout
 * location, so:
 *   - (startX, startY) = centred launch point
 *   - (0, 0) = final resting spot on the page
 */
function buildSpiralKeyframes(startX: number, startY: number): SpiralKeyframes {
  const startRadius = Math.hypot(startX, startY);
  const startAngle = Math.atan2(startY, startX);

  // Hold at the starting position while the inner Zoom plays.
  const x = [startX, startX];
  const y = [startY, startY];
  const times = [0, HOLD_FRACTION];

  for (let i = 1; i <= SAMPLE_COUNT; i += 1) {
    const progress = i / SAMPLE_COUNT;

    // Ease the spiral inward by collapsing radius over time.
    const radius = startRadius * Math.pow(1 - progress, RADIUS_FALLOFF);

    // Advance around the circle as the radius shrinks.
    const angle = startAngle + SPIRAL_TURNS * Math.PI * 2 * progress;

    x.push(radius * Math.cos(angle));
    y.push(radius * Math.sin(angle));
    times.push(HOLD_FRACTION + progress * (1 - HOLD_FRACTION));
  }

  // Force an exact final settle.
  x[x.length - 1] = 0;
  y[y.length - 1] = 0;
  times[times.length - 1] = 1;

  return { x, y, times };
}

function inheritChildBorderRadius(children: React.ReactNode) {
  if (!isValidElement(children) || typeof children.type === 'string') {
    return children;
  }

  const child = children as ReactElement<SxCapableElementProps>;

  return cloneElement(child, {
    sx: [...normalizeSxProp(child.props.sx), { borderRadius: 'inherit' }],
  });
}

export const HeroMotionPath = ({ active, children, onComplete }: HeroMotionPathProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [startOffset, setStartOffset] = useState<{ x: number; y: number } | null>(null);

  /**
   * Measure the element's final resting position and compute the transform
   * needed to place it in the visual centre of the viewport.
   */
  useLayoutEffect(() => {
    if (!active || prefersReducedMotion) {
      setStartOffset(null);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      const finalCenterX = rect.left + rect.width / 2;
      const finalCenterY = rect.top + rect.height / 2;

      setStartOffset({
        x: window.innerWidth / 2 - finalCenterX,
        y: window.innerHeight / 2 - finalCenterY,
      });
    };

    measure();
  }, [active, prefersReducedMotion]);

  useEffect(() => {
    if (active && prefersReducedMotion) {
      onComplete?.();
    }
  }, [active, prefersReducedMotion, onComplete]);

  const keyframes = useMemo(() => {
    if (!startOffset) return null;
    return buildSpiralKeyframes(startOffset.x, startOffset.y);
  }, [startOffset]);

  if (!active || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      data-testid="hero-motion-path"
      ref={ref}
      initial={keyframes ? { x: keyframes.x[0], y: keyframes.y[0] } : false}
      animate={keyframes ? { x: keyframes.x, y: keyframes.y } : undefined}
      transition={
        keyframes
          ? {
              duration: ENTRANCE_DURATION_S,
              times: keyframes.times,
              ease: 'easeInOut',
            }
          : undefined
      }
      onAnimationComplete={() => onComplete?.()}
      style={!keyframes ? { visibility: 'hidden' } : undefined}
    >
      <motion.div
        data-testid="hero-motion-shell"
        initial={{
          scale: SHELL_SCALE_KEYFRAMES[0],
          rotate: SHELL_ROTATE_KEYFRAMES[0],
          borderRadius: SHELL_BORDER_RADIUS_KEYFRAMES[0],
        }}
        animate={{
          scale: SHELL_SCALE_KEYFRAMES,
          rotate: SHELL_ROTATE_KEYFRAMES,
          borderRadius: SHELL_BORDER_RADIUS_KEYFRAMES,
        }}
        transition={{
          duration: ENTRANCE_DURATION_S,
          times: SHELL_KEYFRAME_TIMES,
          ease: 'easeInOut',
        }}
        style={{
          display: 'block',
          transformOrigin: 'center center',
          borderRadius: SETTLED_BORDER_RADIUS,
          willChange: 'transform, border-radius',
        }}
      >
        {inheritChildBorderRadius(children)}
      </motion.div>
    </motion.div>
  );
};
