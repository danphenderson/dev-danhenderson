import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TerminalLine, TerminalSessionTab } from '../../types/ui';
import type { TerminalTypewriterPhase } from '../text/useTerminalTypewriter';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily, systemFontFamily } from './vscodeTokens';

// Module-level keyframe — prevents Emotion from generating duplicate names on re-renders
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

export const isCommandPhase = (phase: TerminalTypewriterPhase): boolean =>
  phase === 'typing-command' || phase === 'pause-before-output' || phase === 'clearing-screen';

export const isOutputPhase = (phase: TerminalTypewriterPhase): boolean =>
  phase === 'showing-output' || phase === 'pause-after-output';

interface VscodeTerminalPanelProps {
  commandText: string;
  expanded?: boolean;
  /** When true, fill the remaining editor column width instead of using the fixed demo width. */
  fluidLayout?: boolean;
  /** When true, the outer IDE window has been user-resized; use flex layout. */
  resized?: boolean;
  outputText: string;
  showCursor: boolean;
  phase: TerminalTypewriterPhase;
  /** Completed command+output pairs shown above the active line */
  history: TerminalLine[];
  /** Terminal session tabs; when omitted the default single "zsh" badge renders. */
  sessions?: TerminalSessionTab[];
  /** Which session tab is active; only meaningful when `sessions` is provided. */
  activeSessionId?: string;
}

/**
 * Colorize a single output line with VS Code–style token colors.
 * Rules are applied in priority order; the first match wins.
 */
const colorizeOutputLine = (text: string): React.ReactNode => {
  // ==> Section headers (e.g. brew ls)
  if (text.startsWith('==>')) {
    const rest = text.slice(3);
    return (
      <>
        <Box component="span" sx={{ color: VSCODE_COLORS.promptBranch }}>
          {'==>'}
        </Box>
        <Box component="span" sx={{ color: VSCODE_COLORS.syntaxFunction }}>
          {rest}
        </Box>
      </>
    );
  }
  // ✓ Success lines (e.g. npm run build)
  if (text.startsWith('✓')) {
    const rest = text.slice(1);
    return (
      <>
        <Box component="span" sx={{ color: VSCODE_COLORS.promptDollar }}>
          {'✓'}
        </Box>
        <Box component="span" sx={{ color: VSCODE_COLORS.foreground }}>
          {rest}
        </Box>
      </>
    );
  }
  // Version strings (v22.14.0, Python 3.x, julia version x)
  if (/^(v\d|Python \d+\.\d|\d+\.\d|julia version)/.test(text)) {
    return (
      <Box component="span" sx={{ color: VSCODE_COLORS.syntaxVariable }}>
        {text}
      </Box>
    );
  }
  // Short git hash + commit message (7 hex chars + space)
  const hashMatch = text.match(/^([0-9a-f]{7}) (.*)$/);
  if (hashMatch) {
    return (
      <>
        <Box component="span" sx={{ color: VSCODE_COLORS.lineNumber }}>
          {hashMatch[1]}
        </Box>{' '}
        <Box component="span" sx={{ color: VSCODE_COLORS.foreground }}>
          {hashMatch[2]}
        </Box>
      </>
    );
  }
  // Default — inherits parent outputText color
  return <>{text}</>;
};

/** First line of the two-line zsh prompt — renders cwd and git status */
const GitStatusLine: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', lineHeight: 1.7 }}>
    <Box component="span" sx={{ color: VSCODE_COLORS.syntaxTypeAnnotation }}>
      {'~/dev-danhenderson'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.promptBranch, ml: '0.5ch' }}>
      {'v1'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.promptBranch, ml: '0.4ch' }}>
      {'*1'}
    </Box>
    <Box component="span" sx={{ color: VSCODE_COLORS.promptDollar, ml: '0.4ch' }}>
      {'+3'}
    </Box>
    <Box
      component="span"
      sx={{
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        ml: '0.75ch',
      }}
    />
  </Box>
);

export const VscodeTerminalPanel: React.FC<VscodeTerminalPanelProps> = ({
  commandText,
  expanded = false,
  fluidLayout = false,
  resized = false,
  outputText,
  showCursor,
  phase,
  history,
  sessions,
  activeSessionId,
}) => {
  const flexLayout = expanded || fluidLayout || resized;
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when history grows or output appears
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, outputText]);

  const isCursorBlinking =
    phase === 'pause-before-output' ||
    phase === 'pause-after-output' ||
    phase === 'clearing-screen';

  const cursorSx: SxProps<Theme> = {
    display: 'inline-block',
    width: '0.55ch',
    ml: '1px',
    userSelect: 'none',
    ...(isCursorBlinking && {
      animation: `${cursorBlink} 530ms step-end infinite`,
    }),
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: flexLayout ? '100%' : VSCODE_LAYOUT.editorColumnWidth,
        maxWidth: '100%',
        minWidth: flexLayout ? 0 : VSCODE_LAYOUT.editorColumnWidth,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: VSCODE_LAYOUT.panelHeaderHeight,
          px: 1.5,
          backgroundColor: VSCODE_COLORS.terminalHeaderBg,
          borderTop: `1px solid ${VSCODE_COLORS.panelBorder}`,
          flexShrink: 0,
        }}
      >
        {/* Panel tab row — TERMINAL is the active panel tab */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="span"
            sx={{
              fontFamily: systemFontFamily,
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: VSCODE_COLORS.foreground,
              userSelect: 'none',
              borderBottom: '1px solid ' + VSCODE_COLORS.activeTabAccent,
              pb: '4px',
            }}
          >
            Terminal
          </Box>
          {/* Inactive panel tabs for realism */}
          {['Problems', 'Output'].map((label) => (
            <Box
              key={label}
              component="span"
              sx={{
                fontFamily: systemFontFamily,
                fontSize: '0.68rem',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: VSCODE_COLORS.inactiveTab,
                userSelect: 'none',
                pb: '4px',
                borderBottom: '1px solid transparent',
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Terminal session tabs */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            {(sessions ?? [{ id: 'zsh', label: 'zsh' }]).map((session) => {
              const isActive = sessions ? session.id === activeSessionId : true;
              return (
                <Box
                  key={session.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    opacity: isActive ? 1 : 0.55,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: monoFontFamily,
                      fontSize: '0.58rem',
                      color: VSCODE_COLORS.inactiveTab,
                      border: `1px solid rgba(255,255,255,0.12)`,
                      borderRadius: '2px',
                      px: '3px',
                      lineHeight: 1.5,
                      userSelect: 'none',
                    }}
                  >
                    {'>_'}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontFamily: monoFontFamily,
                      fontSize: '0.66rem',
                      color: isActive ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
                      userSelect: 'none',
                      transition: 'color 0.15s',
                    }}
                  >
                    {session.label}
                  </Box>
                </Box>
              );
            })}
          </Box>
          {/* Add / dropdown */}
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.76rem',
              color: VSCODE_COLORS.inactiveTab,
              userSelect: 'none',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Box
              component="span"
              sx={{ '&:hover': { color: VSCODE_COLORS.foreground }, transition: 'color 0.1s' }}
            >
              +
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '0.6rem',
                '&:hover': { color: VSCODE_COLORS.foreground },
                transition: 'color 0.1s',
              }}
            >
              ⌄
            </Box>
          </Box>
          {/* Split pane */}
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.76rem',
              color: VSCODE_COLORS.inactiveTab,
              userSelect: 'none',
              cursor: 'default',
              '&:hover': { color: VSCODE_COLORS.foreground },
              transition: 'color 0.1s',
            }}
          >
            {'⊟'}
          </Box>
          {/* More actions */}
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.78rem',
              color: VSCODE_COLORS.inactiveTab,
              userSelect: 'none',
              letterSpacing: '0.12em',
              cursor: 'default',
              '&:hover': { color: VSCODE_COLORS.foreground },
              transition: 'color 0.1s',
            }}
          >
            {'···'}
          </Box>
        </Box>
      </Box>

      {/* Terminal body — fixed height so the component never resizes */}
      <Box
        ref={scrollRef}
        data-testid="terminal-panel-body"
        sx={{
          // terminalBodyLines * lineHeight(1.7em) + padding; keeps height stable across all phases
          height: expanded
            ? 'clamp(12rem, 30vh, 20rem)'
            : `calc(${VSCODE_LAYOUT.terminalBodyLines} * 1.7em + 16px)`,
          flexShrink: 0,
          backgroundColor: VSCODE_COLORS.terminalBg,
          fontFamily: monoFontFamily,
          fontSize: { xs: '0.80rem', sm: '0.88rem', md: '0.95rem' },
          lineHeight: 1.7,
          color: VSCODE_COLORS.foreground,
          px: 1.5,
          py: 0.75,
          overflowX: 'hidden',
          overflowY: 'auto',
          // Fade out during clear-screen phase to simulate Control+L flash
          opacity: phase === 'clearing-screen' ? 0.35 : 1,
          transition: 'opacity 0.12s ease-in',
          // Hide scrollbar to keep the terminal looking clean
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {/* History — completed commands with their output */}
        {history.map((line, histIdx) => (
          <Box key={histIdx} sx={{ opacity: 0.62, transition: 'opacity 0.15s' }}>
            <GitStatusLine />
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Box component="span" sx={{ color: VSCODE_COLORS.lineNumber }}>
                {'○ '}
              </Box>
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.35)' }}>
                {'❯ '}
              </Box>
              {line.command}
            </Box>
            {line.output.split('\n').map((text, i) => (
              <Box key={i} sx={{ color: VSCODE_COLORS.outputText }}>
                {colorizeOutputLine(text)}
              </Box>
            ))}
          </Box>
        ))}

        {/* Active prompt */}
        <GitStatusLine />
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Box component="span" sx={{ color: VSCODE_COLORS.lineNumber }}>
            {'○ '}
          </Box>
          <Box component="span" sx={{ color: VSCODE_COLORS.promptArrow }}>
            {'❯ '}
          </Box>
          {commandText}
          {showCursor && isCommandPhase(phase) && (
            <Box component="span" sx={cursorSx}>
              █
            </Box>
          )}
        </Box>

        {/* Active output rows — appear instantly when showing-output / pause-after-output */}
        {outputText &&
          (() => {
            const outputLines = outputText.split('\n');
            return outputLines.map((text, i) => (
              <Box key={i} sx={{ color: VSCODE_COLORS.outputText }}>
                {colorizeOutputLine(text)}
                {showCursor && isOutputPhase(phase) && i === outputLines.length - 1 && (
                  <Box component="span" sx={cursorSx}>
                    █
                  </Box>
                )}
              </Box>
            ));
          })()}
      </Box>
    </Box>
  );
};
