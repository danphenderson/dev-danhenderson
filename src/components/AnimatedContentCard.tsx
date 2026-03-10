import { ElementType, useEffect, useRef, useState } from 'react';
import { Box, Zoom } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useAppStyles } from '../styles/appStyles';
import { ContentCard, ContentCardProps } from './ContentCard';

export const ANIMATED_CARD_DURATION_MS = 280;
const DEFAULT_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px';

type AnimatedContentCardProps<RootComponent extends ElementType = 'div'> = ContentCardProps<RootComponent> & {
  delayMs?: number;
  triggerOnView?: boolean;
  visible?: boolean;
  threshold?: number;
  rootMargin?: string;
  containerSx?: SxProps<Theme>;
};

export const AnimatedContentCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  visible,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  ...props
}: AnimatedContentCardProps<RootComponent>) => (
  <AnimatedCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    visible={visible}
    threshold={threshold}
    rootMargin={rootMargin}
    {...props}
  />
);

const AnimatedCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  visible,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  containerSx,
  ...props
}: AnimatedContentCardProps<RootComponent>) => {
  const appStyles = useAppStyles();
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibilityControlled = typeof visible === 'boolean';
  const containerSxArray = Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [];

  useEffect(() => {
    if (prefersReducedMotion) {
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
    if (!('IntersectionObserver' in window)) {
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
  }, [prefersReducedMotion, isVisibilityControlled, triggerOnView, threshold, rootMargin]);

  useEffect(() => {
    if (prefersReducedMotion) {
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
      if (typeof window === 'undefined') {
        setIsVisible(true);
        return undefined;
      }
      const timeoutId = window.setTimeout(() => setIsVisible(true), Math.max(0, delayMs));
      return () => window.clearTimeout(timeoutId);
    }
    if (isVisible || !hasTriggered) return undefined;
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }
    const timeoutId = window.setTimeout(() => setIsVisible(true), Math.max(0, delayMs));
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, hasTriggered, isVisible, prefersReducedMotion, isVisibilityControlled, visible]);

  const content = <ContentCard {...props} />;

  if (prefersReducedMotion) {
    return (
      <Box sx={[appStyles.animatedCardContainerSx, ...containerSxArray]}>
        {!isVisibilityControlled || visible ? content : null}
      </Box>
    );
  }

  return (
    <Zoom in={isVisible} timeout={ANIMATED_CARD_DURATION_MS}>
      <Box ref={containerRef} sx={[appStyles.animatedCardContainerSx, ...containerSxArray]}>
        {content}
      </Box>
    </Zoom>
  );
};
