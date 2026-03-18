import * as React from 'react';
import Box from '@mui/material/Box';
import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';
import { VSCODE_EDITOR_TABS } from './vscodeEditorTabs';

interface VscodeTabBarProps {
  activeTab?: VscodeEditorTab;
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
  onTabChange,
}) => {
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
      aria-hidden="true"
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        width: VSCODE_LAYOUT.editorColumnWidth,
        minWidth: VSCODE_LAYOUT.editorColumnWidth,
        maxWidth: VSCODE_LAYOUT.editorColumnWidth,
        height: VSCODE_LAYOUT.tabBarHeight,
        backgroundColor: VSCODE_COLORS.tabBarBg,
        borderBottom: `1px solid ${VSCODE_COLORS.tabBorder}`,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {VSCODE_EDITOR_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Box
            key={tab.id}
            data-testid={`vscode-tab-${tab.id}`}
            onClick={() => onTabChange?.(tab.id)}
            sx={{
              ...tabBaseSx,
              backgroundColor: isActive ? VSCODE_COLORS.activeTabBg : VSCODE_COLORS.inactiveTabBg,
              borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
              borderTop: isActive
                ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
                : '2px solid transparent',
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
