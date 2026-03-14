import { useEffect, useId, useMemo, useState } from 'react';
import { Box, Collapse, Tab, Tabs } from '@mui/material';
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
};

export const TAB_PANEL_TRANSITION_DURATION_MS = 200;

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

  useEffect(() => {
    if (valueProp !== undefined) {
      return;
    }

    setInternalValue((currentValue) =>
      enabledItems.some((item) => item.value === currentValue) ? currentValue : resolvedDefaultValue
    );
  }, [enabledItems, resolvedDefaultValue, valueProp]);

  if (enabledItems.length === 0) {
    return null;
  }

  const candidateValue = valueProp === undefined ? internalValue : valueProp;
  const resolvedValue = enabledItems.some((item) => item.value === candidateValue)
    ? candidateValue
    : resolvedDefaultValue;

  const setValue = (nextValue: TabPanelValue) => {
    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleChange = (_event: SyntheticEvent, nextValue: string) => {
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

        if (prefersReducedMotion && !keepMounted && !isSelected) {
          return null;
        }

        return (
          <Collapse
            key={item.value}
            in={isSelected}
            mountOnEnter={!keepMounted}
            unmountOnExit={!keepMounted}
            timeout={prefersReducedMotion ? 0 : TAB_PANEL_TRANSITION_DURATION_MS}
          >
            <Box
              role="tabpanel"
              id={panelId}
              aria-labelledby={shouldRenderTabs ? tabId : undefined}
              aria-label={shouldRenderTabs ? undefined : item.label}
              aria-hidden={!isSelected}
              hidden={prefersReducedMotion ? !isSelected : undefined}
              sx={getTabPanelBodySx(dense, shouldRenderTabs)}
            >
              {getTabContent(item, isSelected)}
            </Box>
          </Collapse>
        );
      })}
    </Box>
  );
};
