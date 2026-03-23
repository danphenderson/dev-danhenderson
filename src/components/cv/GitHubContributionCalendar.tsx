import { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { GitHubCalendar } from 'react-github-calendar';
import { DEFAULT_INTERSECTION_ROOT_MARGIN, MotionTiltCard } from '../../motion';
import { ContentCard } from '../ContentCard';
import { useComponentStyles } from '../../styles/componentStyles';
import { Text } from '../text';
import { getMaxScrollLeft, isElementInViewport } from '../../utils/dom';
import { easeOutCubic } from '../../utils/easing';

type GitHubContributionCalendarProps = {
  username: string;
  contained?: boolean;
  skipEntranceAnimation?: boolean;
  onEntranceComplete?: () => void;
};

const CALENDAR_SCROLL_CONTAINER_SELECTOR = '.react-activity-calendar__scroll-container';
const CALENDAR_SCROLL_DURATION_MS = 900;

export const GitHubContributionCalendar = ({
  username,
  contained = true,
  skipEntranceAnimation = false,
  onEntranceComplete,
}: GitHubContributionCalendarProps) => {
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerLookupFrameRef = useRef<number | null>(null);
  const hasNotifiedEntranceCompleteRef = useRef(false);
  const {
    contentCardInsetSx,
    githubCalendarColorScheme,
    githubCalendarContainerSx,
    githubCalendarSizeSx,
    githubCalendarTheme,
  } = useComponentStyles();
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [hasIntersectionTrigger, setHasIntersectionTrigger] = useState(skipEntranceAnimation);
  const [hasEnteredView, setHasEnteredView] = useState(skipEntranceAnimation);
  const [hasCompletedEntrance, setHasCompletedEntrance] = useState(skipEntranceAnimation);

  useEffect(() => {
    if (!skipEntranceAnimation) {
      return;
    }

    setHasIntersectionTrigger(true);
    setHasEnteredView(true);
    setHasCompletedEntrance(true);
  }, [skipEntranceAnimation]);

  useEffect(() => {
    const wrapper = calendarWrapperRef.current;

    if (!wrapper) {
      return undefined;
    }

    if (scrollContainer?.isConnected) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    let cancelled = false;

    const resolveScrollContainer = () => {
      if (cancelled) {
        return;
      }

      const nextScrollContainer = wrapper.querySelector<HTMLDivElement>(
        CALENDAR_SCROLL_CONTAINER_SELECTOR
      );

      if (nextScrollContainer) {
        nextScrollContainer.scrollLeft = hasCompletedEntrance
          ? getMaxScrollLeft(nextScrollContainer)
          : 0;
        setScrollContainer((currentScrollContainer) =>
          currentScrollContainer === nextScrollContainer
            ? currentScrollContainer
            : nextScrollContainer
        );
        return;
      }

      if (typeof window.requestAnimationFrame !== 'function') {
        return;
      }

      containerLookupFrameRef.current = window.requestAnimationFrame(resolveScrollContainer);
    };

    resolveScrollContainer();

    return () => {
      cancelled = true;

      if (typeof containerLookupFrameRef.current === 'number') {
        window.cancelAnimationFrame(containerLookupFrameRef.current);
        containerLookupFrameRef.current = null;
      }
    };
  }, [hasCompletedEntrance, scrollContainer]);

  useEffect(() => {
    const wrapper = calendarWrapperRef.current;

    if (!wrapper || hasEnteredView || hasCompletedEntrance || skipEntranceAnimation) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      setHasEnteredView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersectionTrigger(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: DEFAULT_INTERSECTION_ROOT_MARGIN }
    );

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [hasCompletedEntrance, hasEnteredView, skipEntranceAnimation]);

  useEffect(() => {
    const wrapper = calendarWrapperRef.current;

    if (
      !wrapper ||
      !hasIntersectionTrigger ||
      hasEnteredView ||
      hasCompletedEntrance ||
      skipEntranceAnimation
    ) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      setHasEnteredView(true);
      return undefined;
    }

    let visibilityFrameId: number | undefined;
    const resolveViewportEntry = () => {
      visibilityFrameId = undefined;

      if (isElementInViewport(wrapper)) {
        setHasEnteredView(true);
        return true;
      }

      return false;
    };
    const queueViewportCheck = () => {
      if (typeof visibilityFrameId === 'number') {
        window.cancelAnimationFrame(visibilityFrameId);
      }

      if (typeof window.requestAnimationFrame !== 'function') {
        resolveViewportEntry();
        return;
      }

      visibilityFrameId = window.requestAnimationFrame(resolveViewportEntry);
    };

    queueViewportCheck();
    window.addEventListener('scroll', queueViewportCheck, { passive: true });
    window.addEventListener('resize', queueViewportCheck);

    return () => {
      window.removeEventListener('scroll', queueViewportCheck);
      window.removeEventListener('resize', queueViewportCheck);

      if (typeof visibilityFrameId === 'number') {
        window.cancelAnimationFrame(visibilityFrameId);
      }
    };
  }, [hasCompletedEntrance, hasEnteredView, hasIntersectionTrigger, skipEntranceAnimation]);

  useEffect(() => {
    if (!scrollContainer || !hasEnteredView || hasCompletedEntrance || skipEntranceAnimation) {
      return undefined;
    }

    const maxScrollLeft = getMaxScrollLeft(scrollContainer);

    if (maxScrollLeft <= 0) {
      setHasCompletedEntrance(true);
      return undefined;
    }

    const completeEntrance = () => {
      scrollContainer.scrollLeft = maxScrollLeft;
      animationFrameRef.current = null;
      setHasCompletedEntrance(true);
    };

    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      completeEntrance();
      return undefined;
    }

    scrollContainer.scrollLeft = 0;

    let animationStartTime: number | undefined;

    const animate = (timestamp: number) => {
      if (typeof animationStartTime !== 'number') {
        animationStartTime = timestamp;
      }

      const progress = Math.min((timestamp - animationStartTime) / CALENDAR_SCROLL_DURATION_MS, 1);
      scrollContainer.scrollLeft = maxScrollLeft * easeOutCubic(progress);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      completeEntrance();
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (typeof animationFrameRef.current === 'number') {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [hasCompletedEntrance, hasEnteredView, scrollContainer, skipEntranceAnimation]);

  useEffect(() => {
    if (!hasCompletedEntrance || !onEntranceComplete || hasNotifiedEntranceCompleteRef.current) {
      return;
    }

    hasNotifiedEntranceCompleteRef.current = true;
    onEntranceComplete();
  }, [hasCompletedEntrance, onEntranceComplete]);

  useEffect(() => {
    if (!scrollContainer || !hasCompletedEntrance || typeof window === 'undefined') {
      return undefined;
    }

    let lastClientWidth = scrollContainer.clientWidth;
    let lastScrollWidth = scrollContainer.scrollWidth;
    let ignoreNextScrollEvent = false;
    let hasUserScrolled = false;
    let resizeFrameId: number | undefined;
    const alignToRightEdge = () => {
      resizeFrameId = undefined;
      const nextScrollLeft = getMaxScrollLeft(scrollContainer);
      const scrollLeftChanged = scrollContainer.scrollLeft !== nextScrollLeft;

      if (scrollLeftChanged) {
        ignoreNextScrollEvent = true;
      }

      scrollContainer.scrollLeft = nextScrollLeft;
      lastClientWidth = scrollContainer.clientWidth;
      lastScrollWidth = scrollContainer.scrollWidth;

      if (scrollLeftChanged) {
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => {
            ignoreNextScrollEvent = false;
          });
        } else {
          ignoreNextScrollEvent = false;
        }
      }
    };
    const queueAlignment = (force = false) => {
      const clientWidthChanged = scrollContainer.clientWidth !== lastClientWidth;
      const scrollWidthChanged = scrollContainer.scrollWidth !== lastScrollWidth;

      if (!clientWidthChanged && !scrollWidthChanged) {
        return;
      }

      if (!force && hasUserScrolled) {
        lastClientWidth = scrollContainer.clientWidth;
        lastScrollWidth = scrollContainer.scrollWidth;
        return;
      }

      if (typeof resizeFrameId === 'number') {
        window.cancelAnimationFrame(resizeFrameId);
      }

      if (typeof window.requestAnimationFrame !== 'function') {
        alignToRightEdge();
        return;
      }

      resizeFrameId = window.requestAnimationFrame(alignToRightEdge);
    };
    const handleScroll = () => {
      if (ignoreNextScrollEvent) {
        ignoreNextScrollEvent = false;
        return;
      }

      hasUserScrolled = true;
    };
    const handleWindowResize = () => {
      queueAlignment(true);
    };
    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            queueAlignment();
          })
        : undefined;

    alignToRightEdge();
    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleWindowResize);
    resizeObserver?.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();

      if (typeof resizeFrameId === 'number') {
        window.cancelAnimationFrame(resizeFrameId);
      }
    };
  }, [hasCompletedEntrance, scrollContainer]);

  const calendarContent = (
    <Stack spacing={1}>
      <Text role="subsectionTitle" tone="support">
        Contribution calendar
      </Text>
      <Text role="bodyMuted">Yearly GitHub activity at a glance.</Text>
      <Box sx={githubCalendarContainerSx}>
        <Box ref={calendarWrapperRef} sx={githubCalendarSizeSx}>
          <GitHubCalendar
            username={username}
            blockSize={9}
            blockMargin={2}
            fontSize={12}
            colorScheme={githubCalendarColorScheme}
            theme={githubCalendarTheme}
            showColorLegend
            showMonthLabels
            showTotalCount
          />
        </Box>
      </Box>
    </Stack>
  );

  const calendarSurface = contained ? (
    <ContentCard sx={contentCardInsetSx}>{calendarContent}</ContentCard>
  ) : (
    calendarContent
  );

  return <MotionTiltCard intensity={0.5}>{calendarSurface}</MotionTiltCard>;
};
