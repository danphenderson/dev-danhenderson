import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import type { VscodeEditorTab } from '../../types/ui';
import {
  VSCODE_COLORS,
  VSCODE_LAYOUT,
  VSCODE_WINDOW_RADIUS,
  monoFontFamily,
  systemFontFamily,
} from './vscodeTokens';
import { getVscodeEditorTabMetadata } from './vscodeEditorTabs';

const PROMPT_PREFIX = '~ $ ';

const colFlash = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
`;

/** Reusable status bar segment with an optional hover dropdown */
const StatusSegment: React.FC<{
  label: React.ReactNode;
  dropdown?: readonly string[];
}> = ({ label, dropdown }) => (
  <Box
    component="span"
    sx={{
      position: 'relative',
      cursor: dropdown ? 'pointer' : 'default',
      px: '4px',
      py: '1px',
      borderRadius: '3px',
      transition: 'background-color 0.1s',
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
      ...(dropdown && {
        '&:hover .status-dropdown': { display: 'block' },
      }),
    }}
  >
    {label}
    {dropdown && (
      <Box
        className="status-dropdown"
        sx={{
          display: 'none',
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          mb: '4px',
          backgroundColor: VSCODE_COLORS.statusDropdownBg,
          border: `1px solid ${VSCODE_COLORS.panelBorder}`,
          borderRadius: '3px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          zIndex: 30,
          minWidth: 120,
          py: 0.25,
        }}
      >
        {dropdown.map((item) => (
          <Box
            key={item}
            sx={{
              px: 1.5,
              py: 0.25,
              fontFamily: monoFontFamily,
              fontSize: '0.62rem',
              color: VSCODE_COLORS.foreground,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              '&:hover': {
                backgroundColor: VSCODE_COLORS.commandPaletteItemHover,
              },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

interface VscodeStatusBarProps {
  activeTab?: VscodeEditorTab;
  commandText: string;
  /** Total number of terminal rows above the current prompt (history) */
  historyLineCount?: number;
}

export const VscodeStatusBar: React.FC<VscodeStatusBarProps> = ({
  activeTab = 'server',
  commandText,
  historyLineCount = 0,
}) => {
  const activeTabMetadata = getVscodeEditorTabMetadata(activeTab);
  const col = commandText.length + PROMPT_PREFIX.length + 1;
  const ln = historyLineCount + 1;

  const segmentFont = {
    fontFamily: systemFontFamily,
    fontSize: '0.66rem',
    fontWeight: 400,
  };

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        height: VSCODE_LAYOUT.statusBarHeight,
        backgroundColor: VSCODE_COLORS.statusBarBg,
        flexShrink: 0,
        position: 'relative',
        borderBottomLeftRadius: VSCODE_WINDOW_RADIUS,
        borderBottomRightRadius: VSCODE_WINDOW_RADIUS,
        overflow: 'hidden',
      }}
    >
      {/* Left cluster */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          ...segmentFont,
          color: 'rgba(255,255,255,0.92)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          pl: 1,
        }}
      >
        {/* Remote indicator pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: 'rgba(0,0,0,0.18)',
            px: '6px',
            py: '1px',
            borderRadius: '3px',
            mr: 0.5,
          }}
        >
          <Box component="span" sx={{ fontSize: '0.72rem', lineHeight: 1 }}>
            {'><'}
          </Box>
          <Box component="span">WSL</Box>
        </Box>
        <StatusSegment label="⎇ main" dropdown={['main', 'develop', 'feature/hero-shell']} />
        <StatusSegment label="⚠ 0" />
        <StatusSegment label="✗ 0" />
      </Box>

      {/* Right cluster */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          ...segmentFont,
          color: 'rgba(255,255,255,0.92)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          pr: 1,
        }}
      >
        <StatusSegment
          label={activeTabMetadata.languageMode}
          dropdown={activeTabMetadata.languageOptions}
        />
        <Box
          component="span"
          key={col}
          sx={{
            px: '4px',
            animation: `${colFlash} 0.3s ease-out`,
          }}
        >
          Ln {ln}, Col {col}
        </Box>
        <StatusSegment label="UTF-8" dropdown={['UTF-8', 'UTF-16', 'ASCII']} />
        <StatusSegment label="LF" dropdown={['LF', 'CRLF']} />
      </Box>
    </Box>
  );
};
