import * as React from 'react';
import {
  getTypewriterDelay,
  resolveTypewriterTimingProfile,
} from './useTypewriterProgress';
import type { TypewriterTimingPreset } from './useTypewriterProgress';

export type TypewriterLoopPhase =
  | 'typing-prefix'
  | 'pause'
  | 'typing-word'
  | 'deleting-word';

type UseTypewriterLoopOptions = {
  prefix: string;
  words: string[];
  playing?: boolean;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  deleteMs?: number;
  pauseMs?: number;
};

export type UseTypewriterLoopResult = {
  displayText: string;
  showCursor: boolean;
  phase: TypewriterLoopPhase;
  longestText: string;
};

const DEFAULT_DELETE_MS = 40;
const DEFAULT_PAUSE_MS = 1200;

export const useTypewriterLoop = ({
  prefix,
  words,
  playing = true,
  timingPreset = 'default',
  typingBaseMs,
  deleteMs = DEFAULT_DELETE_MS,
  pauseMs = DEFAULT_PAUSE_MS,
}: UseTypewriterLoopOptions): UseTypewriterLoopResult => {
  const resolvedTimingProfile = React.useMemo(
    () => resolveTypewriterTimingProfile(timingPreset, typingBaseMs),
    [timingPreset, typingBaseMs]
  );

  const [phase, setPhase] = React.useState<TypewriterLoopPhase>('typing-prefix');
  const [prefixCharIndex, setPrefixCharIndex] = React.useState(0);
  const [wordListIndex, setWordListIndex] = React.useState(0);
  const [wordCharIndex, setWordCharIndex] = React.useState(0);

  const currentWord = words[wordListIndex % words.length] ?? '';

  const longestWord = React.useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ''),
    [words]
  );
  const longestText = prefix + longestWord;

  // Phase: typing-prefix
  React.useEffect(() => {
    if (!playing || phase !== 'typing-prefix') return undefined;

    if (prefixCharIndex >= prefix.length) {
      setPhase('pause');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPrefixCharIndex((prev) => Math.min(prev + 1, prefix.length));
    }, getTypewriterDelay(prefix, prefixCharIndex, resolvedTimingProfile));

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, prefixCharIndex, prefix, resolvedTimingProfile]);

  // Phase: typing-word
  React.useEffect(() => {
    if (!playing || phase !== 'typing-word') return undefined;

    if (wordCharIndex >= currentWord.length) {
      setPhase('pause');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setWordCharIndex((prev) => Math.min(prev + 1, currentWord.length));
    }, getTypewriterDelay(currentWord, wordCharIndex, resolvedTimingProfile));

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, wordCharIndex, currentWord, resolvedTimingProfile]);

  // Phase: deleting-word
  React.useEffect(() => {
    if (!playing || phase !== 'deleting-word') return undefined;

    if (wordCharIndex <= 0) {
      setWordListIndex((prev) => prev + 1);
      setPhase('pause');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setWordCharIndex((prev) => Math.max(prev - 1, 0));
    }, deleteMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, wordCharIndex, deleteMs]);

  // Phase: pause — transitions to the next action phase after pauseMs
  const prevPhaseRef = React.useRef<TypewriterLoopPhase>('typing-prefix');

  React.useEffect(() => {
    if (phase !== 'pause') {
      prevPhaseRef.current = phase;
    }
  }, [phase]);

  React.useEffect(() => {
    if (!playing || phase !== 'pause') return undefined;

    const prevPhase = prevPhaseRef.current;

    const timeoutId = window.setTimeout(() => {
      if (prevPhase === 'typing-prefix' || prevPhase === 'deleting-word') {
        setWordCharIndex(0);
        setPhase('typing-word');
      } else {
        // After typing-word completes
        setPhase('deleting-word');
      }
    }, pauseMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, pauseMs]);

  // Compute display text
  let displayText: string;

  switch (phase) {
    case 'typing-prefix':
      displayText = prefix.slice(0, prefixCharIndex);
      break;
    case 'typing-word':
    case 'deleting-word':
      displayText = prefix + currentWord.slice(0, wordCharIndex);
      break;
    case 'pause': {
      const prevPhase = prevPhaseRef.current;

      if (prevPhase === 'typing-word') {
        displayText = prefix + currentWord;
      } else if (prevPhase === 'typing-prefix') {
        displayText = prefix;
      } else {
        // After delete, wordListIndex already advanced
        displayText = prefix;
      }
      break;
    }
    default:
      displayText = prefix;
  }

  return {
    displayText,
    showCursor: playing,
    phase,
    longestText,
  };
};
