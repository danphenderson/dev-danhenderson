import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from './textFactory';
import { useTypewriterProgress } from './useTypewriterProgress';
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

export interface TypewriterTextProps {
  text: string;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  cursorChar?: React.ReactNode;
  reserveWidth?: boolean;
  sx?: SxProps<Theme>;
  cursorSx?: SxProps<Theme>;
}

export const TypewriterText = ({
  text,
  timingPreset = 'default',
  typingBaseMs,
  cursorChar = '|',
  reserveWidth = true,
  sx,
  cursorSx,
}: TypewriterTextProps) => {
  const { visibleText, showCursor } = useTypewriterProgress({
    text,
    timingPreset,
    typingBaseMs,
  });

  if (!text) {
    return null;
  }

  return (
    <Box
      component="span"
      aria-label={text}
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
      {reserveWidth && (
        <Box
          component="span"
          aria-hidden
          data-text={text}
          sx={mergeSx(sharedTextSx, {
            visibility: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
            '&::after': {
              content: 'attr(data-text)',
            },
          })}
        />
      )}

      <Box
        component="span"
        aria-hidden
        sx={mergeSx(sharedTextSx, {
          display: 'inline-flex',
          alignItems: 'baseline',
        })}
      >
        {visibleText}

        {showCursor && (
          <Box
            component="span"
            sx={mergeSx(
              {
                display: 'inline-block',
                width: '0.65ch',
                ml: '1px',
                userSelect: 'none',
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

export default TypewriterText;
