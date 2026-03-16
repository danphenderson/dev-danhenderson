import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

export const VscodeTabBar: React.FC = () => (
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
    {/* Active tab */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        backgroundColor: VSCODE_COLORS.activeTabBg,
        borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
        borderTop: `2px solid ${VSCODE_COLORS.activeTabAccent}`,
        position: 'relative',
        flexShrink: 0,
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
          color: VSCODE_COLORS.foreground,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        portfolio.ts
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: monoFontFamily,
          fontSize: '0.7rem',
          color: VSCODE_COLORS.inactiveTab,
          userSelect: 'none',
          ml: 0.25,
          lineHeight: 1,
        }}
      >
        ×
      </Box>
    </Box>

    {/* Inactive tab */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        backgroundColor: VSCODE_COLORS.inactiveTabBg,
        borderRight: `1px solid ${VSCODE_COLORS.tabBorder}`,
        borderTop: '2px solid transparent',
        flexShrink: 0,
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: monoFontFamily,
          fontSize: '0.75rem',
          color: VSCODE_COLORS.inactiveTab,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        terminal
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: monoFontFamily,
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.20)',
          userSelect: 'none',
          ml: 0.25,
          lineHeight: 1,
        }}
      >
        ×
      </Box>
    </Box>
  </Box>
);
