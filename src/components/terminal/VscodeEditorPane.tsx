import * as React from 'react';
import Box from '@mui/material/Box';
import { cursorBlink } from '../../styles/animations';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';
import { VscodeIntelliSenseTooltip } from './VscodeIntelliSenseTooltip';

// Lines that receive a green gutter marker (1-indexed)
const GUTTER_ADD_LINES = new Set([3, 4]);

interface CodeLineProps {
  lineNumber: number;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const CodeLine: React.FC<CodeLineProps> = ({
  lineNumber,
  hovered,
  onMouseEnter,
  onMouseLeave,
  children,
}) => (
  <Box
    component="div"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    sx={{
      display: 'flex',
      alignItems: 'baseline',
      lineHeight: 1.65,
      backgroundColor: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
      transition: 'background-color 0.12s',
    }}
  >
    <Box
      component="span"
      sx={{
        width: '2ch',
        textAlign: 'right',
        color: hovered ? VSCODE_COLORS.foreground : VSCODE_COLORS.lineNumber,
        userSelect: 'none',
        flexShrink: 0,
        mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
        transition: 'color 0.12s',
      }}
    >
      {hovered ? '›' : lineNumber}
    </Box>
    {/* Git diff gutter marker */}
    <Box
      component="span"
      sx={{
        width: VSCODE_LAYOUT.gutterWidth,
        flexShrink: 0,
        mr: '4px',
        backgroundColor: GUTTER_ADD_LINES.has(lineNumber)
          ? VSCODE_COLORS.gutterAdd
          : 'transparent',
        borderRadius: '1px',
        alignSelf: 'stretch',
      }}
    />
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

interface VscodeEditorPaneProps {
  /** When true, show a blinking I-beam cursor after the last line. */
  playing?: boolean;
}

export const VscodeEditorPane: React.FC<VscodeEditorPaneProps> = ({ playing = false }) => {
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null);

  return (
    <Box
      aria-hidden="true"
      sx={{
        backgroundColor: VSCODE_COLORS.editorBg,
        fontFamily: monoFontFamily,
        fontSize: { xs: '0.72rem', sm: '0.80rem', md: '0.84rem' },
        flexShrink: 0,
        borderBottom: `1px solid ${VSCODE_COLORS.panelBorder}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      {/* Breadcrumb bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: VSCODE_LAYOUT.breadcrumbHeight,
          px: 1.5,
          backgroundColor: VSCODE_COLORS.breadcrumbBg,
          borderBottom: `1px solid ${VSCODE_COLORS.panelBorder}`,
          flexShrink: 0,
        }}
      >
        {['src', 'portfolio.ts', 'developer'].map((segment, i) => (
          <React.Fragment key={segment}>
            {i > 0 && (
              <Box
                component="span"
                sx={{
                  mx: 0.5,
                  color: VSCODE_COLORS.breadcrumbSep,
                  fontSize: '0.6rem',
                  userSelect: 'none',
                }}
              >
                ›
              </Box>
            )}
            <Box
              component="span"
              sx={{
                fontFamily: monoFontFamily,
                fontSize: '0.65rem',
                color: VSCODE_COLORS.panelLabel,
                userSelect: 'none',
              }}
            >
              {segment}
            </Box>
          </React.Fragment>
        ))}
      </Box>

      {/* Editor body with code + minimap */}
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Code area */}
        <Box sx={{ flex: 1, px: 1.5, py: 1 }}>
          <CodeLine
            lineNumber={1}
            hovered={hoveredLine === 1}
            onMouseEnter={() => setHoveredLine(1)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {comment('// portfolio.ts')}
          </CodeLine>
          <CodeLine
            lineNumber={2}
            hovered={hoveredLine === 2}
            onMouseEnter={() => setHoveredLine(2)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {kw('const')} {varr('developer')}
            {punct(': ')}
            <Box
              component="span"
              sx={{
                color: VSCODE_COLORS.syntaxTypeAnnotation,
                position: 'relative',
                '&:hover .intellisense-tooltip': { display: 'block' },
              }}
            >
              Developer
              <VscodeIntelliSenseTooltip />
            </Box>
            {' '}{punct('= {')}
          </CodeLine>
          <CodeLine
            lineNumber={3}
            hovered={hoveredLine === 3}
            onMouseEnter={() => setHoveredLine(3)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {'  '}
            {punct('passions: ')}
            {str('["mathematics", "computers", "adventures"]')}
            {punct(',')}
          </CodeLine>
          <CodeLine
            lineNumber={4}
            hovered={hoveredLine === 4}
            onMouseEnter={() => setHoveredLine(4)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {'  '}
            {punct('contact: ')}
            {punct('() => ')}
            {fn('navigate')}
            {punct('(')}
            {str('"/cv"')}
            {punct('),')}
          </CodeLine>
          <CodeLine
            lineNumber={5}
            hovered={hoveredLine === 5}
            onMouseEnter={() => setHoveredLine(5)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {punct('};')}
          </CodeLine>

          {/* Blinking I-beam cursor */}
          {playing && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                lineHeight: 1.65,
                mt: '1px',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: '2ch',
                  textAlign: 'right',
                  color: VSCODE_COLORS.lineNumber,
                  userSelect: 'none',
                  flexShrink: 0,
                  mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
                }}
              >
                6
              </Box>
              <Box
                component="span"
                sx={{
                  width: VSCODE_LAYOUT.gutterWidth,
                  flexShrink: 0,
                  mr: '4px',
                }}
              />
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.1em',
                  backgroundColor: VSCODE_COLORS.foreground,
                  animation: `${cursorBlink} 1s step-end infinite`,
                  verticalAlign: 'text-bottom',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Minimap column — decorative, md+ only */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: VSCODE_LAYOUT.minimapWidth,
            flexShrink: 0,
            backgroundColor: VSCODE_COLORS.minimapBg,
            py: 1,
            px: 0.5,
            gap: '3px',
          }}
        >
          {[0.6, 0.85, 0.95, 0.8, 0.3].map((w, i) => (
            <Box
              key={i}
              sx={{
                height: 3,
                width: `${w * 100}%`,
                backgroundColor: 'rgba(255,255,255,0.10)',
                borderRadius: '1px',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
