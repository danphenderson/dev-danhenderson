import * as React from 'react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, monoFontFamily } from './vscodeTokens';
import { fn, kw, punct, typeAnnotation, varr } from './vscodeSyntaxHelpers';

interface VscodeIntelliSenseTooltipProps {
  symbol: string;
}

const TOOLTIP_CONTENT: Record<string, React.ReactNode> = {
  FastAPI: (
    <>
      {kw('class ')}
      {typeAnnotation('FastAPI')}
      {punct('(')}
      {typeAnnotation('Starlette')}
      {punct(')\n')}
      {kw('def ')}
      {fn('get')}
      {punct('(path: ')}
      {typeAnnotation('str')}
      {punct(') -> ')}
      {typeAnnotation('Callable[..., Any]')}
    </>
  ),
  CORSMiddleware: (
    <>
      {kw('class ')}
      {typeAnnotation('CORSMiddleware')}
      {punct('\n')}
      {varr('  allow_origins')}
      {punct(': ')}
      {typeAnnotation('Sequence[str]')}
      {punct('\n')}
      {varr('  allow_methods')}
      {punct(': ')}
      {typeAnnotation('Sequence[str]')}
    </>
  ),
  PingResponse: (
    <>
      {kw('type ')}
      {typeAnnotation('PingResponse')}
      {punct(' = {\n')}
      {varr('  message')}
      {punct(': ')}
      {typeAnnotation('string')}
      {punct(';\n}')}
    </>
  ),
};

/**
 * IntelliSense-style tooltip that appears on `:hover` of highlighted editor symbols.
 * Must be rendered inside a `position: relative` parent.
 * Visibility is controlled via CSS: the parent's `&:hover .intellisense-tooltip` rule
 * toggles `display: block`.
 */
export const VscodeIntelliSenseTooltip: React.FC<VscodeIntelliSenseTooltipProps> = ({ symbol }) => (
  <Box
    className="intellisense-tooltip"
    sx={{
      display: 'none',
      position: 'absolute',
      top: '100%',
      left: 0,
      mt: '4px',
      zIndex: 10,
      backgroundColor: VSCODE_COLORS.commandPaletteBg,
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
    {TOOLTIP_CONTENT[symbol] ?? typeAnnotation(symbol)}
  </Box>
);
