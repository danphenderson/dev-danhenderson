import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import FileCopyOutlined from '@mui/icons-material/FileCopyOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import GitHub from '@mui/icons-material/GitHub';
import LoopOutlined from '@mui/icons-material/LoopOutlined';
import ExtensionOutlined from '@mui/icons-material/ExtensionOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { VSCODE_COLORS, VSCODE_LAYOUT } from './vscodeTokens';

/** Top-aligned activity-bar icons (primary navigation) */
const topIcons = [
  FileCopyOutlined, // Explorer
  AutoAwesomeOutlined, // Copilot Chat
  GitHub, // GitHub
  LoopOutlined, // GitHub Actions
  ExtensionOutlined, // Extensions
  AccountTreeOutlined, // Source Control
];

interface VscodeActivityBarProps {
  sx?: SxProps<Theme>;
  activeIndex?: number;
  onIconClick?: (index: number) => void;
}

const ICON_SIZE = '1.35rem';
const ICON_MUTED = VSCODE_COLORS.inactiveTab;
const ICON_ACTIVE = VSCODE_COLORS.foreground;

export const VscodeActivityBar: React.FC<VscodeActivityBarProps> = ({
  sx,
  activeIndex = 0,
  onIconClick,
}) => (
  <Box
    aria-hidden="true"
    sx={[
      {
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        width: VSCODE_LAYOUT.activityBarWidth,
        flexShrink: 0,
        backgroundColor: VSCODE_COLORS.activityBarBg,
        pt: 0.5,
        pb: 0.75,
        gap: '2px',
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {/* Primary icons — top-aligned */}
    {topIcons.map((Icon, i) => {
      const isActive = i === activeIndex;
      return (
        <Box
          key={i}
          data-testid={`activity-icon-${i}`}
          onClick={() => onIconClick?.(i)}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: VSCODE_LAYOUT.activityBarWidth,
            height: VSCODE_LAYOUT.activityBarWidth,
            cursor: 'pointer',
            borderRadius: 0,
            transition: 'background-color 0.1s',
            '&:hover': {
              backgroundColor: VSCODE_COLORS.iconHover,
            },
            // Active indicator: 2px white left bar
            ...(isActive && {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '25%',
                bottom: '25%',
                width: 2,
                backgroundColor: ICON_ACTIVE,
                borderRadius: '0 1px 1px 0',
              },
            }),
          }}
        >
          <Icon
            sx={{
              fontSize: ICON_SIZE,
              color: isActive ? ICON_ACTIVE : ICON_MUTED,
              transition: 'color 0.1s',
            }}
          />
        </Box>
      );
    })}

    {/* Spacer pushes settings to bottom */}
    <Box sx={{ flex: 1 }} />

    {/* Bottom-pinned Settings icon */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: VSCODE_LAYOUT.activityBarWidth,
        height: VSCODE_LAYOUT.activityBarWidth,
        cursor: 'pointer',
        transition: 'background-color 0.1s',
        '&:hover': { backgroundColor: VSCODE_COLORS.iconHover },
      }}
    >
      <SettingsOutlined sx={{ fontSize: ICON_SIZE, color: ICON_MUTED }} />
    </Box>
  </Box>
);
