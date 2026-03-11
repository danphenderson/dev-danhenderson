import { ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCvStyles } from '../styles/cvStyles';
import { AnimatedContentCard } from './AnimatedContentCard';

type AnimatedContentListLayout = 'stack' | 'wrap';
type AnimatedContentItemSurface = 'card' | 'panel' | 'plain';
const DEFAULT_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px';

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
  mountThreshold?: number;
  mountRootMargin?: string;
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
  mountThreshold = DEFAULT_THRESHOLD,
  mountRootMargin = DEFAULT_ROOT_MARGIN,
}: AnimatedContentListProps<Item>) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    cardResetSx,
    getItemDelayMs,
    getWrapListSx,
    motionTokens,
    sectionPanelSx,
    wrapItemContainerSx,
  } = useCvStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(!mountItemsOnView || prefersReducedMotion);
  const containerSxArray = Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [];
  const itemSxArray = Array.isArray(itemSx) ? itemSx : itemSx ? [itemSx] : [];
  const itemContainerSxArray = Array.isArray(itemContainerSx) ? itemContainerSx : itemContainerSx ? [itemContainerSx] : [];
  const resolvedItemContainerSx =
    layout === 'wrap' ? [wrapItemContainerSx, ...itemContainerSxArray] : itemContainerSxArray;
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.itemStaggerMs;
  const itemSurfaceSx =
    itemSurface === 'panel'
      ? [cardResetSx, sectionPanelSx]
      : itemSurface === 'plain'
        ? [cardResetSx]
        : [];
  const shouldRenderItems = !mountItemsOnView || hasEnteredView;

  useEffect(() => {
    if (!mountItemsOnView || prefersReducedMotion) {
      if (!hasEnteredView) {
        setHasEnteredView(true);
      }

      return undefined;
    }

    if (hasEnteredView) {
      return undefined;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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
  }, [hasEnteredView, mountItemsOnView, mountRootMargin, mountThreshold, prefersReducedMotion]);

  const animatedItems = shouldRenderItems
    ? items.map((item, index) => (
        <AnimatedContentCard
          key={getItemKey(item, index)}
          delayMs={getItemDelayMs(index, startDelayMs, resolvedItemStaggerMs)}
          sx={[...itemSurfaceSx, ...itemSxArray]}
          containerSx={resolvedItemContainerSx}
        >
          {renderItem(item, index)}
        </AnimatedContentCard>
      ))
    : null;

  if (layout === 'wrap') {
    return (
      <Box ref={containerRef} sx={[getWrapListSx(wrapGap), ...containerSxArray]}>
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
