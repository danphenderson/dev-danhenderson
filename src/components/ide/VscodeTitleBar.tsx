import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import {
  VSCODE_COLORS,
  VSCODE_LAYOUT,
  VSCODE_WINDOW_RADIUS,
  systemFontFamily,
} from './vscodeTokens';
import { cssDuration } from '../../motion/tokens';
import { trafficDotPulse } from '../../styles/animations';

const stopDragStartPropagation = (event: React.PointerEvent<HTMLDivElement>) => {
  event.stopPropagation();
};

interface TrafficDotProps {
  color: string;
  hoverIcon: string;
  onClick?: () => void;
  label?: string;
  highlighted?: boolean;
}

const TrafficDot: React.FC<TrafficDotProps> = ({
  color,
  hoverIcon,
  onClick,
  label,
  highlighted,
}) => {
  const dot = (
    <Box
      role={onClick ? 'button' : undefined}
      aria-label={label}
      tabIndex={onClick ? 0 : -1}
      onClick={(event: React.MouseEvent) => {
        if (onClick) {
          event.stopPropagation();
          onClick();
        }
      }}
      onKeyDown={
        onClick
          ? (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                onClick();
              }
            }
          : undefined
      }
      onPointerDown={onClick ? stopDragStartPropagation : undefined}
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
        transition: 'filter 0.12s',
        cursor: onClick ? 'pointer' : undefined,
        outline: 'none',
        ...(highlighted && {
          animation: `${trafficDotPulse} ${cssDuration.slow} ease-out`,
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }),
        '&:focus-visible': {
          outline: `2px solid ${VSCODE_COLORS.activeTabAccent}`,
          outlineOffset: 2,
        },
        '& .dot-icon': {
          opacity: 0,
          fontSize: '0.5rem',
          fontWeight: 800,
          color: 'rgba(0,0,0,0.55)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.1s',
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

  if (!label) {
    return dot;
  }

  return (
    <Tooltip arrow disableFocusListener placement="top" title={label}>
      {dot}
    </Tooltip>
  );
};

/** Clickable icon-button wrapper for title bar controls */
const TitleBarIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 22,
      borderRadius: '4px',
      cursor: 'default',
      transition: 'background-color 0.1s',
      '&:hover': { backgroundColor: VSCODE_COLORS.iconHover },
    }}
  >
    {children}
  </Box>
);

interface VscodeTitleBarProps {
  onCommandPaletteToggle?: () => void;
  onWindowDragPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  windowDragEnabled?: boolean;
  windowDragging?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  expandHighlighted?: boolean;
  showAuxiliaryControls?: boolean;
}

export const VscodeTitleBar: React.FC<VscodeTitleBarProps> = ({
  onCommandPaletteToggle,
  onWindowDragPointerDown,
  windowDragEnabled = false,
  windowDragging = false,
  onClose,
  onMinimize,
  onExpand,
  expandHighlighted,
  showAuxiliaryControls = true,
}) => (
  <Box
    data-testid="vscode-title-bar"
    onPointerDown={onWindowDragPointerDown}
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: VSCODE_LAYOUT.titleBarHeight,
      px: 1.5,
      backgroundColor: VSCODE_COLORS.titleBarBg,
      borderBottom: `1px solid ${VSCODE_COLORS.titleBorder}`,
      flexShrink: 0,
      position: 'relative',
      // Rounded top-left and top-right to match the window radius
      borderTopLeftRadius: VSCODE_WINDOW_RADIUS,
      borderTopRightRadius: VSCODE_WINDOW_RADIUS,
      cursor: windowDragEnabled ? (windowDragging ? 'grabbing' : 'grab') : 'default',
      userSelect: 'none',
    }}
  >
    {/* Traffic-light window controls — macOS spacing: 8px between dot centers */}
    <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0, zIndex: 1, ml: 0.25 }}>
      <TrafficDot
        color={VSCODE_COLORS.dotRed}
        hoverIcon="×"
        onClick={onClose}
        label="Close window"
      />
      <TrafficDot
        color={VSCODE_COLORS.dotYellow}
        hoverIcon="−"
        onClick={onMinimize}
        label="Minimize window"
      />
      <TrafficDot
        color={VSCODE_COLORS.dotGreen}
        hoverIcon="⊕"
        onClick={onExpand}
        label="Expand window"
        highlighted={expandHighlighted}
      />
    </Box>

    {/* Centered search / command-palette trigger */}
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
        onPointerDown={stopDragStartPropagation}
        sx={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          height: 24,
          width: { xs: '55%', sm: 360 },
          maxWidth: 420,
          border: `1px solid rgba(255,255,255,0.10)`,
          borderRadius: '5px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          cursor: onCommandPaletteToggle ? 'pointer' : 'default',
          '&:hover': onCommandPaletteToggle
            ? { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }
            : undefined,
          transition: 'background-color 0.12s, border-color 0.12s',
        }}
      >
        <SearchOutlined
          sx={{ fontSize: '0.82rem', color: VSCODE_COLORS.titleLabel, flexShrink: 0, opacity: 0.7 }}
        />
        <Box
          component="span"
          sx={{
            flex: 1,
            textAlign: 'center',
            fontFamily: systemFontFamily,
            fontSize: '0.72rem',
            color: VSCODE_COLORS.titleLabel,
            userSelect: 'none',
            letterSpacing: '0.01em',
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
      data-testid="vscode-title-bar-aux-controls"
      onPointerDown={stopDragStartPropagation}
      sx={{
        display: showAuxiliaryControls ? { xs: 'none', sm: 'flex' } : 'none',
        alignItems: 'center',
        gap: 0.25,
        ml: 'auto',
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      {/* Copilot / AI assistant + dropdown */}
      <TitleBarIcon>
        <AutoAwesomeOutlined sx={{ fontSize: '0.88rem', color: VSCODE_COLORS.titleLabel }} />
        <KeyboardArrowDownOutlined
          sx={{ fontSize: '0.6rem', color: VSCODE_COLORS.titleLabel, ml: '-2px' }}
        />
      </TitleBarIcon>

      {/* Remote indicator: green dot + count */}
      <TitleBarIcon>
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
            fontFamily: systemFontFamily,
            fontSize: '0.68rem',
            color: VSCODE_COLORS.titleLabel,
            userSelect: 'none',
            lineHeight: 1,
            ml: '4px',
          }}
        >
          46
        </Box>
      </TitleBarIcon>

      {/* Profile */}
      <TitleBarIcon>
        <AccountCircleOutlined sx={{ fontSize: '0.95rem', color: VSCODE_COLORS.titleLabel }} />
      </TitleBarIcon>

      {/* Settings */}
      <TitleBarIcon>
        <SettingsOutlined sx={{ fontSize: '0.95rem', color: VSCODE_COLORS.titleLabel }} />
      </TitleBarIcon>
    </Box>
  </Box>
);
