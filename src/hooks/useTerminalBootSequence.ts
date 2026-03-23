import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getTypewriterDelay,
  resolveTypewriterTimingProfile,
} from '../components/text/useTypewriterProgress';
import { useMotionScale } from '../motion/hooks';
import type { TerminalSessionTab, VscodeEditorTab } from '../types/ui';

// ---------------------------------------------------------------------------
// Phase model
// ---------------------------------------------------------------------------

export type BootPhase =
  | 'idle'
  | 'explorer-open'
  | 'server-typing'
  | 'server-enter'
  | 'server-output'
  | 'client-typing'
  | 'client-enter'
  | 'client-output'
  | 'handoff'
  | 'complete';

// ---------------------------------------------------------------------------
// Boot content — matches the editor source narrative
// ---------------------------------------------------------------------------

const SERVER_COMMAND = 'uvicorn server:app --reload';
const SERVER_OUTPUT = [
  'INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)',
  'INFO:     Started reloader process [28720]',
  'INFO:     Started server process [28722]',
  'INFO:     Waiting for application startup.',
  'INFO:     Application startup complete.',
].join('\n');

const CLIENT_COMMAND = 'npx tsx src/client.ts';
const CLIENT_OUTPUT = 'client: ping\nserver: pong';

// ---------------------------------------------------------------------------
// Session definitions
// ---------------------------------------------------------------------------

const SERVER_SESSION: TerminalSessionTab = { id: 'server', label: 'uvicorn' };
const CLIENT_SESSION: TerminalSessionTab = { id: 'client', label: 'tsx' };
const ZSH_SESSION: TerminalSessionTab = { id: 'zsh', label: 'zsh' };

// ---------------------------------------------------------------------------
// Timing (milliseconds at motion‑scale 1×)
// ---------------------------------------------------------------------------

const EXPAND_SETTLE_MS = 300;
const EXPLORER_OPEN_MS = 600;
const PAUSE_BEFORE_OUTPUT_MS = 400;
const SERVER_OBSERVE_MS = 900;
const CLIENT_OBSERVE_MS = 1000;
const HANDOFF_PAUSE_MS = 250;

type BootTransitionConfig =
  | {
      kind: 'delay';
      durationMs: number;
      nextPhase: BootPhase;
      resetCharIndex?: boolean;
    }
  | {
      kind: 'typing';
      command: string;
      nextPhase: BootPhase;
    };

const BOOT_PHASE_TRANSITIONS: Record<
  Exclude<BootPhase, 'idle' | 'complete'>,
  BootTransitionConfig
> = {
  'explorer-open': {
    kind: 'delay',
    durationMs: EXPLORER_OPEN_MS,
    nextPhase: 'server-typing',
  },
  'server-typing': {
    kind: 'typing',
    command: SERVER_COMMAND,
    nextPhase: 'server-enter',
  },
  'server-enter': {
    kind: 'delay',
    durationMs: PAUSE_BEFORE_OUTPUT_MS,
    nextPhase: 'server-output',
  },
  'server-output': {
    kind: 'delay',
    durationMs: SERVER_OBSERVE_MS,
    nextPhase: 'client-typing',
    resetCharIndex: true,
  },
  'client-typing': {
    kind: 'typing',
    command: CLIENT_COMMAND,
    nextPhase: 'client-enter',
  },
  'client-enter': {
    kind: 'delay',
    durationMs: PAUSE_BEFORE_OUTPUT_MS,
    nextPhase: 'client-output',
  },
  'client-output': {
    kind: 'delay',
    durationMs: CLIENT_OBSERVE_MS,
    nextPhase: 'handoff',
  },
  handoff: {
    kind: 'delay',
    durationMs: HANDOFF_PAUSE_MS,
    nextPhase: 'complete',
  },
};

// ---------------------------------------------------------------------------
// Result interface
// ---------------------------------------------------------------------------

export interface TerminalBootResult {
  phase: BootPhase;
  sessions: TerminalSessionTab[];
  activeSessionId: string;
  commandText: string;
  outputText: string;
  showCursor: boolean;
  complete: boolean;
  editorTab: VscodeEditorTab;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useTerminalBootSequence = (active: boolean): TerminalBootResult => {
  const { duration: durationScale } = useMotionScale();
  const [phase, setPhase] = useState<BootPhase>('idle');
  const [charIndex, setCharIndex] = useState(0);
  const hasStartedRef = useRef(false);

  const timingProfile = useMemo(() => resolveTypewriterTimingProfile('headline'), []);

  // Scale helper — floor of 1 ms so animations never stall at non-zero scales
  const scale = (ms: number) => Math.max(1, Math.round(ms * durationScale));

  // ---- Start sequence ----
  useEffect(() => {
    if (!active || hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (durationScale === 0) {
      setPhase('complete');
      return;
    }

    const id = window.setTimeout(() => setPhase('explorer-open'), scale(EXPAND_SETTLE_MS));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, durationScale]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') {
      return;
    }

    const transition = BOOT_PHASE_TRANSITIONS[phase];

    if (transition.kind === 'typing') {
      if (charIndex >= transition.command.length) {
        setPhase(transition.nextPhase);
        return;
      }

      const delay = getTypewriterDelay(transition.command, charIndex, timingProfile);
      const id = window.setTimeout(
        () => setCharIndex((index) => Math.min(index + 1, transition.command.length)),
        scale(delay)
      );
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      if (transition.resetCharIndex) {
        setCharIndex(0);
      }

      setPhase(transition.nextPhase);
    }, scale(transition.durationMs));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, phase, timingProfile, durationScale]);

  // ---------------------------------------------------------------------------
  // Derive display state
  // ---------------------------------------------------------------------------

  const isServer =
    phase === 'server-typing' || phase === 'server-enter' || phase === 'server-output';
  const isClient =
    phase === 'client-typing' || phase === 'client-enter' || phase === 'client-output';

  let activeSessionId: string;
  let commandText = '';
  let outputText = '';
  let showCursor = false;
  let editorTab: VscodeEditorTab = 'server';

  if (isServer) {
    activeSessionId = 'server';
    commandText = SERVER_COMMAND.slice(0, charIndex);
    outputText = phase === 'server-output' ? SERVER_OUTPUT : '';
    showCursor = true;
    editorTab = 'server';
  } else if (isClient) {
    activeSessionId = 'client';
    commandText = CLIENT_COMMAND.slice(0, charIndex);
    outputText = phase === 'client-output' ? CLIENT_OUTPUT : '';
    showCursor = true;
    editorTab = 'client';
  } else if (phase === 'handoff') {
    activeSessionId = 'zsh';
    showCursor = true;
  } else {
    activeSessionId = 'zsh';
  }

  // Sessions accumulate as they appear during boot
  let sessions: TerminalSessionTab[];

  if (phase === 'idle' || phase === 'complete') {
    sessions = [ZSH_SESSION];
  } else if (phase === 'explorer-open') {
    sessions = [ZSH_SESSION];
  } else if (isServer) {
    sessions = [SERVER_SESSION];
  } else if (isClient) {
    sessions = [SERVER_SESSION, CLIENT_SESSION];
  } else {
    // handoff
    sessions = [SERVER_SESSION, CLIENT_SESSION, ZSH_SESSION];
  }

  return {
    phase,
    sessions,
    activeSessionId,
    commandText,
    outputText,
    showCursor,
    complete: phase === 'complete',
    editorTab,
  };
};
