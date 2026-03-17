import * as React from 'react';
import Box from '@mui/material/Box';
import TerminalOutlined from '@mui/icons-material/TerminalOutlined';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

type TabId = 'portfolio' | 'terminal';

interface VscodeTabBarProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
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
  activeTab = 'portfolio',
  onTabChange,
}) => {
  const isPortfolioActive = activeTab === 'portfolio';
  const isTerminalActive = activeTab === 'terminal';

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
        height: VSCODE_LAYOUT.tabBarHeight,
        backgroundColor: VSCODE_COLORS.tabBarBg,
        borderBottom: `1px solid ${VSCODE_COLORS.tabBorder}`,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Portfolio tab */}
      <Box
        onClick={() => onTabChange?.('portfolio')}
        sx={{
          ...tabBaseSx,
          backgroundColor: isPortfolioActive
            ? VSCODE_COLORS.activeTabBg
            : VSCODE_COLORS.inactiveTabBg,
          borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
          borderTop: isPortfolioActive
            ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
            : '2px solid transparent',
          ...(!isPortfolioActive && {
            '& .close-btn': { opacity: 0 },
            '&:hover .close-btn': { opacity: 1 },
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
          }),
        }}
      >
        {/* TypeScript icon badge */}
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            borderRadius: '3px',
            backgroundColor: '#3178c6',
            flexShrink: 0,
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.52rem',
              fontWeight: 700,
              color: '#ffffff',
              userSelect: 'none',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            TS
          </Box>
        </Box>
        <Box
          component="span"
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.74rem',
            color: isPortfolioActive ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.1s',
          }}
        >
          portfolio.ts
        </Box>
        <CloseButton active={isPortfolioActive} />
      </Box>

      {/* Terminal tab */}
      <Box
        onClick={() => onTabChange?.('terminal')}
        sx={{
          ...tabBaseSx,
          backgroundColor: isTerminalActive
            ? VSCODE_COLORS.activeTabBg
            : VSCODE_COLORS.inactiveTabBg,
          borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
          borderTop: isTerminalActive
            ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
            : '2px solid transparent',
          ...(!isTerminalActive && {
            '& .close-btn': { opacity: 0 },
            '&:hover .close-btn': { opacity: 1 },
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
          }),
        }}
      >
        {/* Terminal icon */}
        <TerminalOutlined
          sx={{
            fontSize: '0.88rem',
            color: isTerminalActive ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
            flexShrink: 0,
            transition: 'color 0.1s',
          }}
        />
        <Box
          component="span"
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.74rem',
            color: isTerminalActive ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.1s',
          }}
        >
          terminal
        </Box>
        <CloseButton active={isTerminalActive} />
      </Box>
    </Box>
  );
};
