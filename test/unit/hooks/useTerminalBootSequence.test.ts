import { renderHook, act } from '@testing-library/react';
import { useTerminalBootSequence } from '../../../src/hooks/useTerminalBootSequence';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

let mockDuration = 1;

jest.mock('../../../src/motion/hooks', () => ({
  useMotionScale: () => ({ duration: mockDuration, stagger: 1, tilt: 1 }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Advance fake timers in an act block */
const advance = (ms: number) => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

/** Advance until phase changes or a ceiling is hit */
const advanceUntilPhase = (
  result: { current: ReturnType<typeof useTerminalBootSequence> },
  targetPhase: string,
  ceiling = 30_000
) => {
  let elapsed = 0;
  while (result.current.phase !== targetPhase && elapsed < ceiling) {
    advance(50);
    elapsed += 50;
  }
  expect(result.current.phase).toBe(targetPhase);
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useTerminalBootSequence', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDuration = 1;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ---- Idle state ----

  it('starts in idle when not active', () => {
    const { result } = renderHook(() => useTerminalBootSequence(false));

    expect(result.current.phase).toBe('idle');
    expect(result.current.complete).toBe(false);
    expect(result.current.commandText).toBe('');
    expect(result.current.outputText).toBe('');
    expect(result.current.showCursor).toBe(false);
    expect(result.current.activeSessionId).toBe('zsh');
    expect(result.current.sessions).toEqual([{ id: 'zsh', label: 'zsh' }]);
  });

  // ---- Activation ----

  it('transitions to explorer-open then server-typing after settle + explorer delay', () => {
    const { result } = renderHook(() => useTerminalBootSequence(true));

    expect(result.current.phase).toBe('idle');

    // EXPAND_SETTLE_MS = 300 → explorer-open
    advance(300);

    expect(result.current.phase).toBe('explorer-open');
    expect(result.current.explorerOpen).toBe(true);
    expect(result.current.activeSessionId).toBe('zsh');
    expect(result.current.sessions).toEqual([{ id: 'zsh', label: 'zsh' }]);

    // EXPLORER_OPEN_MS = 600 → server-typing
    advance(600);

    expect(result.current.phase).toBe('server-typing');
    expect(result.current.showCursor).toBe(true);
    expect(result.current.activeSessionId).toBe('server');
    expect(result.current.editorTab).toBe('server');
    expect(result.current.sessions).toEqual([{ id: 'server', label: 'uvicorn' }]);
  });

  // ---- Server command typing ----

  it('types the server command character by character', () => {
    const { result } = renderHook(() => useTerminalBootSequence(true));

    advance(300); // settle → explorer-open
    advance(600); // explorer-open → server-typing
    expect(result.current.phase).toBe('server-typing');

    // Advance enough for at least one character
    advance(400);
    expect(result.current.commandText.length).toBeGreaterThan(0);
    expect(result.current.commandText).toBe(
      'uvicorn server:app --reload'.slice(0, result.current.commandText.length)
    );
  });

  // ---- Full phase progression ----

  it('progresses through all phases to complete', () => {
    const { result } = renderHook(() => useTerminalBootSequence(true));

    // idle → explorer-open
    advanceUntilPhase(result, 'explorer-open');
    expect(result.current.explorerOpen).toBe(true);

    // explorer-open → server-typing
    advanceUntilPhase(result, 'server-typing');
    expect(result.current.activeSessionId).toBe('server');
    expect(result.current.editorTab).toBe('server');

    // server-typing → server-enter
    advanceUntilPhase(result, 'server-enter');
    expect(result.current.commandText).toBe('uvicorn server:app --reload');
    expect(result.current.outputText).toBe('');

    // server-enter → server-output
    advanceUntilPhase(result, 'server-output');
    expect(result.current.outputText).toContain('127.0.0.1:8000');

    // server-output → client-typing
    advanceUntilPhase(result, 'client-typing');
    expect(result.current.activeSessionId).toBe('client');
    expect(result.current.editorTab).toBe('client');
    expect(result.current.sessions).toEqual([
      { id: 'server', label: 'uvicorn' },
      { id: 'client', label: 'tsx' },
    ]);

    // client-typing → client-enter
    advanceUntilPhase(result, 'client-enter');
    expect(result.current.commandText).toBe('npx tsx src/client.ts');

    // client-enter → client-output
    advanceUntilPhase(result, 'client-output');
    expect(result.current.outputText).toContain('client: ping');
    expect(result.current.outputText).toContain('server: pong');

    // client-output → handoff
    advanceUntilPhase(result, 'handoff');
    expect(result.current.activeSessionId).toBe('zsh');
    expect(result.current.showCursor).toBe(true);
    expect(result.current.sessions).toEqual([
      { id: 'server', label: 'uvicorn' },
      { id: 'client', label: 'tsx' },
      { id: 'zsh', label: 'zsh' },
    ]);

    // handoff → complete
    advanceUntilPhase(result, 'complete');
    expect(result.current.complete).toBe(true);
    expect(result.current.showCursor).toBe(false);
    expect(result.current.sessions).toEqual([{ id: 'zsh', label: 'zsh' }]);
  });

  // ---- Reduced motion ----

  it('skips directly to complete when duration scale is 0', () => {
    mockDuration = 0;

    const { result } = renderHook(() => useTerminalBootSequence(true));

    // The effect runs synchronously in the same tick
    advance(0);

    expect(result.current.phase).toBe('complete');
    expect(result.current.complete).toBe(true);
  });

  // ---- Replay safety ----

  it('does not restart when active toggles off then on again', () => {
    const { result, rerender } = renderHook(({ active }) => useTerminalBootSequence(active), {
      initialProps: { active: true },
    });

    // Progress past idle
    advanceUntilPhase(result, 'server-typing');

    // Deactivate
    rerender({ active: false });

    // Re-activate
    rerender({ active: true });

    // An additional settle delay should NOT move phase back to server-typing from scratch.
    // The phase should remain wherever it was (server-typing or later), not restart.
    advance(500);
    const p = result.current.phase;
    expect(p).not.toBe('idle');
  });

  // ---- Sessions accumulate ----

  it('shows only server session during server phases', () => {
    const { result } = renderHook(() => useTerminalBootSequence(true));

    advanceUntilPhase(result, 'server-output');
    expect(result.current.sessions).toEqual([{ id: 'server', label: 'uvicorn' }]);
  });

  it('shows server + client sessions during client phases', () => {
    const { result } = renderHook(() => useTerminalBootSequence(true));

    advanceUntilPhase(result, 'client-typing');
    expect(result.current.sessions).toEqual([
      { id: 'server', label: 'uvicorn' },
      { id: 'client', label: 'tsx' },
    ]);
  });

  // ---- Inactive stays idle ----

  it('remains idle when active is false even after time passes', () => {
    const { result } = renderHook(() => useTerminalBootSequence(false));

    advance(5000);

    expect(result.current.phase).toBe('idle');
    expect(result.current.complete).toBe(false);
  });
});
