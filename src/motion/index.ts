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

export {
  duration,
  cssDuration,
  easing,
  stagger,
  transition,
  springOptions,
  DEFAULT_INTERSECTION_THRESHOLD,
  DEFAULT_INTERSECTION_ROOT_MARGIN,
} from './tokens';

export {
  fadeInUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  hoverLift,
  tapShrink,
  hoverZoom,
  storySlideVariants,
  slideContentContainer,
  slideContentItem,
  storyContentContainer,
  storyLabelReveal,
  storyTitleReveal,
  storyMetaReveal,
  storyBodyReveal,
  storyChipsReveal,
  storyLinkReveal,
  storyBulletContainer,
  storyBulletItem,
} from './variants';

export {
  MotionSection,
  StaggerChildren,
  MotionCard,
  MotionImage,
  MotionItem,
  MotionFadeIn,
  MotionScaleIn,
  MotionTiltCard,
} from './components';
