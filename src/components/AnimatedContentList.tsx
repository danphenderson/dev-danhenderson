import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCvStyles } from '../styles/cvStyles';
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
}: AnimatedContentListProps<Item>) => {
  const {
    cardResetSx,
    getItemDelayMs,
    getWrapListSx,
    motionTokens,
    sectionPanelSx,
    wrapItemContainerSx,
  } = useCvStyles();
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

  const animatedItems = items.map((item, index) => (
    <AnimatedContentCard
      key={getItemKey(item, index)}
      delayMs={getItemDelayMs(index, startDelayMs, resolvedItemStaggerMs)}
      sx={[...itemSurfaceSx, ...itemSxArray]}
      containerSx={resolvedItemContainerSx}
    >
      {renderItem(item, index)}
    </AnimatedContentCard>
  ));

  if (layout === 'wrap') {
    return (
      <Box sx={[getWrapListSx(wrapGap), ...containerSxArray]}>
        {animatedItems}
      </Box>
    );
  }

  return (
    <Stack spacing={stackSpacing} sx={containerSxArray}>
      {animatedItems}
    </Stack>
  );
};
