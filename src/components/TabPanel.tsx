import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Box, Collapse, Tab, Tabs } from '@mui/material';
import type { ReactNode, SyntheticEvent } from 'react';
import { cssDuration } from '../motion/tokens';
import { useComponentStyles } from '../styles/componentStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { InteractiveLabel } from './text';

export type TabPanelRenderContext = {
  getDrawerContainer: () => HTMLDivElement | null;
  panelId: string;
  tabId?: string;
  dense: boolean;
  hasTabs: boolean;
};

export type TabPanelItem = {
  value: string;
  label: string;
  shortLabel?: string;
  content?: ReactNode;
  renderContent?: (selected: boolean, context: TabPanelRenderContext) => ReactNode;
  closeDelayMs?: number;
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
};

const TAB_PANEL_CLOSE_DELAY_MS = 220;

const getInitialValue = (
  items: TabPanelItem[],
  defaultValue?: string,
  autoSelectFirst: boolean = false
): TabPanelValue =>
  items.find((item) => item.value === defaultValue)?.value ??
  (autoSelectFirst ? items[0]?.value ?? false : false);

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
}: TabPanelProps) => {
  const { getTabListSx, getTabPanelBodySx, getTabPanelSx, getTabSx, interactiveSurfaceSx } =
    useComponentStyles();
  const fallbackId = useId();
  const tabPanelId = idProp ?? fallbackId;
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const shouldRenderTabs = !(hideTabsWhenSingle && enabledItems.length === 1);
  const resolvedDefaultValue = useMemo(
    () => getInitialValue(enabledItems, defaultValue, !shouldRenderTabs),
    [defaultValue, enabledItems, shouldRenderTabs]
  );
  const [internalValue, setInternalValue] = useState<TabPanelValue>(resolvedDefaultValue);
  const [enteredPanels, setEnteredPanels] = useState<Record<string, boolean>>({});
  const [closingPanelValue, setClosingPanelValue] = useState<string | null>(null);
  const panelBodyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimerIdRef = useRef<number | null>(null);
  const pendingCloseValueRef = useRef<string | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerIdRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerIdRef.current);
    closeTimerIdRef.current = null;
  };

  useEffect(() => {
    if (valueProp !== undefined) {
      return;
    }

    setInternalValue((currentValue) =>
      enabledItems.some((item) => item.value === currentValue) ? currentValue : resolvedDefaultValue
    );
  }, [enabledItems, resolvedDefaultValue, valueProp]);

  useEffect(() => {
    const enabledValues = new Set(enabledItems.map((item) => item.value));

    setEnteredPanels((currentEnteredPanels) =>
      Object.fromEntries(
        Object.entries(currentEnteredPanels).filter(([value]) => enabledValues.has(value))
      )
    );
  }, [enabledItems]);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    []
  );

  const candidateValue = valueProp === undefined ? internalValue : valueProp;
  const resolvedValue = enabledItems.some((item) => item.value === candidateValue)
    ? candidateValue
    : resolvedDefaultValue;

  useEffect(() => {
    if (pendingCloseValueRef.current && resolvedValue !== pendingCloseValueRef.current) {
      pendingCloseValueRef.current = null;
      clearCloseTimer();
      setClosingPanelValue(null);
      return;
    }

    if (!resolvedValue) {
      setClosingPanelValue(null);
    }
  }, [resolvedValue]);

  useEffect(() => {
    if (!resolvedValue) {
      return;
    }

    setEnteredPanels((currentEnteredPanels) => ({
      ...currentEnteredPanels,
      [resolvedValue]: false,
    }));
  }, [resolvedValue]);

  if (enabledItems.length === 0) {
    return null;
  }

  const setValue = (nextValue: TabPanelValue) => {
    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleChange = (_event: SyntheticEvent, nextValue: string) => {
    pendingCloseValueRef.current = null;
    clearCloseTimer();
    setClosingPanelValue(null);
    setValue(nextValue);
  };

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

                  if (!item.renderContent) {
                    pendingCloseValueRef.current = null;
                    clearCloseTimer();
                    setClosingPanelValue(null);
                    setValue(false);
                    return;
                  }

                  pendingCloseValueRef.current = item.value;
                  clearCloseTimer();
                  setClosingPanelValue(item.value);
                  setEnteredPanels((currentEnteredPanels) => ({
                    ...currentEnteredPanels,
                    [item.value]: false,
                  }));

                  closeTimerIdRef.current = window.setTimeout(
                    () => {
                      const pendingCloseValue = pendingCloseValueRef.current;

                      closeTimerIdRef.current = null;

                      if (pendingCloseValue !== item.value) {
                        return;
                      }

                      pendingCloseValueRef.current = null;
                      setClosingPanelValue(null);
                      setValue(false);
                    },
                    Math.max(
                      item.closeDelayMs ?? TAB_PANEL_CLOSE_DELAY_MS,
                      TAB_PANEL_CLOSE_DELAY_MS
                    )
                  );
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
        const isClosing = closingPanelValue === item.value;
        const isContentReady = isSelected && (enteredPanels[item.value] ?? true);
        const isContentVisible = isClosing || isContentReady;
        const tabId = `${tabPanelId}-tab-${item.value}`;
        const panelId = `${tabPanelId}-panel-${item.value}`;
        const renderContext: TabPanelRenderContext = {
          getDrawerContainer: () => panelBodyRefs.current[item.value] ?? null,
          panelId,
          tabId: shouldRenderTabs ? tabId : undefined,
          dense,
          hasTabs: shouldRenderTabs,
        };
        const shouldRenderPanel = keepMounted || isSelected || !!item.renderContent;

        if (!shouldRenderPanel) {
          return null;
        }

        return (
          <Box
            key={item.value}
            ref={(node: HTMLDivElement | null) => {
              panelBodyRefs.current[item.value] = node;
            }}
            role="tabpanel"
            id={panelId}
            aria-labelledby={shouldRenderTabs ? tabId : undefined}
            aria-label={shouldRenderTabs ? undefined : item.label}
            hidden={!isSelected}
            sx={getTabPanelBodySx(dense, shouldRenderTabs)}
          >
            {item.renderContent ? (
              <Collapse
                in={isSelected}
                appear={false}
                timeout="auto"
                sx={{ width: '100%' }}
                onEntered={() => {
                  setEnteredPanels((currentEnteredPanels) => ({
                    ...currentEnteredPanels,
                    [item.value]: true,
                  }));
                }}
              >
                <Box
                  sx={{
                    opacity: isContentVisible ? 1 : 0,
                    transition: `opacity ${cssDuration.quick} ${SPRING_EASING_CSS}`,
                  }}
                >
                  {item.renderContent(isContentReady, renderContext)}
                </Box>
              </Collapse>
            ) : isSelected || keepMounted ? (
              item.content ?? null
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};
