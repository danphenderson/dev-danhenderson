import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SPRING_EASING_MOTION } from '../styles/springEasing';

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

/**
 * Resting border-radius in px.  Must match the shell Paper's computed
 * border-radius so the transition from overflow:hidden to overflow:visible
 * is seamless.  (theme.shape.borderRadius = 14, sx borderRadius: 2 → 28px)
 */
const RESTING_BORDER_RADIUS = 28;

/**
 * In-flight keyframe milestones (progress 0..1 through the travel portion).
 * Multi-step sequence inspired by Motion's React keyframes example.
 */
const IN_FLIGHT_STOPS: ReadonlyArray<{
  t: number;
  scale: number;
  rotate: number;
  borderRadius: number;
}> = [
  { t: 0, scale: 1.0, rotate: 0, borderRadius: RESTING_BORDER_RADIUS },
  { t: 0.18, scale: 0.85, rotate: 10, borderRadius: 50 },
  { t: 0.42, scale: 1.1, rotate: -8, borderRadius: 44 },
  { t: 0.65, scale: 0.92, rotate: 5, borderRadius: 36 },
  { t: 0.85, scale: 1.04, rotate: -2, borderRadius: 30 },
  { t: 1.0, scale: 1.0, rotate: 0, borderRadius: RESTING_BORDER_RADIUS },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateStop(progress: number, prop: 'scale' | 'rotate' | 'borderRadius'): number {
  if (progress <= 0) return IN_FLIGHT_STOPS[0][prop];
  if (progress >= 1) return IN_FLIGHT_STOPS[IN_FLIGHT_STOPS.length - 1][prop];

  for (let i = 1; i < IN_FLIGHT_STOPS.length; i += 1) {
    if (progress <= IN_FLIGHT_STOPS[i].t) {
      const prev = IN_FLIGHT_STOPS[i - 1];
      const next = IN_FLIGHT_STOPS[i];
      const localT = (progress - prev.t) / (next.t - prev.t);
      return lerp(prev[prop], next[prop], localT);
    }
  }

  return IN_FLIGHT_STOPS[IN_FLIGHT_STOPS.length - 1][prop];
}

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
  scale: number[];
  rotate: number[];
  borderRadius: number[];
  times: number[];
}

/**
 * Build a smooth spiral from the measured start offset (viewport centre)
 * back to the element's natural resting position (0, 0).
 *
 * Coordinates are transform offsets relative to the element's final layout
 * location, so:
 *   - (startX, startY) = centred launch point
 *   - (0, 0) = final resting spot on the page
 *
 * Also produces in-flight keyframed transform arrays (scale, rotate,
 * borderRadius) synchronized with the spiral travel for a dynamic
 * entrance sequence.
 */
function buildSpiralKeyframes(startX: number, startY: number): SpiralKeyframes {
  const startRadius = Math.hypot(startX, startY);
  const startAngle = Math.atan2(startY, startX);

  // Hold at the starting position while the inner Zoom plays.
  const x = [startX, startX];
  const y = [startY, startY];
  const scale = [1, 1];
  const rotate = [0, 0];
  const borderRadius = [RESTING_BORDER_RADIUS, RESTING_BORDER_RADIUS];
  const times = [0, HOLD_FRACTION];

  for (let i = 1; i <= SAMPLE_COUNT; i += 1) {
    const progress = i / SAMPLE_COUNT;

    // Ease the spiral inward by collapsing radius over time.
    const radius = startRadius * Math.pow(1 - progress, RADIUS_FALLOFF);

    // Advance around the circle as the radius shrinks.
    const angle = startAngle + SPIRAL_TURNS * Math.PI * 2 * progress;

    x.push(radius * Math.cos(angle));
    y.push(radius * Math.sin(angle));

    // In-flight keyframed transforms synchronized with spiral travel.
    scale.push(interpolateStop(progress, 'scale'));
    rotate.push(interpolateStop(progress, 'rotate'));
    borderRadius.push(interpolateStop(progress, 'borderRadius'));

    times.push(HOLD_FRACTION + progress * (1 - HOLD_FRACTION));
  }

  // Force an exact final settle.
  x[x.length - 1] = 0;
  y[y.length - 1] = 0;
  scale[scale.length - 1] = 1;
  rotate[rotate.length - 1] = 0;
  borderRadius[borderRadius.length - 1] = RESTING_BORDER_RADIUS;
  times[times.length - 1] = 1;

  return { x, y, scale, rotate, borderRadius, times };
}

export const HeroMotionPath = ({ active, children, onComplete }: HeroMotionPathProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [startOffset, setStartOffset] = useState<{ x: number; y: number } | null>(null);
  const [settled, setSettled] = useState(false);

  /** Reset settled state when the path deactivates so a re-entrance replays. */
  useEffect(() => {
    if (!active) setSettled(false);
  }, [active]);

  /**
   * Measure the element's final resting position and compute the transform
   * needed to place it in the visual centre of the viewport.
   */
  useLayoutEffect(() => {
    if (!active) {
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
  }, [active]);

  const keyframes = useMemo(() => {
    if (!startOffset) return null;
    return buildSpiralKeyframes(startOffset.x, startOffset.y);
  }, [startOffset]);

  if (!active) {
    return <>{children}</>;
  }

  const motionStyle: React.CSSProperties | undefined = !keyframes
    ? { visibility: 'hidden' }
    : !settled
      ? { overflow: 'hidden' }
      : undefined;

  return (
    <motion.div
      ref={ref}
      initial={
        keyframes
          ? {
              x: keyframes.x[0],
              y: keyframes.y[0],
              scale: keyframes.scale[0],
              rotate: keyframes.rotate[0],
              borderRadius: keyframes.borderRadius[0],
            }
          : false
      }
      animate={
        keyframes
          ? {
              x: keyframes.x,
              y: keyframes.y,
              scale: keyframes.scale,
              rotate: keyframes.rotate,
              borderRadius: keyframes.borderRadius,
            }
          : undefined
      }
      transition={
        keyframes
          ? {
              duration: ENTRANCE_DURATION_S,
              times: keyframes.times,
              ease: SPRING_EASING_MOTION,
            }
          : undefined
      }
      onAnimationComplete={() => {
        setSettled(true);
        onComplete?.();
      }}
      style={motionStyle}
    >
      {children}
    </motion.div>
  );
};
