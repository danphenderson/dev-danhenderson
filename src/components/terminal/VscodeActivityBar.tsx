import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import ExtensionOutlined from '@mui/icons-material/ExtensionOutlined';
import { VSCODE_COLORS, VSCODE_LAYOUT } from './vscodeTokens';

const icons = [
  FolderOpenOutlined,
  SearchOutlined,
  AccountTreeOutlined,
  PlayArrowOutlined,
  ExtensionOutlined,
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
