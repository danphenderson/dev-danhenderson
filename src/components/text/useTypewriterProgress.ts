import * as React from 'react';
import { useMotionScale } from '../../motion';

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

export const typewriterTimingProfiles = {
  default: {
    baseMs: 54,
    minDelayMs: 28,
    maxDelayMs: 260,
    delayScale: 1,
  },
  headline: {
    baseMs: 4,
    minDelayMs: 28,
    maxDelayMs: 260,
    delayScale: 1,
  },
  body: {
    baseMs: 2,
    minDelayMs: 8,
    maxDelayMs: 110,
    delayScale: 0.24,
  },
  cvBio: {
    baseMs: 0,
    minDelayMs: 6,
    maxDelayMs: 72,
    delayScale: 0.16,
  },
} as const;

export type TypewriterTimingPreset = keyof typeof typewriterTimingProfiles;

type TypewriterTimingProfile = {
  baseMs: number;
  minDelayMs: number;
  maxDelayMs: number;
  delayScale: number;
};

type UseTypewriterProgressOptions = {
  text: string;
  playing?: boolean;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
};

export type UseTypewriterProgressResult = {
  charIndex: number;
  visibleText: string;
  isComplete: boolean;
  showCursor: boolean;
  resolvedTimingProfile: TypewriterTimingProfile;
};

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

export const resolveTypewriterTimingProfile = (
  timingPreset: TypewriterTimingPreset = 'default',
  typingBaseMs?: number
): TypewriterTimingProfile => {
  const presetProfile = typewriterTimingProfiles[timingPreset];

  return {
    ...presetProfile,
    baseMs: typingBaseMs ?? presetProfile.baseMs,
  };
};

export const getTypewriterDelay = (
  text: string,
  nextIndex: number,
  timingProfile: TypewriterTimingProfile
): number => {
  const nextChar = text[nextIndex] ?? '';
  const prevChar = text[nextIndex - 1] ?? '';
  const { start, end } = getWordBounds(text, nextIndex);
  const wordLength = Math.max(1, end - start);
  const positionInWord = nextIndex - start;
  const progress = wordLength <= 1 ? 1 : positionInWord / (wordLength - 1);

  let delay = timingProfile.baseMs;

  delay += Math.min(wordLength * 2.5, 28);

  if (positionInWord === 0) delay += 40;
  if (progress > 0.72) delay += 18;
  if (nextChar === ' ') delay += 28;
  if (/[,.!?;:]/.test(nextChar)) delay += 140;
  if (/[-/\\()[\]{}]/.test(nextChar)) delay += 50;
  if (/[A-Z0-9]/.test(nextChar)) delay += 18;
  if (prevChar && nextChar && isUncommonPair(prevChar, nextChar)) delay += 22;

  delay *= randomBetween(0.82, 1.22);
  delay *= timingProfile.delayScale;

  return clamp(Math.round(delay), timingProfile.minDelayMs, timingProfile.maxDelayMs);
};

export const useTypewriterProgress = ({
  text,
  playing = true,
  timingPreset = 'default',
  typingBaseMs,
}: UseTypewriterProgressOptions): UseTypewriterProgressResult => {
  const { duration: durationScale } = useMotionScale();
  const resolvedTimingProfile = React.useMemo(
    () => resolveTypewriterTimingProfile(timingPreset, typingBaseMs),
    [timingPreset, typingBaseMs]
  );
  const [charIndex, setCharIndex] = React.useState(0);
  const isInstantReveal = playing && durationScale === 0;
  const renderedCharIndex = isInstantReveal ? text.length : charIndex;

  React.useEffect(() => {
    setCharIndex(0);
  }, [text]);

  React.useEffect(() => {
    if (!isInstantReveal || charIndex === text.length) {
      return;
    }

    setCharIndex(text.length);
  }, [charIndex, isInstantReveal, text.length]);

  React.useEffect(() => {
    if (!playing) return undefined;
    if (durationScale === 0) return undefined;
    if (charIndex >= text.length) return undefined;

    const timeoutId = window.setTimeout(
      () => {
        setCharIndex((currentIndex) => Math.min(currentIndex + 1, text.length));
      },
      Math.max(
        1,
        Math.round(getTypewriterDelay(text, charIndex, resolvedTimingProfile) * durationScale)
      )
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [charIndex, durationScale, playing, resolvedTimingProfile, text]);

  return {
    charIndex: renderedCharIndex,
    visibleText: text.slice(0, renderedCharIndex),
    isComplete: renderedCharIndex >= text.length,
    showCursor: playing && renderedCharIndex < text.length,
    resolvedTimingProfile,
  };
};
