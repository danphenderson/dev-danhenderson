import { Fragment } from 'react';
import { Box, Zoom } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useComponentStyles } from '../styles/componentStyles';

type AnimatedZoomListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  startDelayMs?: number;
  containerSx?: SxProps<Theme>;
  itemStaggerMs?: number;
};

export const AnimatedZoomList = <Item,>({
  items,
  getItemKey,
  renderItem,
  in: inProp,
  startDelayMs = 0,
  containerSx,
  itemStaggerMs,
}: AnimatedZoomListProps<Item>) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { getSectionDelayMs, motionTokens } = useComponentStyles();
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.accordionChipStaggerMs;

  if (prefersReducedMotion) {
    return (
      <Box sx={containerSx}>
        {items.map((item, index) => (
          <Fragment key={getItemKey(item, index)}>{renderItem(item, index)}</Fragment>
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
          style={{
            transitionDelay: `${getSectionDelayMs(index, startDelayMs, resolvedItemStaggerMs)}ms`,
          }}
        >
          <Box>{renderItem(item, index)}</Box>
        </Zoom>
      ))}
    </Box>
  );
};
