/**
 * Syntax-highlight span helpers for the VSCode editor pane demo.
 * Each helper wraps text in a Box span styled with the matching
 * VSCODE_COLORS token, so consuming components don't repeat the
 * same Box-import + color-lookup pattern for every token type.
 */
import Box from '@mui/material/Box';
import { VSCODE_COLORS } from './vscodeTokens';

export const kw = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxKeyword }}>
    {text}
  </Box>
);

export const str = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxString }}>
    {text}
  </Box>
);

export const fn = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxFunction }}>
    {text}
  </Box>
);

export const varr = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxVariable }}>
    {text}
  </Box>
);

export const comment = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxComment, fontStyle: 'italic' }}>
    {text}
  </Box>
);

export const punct = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
    {text}
  </Box>
);

export const typeAnnotation = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
    {text}
  </Box>
);
