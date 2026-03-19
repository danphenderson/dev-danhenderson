import * as React from 'react';
import Box from '@mui/material/Box';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { cursorBlink } from '../../styles/animations';
import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';
import { VscodeIntelliSenseTooltip } from './VscodeIntelliSenseTooltip';
import { getVscodeEditorTabMetadata } from './vscodeEditorTabs';
import { kw, str, fn, varr, comment, punct } from './vscodeSyntaxHelpers';

// ---------------------------------------------------------------------------
// Demo content — edit here to change what appears in the editor pane
// ---------------------------------------------------------------------------

type TokenKind =
  | 'kw'
  | 'str'
  | 'fn'
  | 'varr'
  | 'comment'
  | 'punct'
  | 'typeAnnotation'
  | 'intellisense'
  | 'raw';

interface CodeToken {
  kind: TokenKind;
  text: string;
}

interface CodeLineData {
  tokens: CodeToken[];
  gutterAdd?: boolean;
  foldable?: boolean;
}

// server.py — FastAPI ping server
const SERVER_CODE_LINES: CodeLineData[] = [
  {
    tokens: [{ kind: 'comment', text: '# server.py' }],
  },
  {
    tokens: [
      { kind: 'kw', text: 'from' },
      { kind: 'raw', text: ' fastapi ' },
      { kind: 'kw', text: 'import' },
      { kind: 'raw', text: ' ' },
      { kind: 'intellisense', text: 'FastAPI' },
    ],
  },
  {
    tokens: [
      { kind: 'kw', text: 'from' },
      { kind: 'raw', text: ' fastapi.middleware.cors ' },
      { kind: 'kw', text: 'import' },
      { kind: 'raw', text: ' ' },
      { kind: 'intellisense', text: 'CORSMiddleware' },
    ],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'varr', text: 'app' },
      { kind: 'punct', text: ' = ' },
      { kind: 'intellisense', text: 'FastAPI' },
      { kind: 'punct', text: '(' },
      { kind: 'punct', text: 'title=' },
      { kind: 'str', text: '"Ping Pong Server"' },
      { kind: 'punct', text: ')' },
    ],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'varr', text: 'app' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'add_middleware' },
      { kind: 'punct', text: '(' },
    ],
    foldable: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'intellisense', text: 'CORSMiddleware' },
      { kind: 'punct', text: ',' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'punct', text: 'allow_origins=' },
      { kind: 'str', text: '["*"]' },
      { kind: 'punct', text: ',' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'punct', text: 'allow_credentials=' },
      { kind: 'kw', text: 'True' },
      { kind: 'punct', text: ',' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'punct', text: 'allow_methods=' },
      { kind: 'str', text: '["*"]' },
      { kind: 'punct', text: ',' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'punct', text: 'allow_headers=' },
      { kind: 'str', text: '["*"]' },
      { kind: 'punct', text: ',' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [{ kind: 'punct', text: ')' }],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'punct', text: '@' },
      { kind: 'varr', text: 'app' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'get' },
      { kind: 'punct', text: '(' },
      { kind: 'str', text: '"/ping"' },
      { kind: 'punct', text: ')' },
    ],
  },
  {
    tokens: [
      { kind: 'kw', text: 'async' },
      { kind: 'raw', text: ' ' },
      { kind: 'kw', text: 'def' },
      { kind: 'raw', text: ' ' },
      { kind: 'fn', text: 'ping' },
      { kind: 'punct', text: '() -> dict[str, str]:' },
    ],
    foldable: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'kw', text: 'return' },
      { kind: 'raw', text: ' ' },
      { kind: 'punct', text: '{' },
      { kind: 'str', text: '"message"' },
      { kind: 'punct', text: ': ' },
      { kind: 'str', text: '"pong"' },
      { kind: 'punct', text: '}' },
    ],
    gutterAdd: true,
  },
];

// client.ts — TypeScript fetch client
const CLIENT_CODE_LINES: CodeLineData[] = [
  {
    tokens: [{ kind: 'comment', text: '// client.ts' }],
  },
  {
    tokens: [
      { kind: 'kw', text: 'const' },
      { kind: 'raw', text: ' ' },
      { kind: 'varr', text: 'SERVER_URL' },
      { kind: 'punct', text: ' = ' },
      { kind: 'str', text: '"http://127.0.0.1:8000"' },
      { kind: 'punct', text: ';' },
    ],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'kw', text: 'type' },
      { kind: 'raw', text: ' ' },
      { kind: 'intellisense', text: 'PingResponse' },
      { kind: 'raw', text: ' = {' },
    ],
    foldable: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '  ' },
      { kind: 'punct', text: 'message: ' },
      { kind: 'typeAnnotation', text: 'string' },
      { kind: 'punct', text: ';' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [{ kind: 'punct', text: '};' }],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'kw', text: 'async' },
      { kind: 'raw', text: ' ' },
      { kind: 'kw', text: 'function' },
      { kind: 'raw', text: ' ' },
      { kind: 'fn', text: 'main' },
      { kind: 'punct', text: '(): ' },
      { kind: 'typeAnnotation', text: 'Promise<void>' },
      { kind: 'punct', text: ' {' },
    ],
    foldable: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '  ' },
      { kind: 'kw', text: 'try' },
      { kind: 'raw', text: ' {' },
    ],
    foldable: true,
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'kw', text: 'const' },
      { kind: 'raw', text: ' ' },
      { kind: 'varr', text: 'response' },
      { kind: 'punct', text: ' = ' },
      { kind: 'kw', text: 'await' },
      { kind: 'raw', text: ' ' },
      { kind: 'fn', text: 'fetch' },
      { kind: 'punct', text: '(`' },
      { kind: 'punct', text: '${' },
      { kind: 'varr', text: 'SERVER_URL' },
      { kind: 'punct', text: '}' },
      { kind: 'str', text: '/ping' },
      { kind: 'punct', text: '`);' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'kw', text: 'if' },
      { kind: 'punct', text: ' (!' },
      { kind: 'varr', text: 'response' },
      { kind: 'punct', text: '.ok) {' },
    ],
    foldable: true,
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '      ' },
      { kind: 'kw', text: 'throw' },
      { kind: 'raw', text: ' ' },
      { kind: 'kw', text: 'new' },
      { kind: 'raw', text: ' ' },
      { kind: 'typeAnnotation', text: 'Error' },
      { kind: 'punct', text: '(`' },
      { kind: 'str', text: 'Request failed with status ' },
      { kind: 'punct', text: '${' },
      { kind: 'varr', text: 'response' },
      { kind: 'punct', text: '.status}`);' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'punct', text: '}' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'kw', text: 'const' },
      { kind: 'raw', text: ' ' },
      { kind: 'varr', text: 'data' },
      { kind: 'punct', text: ' = (' },
      { kind: 'kw', text: 'await' },
      { kind: 'raw', text: ' ' },
      { kind: 'varr', text: 'response' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'json' },
      { kind: 'punct', text: '()) as ' },
      { kind: 'intellisense', text: 'PingResponse' },
      { kind: 'punct', text: ';' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'varr', text: 'console' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'log' },
      { kind: 'punct', text: '(' },
      { kind: 'str', text: '"client: ping"' },
      { kind: 'punct', text: ');' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'varr', text: 'console' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'log' },
      { kind: 'punct', text: '(`' },
      { kind: 'str', text: 'server: ' },
      { kind: 'punct', text: '${' },
      { kind: 'varr', text: 'data' },
      { kind: 'punct', text: '.message}`);' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '  ' },
      { kind: 'punct', text: '} ' },
      { kind: 'kw', text: 'catch' },
      { kind: 'punct', text: ' (' },
      { kind: 'varr', text: 'error' },
      { kind: 'punct', text: ') {' },
    ],
    foldable: true,
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'varr', text: 'console' },
      { kind: 'punct', text: '.' },
      { kind: 'fn', text: 'error' },
      { kind: 'punct', text: '(' },
      { kind: 'str', text: '"Ping failed:"' },
      { kind: 'punct', text: ', ' },
      { kind: 'varr', text: 'error' },
      { kind: 'punct', text: ');' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '    ' },
      { kind: 'varr', text: 'process' },
      { kind: 'punct', text: '.exitCode = 1;' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [
      { kind: 'raw', text: '  ' },
      { kind: 'punct', text: '}' },
    ],
    gutterAdd: true,
  },
  {
    tokens: [{ kind: 'punct', text: '}' }],
  },
  {
    tokens: [],
  },
  {
    tokens: [
      { kind: 'kw', text: 'void' },
      { kind: 'raw', text: ' ' },
      { kind: 'fn', text: 'main' },
      { kind: 'punct', text: '();' },
    ],
  },
];

const EDITOR_TAB_LINES: Record<VscodeEditorTab, CodeLineData[]> = {
  server: SERVER_CODE_LINES,
  client: CLIENT_CODE_LINES,
};

/** Number of editor lines visible before scrolling. */
const LINES_VISIBLE = 6;

interface CodeLineProps {
  lineNumber: number;
  hovered: boolean;
  active: boolean;
  foldable: boolean;
  gutterAdd: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const CodeLine: React.FC<CodeLineProps> = ({
  lineNumber,
  hovered,
  active,
  foldable,
  gutterAdd,
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
      minWidth: 0,
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
        backgroundColor: gutterAdd ? VSCODE_COLORS.gutterAdd : 'transparent',
        borderRadius: '1px',
        alignSelf: 'stretch',
      }}
    />
    <Box
      component="span"
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'block',
        whiteSpace: 'pre',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  </Box>
);

/** Renders a single CodeToken as the appropriate syntax-highlight span. */
const renderToken = (token: CodeToken, i: number): React.ReactNode => {
  switch (token.kind) {
    case 'kw':
      return <React.Fragment key={i}>{kw(token.text)}</React.Fragment>;
    case 'str':
      return <React.Fragment key={i}>{str(token.text)}</React.Fragment>;
    case 'fn':
      return <React.Fragment key={i}>{fn(token.text)}</React.Fragment>;
    case 'varr':
      return <React.Fragment key={i}>{varr(token.text)}</React.Fragment>;
    case 'comment':
      return <React.Fragment key={i}>{comment(token.text)}</React.Fragment>;
    case 'punct':
      return <React.Fragment key={i}>{punct(token.text)}</React.Fragment>;
    case 'typeAnnotation':
      return (
        <Box key={i} component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
          {token.text}
        </Box>
      );
    case 'intellisense':
      return (
        <Box
          key={i}
          component="span"
          sx={{
            color: VSCODE_COLORS.syntaxTypeAnnotation,
            position: 'relative',
            '&:hover .intellisense-tooltip': { display: 'block' },
          }}
        >
          {token.text}
          <VscodeIntelliSenseTooltip symbol={token.text} />
        </Box>
      );
    case 'raw':
    default:
      return <React.Fragment key={i}>{token.text}</React.Fragment>;
  }
};

interface VscodeEditorPaneProps {
  activeTab?: VscodeEditorTab;
  expanded?: boolean;
  /** When true, fill the remaining editor column width instead of using the fixed demo width. */
  fluidLayout?: boolean;
  /** When true, the outer IDE window has been user-resized; use flex layout. */
  resized?: boolean;
  /** When true, show a blinking I-beam cursor after the last line. */
  playing?: boolean;
}

export const VscodeEditorPane: React.FC<VscodeEditorPaneProps> = ({
  activeTab = 'server',
  expanded = false,
  fluidLayout = false,
  resized = false,
  playing = false,
}) => {
  const flexLayout = expanded || fluidLayout || resized;
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null);

  const tabMetadata = getVscodeEditorTabMetadata(activeTab);
  const codeLines = EDITOR_TAB_LINES[activeTab] ?? EDITOR_TAB_LINES.server;

  // Active (cursor) line is one past the last code line
  const activeLine: number | null = playing ? codeLines.length + 1 : null;

  return (
    <Box
      aria-hidden="true"
      sx={{
        backgroundColor: VSCODE_COLORS.editorBg,
        fontFamily: monoFontFamily,
        fontSize: { xs: '0.72rem', sm: '0.80rem', md: '0.84rem' },
        width: flexLayout ? '100%' : VSCODE_LAYOUT.editorColumnWidth,
        minWidth: flexLayout ? 0 : VSCODE_LAYOUT.editorColumnWidth,
        maxWidth: flexLayout ? '100%' : VSCODE_LAYOUT.editorColumnWidth,
        borderBottom: `1px solid ${VSCODE_COLORS.panelBorder}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...(flexLayout ? { flex: 1, minHeight: 0 } : { flexShrink: 0 }),
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
          borderBottom: `1px solid ${VSCODE_COLORS.sashBorder}`,
          flexShrink: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {tabMetadata.breadcrumbs.map((segment, i) => (
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
                color:
                  i === tabMetadata.breadcrumbs.length - 1
                    ? VSCODE_COLORS.foreground
                    : VSCODE_COLORS.breadcrumbText,
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
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Scrollable code area — shows LINES_VISIBLE rows then scrolls */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            pl: 0.5,
            pr: 1.5,
            py: 0.75,
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: expanded || resized ? 'none' : `calc(${LINES_VISIBLE} * 1.55em + 12px)`,
            // Thin custom scrollbar to keep the VS Code aesthetic
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.30)' },
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.18) transparent',
          }}
        >
          {codeLines.map((line, idx) => {
            const lineNumber = idx + 1;
            return (
              <CodeLine
                key={lineNumber}
                lineNumber={lineNumber}
                hovered={hoveredLine === lineNumber}
                active={activeLine === lineNumber}
                foldable={!!line.foldable}
                gutterAdd={!!line.gutterAdd}
                onMouseEnter={() => setHoveredLine(lineNumber)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                {line.tokens.map(renderToken)}
              </CodeLine>
            );
          })}

          {/* Blinking I-beam cursor row */}
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
              <Box component="span" sx={{ width: VSCODE_LAYOUT.foldGutterWidth, flexShrink: 0 }} />
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
                {codeLines.length + 1}
              </Box>
              <Box
                component="span"
                sx={{ width: VSCODE_LAYOUT.gutterWidth, flexShrink: 0, mr: '6px' }}
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
