import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

type TabId = 'portfolio' | 'terminal';

interface VscodeTabBarProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

export const VscodeTabBar: React.FC<VscodeTabBarProps> = ({
  activeTab = 'portfolio',
  onTabChange,
}) => {
  const isPortfolioActive = activeTab === 'portfolio';
  const isTerminalActive = activeTab === 'terminal';

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
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          backgroundColor: isPortfolioActive
            ? VSCODE_COLORS.activeTabBg
            : VSCODE_COLORS.inactiveTabBg,
          borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
          borderTop: isPortfolioActive
            ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
            : '2px solid transparent',
          position: 'relative',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'background-color 0.12s',
          ...(!isPortfolioActive && {
            '& .close-btn': { opacity: 0 },
            '&:hover .close-btn': { opacity: 1 },
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
            borderRadius: '2px',
            backgroundColor: '#3178c6',
            flexShrink: 0,
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.54rem',
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
            fontSize: '0.75rem',
            color: isPortfolioActive
              ? VSCODE_COLORS.foreground
              : VSCODE_COLORS.inactiveTab,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.12s',
          }}
        >
          portfolio.ts
        </Box>
        <Box
          component="span"
          className={isPortfolioActive ? undefined : 'close-btn'}
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.7rem',
            color: VSCODE_COLORS.inactiveTab,
            userSelect: 'none',
            ml: 0.25,
            lineHeight: 1,
            transition: 'opacity 0.15s',
          }}
        >
          ×
        </Box>
      </Box>

      {/* Terminal tab */}
      <Box
        onClick={() => onTabChange?.('terminal')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          backgroundColor: isTerminalActive
            ? VSCODE_COLORS.activeTabBg
            : VSCODE_COLORS.inactiveTabBg,
          borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
          borderTop: isTerminalActive
            ? `2px solid ${VSCODE_COLORS.activeTabAccent}`
            : '2px solid transparent',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'background-color 0.12s',
          ...(!isTerminalActive && {
            '& .close-btn': { opacity: 0 },
            '&:hover .close-btn': { opacity: 1 },
          }),
        }}
      >
        <Box
          component="span"
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.75rem',
            color: isTerminalActive
              ? VSCODE_COLORS.foreground
              : VSCODE_COLORS.inactiveTab,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.12s',
          }}
        >
          terminal
        </Box>
        <Box
          component="span"
          className={isTerminalActive ? undefined : 'close-btn'}
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.20)',
            userSelect: 'none',
            ml: 0.25,
            lineHeight: 1,
            transition: 'opacity 0.15s',
          }}
        >
          ×
        </Box>
      </Box>
    </Box>
  );
};
