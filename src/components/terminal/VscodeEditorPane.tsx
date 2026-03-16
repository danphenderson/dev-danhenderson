import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, monoFontFamily } from './vscodeTokens';

interface CodeLineProps {
  lineNumber: number;
  children: React.ReactNode;
}

const CodeLine: React.FC<CodeLineProps> = ({ lineNumber, children }) => (
  <Box component="div" sx={{ display: 'flex', alignItems: 'baseline', lineHeight: 1.65 }}>
    <Box
      component="span"
      sx={{
        width: '2ch',
        textAlign: 'right',
        color: VSCODE_COLORS.lineNumber,
        userSelect: 'none',
        flexShrink: 0,
        mr: `12px`,
      }}
    >
      {lineNumber}
    </Box>
    <Box component="span" sx={{ flex: 1, whiteSpace: 'pre' }}>
      {children}
    </Box>
  </Box>
);

const kw = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxKeyword }}>
    {text}
  </Box>
);
const str = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxString }}>
    {text}
  </Box>
);
const fn = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxFunction }}>
    {text}
  </Box>
);
const varr = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxVariable }}>
    {text}
  </Box>
);
const comment = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxComment }}>
    {text}
  </Box>
);
const punct = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxPunct }}>
    {text}
  </Box>
);
const type = (text: string) => (
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
    {text}
  </Box>
);

export const VscodeEditorPane: React.FC = () => (
  <Box
    aria-hidden="true"
    sx={{
      backgroundColor: VSCODE_COLORS.editorBg,
      fontFamily: monoFontFamily,
      fontSize: { xs: '0.72rem', sm: '0.80rem', md: '0.84rem' },
      px: 1.5,
      py: 1,
      flexShrink: 0,
      borderBottom: `1px solid ${VSCODE_COLORS.panelBorder}`,
    }}
  >
    <CodeLine lineNumber={1}>{comment('// portfolio.ts')}</CodeLine>
    <CodeLine lineNumber={2}>
      {kw('const')} {varr('developer')}
      {punct(': ')}
      {type('Developer')} {punct('= {')}
    </CodeLine>
    <CodeLine lineNumber={3}>
      {'  '}
      {punct('passions: ')}
      {str('["mathematics", "computers", "adventures"]')}
      {punct(',')}
    </CodeLine>
    <CodeLine lineNumber={4}>
      {'  '}
      {punct('contact: ')}
      {punct('() => ')}
      {fn('navigate')}
      {punct('(')}
      {str('"/cv"')}
      {punct('),')}
    </CodeLine>
    <CodeLine lineNumber={5}>{punct('};')}</CodeLine>
  </Box>
);
