import * as React from 'react';
import Box from '@mui/material/Box';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
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

interface VscodeTitleBarProps {
  onCommandPaletteToggle?: () => void;
}

export const VscodeTitleBar: React.FC<VscodeTitleBarProps> = ({ onCommandPaletteToggle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: VSCODE_LAYOUT.titleBarHeight,
      px: 1.5,
      backgroundColor: VSCODE_COLORS.titleBarBg,
      borderBottom: `1px solid ${VSCODE_COLORS.titleBorder}`,
      flexShrink: 0,
      position: 'relative',
    }}
  >
    {/* Traffic-light window controls */}
    <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, zIndex: 1 }}>
      <TrafficDot color={VSCODE_COLORS.dotRed} hoverIcon="×" />
      <TrafficDot color={VSCODE_COLORS.dotYellow} hoverIcon="−" />
      <TrafficDot color={VSCODE_COLORS.dotGreen} hoverIcon="⊕" />
    </Box>

    {/* Centered search / command-palette trigger — absolutely centered so it stays
        visually centered regardless of the asymmetric left/right clusters */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Box
        onClick={onCommandPaletteToggle}
        sx={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          height: 22,
          width: 320,
          border: `1px solid rgba(255,255,255,0.14)`,
          borderRadius: '6px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          cursor: onCommandPaletteToggle ? 'pointer' : 'default',
          '&:hover': onCommandPaletteToggle
            ? { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.22)' }
            : undefined,
          transition: 'background-color 0.12s, border-color 0.12s',
        }}
      >
        <SearchOutlined
          sx={{ fontSize: '0.78rem', color: VSCODE_COLORS.titleLabel, flexShrink: 0 }}
        />
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
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          dev-danhenderson
        </Box>
      </Box>
    </Box>

    {/* Right-side action cluster */}
    <Box
      aria-hidden="true"
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto', flexShrink: 0, zIndex: 1 }}
    >
      {/* Copilot / AI assistant + dropdown */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.15,
          px: 0.5,
          py: 0.25,
          borderRadius: '4px',
          cursor: 'default',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
        }}
      >
        <AutoAwesomeOutlined sx={{ fontSize: '0.88rem', color: VSCODE_COLORS.titleLabel }} />
        <KeyboardArrowDownOutlined sx={{ fontSize: '0.65rem', color: VSCODE_COLORS.titleLabel }} />
      </Box>

      {/* Remote indicator: green dot + count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.4,
          px: 0.5,
          py: 0.25,
          borderRadius: '4px',
          cursor: 'default',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: VSCODE_COLORS.dotGreen,
            flexShrink: 0,
          }}
        />
        <Box
          component="span"
          sx={{
            fontFamily: monoFontFamily,
            fontSize: '0.70rem',
            color: VSCODE_COLORS.titleLabel,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          46
        </Box>
      </Box>

      {/* Profile */}
      <AccountCircleOutlined
        sx={{
          fontSize: '1rem',
          color: VSCODE_COLORS.titleLabel,
          cursor: 'default',
          '&:hover': { color: VSCODE_COLORS.panelLabel },
          transition: 'color 0.12s',
        }}
      />

      {/* Settings */}
      <SettingsOutlined
        sx={{
          fontSize: '1rem',
          color: VSCODE_COLORS.titleLabel,
          cursor: 'default',
          '&:hover': { color: VSCODE_COLORS.panelLabel },
          transition: 'color 0.12s',
        }}
      />
    </Box>
  </Box>
);
