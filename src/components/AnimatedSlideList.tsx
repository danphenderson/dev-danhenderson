import { Box, Slide } from '@mui/material';
import type { ElementType, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { useControlledAnimatedList, type AnimatedControlledListLayout } from './animatedListShared';

const SLIDE_BASE_TIMEOUT_MS = 220;

type AnimatedSlideListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  layout?: AnimatedControlledListLayout;
  startDelayMs?: number;
  itemStaggerMs?: number;
  container?: () => Element | null;
  containerComponent?: ElementType;
  containerSx?: SxProps<Theme>;
  itemComponent?: ElementType;
  itemSx?: SxProps<Theme>;
  stackSpacing?: number;
  wrapGap?: number;
  keepMountedWhenExited?: boolean;
  reverseExitStagger?: boolean;
};

export const getAnimatedSlideListCloseDelayMs = (
  itemCount: number,
  itemStaggerMs: number,
  startDelayMs: number = 0,
  exitDurationMs: number = 220
) => {
  if (itemCount <= 0) {
    return 0;
  }

  return startDelayMs + Math.max(itemCount - 1, 0) * itemStaggerMs + exitDurationMs;
};

export const AnimatedSlideList = <Item,>({
  items,
  getItemKey,
  renderItem,
  in: inProp,
  layout = 'stack',
  startDelayMs = 0,
  itemStaggerMs,
  container,
  containerComponent = 'div',
  containerSx,
  itemComponent = 'div',
  itemSx,
  stackSpacing = 0.75,
  wrapGap = 0.75,
  keepMountedWhenExited = false,
  reverseExitStagger = false,
}: AnimatedSlideListProps<Item>) => {
  const { durationFactor, isMotionDisabled, itemEntries, resolvedContainerSx } =
    useControlledAnimatedList({
      items,
      getItemKey,
      in: inProp,
      startDelayMs,
      itemStaggerMs,
      layout,
      containerSx,
      stackSpacing,
      wrapGap,
      reverseExitStagger,
    });
  const slideTimeout = isMotionDisabled ? 0 : Math.round(SLIDE_BASE_TIMEOUT_MS * durationFactor);

  if (isMotionDisabled) {
    return (
      <Box
        component={containerComponent}
        sx={resolvedContainerSx}
        aria-hidden={!inProp && keepMountedWhenExited ? true : undefined}
        style={!inProp && keepMountedWhenExited ? { visibility: 'hidden' } : undefined}
      >
        {inProp || keepMountedWhenExited
          ? itemEntries.map(({ item, index, key, nodeRef }) => (
              <Box key={key} ref={nodeRef} component={itemComponent} sx={itemSx}>
                {renderItem(item, index)}
              </Box>
            ))
          : null}
      </Box>
    );
  }

  return (
    <Box component={containerComponent} sx={resolvedContainerSx}>
      {itemEntries.map(({ item, index, key, isEntered, nodeRef }) => (
        <Slide
          key={key}
          in={isEntered}
          appear={true}
          direction="up"
          timeout={slideTimeout}
          mountOnEnter={!keepMountedWhenExited}
          unmountOnExit={!keepMountedWhenExited}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
          container={container ? () => container() ?? document.body : undefined}
          nodeRef={nodeRef}
        >
          <Box ref={nodeRef} component={itemComponent} sx={itemSx}>
            {renderItem(item, index)}
          </Box>
        </Slide>
      ))}
    </Box>
  );
};
