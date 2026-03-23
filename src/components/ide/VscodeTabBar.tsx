import * as React from 'react';
import Box from '@mui/material/Box';
import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';
import { VSCODE_EDITOR_TABS } from './vscodeEditorTabs';

interface VscodeTabBarProps {
  activeTab?: VscodeEditorTab;
  expanded?: boolean;
  /** When true, fill the remaining editor column width instead of using the fixed demo width. */
  fluidLayout?: boolean;
  /** When true, the outer IDE window has been user-resized; use flex layout. */
  resized?: boolean;
  onTabChange?: (tab: VscodeEditorTab) => void;
}

/** Shared close-button styling */
const CloseButton: React.FC<{ active: boolean }> = ({ active }) => (
  <Box
    component="span"
    className={active ? undefined : 'close-btn'}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      borderRadius: '3px',
      fontSize: '0.72rem',
      color: VSCODE_COLORS.inactiveTab,
      userSelect: 'none',
      lineHeight: 1,
      flexShrink: 0,
      ml: 0.5,
      transition: 'opacity 0.1s, background-color 0.1s',
      '&:hover': { backgroundColor: VSCODE_COLORS.tabCloseHover },
    }}
  >
    ×
  </Box>
);

export const VscodeTabBar: React.FC<VscodeTabBarProps> = ({
  activeTab = 'server',
  expanded = false,
  fluidLayout = false,
  resized = false,
  onTabChange,
}) => {
  const flexLayout = expanded || fluidLayout || resized;
  const activateTab = React.useCallback(
    (tab: VscodeEditorTab) => {
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  const tabBaseSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    px: 1.5,
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'background-color 0.1s',
    minWidth: 0,
  };

  return (
    <Box
      role="tablist"
      aria-label="Editor tabs"
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        width: flexLayout ? '100%' : VSCODE_LAYOUT.editorColumnWidth,
        minWidth: flexLayout ? 0 : VSCODE_LAYOUT.editorColumnWidth,
        maxWidth: flexLayout ? '100%' : VSCODE_LAYOUT.editorColumnWidth,
        height: VSCODE_LAYOUT.tabBarHeight,
        backgroundColor: VSCODE_COLORS.tabBarBg,
        borderBottom: `1px solid ${VSCODE_COLORS.tabBorder}`,
        flexShrink: 0,
        overflowX: 'auto',
        overflowY: 'hidden',
        // Hide scrollbar to keep the VS Code aesthetic
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {VSCODE_EDITOR_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Box
            component="button"
            type="button"
            key={tab.id}
            data-testid={`vscode-tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => activateTab(tab.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateTab(tab.id);
              }
            }}
            sx={{
              ...tabBaseSx,
              appearance: 'none',
              border: 'none',
              textAlign: 'left',
              font: 'inherit',
              color: 'inherit',
              backgroundColor: isActive ? VSCODE_COLORS.activeTabBg : VSCODE_COLORS.inactiveTabBg,
              borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
              borderTop: isActive
                ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
                : '2px solid transparent',
              '&:focus-visible': {
                outline: `2px solid ${VSCODE_COLORS.activeTabAccent}`,
                outlineOffset: -2,
              },
              ...(isActive
                ? {}
                : {
                    '& .close-btn': { opacity: 0 },
                    '&:hover .close-btn': { opacity: 1 },
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
                  }),
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '3px',
                backgroundColor: tab.badgeColor,
                flexShrink: 0,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: monoFontFamily,
                  fontSize: '0.52rem',
                  fontWeight: 700,
                  color: tab.badgeTextColor,
                  userSelect: 'none',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {tab.badgeLabel}
              </Box>
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: monoFontFamily,
                fontSize: '0.74rem',
                color: isActive ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
                userSelect: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.1s',
              }}
            >
              {tab.fileName}
            </Box>
            <CloseButton active={isActive} />
          </Box>
        );
      })}
    </Box>
  );
};
