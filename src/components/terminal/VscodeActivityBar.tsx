import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import FileCopyOutlined from '@mui/icons-material/FileCopyOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import GitHub from '@mui/icons-material/GitHub';
import LoopOutlined from '@mui/icons-material/LoopOutlined';
import ExtensionOutlined from '@mui/icons-material/ExtensionOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import { VSCODE_COLORS, VSCODE_LAYOUT } from './vscodeTokens';

const icons = [
  FileCopyOutlined, // Explorer
  AutoAwesomeOutlined, // Copilot Chat
  GitHub, // GitHub
  LoopOutlined, // GitHub Actions
  ExtensionOutlined, // Extensions
  AccountTreeOutlined, // Source Control
  Inventory2Outlined, // Remote / Container
];

interface VscodeActivityBarProps {
  sx?: SxProps<Theme>;
  activeIndex?: number;
  onIconClick?: (index: number) => void;
}

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
        pt: 0.75,
        gap: 0.5,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {icons.map((Icon, i) => (
      <Box
        key={i}
        onClick={() => onIconClick?.(i)}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          py: 0.75,
          cursor: 'pointer',
          // Active indicator: left border + full opacity on active icon
          ...(i === activeIndex && {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '20%',
              bottom: '20%',
              width: 2,
              backgroundColor: VSCODE_COLORS.dotGreen,
              borderRadius: '0 1px 1px 0',
            },
          }),
        }}
      >
        <Icon
          sx={{
            fontSize: '1.2rem',
            color: i === activeIndex ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
          }}
        />
      </Box>
    ))}
  </Box>
);
