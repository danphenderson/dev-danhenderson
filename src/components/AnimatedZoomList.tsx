import { Box, Zoom } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../styles/componentStyles';
import { useMotionScale, scaleStagger } from '../motion';
import { SPRING_EASING_CSS } from '../styles/springEasing';

const ZOOM_BASE_TIMEOUT_MS = 220;

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
  const { stagger: sFactor, duration: dFactor } = useMotionScale();
  const resolvedStartDelayMs = Math.round(scaleStagger(startDelayMs, sFactor));
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, sFactor)
  );
  const zoomTimeout = dFactor === 0 ? 0 : Math.round(ZOOM_BASE_TIMEOUT_MS * dFactor);

  if (dFactor === 0) {
    return (
      <Box
        sx={containerSx}
        aria-hidden={!inProp ? true : undefined}
        style={!inProp ? { visibility: 'hidden' } : undefined}
      >
        {items.map((item, index) => (
          <Box key={getItemKey(item, index)}>{renderItem(item, index)}</Box>
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
          timeout={zoomTimeout}
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
