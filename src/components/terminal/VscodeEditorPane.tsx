import * as React from 'react';
import Box from '@mui/material/Box';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { cursorBlink } from '../../styles/animations';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';
import { VscodeIntelliSenseTooltip } from './VscodeIntelliSenseTooltip';

// Lines that receive a green gutter marker (1-indexed)
const GUTTER_ADD_LINES = new Set([3, 4]);

// Lines that show a fold indicator (block-start lines, 1-indexed)
const FOLDABLE_LINES = new Set([2]);

interface CodeLineProps {
  lineNumber: number;
  hovered: boolean;
  active: boolean;
  foldable: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const CodeLine: React.FC<CodeLineProps> = ({
  lineNumber,
  hovered,
  active,
  foldable,
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
      lineHeight: 1.55,
      backgroundColor: active
        ? 'rgba(255,255,255,0.04)'
        : hovered
          ? 'rgba(255,255,255,0.02)'
          : 'transparent',
      transition: 'background-color 0.08s',
      // Current-line left accent
      ...(active && {
        borderLeft: '2px solid rgba(255,255,255,0.12)',
      }),
      ...(!active && {
        borderLeft: '2px solid transparent',
      }),
    }}
  >
    {/* Fold gutter */}
    <Box
      component="span"
      sx={{
        width: VSCODE_LAYOUT.foldGutterWidth,
        textAlign: 'center',
        flexShrink: 0,
        fontSize: '0.55em',
        color: VSCODE_COLORS.foldIndicator,
        userSelect: 'none',
        opacity: foldable ? (hovered ? 1 : 0.5) : 0,
        transition: 'opacity 0.1s',
      }}
    >
      {foldable ? '▾' : ''}
    </Box>
    <Box
      component="span"
      sx={{
        width: VSCODE_LAYOUT.lineNumberWidth,
        textAlign: 'right',
        color: active ? VSCODE_COLORS.lineNumberActive : VSCODE_COLORS.lineNumber,
        userSelect: 'none',
        flexShrink: 0,
        mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
        transition: 'color 0.08s',
        fontSize: '0.92em',
      }}
    >
      {lineNumber}
    </Box>
    {/* Git diff gutter marker */}
    <Box
      component="span"
      sx={{
        width: VSCODE_LAYOUT.gutterWidth,
        flexShrink: 0,
        mr: '6px',
        backgroundColor: GUTTER_ADD_LINES.has(lineNumber) ? VSCODE_COLORS.gutterAdd : 'transparent',
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
  <Box component="span" sx={{ color: VSCODE_COLORS.syntaxComment, fontStyle: 'italic' }}>
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
  // The cursor/active line
  const activeLine: number | null = playing ? 6 : null;

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
      {/* Breadcrumb bar — integrated with editor surface */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: VSCODE_LAYOUT.breadcrumbHeight,
          px: 1.5,
          backgroundColor: VSCODE_COLORS.breadcrumbBg,
          borderBottom: `1px solid ${VSCODE_COLORS.sashBorder}`,
          flexShrink: 0,
        }}
      >
        {['src', 'portfolio.ts', 'developer'].map((segment, i) => (
          <React.Fragment key={segment}>
            {i > 0 && (
              <ChevronRightOutlined
                sx={{
                  fontSize: '0.72rem',
                  color: VSCODE_COLORS.breadcrumbSep,
                  mx: '2px',
                }}
              />
            )}
            <Box
              component="span"
              sx={{
                fontFamily: monoFontFamily,
                fontSize: '0.68rem',
                color: i === 2 ? VSCODE_COLORS.foreground : VSCODE_COLORS.breadcrumbText,
                userSelect: 'none',
                px: '3px',
                py: '1px',
                borderRadius: '3px',
                cursor: 'default',
                transition: 'background-color 0.1s',
                '&:hover': { backgroundColor: VSCODE_COLORS.iconHover },
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
        <Box sx={{ flex: 1, pl: 0.5, pr: 1.5, py: 0.75 }}>
          <CodeLine
            lineNumber={1}
            hovered={hoveredLine === 1}
            active={activeLine === 1}
            foldable={FOLDABLE_LINES.has(1)}
            onMouseEnter={() => setHoveredLine(1)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {comment('// portfolio.ts')}
          </CodeLine>
          <CodeLine
            lineNumber={2}
            hovered={hoveredLine === 2}
            active={activeLine === 2}
            foldable={FOLDABLE_LINES.has(2)}
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
            {punct(' = {')}
          </CodeLine>
          <CodeLine
            lineNumber={3}
            hovered={hoveredLine === 3}
            active={activeLine === 3}
            foldable={FOLDABLE_LINES.has(3)}
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
            active={activeLine === 4}
            foldable={FOLDABLE_LINES.has(4)}
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
            active={activeLine === 5}
            foldable={FOLDABLE_LINES.has(5)}
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
                lineHeight: 1.55,
                mt: '1px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderLeft: '2px solid rgba(255,255,255,0.12)',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: VSCODE_LAYOUT.foldGutterWidth,
                  flexShrink: 0,
                }}
              />
              <Box
                component="span"
                sx={{
                  width: VSCODE_LAYOUT.lineNumberWidth,
                  textAlign: 'right',
                  color: VSCODE_COLORS.lineNumberActive,
                  userSelect: 'none',
                  flexShrink: 0,
                  mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
                  fontSize: '0.92em',
                }}
              >
                6
              </Box>
              <Box
                component="span"
                sx={{
                  width: VSCODE_LAYOUT.gutterWidth,
                  flexShrink: 0,
                  mr: '6px',
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
            borderLeft: `1px solid ${VSCODE_COLORS.sashBorder}`,
            py: 1,
            px: 0.75,
            gap: '3px',
            position: 'relative',
          }}
        >
          {/* Viewport highlight slab */}
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              left: 0,
              right: 0,
              height: 28,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderLeft: '2px solid rgba(255,255,255,0.12)',
            }}
          />
          {[0.55, 0.82, 0.92, 0.78, 0.25].map((w, i) => (
            <Box
              key={i}
              sx={{
                height: 2.5,
                width: `${w * 100}%`,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '0.5px',
                position: 'relative',
                zIndex: 1,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
