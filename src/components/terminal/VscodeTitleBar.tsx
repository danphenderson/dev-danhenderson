import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

const dotSx = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  flexShrink: 0,
} as const;

export const VscodeTitleBar: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: VSCODE_LAYOUT.titleBarHeight,
      px: 1.5,
      backgroundColor: VSCODE_COLORS.titleBarBg,
      borderBottom: `1px solid ${VSCODE_COLORS.titleBorder}`,
      flexShrink: 0,
    }}
  >
    {/* Traffic-light window controls */}
    <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
      <Box sx={{ ...dotSx, backgroundColor: VSCODE_COLORS.dotRed }} />
      <Box sx={{ ...dotSx, backgroundColor: VSCODE_COLORS.dotYellow }} />
      <Box sx={{ ...dotSx, backgroundColor: VSCODE_COLORS.dotGreen }} />
    </Box>

    {/* Centered app label */}
    <Box
      component="span"
      sx={{
        flex: 1,
        textAlign: 'center',
        fontFamily: monoFontFamily,
        fontSize: '0.70rem',
        color: VSCODE_COLORS.titleLabel,
        userSelect: 'none',
        letterSpacing: '0.02em',
        // Offset to visually center relative to the dot cluster on the left
        pr: 4.5,
      }}
    >
      danhenderson.dev — Visual Studio Code
    </Box>
  </Box>
);
