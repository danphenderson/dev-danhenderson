import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCvStyles } from '../styles/cvStyles';
import { AnimatedContentCard } from './AnimatedContentCard';

type AnimatedContentListLayout = 'stack' | 'wrap';

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
}: AnimatedContentListProps<Item>) => {
  const {
    getItemDelayMs,
    getWrapListSx,
    motionTokens,
    wrapItemContainerSx,
  } = useCvStyles();
  const containerSxArray = Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [];
  const itemContainerSxArray = Array.isArray(itemContainerSx) ? itemContainerSx : itemContainerSx ? [itemContainerSx] : [];
  const resolvedItemContainerSx =
    layout === 'wrap' ? [wrapItemContainerSx, ...itemContainerSxArray] : itemContainerSxArray;
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.itemStaggerMs;

  const animatedItems = items.map((item, index) => (
    <AnimatedContentCard
      key={getItemKey(item, index)}
      delayMs={getItemDelayMs(index, startDelayMs, resolvedItemStaggerMs)}
      sx={itemSx}
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
