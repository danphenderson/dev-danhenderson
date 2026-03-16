import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

interface TrafficDotProps {
  color: string;
  hoverIcon: string;
}

const TrafficDot: React.FC<TrafficDotProps> = ({ color, hoverIcon }) => (
  <Box
    sx={{
      position: 'relative',
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& .dot-icon': {
        opacity: 0,
        fontSize: '0.55rem',
        fontWeight: 700,
        color: 'rgba(0,0,0,0.65)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      },
      '&:hover .dot-icon': {
        opacity: 1,
      },
    }}
  >
    <Box component="span" className="dot-icon">
      {hoverIcon}
    </Box>
  </Box>
);

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
      <TrafficDot color={VSCODE_COLORS.dotRed} hoverIcon="×" />
      <TrafficDot color={VSCODE_COLORS.dotYellow} hoverIcon="−" />
      <TrafficDot color={VSCODE_COLORS.dotGreen} hoverIcon="⊕" />
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
