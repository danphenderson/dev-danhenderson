import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Slide } from '@mui/material';
import type { ElementType, ReactNode, RefObject } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SlideProps } from '@mui/material/Slide';
import { useComponentStyles } from '../styles/componentStyles';
import { useMotionScale, scaleDuration, scaleStagger } from '../motion';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { normalizeSxProp } from '../utils/sx';

const SlideWithNodeRef = Slide as unknown as (
  props: SlideProps & { nodeRef?: RefObject<HTMLElement> }
) => JSX.Element;

type AnimatedSlideListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  getItemDirection?: (item: Item, index: number) => NonNullable<SlideProps['direction']>;
  layout?: 'stack' | 'wrap';
  startDelayMs?: number;
  itemStaggerMs?: number;
  transitionDurationMs?: number;
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

const DEFAULT_SLIDE_TRANSITION_DURATION_MS = 220;

export const AnimatedSlideList = <Item,>({
  items,
  getItemKey,
  renderItem,
  in: inProp,
  getItemDirection,
  layout = 'stack',
  startDelayMs = 0,
  itemStaggerMs,
  transitionDurationMs = DEFAULT_SLIDE_TRANSITION_DURATION_MS,
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
  const { motionTokens } = useComponentStyles();
  const { duration: dFactor, stagger: sFactor } = useMotionScale();
  const [enteredKeys, setEnteredKeys] = useState<Set<string>>(() => new Set());
  const nodeRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const enterTimerIdsRef = useRef<number[]>([]);
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, sFactor)
  );
  const resolvedTransitionDurationMs = Math.round(
    scaleDuration(transitionDurationMs, dFactor)
  );
  const itemKeys = useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [getItemKey, items]
  );
  const baseContainerSx: SxProps<Theme> =
    layout === 'wrap'
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

  useEffect(() => {
    enterTimerIdsRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    enterTimerIdsRef.current = [];

    if (!inProp) {
      if (resolvedItemStaggerMs === 0) {
        setEnteredKeys(new Set());
        return undefined;
      }

      if (!reverseExitStagger) {
        setEnteredKeys(new Set());
        return undefined;
      }

      [...itemKeys].reverse().forEach((key, index) => {
        const delayMs = startDelayMs + index * resolvedItemStaggerMs;
        const timerId = window.setTimeout(() => {
          setEnteredKeys((currentKeys) => {
            const nextKeys = new Set(currentKeys);

            nextKeys.delete(key);

            return nextKeys;
          });
        }, delayMs);

        enterTimerIdsRef.current.push(timerId);
      });

      return undefined;
    }

    if (resolvedItemStaggerMs === 0) {
      setEnteredKeys(new Set(itemKeys));
      return undefined;
    }

    setEnteredKeys(new Set());

    itemKeys.forEach((key, index) => {
      const delayMs = startDelayMs + index * resolvedItemStaggerMs;
      const timerId = window.setTimeout(() => {
        setEnteredKeys((currentKeys) => {
          const nextKeys = new Set(currentKeys);

          nextKeys.add(key);

          return nextKeys;
        });
      }, delayMs);

      enterTimerIdsRef.current.push(timerId);
    });

    return () => {
      enterTimerIdsRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      enterTimerIdsRef.current = [];
    };
  }, [inProp, itemKeys, resolvedItemStaggerMs, reverseExitStagger, startDelayMs]);

  return (
    <Box component={containerComponent} sx={resolvedContainerSx}>
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        const nodeRef = getNodeRef(key);

        return (
          <SlideWithNodeRef
            key={key}
            in={enteredKeys.has(key)}
            appear={false}
            direction={getItemDirection ? getItemDirection(item, index) : 'up'}
            mountOnEnter={!keepMountedWhenExited}
            unmountOnExit={!keepMountedWhenExited}
            easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
            timeout={resolvedTransitionDurationMs}
            container={container ? () => container() ?? document.body : undefined}
            nodeRef={nodeRef}
          >
            <Box ref={nodeRef} component={itemComponent} sx={itemSx}>
              {renderItem(item, index)}
            </Box>
          </SlideWithNodeRef>
        );
      })}
    </Box>
  );
};
