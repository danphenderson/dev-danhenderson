import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const DEFAULT_INTERVAL_MS = 45;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

type TypewriterTextProps = {
  text: string;
  playing: boolean;
  intervalMs?: number;
  onComplete?: () => void;
};

export const TypewriterText = ({
  text,
  playing,
  intervalMs = DEFAULT_INTERVAL_MS,
  onComplete,
}: TypewriterTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [charIndex, setCharIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!playing) return undefined;
    if (prefersReducedMotion) {
      setCharIndex(text.length);
      onCompleteRef.current?.();
      return undefined;
    }
    if (charIndex >= text.length) {
      onCompleteRef.current?.();
      return undefined;
    }
    const id = window.setTimeout(() => setCharIndex((i) => i + 1), intervalMs);
    return () => window.clearTimeout(id);
  }, [playing, charIndex, text.length, intervalMs, prefersReducedMotion]);

  if (!playing && charIndex === 0) return null;

  const done = charIndex >= text.length;
  const visibleText = prefersReducedMotion || done ? text : text.slice(0, charIndex);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      {!done && !prefersReducedMotion && (
        <Box
          component="span"
          aria-hidden="true"
          sx={{ display: 'inline', animation: `${blink} 0.7s steps(1) infinite` }}
        >
          |
        </Box>
      )}
    </span>
  );
};
