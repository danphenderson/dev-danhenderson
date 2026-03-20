import * as React from 'react';
import Box from '@mui/material/Box';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlined from '@mui/icons-material/KeyboardArrowRightOutlined';
import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily, systemFontFamily } from './vscodeTokens';
import { getVscodeEditorTabMetadata } from './vscodeEditorTabs';

interface FileEntry {
  name: string;
  kind: 'file' | 'folder';
  indent: number;
  /** Initial expanded state; only meaningful for folders. */
  open?: boolean;
  /** Parent folder name — used to determine visibility when a parent is collapsed. */
  parent?: string;
}

const FILES: FileEntry[] = [
  { name: '.editorconfig', kind: 'file', indent: 0 },
  { name: '.env', kind: 'file', indent: 0 },
  { name: '.pre-commit-config.yaml', kind: 'file', indent: 0 },
  { name: '.github', kind: 'folder', indent: 0, open: true },
  { name: 'ISSUE_TEMPLATE', kind: 'folder', indent: 1, parent: '.github' },
  { name: 'hooks', kind: 'folder', indent: 1, parent: '.github' },
  { name: 'instructions', kind: 'folder', indent: 1, parent: '.github' },
  { name: 'workflows', kind: 'folder', indent: 1, parent: '.github' },
  { name: 'src', kind: 'folder', indent: 0, open: true },
  { name: 'client.ts', kind: 'file', indent: 1, parent: 'src' },
  { name: 'server.py', kind: 'file', indent: 1, parent: 'src' },
  { name: 'Pipfile', kind: 'file', indent: 0 },
  { name: 'docker-compose.yml', kind: 'file', indent: 0 },
  { name: 'package.json', kind: 'file', indent: 0 },
  { name: 'tsconfig.json', kind: 'file', indent: 0 },
];

/** Derive initial expanded state from the static tree. */
const getInitialExpanded = (): Record<string, boolean> => {
  const expanded: Record<string, boolean> = {};
  for (const entry of FILES) {
    if (entry.kind === 'folder') {
      expanded[entry.name] = entry.open ?? false;
    }
  }
  return expanded;
};

interface VscodeExplorerSidebarProps {
  activeTab?: VscodeEditorTab;
  /** When true, the outer IDE window has been user-resized; allow flex-shrink. */
  resized?: boolean;
  visible: boolean;
}

export const VscodeExplorerSidebar: React.FC<VscodeExplorerSidebarProps> = ({
  activeTab = 'server',
  resized = false,
  visible,
}) => {
  const [expanded, setExpanded] = React.useState(getInitialExpanded);

  const handleToggle = React.useCallback((folderName: string) => {
    setExpanded((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  }, []);

  if (!visible) return null;

  const activeFileName = getVscodeEditorTabMetadata(activeTab).fileName;

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: resized ? 'auto' : VSCODE_LAYOUT.explorerWidth,
        minWidth: resized ? 100 : undefined,
        flexShrink: resized ? 1 : 0,
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
          fontFamily: systemFontFamily,
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
          fontFamily: systemFontFamily,
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
        {FILES.map((entry) => {
          // Hide children whose parent folder is collapsed
          if (entry.parent && !expanded[entry.parent]) return null;

          const isFolder = entry.kind === 'folder';
          const isOpen = isFolder && expanded[entry.name];

          return (
            <Box
              key={`${entry.indent}-${entry.name}`}
              onClick={isFolder ? () => handleToggle(entry.name) : undefined}
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
                  entry.name === activeFileName
                    ? VSCODE_COLORS.foreground
                    : VSCODE_COLORS.panelLabel,
                userSelect: 'none',
                cursor: isFolder ? 'pointer' : 'default',
                minWidth: 0,
                backgroundColor:
                  entry.name === activeFileName ? VSCODE_COLORS.explorerItemActive : 'transparent',
                '&:hover': {
                  backgroundColor: VSCODE_COLORS.explorerItemHover,
                },
              }}
            >
              {isFolder ? (
                <>
                  {isOpen ? (
                    <KeyboardArrowDownOutlined
                      sx={{ fontSize: '0.8rem', color: VSCODE_COLORS.panelLabel }}
                    />
                  ) : (
                    <KeyboardArrowRightOutlined
                      sx={{ fontSize: '0.8rem', color: VSCODE_COLORS.panelLabel }}
                    />
                  )}
                  <FolderOutlined
                    sx={{ fontSize: '0.85rem', color: VSCODE_COLORS.fileTypeFolder }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ width: '0.8rem' }} />
                  <InsertDriveFileOutlined
                    sx={{
                      fontSize: '0.85rem',
                      color: entry.name.endsWith('.py')
                        ? VSCODE_COLORS.fileTypePython
                        : entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')
                          ? VSCODE_COLORS.fileTypeTs
                          : entry.name.endsWith('.json')
                            ? VSCODE_COLORS.fileTypeJson
                            : VSCODE_COLORS.panelLabel,
                    }}
                  />
                </>
              )}
              <Box
                component="span"
                sx={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.name}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
