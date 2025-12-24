import { ElementType, useEffect, useRef, useState } from 'react';
import { Box, Zoom } from '@mui/material';
import { ContentCard, ContentCardProps } from './ContentCard';

export const ANIMATED_CARD_BASE_DELAY_MS = 80;
export const ANIMATED_CARD_DURATION_MS = 480;
export const ANIMATED_CARD_SPEED_MULTIPLIER = 1.10;
const DEFAULT_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = '0px 0px 100% 0px';

type AnimatedContentCardProps<RootComponent extends ElementType = 'div'> = ContentCardProps<RootComponent> & {
  delayMs?: number;
  triggerOnView?: boolean;
  threshold?: number;
  rootMargin?: string;
};

export const AnimatedContentCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  ...props
}: AnimatedContentCardProps<RootComponent>) => (
  <AnimatedCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    threshold={threshold}
    rootMargin={rootMargin}
    {...props}
  />
);

const AnimatedCard = <RootComponent extends ElementType = 'div'>({
  delayMs = 0,
  triggerOnView = true,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  ...props
}: AnimatedContentCardProps<RootComponent>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const effectiveDelay = (delayMs + ANIMATED_CARD_BASE_DELAY_MS) * ANIMATED_CARD_SPEED_MULTIPLIER;

  useEffect(() => {
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
  }, [triggerOnView, threshold, rootMargin]);

  useEffect(() => {
    if (isVisible || !hasTriggered) return;
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }
    const timeoutId = window.setTimeout(() => setIsVisible(true), Math.max(0, effectiveDelay));
    return () => window.clearTimeout(timeoutId);
  }, [effectiveDelay, hasTriggered, isVisible]);

  return (
    <Zoom in={isVisible} timeout={ANIMATED_CARD_DURATION_MS * ANIMATED_CARD_SPEED_MULTIPLIER}>
      <Box ref={containerRef} sx={{ width: '100%' }}>
        <ContentCard {...props} />
      </Box>
    </Zoom>
  );
};
