import * as React from 'react';
import {
  getTypewriterDelay,
  resolveTypewriterTimingProfile,
} from './useTypewriterProgress';
import type { TypewriterTimingPreset } from './useTypewriterProgress';

export type TerminalTypewriterPhase =
  | 'idle'
  | 'typing-command'
  | 'pause-before-output'
  | 'showing-output'
  | 'pause-after-output';

export interface TerminalLine {
  command: string;
  output: string;
}

interface UseTerminalTypewriterOptions {
  lines: TerminalLine[];
  playing?: boolean;
  prompt?: string;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  pauseBeforeOutputMs?: number;
  pauseAfterOutputMs?: number;
}

export interface UseTerminalTypewriterResult {
  promptText: string;
  /** The partially-typed command on the active line */
  commandText: string;
  /** The full output for the active line (shown instantly after "enter") */
  outputText: string;
  showCursor: boolean;
  phase: TerminalTypewriterPhase;
  /** Completed command+output pairs that stay visible above the active line */
  history: TerminalLine[];
}

const DEFAULT_PAUSE_BEFORE_OUTPUT_MS = 400;
const DEFAULT_PAUSE_AFTER_OUTPUT_MS = 2400;

export const useTerminalTypewriter = ({
  lines,
  playing = true,
  prompt = '$ ',
  timingPreset = 'default',
  typingBaseMs,
  pauseBeforeOutputMs = DEFAULT_PAUSE_BEFORE_OUTPUT_MS,
  pauseAfterOutputMs = DEFAULT_PAUSE_AFTER_OUTPUT_MS,
}: UseTerminalTypewriterOptions): UseTerminalTypewriterResult => {
  const resolvedTimingProfile = React.useMemo(
    () => resolveTypewriterTimingProfile(timingPreset, typingBaseMs),
    [timingPreset, typingBaseMs]
  );

  const [phase, setPhase] = React.useState<TerminalTypewriterPhase>('idle');
  const [lineIndex, setLineIndex] = React.useState(0);
  const [commandCharIndex, setCommandCharIndex] = React.useState(0);
  const [history, setHistory] = React.useState<TerminalLine[]>([]);

  const currentLine = React.useMemo(
    () => lines[lineIndex % lines.length] ?? { command: '', output: '' },
    [lines, lineIndex]
  );

  // Start typing when playing transitions to true
  React.useEffect(() => {
    if (playing && phase === 'idle') {
      setPhase('typing-command');
    }
  }, [playing, phase]);

  // Phase: typing-command — type the command character by character
  React.useEffect(() => {
    if (!playing || phase !== 'typing-command') return undefined;

    if (commandCharIndex >= currentLine.command.length) {
      setPhase('pause-before-output');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCommandCharIndex((prev) => Math.min(prev + 1, currentLine.command.length));
    }, getTypewriterDelay(currentLine.command, commandCharIndex, resolvedTimingProfile));

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, commandCharIndex, currentLine.command, resolvedTimingProfile]);

  // Phase: pause-before-output — brief pause to simulate pressing enter
  React.useEffect(() => {
    if (!playing || phase !== 'pause-before-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      setPhase('showing-output');
    }, pauseBeforeOutputMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, pauseBeforeOutputMs]);

  // Phase: showing-output — output appears instantly, then pause
  React.useEffect(() => {
    if (!playing || phase !== 'showing-output') return undefined;

    setPhase('pause-after-output');
    return undefined;
  }, [playing, phase]);

  // Phase: pause-after-output — let the user read the output, then advance
  React.useEffect(() => {
    if (!playing || phase !== 'pause-after-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      const nextIndex = lineIndex + 1;
      const isWrapping = nextIndex % lines.length === 0;

      // Clear history when the cycle wraps to keep the animation tidy
      setHistory((prev) => (isWrapping ? [] : [...prev, currentLine]));
      setLineIndex(nextIndex);
      setCommandCharIndex(0);
      setPhase('typing-command');
    }, pauseAfterOutputMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, pauseAfterOutputMs, currentLine, lineIndex, lines.length]);

  // Compute display text
  const commandText = currentLine.command.slice(0, commandCharIndex);
  // Show the full output only during the showing-output and pause-after-output phases
  const outputText =
    phase === 'showing-output' || phase === 'pause-after-output' ? currentLine.output : '';

  return {
    promptText: prompt,
    commandText,
    outputText,
    showCursor: playing && phase !== 'idle',
    phase,
    history,
  };
};
