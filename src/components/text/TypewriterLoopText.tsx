import * as React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from './textFactory';
import { useTypewriterLoop } from './useTypewriterLoop';
import type { TypewriterTimingPreset } from './useTypewriterProgress';

const sharedTextSx: SxProps<Theme> = {
  gridArea: '1 / 1',
  whiteSpace: 'pre-wrap',
  lineHeight: 'inherit',
  font: 'inherit',
  letterSpacing: 'inherit',
  color: 'inherit',
  textTransform: 'inherit',
  minWidth: 0,
};

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

export interface TypewriterLoopTextProps {
  prefix: string;
  words: string[];
  playing?: boolean;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  deleteMs?: number;
  pauseMs?: number;
  cursorChar?: React.ReactNode;
  sx?: SxProps<Theme>;
  cursorSx?: SxProps<Theme>;
}

export const TypewriterLoopText = ({
  prefix,
  words,
  playing,
  timingPreset = 'default',
  typingBaseMs,
  deleteMs,
  pauseMs,
  cursorChar = '|',
  sx,
  cursorSx,
}: TypewriterLoopTextProps) => {
  const { displayText, showCursor, phase, longestText } = useTypewriterLoop({
    prefix,
    words,
    playing,
    timingPreset,
    typingBaseMs,
    deleteMs,
    pauseMs,
  });

  const isPaused = phase === 'pause';

  const fullAccessibleText = `${prefix}${words.join(', ')}`;

  return (
    <Box
      component="span"
      aria-label={fullAccessibleText}
      sx={mergeSx(
        {
          position: 'relative',
          display: 'inline-grid',
          alignItems: 'baseline',
          verticalAlign: 'baseline',
        },
        sx
      )}
    >
      {/* Width reserve layer – prevents layout shift */}
      <Box
        component="span"
        aria-hidden
        data-text={longestText}
        sx={mergeSx(sharedTextSx, {
          visibility: 'hidden',
          pointerEvents: 'none',
          userSelect: 'none',
          '&::after': {
            content: 'attr(data-text)',
          },
        })}
      />

      {/* Animated visible layer */}
      <Box
        component="span"
        aria-hidden
        sx={mergeSx(sharedTextSx, {
          display: 'inline-flex',
          alignItems: 'baseline',
        })}
      >
        {displayText}

        {showCursor && (
          <Box
            component="span"
            sx={mergeSx(
              {
                display: 'inline-block',
                width: '0.65ch',
                ml: '1px',
                userSelect: 'none',
                ...(isPaused && {
                  animation: `${cursorBlink} 530ms step-end infinite`,
                }),
              },
              cursorSx
            )}
          >
            {cursorChar}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TypewriterLoopText;
