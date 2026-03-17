import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TerminalLine, TerminalTypewriterPhase } from '../text/useTerminalTypewriter';
import { VSCODE_COLORS, VSCODE_LAYOUT, monoFontFamily } from './vscodeTokens';

// Module-level keyframe — prevents Emotion from generating duplicate names on re-renders
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

export const isCommandPhase = (phase: TerminalTypewriterPhase): boolean =>
  phase === 'typing-command' || phase === 'pause-before-output';

export const isOutputPhase = (phase: TerminalTypewriterPhase): boolean =>
  phase === 'showing-output' || phase === 'pause-after-output';

interface VscodeTerminalPanelProps {
  commandText: string;
  outputText: string;
  showCursor: boolean;
  phase: TerminalTypewriterPhase;
  /** Completed command+output pairs shown above the active line */
  history: TerminalLine[];
}

const lineNumberSx: SxProps<Theme> = {
  width: '2ch',
  textAlign: 'right',
  color: VSCODE_COLORS.lineNumber,
  userSelect: 'none',
  flexShrink: 0,
  mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
};

/** Renders a single terminal row with a line number */
const TerminalRow: React.FC<{
  lineNum: number;
  children: React.ReactNode;
}> = ({ lineNum, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
    <Box component="span" sx={lineNumberSx}>
      {lineNum}
    </Box>
    <Box component="span">{children}</Box>
  </Box>
);

export const VscodeTerminalPanel: React.FC<VscodeTerminalPanelProps> = ({
  commandText,
  outputText,
  showCursor,
  phase,
  history,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when history grows or output appears
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, outputText]);

  const isCursorBlinking = phase === 'pause-before-output' || phase === 'pause-after-output';

  const cursorSx: SxProps<Theme> = {
    display: 'inline-block',
    width: '0.55ch',
    ml: '1px',
    userSelect: 'none',
    ...(isCursorBlinking && {
      animation: `${cursorBlink} 530ms step-end infinite`,
    }),
  };

  // Compute the running line number across all history + active line
  let runningLineNum = 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Panel header with tab strip */}
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
        {/* Panel tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL'].map((tab) => (
            <Box
              key={tab}
              component="span"
              sx={{
                fontFamily: monoFontFamily,
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                userSelect: 'none',
                ...(tab === 'TERMINAL'
                  ? {
                      color: VSCODE_COLORS.foreground,
                      borderBottom: `1px solid ${VSCODE_COLORS.foreground}`,
                      pb: '2px',
                    }
                  : {
                      color: VSCODE_COLORS.inactiveTab,
                    }),
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Terminal session tabs */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {['bash', 'node'].map((session, i) => (
              <Box
                key={session}
                component="span"
                sx={{
                  fontFamily: monoFontFamily,
                  fontSize: '0.60rem',
                  color: i === 0 ? VSCODE_COLORS.foreground : VSCODE_COLORS.inactiveTab,
                  userSelect: 'none',
                  px: 0.5,
                  borderRadius: '2px',
                  ...(i === 0 && {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }),
                }}
              >
                {session}
              </Box>
            ))}
          </Box>
          <Box
            component="span"
            sx={{
              fontFamily: monoFontFamily,
              fontSize: '0.80rem',
              color: VSCODE_COLORS.inactiveTab,
              userSelect: 'none',
              letterSpacing: '0.15em',
            }}
          >
            {'× +'}
          </Box>
        </Box>
      </Box>

      {/* Terminal body */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          backgroundColor: VSCODE_COLORS.terminalBg,
          fontFamily: monoFontFamily,
          fontSize: { xs: '0.82rem', sm: '0.92rem', md: '1rem' },
          lineHeight: 1.7,
          color: VSCODE_COLORS.foreground,
          px: 1.5,
          py: 1,
          overflowY: 'auto',
          // Hide scrollbar to keep the terminal looking clean
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {/* History — completed commands with their output */}
        {history.map((line, histIdx) => {
          const commandLineNum = runningLineNum;
          runningLineNum += 1;

          const outputLines = line.output.split('\n');
          const outputStartNum = runningLineNum;
          runningLineNum += outputLines.length;

          return (
            <React.Fragment key={histIdx}>
              {/* Command row */}
              <TerminalRow lineNum={commandLineNum}>
                <Box component="span" sx={{ color: VSCODE_COLORS.promptPath }}>
                  {'~ '}
                </Box>
                <Box component="span" sx={{ color: VSCODE_COLORS.promptDollar }}>
                  {'$ '}
                </Box>
                {line.command}
              </TerminalRow>
              {/* Output rows */}
              {outputLines.map((text, i) => (
                <TerminalRow key={i} lineNum={outputStartNum + i}>
                  <Box component="span" sx={{ color: VSCODE_COLORS.outputText }}>
                    {text}
                  </Box>
                </TerminalRow>
              ))}
            </React.Fragment>
          );
        })}

        {/* Active command row */}
        <TerminalRow lineNum={runningLineNum}>
          <Box component="span" sx={{ color: VSCODE_COLORS.promptPath }}>
            {'~ '}
          </Box>
          <Box component="span" sx={{ color: VSCODE_COLORS.promptDollar }}>
            {'$ '}
          </Box>
          {commandText}
          {showCursor && isCommandPhase(phase) && (
            <Box component="span" sx={cursorSx}>
              ▊
            </Box>
          )}
        </TerminalRow>

        {/* Active output rows — appear instantly when showing-output / pause-after-output */}
        {outputText &&
          (() => {
            const outputLines = outputText.split('\n');
            const outputStartNum = runningLineNum + 1;
            return outputLines.map((text, i) => (
              <TerminalRow key={i} lineNum={outputStartNum + i}>
                <Box component="span" sx={{ color: VSCODE_COLORS.outputText }}>
                  {text}
                  {showCursor && isOutputPhase(phase) && i === outputLines.length - 1 && (
                    <Box component="span" sx={cursorSx}>
                      ▊
                    </Box>
                  )}
                </Box>
              </TerminalRow>
            ));
          })()}
      </Box>
    </Box>
  );
};
