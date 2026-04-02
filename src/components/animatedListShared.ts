import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../styles/componentStyles';
import { scaleStagger, useMotionScale } from '../motion';
import { normalizeSxProp } from '../utils/sx';

export type AnimatedControlledListLayout = 'stack' | 'wrap';

type UseAnimatedControlledListOptions<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => string;
  in: boolean;
  startDelayMs?: number;
  itemStaggerMs?: number;
  layout?: AnimatedControlledListLayout;
  containerSx?: SxProps<Theme>;
  stackSpacing?: number;
  wrapGap?: number;
  reverseExitStagger?: boolean;
};

export type AnimatedControlledListEntry<Item> = {
  item: Item;
  index: number;
  key: string;
  isEntered: boolean;
  nodeRef: RefObject<HTMLElement | null>;
};

export const useControlledAnimatedList = <Item>({
  items,
  getItemKey,
  in: inProp,
  startDelayMs = 0,
  itemStaggerMs,
  layout,
  containerSx,
  stackSpacing = 0.75,
  wrapGap = 0.75,
  reverseExitStagger = false,
}: UseAnimatedControlledListOptions<Item>) => {
  const { motionTokens } = useComponentStyles();
  const { stagger: staggerFactor, duration: durationFactor } = useMotionScale();
  const [enteredKeys, setEnteredKeys] = useState<Set<string>>(() => new Set());
  const enterTimerIdsRef = useRef<number[]>([]);
  const latestItemKeysRef = useRef<string[]>([]);
  const nodeRefs = useRef(new Map<string, RefObject<HTMLElement | null>>());
  const resolvedStartDelayMs = Math.round(scaleStagger(startDelayMs, staggerFactor));
  const resolvedItemStaggerMs = Math.round(
    scaleStagger(itemStaggerMs ?? motionTokens.itemStaggerMs, staggerFactor)
  );
  const itemKeys = useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [getItemKey, items]
  );
  const itemKeysSignature = useMemo(() => JSON.stringify(itemKeys), [itemKeys]);
  const baseContainerSx: SxProps<Theme> | undefined =
    layout === 'wrap'
      ? {
          display: 'flex',
          flexWrap: 'wrap',
          gap: wrapGap,
        }
      : layout === 'stack'
        ? {
            '& > * + *': {
              mt: stackSpacing,
            },
          }
        : undefined;
  const resolvedContainerSx: SxProps<Theme> = [
    ...(baseContainerSx ? [baseContainerSx] : []),
    ...normalizeSxProp(containerSx),
  ];

  useEffect(() => {
    latestItemKeysRef.current = itemKeys;

    const nextKeys = new Set(itemKeys);
    nodeRefs.current.forEach((_nodeRef, key) => {
      if (!nextKeys.has(key)) {
        nodeRefs.current.delete(key);
      }
    });
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

    if (durationFactor === 0) {
      setEnteredKeys(inProp ? new Set(nextItemKeys) : new Set());
      return undefined;
    }

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
  }, [
    durationFactor,
    inProp,
    itemKeysSignature,
    resolvedItemStaggerMs,
    resolvedStartDelayMs,
    reverseExitStagger,
  ]);

  const itemEntries = useMemo(
    () =>
      items.map((item, index) => {
        const key = itemKeys[index];

        return {
          item,
          index,
          key,
          isEntered: enteredKeys.has(key),
          nodeRef: getNodeRef(key),
        } satisfies AnimatedControlledListEntry<Item>;
      }),
    [enteredKeys, itemKeys, items]
  );

  return {
    durationFactor,
    isMotionDisabled: durationFactor === 0,
    itemEntries,
    resolvedContainerSx,
  };
};
