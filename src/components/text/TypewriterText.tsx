import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { mergeSx } from './textFactory';

const COMMON_PAIRS = new Set([
  'th',
  'he',
  'in',
  'er',
  'an',
  're',
  'on',
  'at',
  'en',
  'nd',
  'ti',
  'es',
  'or',
  'te',
  'of',
  'ed',
  'is',
  'it',
  'al',
  'ar',
  'st',
  'to',
  'nt',
  'ng',
  'se',
  'ha',
  'as',
  'ou',
  'io',
  'le',
  've',
  'co',
  'me',
  'de',
]);

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

const typewriterTypingBaseMsByPreset = {
  default: 54,
  headline: 4,
} as const;

export type TypewriterTimingPreset = keyof typeof typewriterTypingBaseMsByPreset;

export interface TypewriterTextProps {
  text: string;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  cursorChar?: React.ReactNode;
  reserveWidth?: boolean;
  sx?: SxProps<Theme>;
  cursorSx?: SxProps<Theme>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getWordBounds(text: string, index: number) {
  let start = index;
  let end = index;

  while (start > 0 && text[start - 1] !== ' ') start -= 1;
  while (end < text.length && text[end] !== ' ') end += 1;

  return { start, end };
}

function isUncommonPair(prev: string, next: string): boolean {
  if (!/[a-z]/i.test(prev) || !/[a-z]/i.test(next)) return true;
  return !COMMON_PAIRS.has(`${prev}${next}`.toLowerCase());
}

function getTypingDelay(text: string, nextIndex: number, baseMs: number): number {
  const nextChar = text[nextIndex] ?? '';
  const prevChar = text[nextIndex - 1] ?? '';
  const { start, end } = getWordBounds(text, nextIndex);
  const wordLength = Math.max(1, end - start);
  const positionInWord = nextIndex - start;
  const progress = wordLength <= 1 ? 1 : positionInWord / (wordLength - 1);

  let delay = baseMs;

  delay += Math.min(wordLength * 2.5, 28);

  if (positionInWord === 0) delay += 40;
  if (progress > 0.72) delay += 18;
  if (nextChar === ' ') delay += 28;
  if (/[,.!?;:]/.test(nextChar)) delay += 140;
  if (/[-/\\()[\]{}]/.test(nextChar)) delay += 50;
  if (/[A-Z0-9]/.test(nextChar)) delay += 18;
  if (prevChar && nextChar && isUncommonPair(prevChar, nextChar)) delay += 22;

  delay *= randomBetween(0.82, 1.22);

  return clamp(Math.round(delay), 28, 260);
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [charIndex, setCharIndex] = React.useState(() => (prefersReducedMotion ? text.length : 0));
  const resolvedTypingBaseMs = typingBaseMs ?? typewriterTypingBaseMsByPreset[timingPreset];

  React.useEffect(() => {
    setCharIndex(prefersReducedMotion ? text.length : 0);
  }, [prefersReducedMotion, text]);

  React.useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (charIndex >= text.length) return undefined;

    const timeoutId = window.setTimeout(() => {
      setCharIndex((currentIndex) => Math.min(currentIndex + 1, text.length));
    }, getTypingDelay(text, charIndex, resolvedTypingBaseMs));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [charIndex, prefersReducedMotion, resolvedTypingBaseMs, text]);

  if (!text) {
    return null;
  }

  const visibleText = prefersReducedMotion ? text : text.slice(0, charIndex);
  const showCursor = !prefersReducedMotion && charIndex < text.length;

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
