import { Box, Zoom } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../styles/componentStyles';
import { useMotionScale, scaleStagger } from '../motion';
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
  const { stagger: sFactor } = useMotionScale();
  const resolvedStartDelayMs = Math.round(scaleStagger(startDelayMs, sFactor));
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, sFactor)
  );

  return (
    <Box sx={containerSx}>
      {items.map((item, index) => (
        <Zoom
          key={getItemKey(item, index)}
          in={inProp}
          appear={false}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
          style={{
            transitionDelay: `${getSectionDelayMs(
              index,
              resolvedStartDelayMs,
              resolvedItemStaggerMs
            )}ms`,
          }}
        >
          <Box>{renderItem(item, index)}</Box>
        </Zoom>
      ))}
    </Box>
  );
};
