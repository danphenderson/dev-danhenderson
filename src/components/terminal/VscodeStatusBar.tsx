import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import { VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

const PROMPT_PREFIX = '~ $ ';

const colFlash = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
`;

interface VscodeStatusBarProps {
  commandText: string;
}

export const VscodeStatusBar: React.FC<VscodeStatusBarProps> = ({ commandText }) => {
  const theme = useTheme();
  const col = commandText.length + PROMPT_PREFIX.length + 1;

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        height: VSCODE_LAYOUT.statusBarHeight,
        px: 1.5,
        backgroundColor: theme.palette.primary.main,
        flexShrink: 0,
      }}
    >
      {/* Left cluster */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontFamily: monoFontFamily,
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.90)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span>⎇ main</span>
        <span>⚠ 0</span>
        <span>✗ 0</span>
      </Box>

      {/* Right cluster */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontFamily: monoFontFamily,
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.90)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span>TypeScript</span>
        <span
          key={col}
          style={{ animation: `${colFlash} 0.3s ease-out` }}
        >
          Ln 1, Col {col}
        </span>
        <span>UTF-8</span>
        <span>LF</span>
      </Box>
    </Box>
  );
};
