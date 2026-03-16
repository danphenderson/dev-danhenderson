import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTerminalTypewriter } from './text/useTerminalTypewriter';
import type { TerminalLine } from './text/useTerminalTypewriter';

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

export interface TerminalHeroContentProps {
  lines: TerminalLine[];
  playing?: boolean;
  sessionLabel?: string;
  sx?: SxProps<Theme>;
}

const windowControlSx: SxProps<Theme> = {
  width: 12,
  height: 12,
  borderRadius: '50%',
};

const monoFontFamily = '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace';

const isCommandPhase = (phase: string) =>
  phase === 'typing-command' || phase === 'deleting-command' || phase === 'pause-before-output';

const isOutputPhase = (phase: string) =>
  phase === 'typing-output' || phase === 'deleting-output' || phase === 'pause-after-output';

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
  sessionLabel = 'danhenderson.dev',
  sx,
}) => {
  const { commandText, outputText, showCursor, phase, longestCommand, longestOutput } =
    useTerminalTypewriter({
      lines,
      playing,
      prompt: '~ $ ',
      timingPreset: 'headline',
      pauseBeforeOutputMs: 400,
      pauseAfterOutputMs: 2400,
    });

  const isCursorBlinking =
    phase === 'pause-before-output' || phase === 'pause-after-output';

  const cursorSx: SxProps<Theme> = {
    display: 'inline-block',
    width: '0.55ch',
    ml: '1px',
    userSelect: 'none',
    ...(isCursorBlinking && {
      animation: `${cursorBlink} 530ms step-end infinite`,
    }),
  };

  const accessibleLabel = lines
    .map((l) => `${l.command}: ${l.output}`)
    .join('; ');

  return (
    <Box
      aria-label={accessibleLabel}
      data-testid="terminal-hero"
      data-playing={String(Boolean(playing))}
      sx={[
        {
          fontFamily: monoFontFamily,
          fontSize: { xs: '0.82rem', sm: '0.92rem', md: '1rem' },
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.92)',
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* Title bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.875,
          pb: 0.875,
          mb: 1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Window controls */}
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          <Box sx={{ ...windowControlSx, backgroundColor: '#ff5f57' }} />
          <Box sx={{ ...windowControlSx, backgroundColor: '#febc2e' }} />
          <Box sx={{ ...windowControlSx, backgroundColor: '#28c840' }} />
        </Box>

        {/* Session label */}
        <Box
          component="span"
          sx={{
            flex: 1,
            textAlign: 'center',
            fontSize: '0.72rem',
            opacity: 0.4,
            letterSpacing: '0.03em',
            userSelect: 'none',
            pr: 4.5,
          }}
        >
          {sessionLabel}
        </Box>
      </Box>

      {/* Terminal body */}
      <Box sx={{ position: 'relative', minHeight: '3.4em' }}>
        {/* Width reservation – prevents layout shift */}
        <Box
          component="span"
          aria-hidden
          sx={{
            display: 'block',
            visibility: 'hidden',
            whiteSpace: 'pre-wrap',
            pointerEvents: 'none',
            userSelect: 'none',
            font: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          {'~ $ '}{longestCommand}
          {'\n'}
          {longestOutput}
        </Box>

        {/* Visible layer */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            whiteSpace: 'pre-wrap',
            font: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          {/* Prompt + command row */}
          <Box component="span">
            <Box component="span" sx={{ opacity: 0.4 }}>{'~ '}</Box>
            <Box component="span" sx={{ color: '#28c840' }}>{'$ '}</Box>
            {commandText}
            {showCursor && isCommandPhase(phase) && (
              <Box component="span" sx={cursorSx}>▊</Box>
            )}
          </Box>

          {/* Output row */}
          {(outputText || isOutputPhase(phase)) && (
            <Box
              component="div"
              sx={{
                color: 'rgba(255,255,255,0.58)',
                mt: 0.125,
              }}
            >
              {outputText}
              {showCursor && isOutputPhase(phase) && (
                <Box component="span" sx={cursorSx}>▊</Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
