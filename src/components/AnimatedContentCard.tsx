import { useEffect, useRef, useState } from 'react';
import { Box, Zoom } from '@mui/material';
import type { ElementType } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  DEFAULT_INTERSECTION_ROOT_MARGIN,
  DEFAULT_INTERSECTION_THRESHOLD,
  useMotionScale,
} from '../motion';
import { useAppStyles } from '../styles/appStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import type { AnimatedContentCardEntranceDirection } from '../types/ui';
import { normalizeSxProp } from '../utils/sx';
import { ContentCard } from './ContentCard';
import type { ContentCardProps } from './ContentCard';

export const ANIMATED_CARD_DURATION_MS = 280;
const DIRECTIONAL_ENTRANCE_OFFSET_PX = 40;

type AnimatedContentCardProps<RootComponent extends ElementType = 'div'> =
  ContentCardProps<RootComponent> & {
    delayMs?: number;
    triggerOnView?: boolean;
    visible?: boolean;
    entranceDirection?: AnimatedContentCardEntranceDirection;
    skipEntranceAnimation?: boolean;
    threshold?: number;
    rootMargin?: string;
    containerSx?: SxProps<Theme>;
    onVisible?: () => void;
  };

export const AnimatedContentCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  visible,
  entranceDirection = 'zoom',
  skipEntranceAnimation = false,
  threshold = DEFAULT_INTERSECTION_THRESHOLD,
  rootMargin = DEFAULT_INTERSECTION_ROOT_MARGIN,
  onVisible,
  ...props
}: AnimatedContentCardProps<RootComponent>) => (
  <AnimatedCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    visible={visible}
    entranceDirection={entranceDirection}
    skipEntranceAnimation={skipEntranceAnimation}
    threshold={threshold}
    rootMargin={rootMargin}
    onVisible={onVisible}
    {...props}
  />
);

const AnimatedCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  visible,
  entranceDirection = 'zoom',
  skipEntranceAnimation = false,
  threshold = DEFAULT_INTERSECTION_THRESHOLD,
  rootMargin = DEFAULT_INTERSECTION_ROOT_MARGIN,
  containerSx,
  onVisible,
  ...props
}: AnimatedContentCardProps<RootComponent>) => {
  const appStyles = useAppStyles();
  const { duration: dFactor } = useMotionScale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasNotifiedVisibleRef = useRef(false);
  const [hasTriggered, setHasTriggered] = useState(skipEntranceAnimation);
  const [isVisible, setIsVisible] = useState(skipEntranceAnimation);
  const isVisibilityControlled = typeof visible === 'boolean';
  const containerSxArray = normalizeSxProp(containerSx);
  const shouldRenderWithoutEntranceDelay = skipEntranceAnimation || dFactor === 0;

  useEffect(() => {
    if (skipEntranceAnimation) {
      if (!hasTriggered) {
        setHasTriggered(true);
      }
      return undefined;
    }
    if (isVisibilityControlled) {
      return undefined;
    }
    if (!triggerOnView) {
      setHasTriggered(true);
      return;
    }
    if (typeof window === 'undefined') {
      setHasTriggered(true);
      return;
    }
    if (typeof window.IntersectionObserver !== 'function') {
      setHasTriggered(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    hasTriggered,
    isVisibilityControlled,
    rootMargin,
    skipEntranceAnimation,
    threshold,
    triggerOnView,
  ]);

  useEffect(() => {
    if (skipEntranceAnimation) {
      if (!isVisible) {
        setIsVisible(true);
      }
      return undefined;
    }
    if (isVisibilityControlled) {
      if (!visible) {
        if (isVisible) {
          setIsVisible(false);
        }
        return undefined;
      }
      if (isVisible) return undefined;
      if (shouldRenderWithoutEntranceDelay || typeof window === 'undefined') {
        setIsVisible(true);
        return undefined;
      }
      const timeoutId = window.setTimeout(() => setIsVisible(true), Math.max(0, delayMs));
      return () => window.clearTimeout(timeoutId);
    }
    if (isVisible || !hasTriggered) return undefined;
    if (shouldRenderWithoutEntranceDelay || typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }
    const timeoutId = window.setTimeout(() => setIsVisible(true), Math.max(0, delayMs));
    return () => window.clearTimeout(timeoutId);
  }, [
    delayMs,
    hasTriggered,
    isVisible,
    isVisibilityControlled,
    shouldRenderWithoutEntranceDelay,
    skipEntranceAnimation,
    visible,
  ]);

  const isEligibleToShow = isVisibilityControlled ? Boolean(visible) : hasTriggered;
  const isRenderedVisible = shouldRenderWithoutEntranceDelay ? isEligibleToShow : isVisible;

  useEffect(() => {
    if (!isRenderedVisible || !onVisible || hasNotifiedVisibleRef.current) {
      return;
    }

    hasNotifiedVisibleRef.current = true;
    onVisible();
  }, [isRenderedVisible, onVisible]);

  const content = <ContentCard {...props} />;
  const transitionDurationMs = Math.round(ANIMATED_CARD_DURATION_MS * dFactor);
  const isDirectionalEntrance = entranceDirection !== 'zoom';
  const isDirectionalHidden = isDirectionalEntrance && !isRenderedVisible;
  const hiddenDirectionalTransform =
    entranceDirection === 'left'
      ? `translate3d(-${DIRECTIONAL_ENTRANCE_OFFSET_PX}px, 0, 0)`
      : `translate3d(${DIRECTIONAL_ENTRANCE_OFFSET_PX}px, 0, 0)`;
  const directionalTransition = shouldRenderWithoutEntranceDelay
    ? 'none'
    : `opacity ${transitionDurationMs}ms ${SPRING_EASING_CSS}, transform ${transitionDurationMs}ms ${SPRING_EASING_CSS}`;

  return (
    <Box ref={containerRef} sx={[appStyles.animatedCardContainerSx, ...containerSxArray]}>
      {isDirectionalEntrance ? (
        <Box
          aria-hidden={isDirectionalHidden || undefined}
          sx={{
            opacity: isDirectionalHidden ? 0 : 1,
            visibility: isDirectionalHidden ? 'hidden' : 'visible',
            pointerEvents: isDirectionalHidden ? 'none' : undefined,
            transform: isDirectionalHidden ? hiddenDirectionalTransform : 'translate3d(0, 0, 0)',
            transition: directionalTransition,
            willChange: shouldRenderWithoutEntranceDelay ? 'auto' : 'opacity, transform',
          }}
        >
          {content}
        </Box>
      ) : (
        <Zoom
          in={isRenderedVisible}
          appear={!shouldRenderWithoutEntranceDelay}
          timeout={shouldRenderWithoutEntranceDelay ? 0 : transitionDurationMs}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
        >
          <Box>{content}</Box>
        </Zoom>
      )}
    </Box>
  );
};
