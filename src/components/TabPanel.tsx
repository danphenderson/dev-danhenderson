import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import type { ReactNode, SyntheticEvent } from 'react';
import { useComponentStyles } from '../styles/componentStyles';
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

const getInitialValue = (
  items: TabPanelItem[],
  defaultValue?: string,
  autoSelectFirst: boolean = false
): TabPanelValue =>
  items.find((item) => item.value === defaultValue)?.value ??
  (autoSelectFirst ? items[0]?.value ?? false : false);

const getTabContent = (item: TabPanelItem, selected: boolean, context: TabPanelRenderContext) =>
  item.renderContent ? item.renderContent(selected, context) : item.content ?? null;

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
  const fallbackId = useId();
  const tabPanelId = idProp ?? fallbackId;
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const shouldRenderTabs = !(hideTabsWhenSingle && enabledItems.length === 1);
  const resolvedDefaultValue = useMemo(
    () => getInitialValue(enabledItems, defaultValue, !shouldRenderTabs),
    [defaultValue, enabledItems, shouldRenderTabs]
  );
  const [internalValue, setInternalValue] = useState<TabPanelValue>(resolvedDefaultValue);
  const panelBodyRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        const renderContext: TabPanelRenderContext = {
          getDrawerContainer: () => panelBodyRefs.current[item.value] ?? null,
          panelId,
          tabId: shouldRenderTabs ? tabId : undefined,
          dense,
          hasTabs: shouldRenderTabs,
        };

        if (!keepMounted && !isSelected) {
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
            {getTabContent(item, isSelected, renderContext)}
          </Box>
        );
      })}
    </Box>
  );
};
