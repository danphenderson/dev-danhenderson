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
  | 'typing-output'
  | 'pause-after-output'
  | 'deleting-output'
  | 'deleting-command';

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
  deleteMs?: number;
  pauseBeforeOutputMs?: number;
  pauseAfterOutputMs?: number;
}

export interface UseTerminalTypewriterResult {
  promptText: string;
  commandText: string;
  outputText: string;
  showCursor: boolean;
  phase: TerminalTypewriterPhase;
  longestCommand: string;
  longestOutput: string;
}

const DEFAULT_DELETE_MS = 30;
const DEFAULT_PAUSE_BEFORE_OUTPUT_MS = 400;
const DEFAULT_PAUSE_AFTER_OUTPUT_MS = 2400;

export const useTerminalTypewriter = ({
  lines,
  playing = true,
  prompt = '$ ',
  timingPreset = 'default',
  typingBaseMs,
  deleteMs = DEFAULT_DELETE_MS,
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
  const [outputCharIndex, setOutputCharIndex] = React.useState(0);

  const currentLine = lines[lineIndex % lines.length] ?? { command: '', output: '' };

  const longestCommand = React.useMemo(
    () => lines.reduce((a, b) => (a.length >= b.command.length ? a : b.command), ''),
    [lines]
  );

  const longestOutput = React.useMemo(
    () => lines.reduce((a, b) => (a.length >= b.output.length ? a : b.output), ''),
    [lines]
  );

  // Start typing when playing transitions to true
  React.useEffect(() => {
    if (playing && phase === 'idle') {
      setPhase('typing-command');
    }
  }, [playing, phase]);

  // Phase: typing-command
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

  // Phase: pause-before-output
  React.useEffect(() => {
    if (!playing || phase !== 'pause-before-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      setOutputCharIndex(0);
      setPhase('typing-output');
    }, pauseBeforeOutputMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, pauseBeforeOutputMs]);

  // Phase: typing-output
  React.useEffect(() => {
    if (!playing || phase !== 'typing-output') return undefined;

    if (outputCharIndex >= currentLine.output.length) {
      setPhase('pause-after-output');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setOutputCharIndex((prev) => Math.min(prev + 1, currentLine.output.length));
    }, getTypewriterDelay(currentLine.output, outputCharIndex, resolvedTimingProfile));

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, outputCharIndex, currentLine.output, resolvedTimingProfile]);

  // Phase: pause-after-output
  React.useEffect(() => {
    if (!playing || phase !== 'pause-after-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      setPhase('deleting-output');
    }, pauseAfterOutputMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, pauseAfterOutputMs]);

  // Phase: deleting-output
  React.useEffect(() => {
    if (!playing || phase !== 'deleting-output') return undefined;

    if (outputCharIndex <= 0) {
      setPhase('deleting-command');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setOutputCharIndex((prev) => Math.max(prev - 1, 0));
    }, deleteMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, outputCharIndex, deleteMs]);

  // Phase: deleting-command
  React.useEffect(() => {
    if (!playing || phase !== 'deleting-command') return undefined;

    if (commandCharIndex <= 0) {
      setLineIndex((prev) => prev + 1);
      setPhase('typing-command');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCommandCharIndex((prev) => Math.max(prev - 1, 0));
    }, deleteMs);

    return () => window.clearTimeout(timeoutId);
  }, [playing, phase, commandCharIndex, deleteMs]);

  // Compute display text
  const commandText = currentLine.command.slice(0, commandCharIndex);
  const outputText = currentLine.output.slice(0, outputCharIndex);

  return {
    promptText: prompt,
    commandText,
    outputText,
    showCursor: playing && phase !== 'idle',
    phase,
    longestCommand,
    longestOutput,
  };
};
