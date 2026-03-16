/**
 * Motion system — unified animation foundation for danhenderson.dev.
 *
 * Re-exports tokens (durations, easing, stagger timings), reusable
 * motion variants, and ready-to-use animated primitives.
 *
 * Usage:
 *
 *   import { MotionSection, fadeInUp, duration } from '../motion';
 */

export { duration, easing, stagger, transition } from './tokens';

export {
  fadeInUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  hoverLift,
  tapShrink,
  hoverZoom,
} from './variants';

export {
  MotionSection,
  StaggerChildren,
  MotionCard,
  MotionImage,
  MotionItem,
  MotionFadeIn,
  MotionScaleIn,
} from './components';
