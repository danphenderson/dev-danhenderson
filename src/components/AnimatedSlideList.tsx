import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Slide } from '@mui/material';
import type { ElementType, ReactNode, RefObject } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SlideProps } from '@mui/material/Slide';
import { useComponentStyles } from '../styles/componentStyles';
import { useMotionScale, scaleStagger } from '../motion';
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
  const { motionTokens } = useComponentStyles();
  const { stagger: sFactor } = useMotionScale();
  const resolvedStartDelayMs = Math.round(scaleStagger(startDelayMs, sFactor));
  const [enteredKeys, setEnteredKeys] = useState<Set<string>>(() => new Set());
  const nodeRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const enterTimerIdsRef = useRef<number[]>([]);
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, sFactor)
  );
  const itemKeys = useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [getItemKey, items]
  );
  const itemKeysSignature = useMemo(() => JSON.stringify(itemKeys), [itemKeys]);
  const latestItemKeysRef = useRef(itemKeys);
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

  useEffect(() => {
    latestItemKeysRef.current = itemKeys;
  }, [itemKeys]);

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
    const nextItemKeys = latestItemKeysRef.current;

    enterTimerIdsRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    enterTimerIdsRef.current = [];

    if (!inProp) {
      if (!reverseExitStagger) {
        setEnteredKeys(new Set());
        return undefined;
      }

      [...nextItemKeys].reverse().forEach((key, index) => {
        const delayMs = resolvedStartDelayMs + index * resolvedItemStaggerMs;
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

    setEnteredKeys(new Set());

    nextItemKeys.forEach((key, index) => {
      const delayMs = resolvedStartDelayMs + index * resolvedItemStaggerMs;
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
  }, [inProp, itemKeysSignature, resolvedItemStaggerMs, resolvedStartDelayMs, reverseExitStagger]);

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
            direction="up"
            mountOnEnter={!keepMountedWhenExited}
            unmountOnExit={!keepMountedWhenExited}
            easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
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
