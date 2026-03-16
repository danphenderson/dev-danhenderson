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
  phase === 'typing-command' || phase === 'deleting-command' || phase === 'pause-before-output';

export const isOutputPhase = (phase: TerminalTypewriterPhase): boolean =>
  phase === 'typing-output' || phase === 'deleting-output' || phase === 'pause-after-output';

interface VscodeTerminalPanelProps {
  lines: TerminalLine[];
  commandText: string;
  outputText: string;
  showCursor: boolean;
  phase: TerminalTypewriterPhase;
  longestCommand: string;
  longestOutput: string;
}

const lineNumberSx: SxProps<Theme> = {
  width: '2ch',
  textAlign: 'right',
  color: VSCODE_COLORS.lineNumber,
  userSelect: 'none',
  flexShrink: 0,
  mr: `${VSCODE_LAYOUT.lineNumberGutter}px`,
};

export const VscodeTerminalPanel: React.FC<VscodeTerminalPanelProps> = ({
  lines,
  commandText,
  outputText,
  showCursor,
  phase,
  longestCommand,
  longestOutput,
}) => {
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

      {/* Terminal body */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          backgroundColor: VSCODE_COLORS.terminalBg,
          fontFamily: monoFontFamily,
          fontSize: { xs: '0.82rem', sm: '0.92rem', md: '1rem' },
          lineHeight: 1.7,
          color: VSCODE_COLORS.foreground,
          px: 1.5,
          py: 1,
        }}
      >
        {/* Width-reservation layer — prevents layout shift */}
        <Box
          aria-hidden
          sx={{
            visibility: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
            font: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          {/* Command row reserve */}
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Box component="span" sx={lineNumberSx}>
              1
            </Box>
            <Box component="span">
              {'~ $ '}
              {longestCommand}
            </Box>
          </Box>
          {/* Output row(s) reserve — split by \n to reserve for multi-line outputs */}
          {longestOutput.split('\n').map((line, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Box component="span" sx={lineNumberSx}>
                {i + 2}
              </Box>
              <Box component="span">{line}</Box>
            </Box>
          ))}
        </Box>

        {/* Visible layer */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            font: 'inherit',
            lineHeight: 'inherit',
            px: 1.5,
            py: 1,
          }}
        >
          {/* Command row */}
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Box component="span" sx={lineNumberSx}>
              1
            </Box>
            <Box component="span">
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
            </Box>
          </Box>

          {/* Output row(s) — split by \n to render multi-line outputs with per-row line numbers */}
          {(outputText || isOutputPhase(phase)) &&
            (() => {
              const outputLines = outputText.split('\n');
              return outputLines.map((line, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Box component="span" sx={lineNumberSx}>
                    {i + 2}
                  </Box>
                  <Box component="span" sx={{ color: VSCODE_COLORS.outputText }}>
                    {line}
                    {showCursor && isOutputPhase(phase) && i === outputLines.length - 1 && (
                      <Box component="span" sx={cursorSx}>
                        ▊
                      </Box>
                    )}
                  </Box>
                </Box>
              ));
            })()}
        </Box>
      </Box>
    </Box>
  );
};
