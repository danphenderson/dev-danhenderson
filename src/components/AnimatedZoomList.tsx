import { Fragment, ReactNode } from 'react';
import { Box, Zoom } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCvStyles } from '../styles/cvStyles';

type AnimatedZoomListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  containerSx?: SxProps<Theme>;
  itemStaggerMs?: number;
};

export const AnimatedZoomList = <Item,>({
  items,
  getItemKey,
  renderItem,
  in: inProp,
  containerSx,
  itemStaggerMs,
}: AnimatedZoomListProps<Item>) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    getAnimatedZoomItemSx,
    getSectionDelayMs,
    motionTokens,
  } = useCvStyles();
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.accordionChipStaggerMs;

  if (prefersReducedMotion) {
    return (
      <Box sx={containerSx}>
        {items.map((item, index) => (
          <Fragment key={getItemKey(item, index)}>
            {renderItem(item, index)}
          </Fragment>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      {items.map((item, index) => (
        <Zoom
          key={getItemKey(item, index)}
          in={inProp}
          appear={false}
        >
          <Box sx={getAnimatedZoomItemSx(getSectionDelayMs(index, 0, resolvedItemStaggerMs))}>
            {renderItem(item, index)}
          </Box>
        </Zoom>
      ))}
    </Box>
  );
};
