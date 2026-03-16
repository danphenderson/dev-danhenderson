import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

const PROMPT_PREFIX = '~ $ ';

const colFlash = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
`;

/** Reusable status bar segment with an optional hover dropdown */
const StatusSegment: React.FC<{
  label: React.ReactNode;
  dropdown?: string[];
}> = ({ label, dropdown }) => (
  <Box
    component="span"
    sx={{
      position: 'relative',
      cursor: dropdown ? 'pointer' : 'default',
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
        position: 'relative',
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
        <StatusSegment
          label="⎇ main"
          dropdown={['main', 'develop', 'feature/hero-shell']}
        />
        <StatusSegment label="⚠ 0" />
        <StatusSegment label="✗ 0" />
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
        <StatusSegment
          label="TypeScript"
          dropdown={['TypeScript', 'JavaScript', 'JSON', 'Markdown']}
        />
        <span
          key={col}
          style={{ animation: `${colFlash} 0.3s ease-out` }}
        >
          Ln 1, Col {col}
        </span>
        <StatusSegment
          label="UTF-8"
          dropdown={['UTF-8', 'UTF-16', 'ASCII']}
        />
        <StatusSegment
          label="LF"
          dropdown={['LF', 'CRLF']}
        />
      </Box>
    </Box>
  );
};
