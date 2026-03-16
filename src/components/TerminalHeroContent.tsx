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
  width: 10,
  height: 10,
  borderRadius: '50%',
};

const monoFontFamily = '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace';

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
  sessionLabel = 'danhenderson.dev',
  sx,
}) => {
  const { promptText, commandText, outputText, showCursor, phase, longestCommand, longestOutput } =
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
          gap: 0.75,
          mb: 1,
        }}
      >
        {/* Window controls */}
        <Box sx={{ display: 'flex', gap: 0.625 }}>
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
            opacity: 0.5,
            letterSpacing: '0.04em',
            userSelect: 'none',
          }}
        >
          {sessionLabel}
        </Box>

        {/* Status indicator */}
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: playing ? '#28c840' : 'rgba(255,255,255,0.25)',
            transition: 'background-color 300ms ease',
            flexShrink: 0,
          }}
        />
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
          {promptText}{longestCommand}
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
            <Box component="span" sx={{ opacity: 0.5 }}>
              {promptText}
            </Box>
            {commandText}
            {showCursor && (phase === 'typing-command' || phase === 'deleting-command' || phase === 'pause-before-output') && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '0.6ch',
                  ml: '1px',
                  userSelect: 'none',
                  ...(isCursorBlinking && {
                    animation: `${cursorBlink} 530ms step-end infinite`,
                  }),
                }}
              >
                ▌
              </Box>
            )}
          </Box>

          {/* Output row */}
          {(outputText || phase === 'typing-output' || phase === 'pause-after-output' || phase === 'deleting-output') && (
            <Box
              component="div"
              sx={{
                color: 'rgba(255,255,255,0.68)',
                mt: 0.25,
              }}
            >
              → {outputText}
              {showCursor && (phase === 'typing-output' || phase === 'deleting-output' || phase === 'pause-after-output') && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '0.6ch',
                    ml: '1px',
                    userSelect: 'none',
                    ...(phase === 'pause-after-output' && {
                      animation: `${cursorBlink} 530ms step-end infinite`,
                    }),
                  }}
                >
                  ▌
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
