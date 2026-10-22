import * as React from 'react';
import { useMotionScale } from '../../motion';
import { getTypewriterDelay, resolveTypewriterTimingProfile } from './useTypewriterProgress';
import type { TypewriterTimingPreset } from './useTypewriterProgress';
import type { TerminalLine } from '../../types/ui';

export type { TerminalLine };

export type TerminalTypewriterPhase =
  | 'idle'
  | 'typing-command'
  | 'pause-before-output'
  | 'showing-output'
  | 'pause-after-output'
  | 'clearing-screen';

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
const CLEAR_SCREEN_PAUSE_MS = 500;

export const useTerminalTypewriter = ({
  lines,
  playing = true,
  prompt = '$ ',
  timingPreset = 'default',
  typingBaseMs,
  pauseBeforeOutputMs = DEFAULT_PAUSE_BEFORE_OUTPUT_MS,
  pauseAfterOutputMs = DEFAULT_PAUSE_AFTER_OUTPUT_MS,
}: UseTerminalTypewriterOptions): UseTerminalTypewriterResult => {
  const { duration: motionScale } = useMotionScale();
  const animatedPlaying = playing && motionScale > 0 && lines.length > 0;
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
    if (animatedPlaying && phase === 'idle') {
      setPhase('typing-command');
    }
  }, [animatedPlaying, phase]);

  // Phase: typing-command — type the command character by character
  React.useEffect(() => {
    if (!animatedPlaying || phase !== 'typing-command') return undefined;

    if (commandCharIndex >= currentLine.command.length) {
      setPhase('pause-before-output');
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => {
        setCommandCharIndex((prev) => Math.min(prev + 1, currentLine.command.length));
      },
      getTypewriterDelay(currentLine.command, commandCharIndex, resolvedTimingProfile) * motionScale
    );

    return () => window.clearTimeout(timeoutId);
  }, [
    animatedPlaying,
    phase,
    commandCharIndex,
    currentLine.command,
    resolvedTimingProfile,
    motionScale,
  ]);

  // Phase: pause-before-output — brief pause to simulate pressing enter
  React.useEffect(() => {
    if (!animatedPlaying || phase !== 'pause-before-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      setPhase('showing-output');
    }, pauseBeforeOutputMs * motionScale);

    return () => window.clearTimeout(timeoutId);
  }, [animatedPlaying, phase, pauseBeforeOutputMs, motionScale]);

  // Phase: showing-output — output appears instantly, then pause
  React.useEffect(() => {
    if (!animatedPlaying || phase !== 'showing-output') return undefined;

    setPhase('pause-after-output');
    return undefined;
  }, [animatedPlaying, phase]);

  // Phase: pause-after-output — let the user read the output, then simulate Control+L
  React.useEffect(() => {
    if (!animatedPlaying || phase !== 'pause-after-output') return undefined;

    const timeoutId = window.setTimeout(() => {
      // Control+L: clear the screen immediately, show empty prompt briefly
      setHistory([]);
      setCommandCharIndex(0);
      setPhase('clearing-screen');
    }, pauseAfterOutputMs * motionScale);

    return () => window.clearTimeout(timeoutId);
  }, [animatedPlaying, phase, pauseAfterOutputMs, motionScale]);

  // Phase: clearing-screen — brief pause showing empty prompt after Control+L, then advance
  React.useEffect(() => {
    if (!animatedPlaying || phase !== 'clearing-screen') return undefined;

    const timeoutId = window.setTimeout(() => {
      setLineIndex((prev) => prev + 1);
      setPhase('typing-command');
    }, CLEAR_SCREEN_PAUSE_MS * motionScale);

    return () => window.clearTimeout(timeoutId);
  }, [animatedPlaying, phase, motionScale]);

  // A stable transcript is immediately available without scheduling a loop.
  if (motionScale === 0) {
    const lastLine = lines[lines.length - 1];
    return {
      promptText: prompt,
      commandText: lastLine?.command ?? '',
      outputText: lastLine?.output ?? '',
      showCursor: false,
      phase: 'pause-after-output',
      history: lines.slice(0, -1),
    };
  }

  // Compute display text
  const commandText = currentLine.command.slice(0, commandCharIndex);
  // Show the full output only during the showing-output and pause-after-output phases;
  // output is hidden in clearing-screen (screen has been cleared)
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
