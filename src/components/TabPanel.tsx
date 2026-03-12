import { useEffect, useId, useMemo, useState } from 'react';
import { Box, Grow, Tab, Tabs } from '@mui/material';
import type { ReactNode, SyntheticEvent } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useComponentStyles } from '../styles/componentStyles';
import { InteractiveLabel } from './text';

export type TabPanelItem = {
  value: string;
  label: string;
  shortLabel?: string;
  content?: ReactNode;
  renderContent?: (selected: boolean) => ReactNode;
  disabled?: boolean;
};

type TabPanelValue = string | false;

type TabPanelProps = {
  id?: string;
  items: TabPanelItem[];
  ariaLabel: string;
  value?: string | false;
  defaultValue?: string;
  onChange?: (value: TabPanelValue) => void;
  dense?: boolean;
  keepMounted?: boolean;
  hideTabsWhenSingle?: boolean;
  tabsVariant?: 'standard' | 'scrollable' | 'fullWidth';
  initialPanelGrowDelayMs?: number;
};

const INITIAL_PANEL_GROW_DURATION_MS = 220;
const INITIAL_PANEL_GROW_ORIGIN = 'center top';

const getInitialValue = (
  items: TabPanelItem[],
  defaultValue?: string,
  autoSelectFirst: boolean = false
): TabPanelValue =>
  items.find((item) => item.value === defaultValue)?.value ??
  (autoSelectFirst ? items[0]?.value ?? false : false);

const getTabContent = (item: TabPanelItem, selected: boolean) =>
  item.renderContent ? item.renderContent(selected) : item.content ?? null;

export const TabPanel = ({
  id: idProp,
  items,
  ariaLabel,
  value: valueProp,
  defaultValue,
  onChange,
  dense = false,
  keepMounted = false,
  hideTabsWhenSingle = false,
  tabsVariant = 'standard',
  initialPanelGrowDelayMs,
}: TabPanelProps) => {
  const { getTabListSx, getTabPanelBodySx, getTabPanelSx, getTabSx, interactiveSurfaceSx } = useComponentStyles();
  const prefersReducedMotion = usePrefersReducedMotion();
  const fallbackId = useId();
  const tabPanelId = idProp ?? fallbackId;
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const shouldRenderTabs = !(hideTabsWhenSingle && enabledItems.length === 1);
  const resolvedDefaultValue = useMemo(
    () => getInitialValue(enabledItems, defaultValue, !shouldRenderTabs),
    [defaultValue, enabledItems, shouldRenderTabs]
  );
  const [internalValue, setInternalValue] = useState<TabPanelValue>(resolvedDefaultValue);
  const shouldAnimateInitialPanelGrow =
    typeof initialPanelGrowDelayMs === 'number' && initialPanelGrowDelayMs >= 0 && !prefersReducedMotion;
  const [initialGrowDelayElapsed, setInitialGrowDelayElapsed] = useState(!shouldAnimateInitialPanelGrow);
  const [initialGrowValue, setInitialGrowValue] = useState<string | null>(null);
  const [hasCompletedInitialGrow, setHasCompletedInitialGrow] = useState(!shouldAnimateInitialPanelGrow);

  useEffect(() => {
    if (valueProp !== undefined) {
      return;
    }

    setInternalValue((currentValue) =>
      enabledItems.some((item) => item.value === currentValue) ? currentValue : resolvedDefaultValue
    );
  }, [enabledItems, resolvedDefaultValue, valueProp]);

  useEffect(() => {
    if (!shouldAnimateInitialPanelGrow) {
      setInitialGrowDelayElapsed(true);
      setInitialGrowValue(null);
      setHasCompletedInitialGrow(true);
      return undefined;
    }

    setInitialGrowDelayElapsed(initialPanelGrowDelayMs === 0);
    setInitialGrowValue(null);
    setHasCompletedInitialGrow(false);

    if (initialPanelGrowDelayMs === 0 || typeof window === 'undefined') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setInitialGrowDelayElapsed(true);
    }, initialPanelGrowDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [initialPanelGrowDelayMs, shouldAnimateInitialPanelGrow]);

  const candidateValue = valueProp === undefined ? internalValue : valueProp;
  const resolvedValue = enabledItems.some((item) => item.value === candidateValue)
    ? candidateValue
    : resolvedDefaultValue;
  const hasSelectionChangedDuringInitialGrow =
    shouldAnimateInitialPanelGrow &&
    !hasCompletedInitialGrow &&
    initialGrowValue !== null &&
    resolvedValue !== initialGrowValue;
  const shouldRunInitialGrow =
    shouldAnimateInitialPanelGrow && !hasCompletedInitialGrow && !hasSelectionChangedDuringInitialGrow;

  useEffect(() => {
    if (!shouldRunInitialGrow || !initialGrowDelayElapsed || initialGrowValue !== null || typeof resolvedValue !== 'string') {
      return;
    }

    setInitialGrowValue(resolvedValue);
  }, [initialGrowDelayElapsed, initialGrowValue, resolvedValue, shouldRunInitialGrow]);

  useEffect(() => {
    if (!hasSelectionChangedDuringInitialGrow) {
      return;
    }

    setInitialGrowValue(null);
    setHasCompletedInitialGrow(true);
  }, [hasSelectionChangedDuringInitialGrow]);

  const setValue = (nextValue: TabPanelValue) => {
    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleChange = (_event: SyntheticEvent, nextValue: string) => {
    setValue(nextValue);
  };

  if (enabledItems.length === 0) {
    return null;
  }

  return (
    <Box sx={getTabPanelSx()}>
      {shouldRenderTabs && (
        <Tabs
          value={resolvedValue}
          onChange={handleChange}
          variant={tabsVariant}
          scrollButtons={tabsVariant === 'scrollable' ? 'auto' : undefined}
          allowScrollButtonsMobile={tabsVariant === 'scrollable'}
          aria-label={ariaLabel}
          sx={getTabListSx(dense)}
        >
          {enabledItems.map((item) => {
            const visibleLabel = item.shortLabel ?? item.label;
            const tabId = `${tabPanelId}-tab-${item.value}`;
            const panelId = `${tabPanelId}-panel-${item.value}`;

            return (
              <Tab
                key={item.value}
                id={tabId}
                aria-controls={panelId}
                aria-label={item.shortLabel ? item.label : undefined}
                onClick={(event) => {
                  if (resolvedValue !== item.value) {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  setValue(false);
                }}
                label={<InteractiveLabel>{visibleLabel}</InteractiveLabel>}
                value={item.value}
                sx={[interactiveSurfaceSx, getTabSx(dense)]}
              />
            );
          })}
        </Tabs>
      )}

      {enabledItems.map((item) => {
        const isSelected = item.value === resolvedValue;
        const tabId = `${tabPanelId}-tab-${item.value}`;
        const panelId = `${tabPanelId}-panel-${item.value}`;
        const isAnimatingInitialGrow = shouldRunInitialGrow && isSelected && initialGrowValue === item.value;
        const isPendingInitialGrow =
          shouldRunInitialGrow &&
          isSelected &&
          (!initialGrowDelayElapsed || (initialGrowValue !== null && initialGrowValue !== item.value) || initialGrowValue === null);
        const isVisible = isSelected && !isPendingInitialGrow;
        const content = getTabContent(item, isVisible);

        if (!keepMounted && !isSelected) {
          return null;
        }

        if (isAnimatingInitialGrow) {
          return (
            <Grow
              key={item.value}
              in
              appear
              timeout={INITIAL_PANEL_GROW_DURATION_MS}
              style={{ transformOrigin: INITIAL_PANEL_GROW_ORIGIN }}
              onEntered={() => {
                setInitialGrowValue(null);
                setHasCompletedInitialGrow(true);
              }}
            >
              <Box
                role="tabpanel"
                id={panelId}
                aria-labelledby={shouldRenderTabs ? tabId : undefined}
                aria-label={shouldRenderTabs ? undefined : item.label}
                hidden={false}
                sx={getTabPanelBodySx(dense, shouldRenderTabs)}
              >
                {content}
              </Box>
            </Grow>
          );
        }

        if (isPendingInitialGrow) {
          if (!keepMounted) {
            return null;
          }

          return (
            <Box
              key={item.value}
              role="tabpanel"
              id={panelId}
              aria-labelledby={shouldRenderTabs ? tabId : undefined}
              aria-label={shouldRenderTabs ? undefined : item.label}
              hidden
              sx={[getTabPanelBodySx(dense, shouldRenderTabs), { display: 'none' }]}
            >
              {content}
            </Box>
          );
        }

        return (
          <Box
            key={item.value}
            role="tabpanel"
            id={panelId}
            aria-labelledby={shouldRenderTabs ? tabId : undefined}
            aria-label={shouldRenderTabs ? undefined : item.label}
            hidden={!isSelected}
            sx={getTabPanelBodySx(dense, shouldRenderTabs)}
          >
            {content}
          </Box>
        );
      })}
    </Box>
  );
};
