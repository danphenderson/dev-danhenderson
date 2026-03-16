import * as React from 'react';
import Box from '@mui/material/Box';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlined from '@mui/icons-material/KeyboardArrowRightOutlined';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

interface FileEntry {
  name: string;
  kind: 'file' | 'folder';
  indent: number;
  open?: boolean;
}

const FILES: FileEntry[] = [
  { name: 'src', kind: 'folder', indent: 0, open: true },
  { name: 'portfolio.ts', kind: 'file', indent: 1 },
  { name: 'App.tsx', kind: 'file', indent: 1 },
  { name: 'index.tsx', kind: 'file', indent: 1 },
  { name: 'public', kind: 'folder', indent: 0, open: false },
  { name: 'package.json', kind: 'file', indent: 0 },
  { name: 'tsconfig.json', kind: 'file', indent: 0 },
];

interface VscodeExplorerSidebarProps {
  visible: boolean;
}

export const VscodeExplorerSidebar: React.FC<VscodeExplorerSidebarProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: VSCODE_LAYOUT.explorerWidth,
        flexShrink: 0,
        backgroundColor: VSCODE_COLORS.explorerBg,
        borderRight: `1px solid ${VSCODE_COLORS.panelBorder}`,
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Explorer title */}
      <Box
        sx={{
          px: 1.5,
          py: 0.5,
          fontFamily: monoFontFamily,
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: VSCODE_COLORS.panelLabel,
          userSelect: 'none',
          textTransform: 'uppercase',
        }}
      >
        Explorer
      </Box>

      {/* Project title */}
      <Box
        sx={{
          px: 1,
          py: 0.25,
          fontFamily: monoFontFamily,
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: VSCODE_COLORS.foreground,
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
        }}
      >
        <KeyboardArrowDownOutlined sx={{ fontSize: '0.85rem', color: VSCODE_COLORS.foreground }} />
        DANHENDERSON.DEV
      </Box>

      {/* File tree */}
      <Box sx={{ flex: 1, pt: 0.25 }}>
        {FILES.map((entry) => (
          <Box
            key={entry.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              pl: `${12 + entry.indent * 12}px`,
              pr: 1,
              py: '1px',
              fontFamily: monoFontFamily,
              fontSize: '0.68rem',
              color:
                entry.name === 'portfolio.ts'
                  ? VSCODE_COLORS.foreground
                  : VSCODE_COLORS.panelLabel,
              userSelect: 'none',
              cursor: 'default',
              backgroundColor:
                entry.name === 'portfolio.ts'
                  ? VSCODE_COLORS.explorerItemActive
                  : 'transparent',
              '&:hover': {
                backgroundColor: VSCODE_COLORS.explorerItemHover,
              },
            }}
          >
            {entry.kind === 'folder' ? (
              <>
                {entry.open ? (
                  <KeyboardArrowDownOutlined
                    sx={{ fontSize: '0.8rem', color: VSCODE_COLORS.panelLabel }}
                  />
                ) : (
                  <KeyboardArrowRightOutlined
                    sx={{ fontSize: '0.8rem', color: VSCODE_COLORS.panelLabel }}
                  />
                )}
                <FolderOutlined
                  sx={{ fontSize: '0.85rem', color: '#dcb67a' }}
                />
              </>
            ) : (
              <>
                <Box sx={{ width: '0.8rem' }} />
                <InsertDriveFileOutlined
                  sx={{
                    fontSize: '0.85rem',
                    color:
                      entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')
                        ? '#3178c6'
                        : entry.name.endsWith('.json')
                          ? '#e6c07b'
                          : VSCODE_COLORS.panelLabel,
                  }}
                />
              </>
            )}
            {entry.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
