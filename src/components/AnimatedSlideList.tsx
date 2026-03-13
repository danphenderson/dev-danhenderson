import { createRef, useRef } from 'react';
import { Box, Slide } from '@mui/material';
import type { ElementType, ReactNode, RefObject } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SlideProps } from '@mui/material/Slide';
import { TransitionGroup } from 'react-transition-group';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useComponentStyles } from '../styles/componentStyles';
import { normalizeSxProp } from '../utils/sx';

const SlideWithNodeRef = Slide as unknown as (props: SlideProps & { nodeRef?: RefObject<HTMLElement> }) => JSX.Element;

type AnimatedSlideListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  layout?: 'stack' | 'wrap';
  startDelayMs?: number;
  itemStaggerMs?: number;
  container?: () => Element | null;
  containerComponent?: ElementType;
  containerSx?: SxProps<Theme>;
  itemComponent?: ElementType;
  itemSx?: SxProps<Theme>;
  stackSpacing?: number;
  wrapGap?: number;
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
}: AnimatedSlideListProps<Item>) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    getAnimatedSlideItemSx,
    getSectionDelayMs,
    motionTokens,
  } = useComponentStyles();
  const nodeRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const resolvedItemStaggerMs = itemStaggerMs ?? motionTokens.accordionChipStaggerMs;
  const visibleItems = inProp ? items : [];
  const baseContainerSx: SxProps<Theme> = layout === 'wrap'
      ? {
        display: 'flex',
        flexWrap: 'wrap',
        gap: wrapGap,
      }
      : {
        '& > * + *': {
          mt: stackSpacing,
        },
      };
  const resolvedContainerSx: SxProps<Theme> = [baseContainerSx, ...normalizeSxProp(containerSx)];

  const getNodeRef = (key: string) => {
    const existingNodeRef = nodeRefs.current.get(key);

    if (existingNodeRef) {
      return existingNodeRef;
    }

    const nextNodeRef = createRef<HTMLElement>();

    nodeRefs.current.set(key, nextNodeRef);

    return nextNodeRef;
  };

  if (prefersReducedMotion) {
    return (
      <Box component={containerComponent} sx={resolvedContainerSx}>
        {visibleItems.map((item, index) => (
          <Box
            key={getItemKey(item, index)}
            component={itemComponent}
            sx={itemSx}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box component={containerComponent} sx={resolvedContainerSx}>
      <TransitionGroup component={null}>
        {visibleItems.map((item, index) => {
          const key = getItemKey(item, index);
          const nodeRef = getNodeRef(key);
          const slideItemSx: SxProps<Theme> = [
            getAnimatedSlideItemSx(getSectionDelayMs(index, startDelayMs, resolvedItemStaggerMs)),
            ...normalizeSxProp(itemSx),
          ];

          return (
            <SlideWithNodeRef
              key={key}
              appear={false}
              direction="up"
              mountOnEnter
              unmountOnExit
              container={container ? (() => container() ?? document.body) : undefined}
              nodeRef={nodeRef}
            >
              <Box
                ref={nodeRef}
                component={itemComponent}
                sx={slideItemSx}
              >
                {renderItem(item, index)}
              </Box>
            </SlideWithNodeRef>
          );
        })}
      </TransitionGroup>
    </Box>
  );
};
