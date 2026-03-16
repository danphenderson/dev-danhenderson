import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, monoFontFamily } from './vscodeTokens';

/**
 * IntelliSense-style tooltip that appears on `:hover` of the `Developer` type span.
 * Must be rendered inside a `position: relative` parent.
 * Visibility is controlled via CSS: the parent's `&:hover .intellisense-tooltip` rule
 * toggles `display: block`.
 */
export const VscodeIntelliSenseTooltip: React.FC = () => (
  <Box
    className="intellisense-tooltip"
    sx={{
      display: 'none',
      position: 'absolute',
      top: '100%',
      left: 0,
      mt: '4px',
      zIndex: 10,
      backgroundColor: '#252526',
      border: `1px solid ${VSCODE_COLORS.panelBorder}`,
      borderRadius: '3px',
      px: 1.5,
      py: 1,
      fontFamily: monoFontFamily,
      fontSize: '0.72rem',
      lineHeight: 1.7,
      whiteSpace: 'pre',
      color: VSCODE_COLORS.foreground,
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      pointerEvents: 'none',
    }}
  >
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxKeyword }}>
      {'type '}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
      Developer
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {' = {\n'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxVariable }}>
      {'  passions'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {': '}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
      string
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {'[];\n'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxVariable }}>
      {'  contact'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {': '}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {'() => '}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxKeyword }}>
      void
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
      {';\n}'}
    </Box>
  </Box>
);
