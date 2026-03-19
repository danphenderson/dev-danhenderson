import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Slide } from '@mui/material';
import type { ReactNode, RefObject } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SlideProps } from '@mui/material/Slide';
import { useComponentStyles } from '../styles/componentStyles';
import { useMotionScale, scaleStagger } from '../motion';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { normalizeSxProp } from '../utils/sx';

const SlideWithNodeRef = Slide as unknown as (
  props: SlideProps & { nodeRef?: RefObject<HTMLElement> }
) => JSX.Element;

type AnimatedChipSlideListProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  in: boolean;
  startDelayMs?: number;
  containerSx?: SxProps<Theme>;
  itemStaggerMs?: number;
};

/**
 * Bidirectional slide list — items alternate entering from the left and right
 * with staggered timing.  Even-indexed items slide in from the left; odd-indexed
 * items slide in from the right.  On exit the pattern reverses with a trailing
 * stagger so items depart in reverse order.
 *
 * All timing scales through `useMotionScale()`, so the animation respects the
 * global motion-intensity setting and the `prefers-reduced-motion` media query.
 */
export const AnimatedChipSlideList = <Item,>({
  items,
  getItemKey,
  renderItem,
  in: inProp,
  startDelayMs = 0,
  containerSx,
  itemStaggerMs,
}: AnimatedChipSlideListProps<Item>) => {
  const { motionTokens } = useComponentStyles();
  const { stagger: sFactor } = useMotionScale();
  const [enteredKeys, setEnteredKeys] = useState<Set<string>>(() => new Set());
  const nodeRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const containerRef = useRef<HTMLDivElement>(null);
  const enterTimerIdsRef = useRef<number[]>([]);
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, sFactor)
  );
  const itemKeys = useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [getItemKey, items]
  );
  const resolvedContainerSx: SxProps<Theme> = [
    { overflow: 'hidden' },
    ...normalizeSxProp(containerSx),
  ];

  const getNodeRef = (key: string) => {
    const existingNodeRef = nodeRefs.current.get(key);

    if (existingNodeRef) {
      return existingNodeRef;
    }

    const nextNodeRef = createRef<HTMLElement>();

    nodeRefs.current.set(key, nextNodeRef);

    return nextNodeRef;
  };

  const getContainer = useCallback(() => containerRef.current ?? document.body, []);

  useEffect(() => {
    enterTimerIdsRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    enterTimerIdsRef.current = [];

    if (!inProp) {
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
  }, [inProp, itemKeys, resolvedItemStaggerMs, startDelayMs]);

  return (
    <Box ref={containerRef} sx={resolvedContainerSx}>
      {items.map((item, index) => {
        const key = getItemKey(item, index);
        const nodeRef = getNodeRef(key);
        const direction = index % 2 === 0 ? 'right' : 'left';

        return (
          <SlideWithNodeRef
            key={key}
            in={enteredKeys.has(key)}
            appear={false}
            direction={direction}
            mountOnEnter
            unmountOnExit
            easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
            container={getContainer}
            nodeRef={nodeRef}
          >
            <Box ref={nodeRef}>{renderItem(item, index)}</Box>
          </SlideWithNodeRef>
        );
      })}
    </Box>
  );
};
