import { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import type { ElementType, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  DEFAULT_INTERSECTION_ROOT_MARGIN,
  DEFAULT_INTERSECTION_THRESHOLD,
  MotionTiltCard,
} from '../motion';
import { useComponentStyles } from '../styles/componentStyles';
import { normalizeSxProp } from '../utils/sx';
import { AnimatedContentCard } from './AnimatedContentCard';

type AnimatedContentListLayout = 'stack' | 'wrap';
type AnimatedContentItemSurface = 'card' | 'panel' | 'plain';

type AnimatedContentListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  layout?: AnimatedContentListLayout;
  startDelayMs?: number;
  itemStaggerMs?: number;
  stackSpacing?: number;
  wrapGap?: number;
  containerSx?: SxProps<Theme>;
  itemSx?: SxProps<Theme>;
  itemContainerSx?: SxProps<Theme>;
  itemSurface?: AnimatedContentItemSurface;
  mountItemsOnView?: boolean;
  skipEntranceAnimation?: boolean;
  mountThreshold?: number;
  mountRootMargin?: string;
  tiltItems?: boolean;
};

export const AnimatedContentList = <Item,>({
  items,
  getItemKey,
  renderItem,
  layout = 'stack',
  startDelayMs = 0,
  itemStaggerMs,
  stackSpacing = 0,
  wrapGap = 0.75,
  containerSx,
  itemSx,
  itemContainerSx,
  itemSurface = 'card',
  mountItemsOnView = false,
  skipEntranceAnimation = false,
  mountThreshold = DEFAULT_INTERSECTION_THRESHOLD,
  mountRootMargin = DEFAULT_INTERSECTION_ROOT_MARGIN,
  tiltItems = false,
}: AnimatedContentListProps<Item>) => {
  const {
    cardResetSx,
    getItemDelayMs,
    getWrapListSx,
    motionTokens,
    sectionPanelSx,
    wrapItemContainerSx,
  } = useComponentStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(!mountItemsOnView || skipEntranceAnimation);
  const containerSxArray = normalizeSxProp(containerSx);
  const itemSxArray = normalizeSxProp(itemSx);
  const itemContainerSxArray = normalizeSxProp(itemContainerSx);
  const resolvedItemContainerSx =
    layout === 'wrap' ? [wrapItemContainerSx, ...itemContainerSxArray] : itemContainerSxArray;
  const wrapListSx = getWrapListSx(wrapGap);
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.itemStaggerMs;
  const itemSurfaceSx =
    itemSurface === 'panel'
      ? [cardResetSx, sectionPanelSx]
      : itemSurface === 'plain'
        ? [cardResetSx]
        : [];
  const shouldRenderItems = !mountItemsOnView || hasEnteredView;
  const itemComponent: ElementType | undefined = tiltItems ? MotionTiltCard : undefined;

  useEffect(() => {
    if (skipEntranceAnimation) {
      if (!hasEnteredView) {
        setHasEnteredView(true);
      }

      return undefined;
    }

    if (!mountItemsOnView) {
      if (!hasEnteredView) {
        setHasEnteredView(true);
      }

      return undefined;
    }

    if (hasEnteredView) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      setHasEnteredView(true);
      return undefined;
    }

    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: mountThreshold, rootMargin: mountRootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEnteredView, mountItemsOnView, mountRootMargin, mountThreshold, skipEntranceAnimation]);

  const animatedItems = shouldRenderItems
    ? items.map((item, index) => (
        <AnimatedContentCard
          key={getItemKey(item, index)}
          delayMs={getItemDelayMs(index, startDelayMs, resolvedItemStaggerMs)}
          skipEntranceAnimation={skipEntranceAnimation}
          sx={[...itemSurfaceSx, ...itemSxArray]}
          containerSx={resolvedItemContainerSx}
          {...(itemComponent ? { component: itemComponent } : {})}
        >
          {renderItem(item, index)}
        </AnimatedContentCard>
      ))
    : null;

  if (layout === 'wrap') {
    return (
      <Box ref={containerRef} sx={[wrapListSx, ...containerSxArray]}>
        {animatedItems}
      </Box>
    );
  }

  return (
    <Stack ref={containerRef} spacing={stackSpacing} sx={containerSxArray}>
      {animatedItems}
    </Stack>
  );
};
