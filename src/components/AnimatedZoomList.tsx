import { Box, Zoom } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../styles/componentStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';

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
  const { getSectionDelayMs, motionTokens } = useComponentStyles();
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.itemStaggerMs;

  return (
    <Box sx={containerSx}>
      {items.map((item, index) => (
        <Zoom
          key={getItemKey(item, index)}
          in={inProp}
          appear={false}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
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
