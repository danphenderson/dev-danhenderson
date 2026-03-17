import * as React from 'react';
import Box from '@mui/material/Box';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import {
  VSCODE_COLORS,
  VSCODE_LAYOUT,
  VSCODE_WINDOW_SHADOW,
  monoFontFamily,
  systemFontFamily,
} from './vscodeTokens';

interface VscodeCommandPaletteProps {
  visible: boolean;
  onDismiss: () => void;
}

const COMMANDS = [
  { label: 'View: Toggle Terminal', shortcut: '⌃`' },
  { label: 'File: Save', shortcut: '⌘S' },
  { label: 'View: Toggle Sidebar Visibility', shortcut: '⌘B' },
  { label: 'Go to File...', shortcut: '⌘P' },
  { label: 'Developer: Toggle Developer Tools', shortcut: '' },
  { label: 'Preferences: Color Theme', shortcut: '' },
];

export const VscodeCommandPalette: React.FC<VscodeCommandPaletteProps> = ({
  visible,
  onDismiss,
}) => {
  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onDismiss}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 49,
        }}
      />

      {/* Palette */}
      <Box
        sx={{
          position: 'absolute',
          top: VSCODE_LAYOUT.titleBarHeight,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          width: VSCODE_LAYOUT.commandPaletteWidth,
          maxWidth: '90%',
          backgroundColor: VSCODE_COLORS.commandPaletteBg,
          border: `1px solid ${VSCODE_COLORS.panelBorder}`,
          borderRadius: '6px',
          boxShadow: VSCODE_WINDOW_SHADOW,
          overflow: 'hidden',
          fontFamily: systemFontFamily,
        }}
      >
        {/* Search input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1,
            py: 0.5,
            borderBottom: `1px solid ${VSCODE_COLORS.commandPaletteSeparator}`,
          }}
        >
          <Box
            component="span"
            sx={{ color: VSCODE_COLORS.panelLabel, fontSize: '0.75rem', userSelect: 'none' }}
          >
            &gt;
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: VSCODE_COLORS.commandPaletteInputBg,
              borderRadius: '3px',
              px: 0.75,
              py: 0.5,
              fontSize: '0.75rem',
              color: VSCODE_COLORS.foreground,
              userSelect: 'none',
            }}
          >
            <SearchOutlined
              sx={{
                fontSize: '0.85rem',
                color: VSCODE_COLORS.panelLabel,
                mr: 0.5,
                verticalAlign: 'middle',
              }}
            />
            <Box component="span" sx={{ color: VSCODE_COLORS.inactiveTab }}>
              Type a command...
            </Box>
          </Box>
        </Box>

        {/* Command list */}
        <Box sx={{ maxHeight: 200, overflow: 'hidden' }}>
          {COMMANDS.map((cmd) => (
            <Box
              key={cmd.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.5,
                fontSize: '0.72rem',
                color: VSCODE_COLORS.foreground,
                userSelect: 'none',
                cursor: 'default',
                '&:hover': {
                  backgroundColor: VSCODE_COLORS.commandPaletteItemHover,
                },
              }}
            >
              <Box component="span">{cmd.label}</Box>
              {cmd.shortcut && (
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.65rem',
                    color: VSCODE_COLORS.inactiveTab,
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  {cmd.shortcut}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
