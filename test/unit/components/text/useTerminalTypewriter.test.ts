import { renderHook, act } from '@testing-library/react';
import { useTerminalTypewriter } from '../../../../src/components/text/useTerminalTypewriter';

const lines = [
  { command: 'hello', output: 'world' },
  { command: 'foo', output: 'bar' },
];

describe('useTerminalTypewriter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts in idle phase and does not type when not playing', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: false })
    );

    expect(result.current.phase).toBe('idle');
    expect(result.current.commandText).toBe('');
    expect(result.current.outputText).toBe('');
    expect(result.current.showCursor).toBe(false);
    expect(result.current.history).toEqual([]);
  });

  it('begins typing the command when playing transitions to true', () => {
    const { result, rerender } = renderHook(
      ({ playing }) =>
        useTerminalTypewriter({ lines, playing }),
      { initialProps: { playing: false } }
    );

    expect(result.current.phase).toBe('idle');

    rerender({ playing: true });

    expect(result.current.phase).toBe('typing-command');
    expect(result.current.showCursor).toBe(true);
  });

  it('types the full command character by character then pauses', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: true, typingBaseMs: 10, pauseBeforeOutputMs: 5000 })
    );

    expect(result.current.phase).toBe('typing-command');

    // Type 'hello' one char at a time (use large intervals to avoid firing pause timer)
    for (let i = 0; i < 5; i++) {
      act(() => { jest.advanceTimersByTime(300); });
    }

    expect(result.current.commandText).toBe('hello');
    expect(result.current.phase).toBe('pause-before-output');
  });

  it('shows output instantly after the enter pause and does not type or delete it', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({
        lines,
        playing: true,
        typingBaseMs: 10,
        pauseBeforeOutputMs: 500,
        pauseAfterOutputMs: 5000,
      })
    );

    // Type the full command
    for (let i = 0; i < 5; i++) {
      act(() => { jest.advanceTimersByTime(300); });
    }
    expect(result.current.phase).toBe('pause-before-output');
    expect(result.current.outputText).toBe('');

    // Fire the enter-pause timer — output appears instantly
    act(() => { jest.advanceTimersByTime(600); });

    expect(result.current.phase).toBe('pause-after-output');
    expect(result.current.outputText).toBe('world');
    expect(result.current.commandText).toBe('hello');
  });

  it('accumulates completed lines in history and starts typing the next command', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({
        lines,
        playing: true,
        typingBaseMs: 10,
        pauseBeforeOutputMs: 500,
        pauseAfterOutputMs: 1000,
      })
    );

    expect(result.current.history).toEqual([]);

    // Type 'hello'
    for (let i = 0; i < 5; i++) {
      act(() => { jest.advanceTimersByTime(300); });
    }
    expect(result.current.phase).toBe('pause-before-output');

    // Fire enter-pause timer
    act(() => { jest.advanceTimersByTime(600); });
    expect(result.current.phase).toBe('pause-after-output');
    expect(result.current.outputText).toBe('world');

    // Fire the read-pause timer — history grows and next command starts
    act(() => { jest.advanceTimersByTime(1100); });

    expect(result.current.history).toEqual([{ command: 'hello', output: 'world' }]);
    expect(result.current.phase).toBe('typing-command');
    expect(result.current.commandText).toBe('');
    expect(result.current.outputText).toBe('');
  });

  it('does not include typing-output, deleting-output, or deleting-command phases', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({
        lines,
        playing: true,
        typingBaseMs: 10,
        pauseBeforeOutputMs: 100,
        pauseAfterOutputMs: 100,
      })
    );

    const observedPhases = new Set();
    observedPhases.add(result.current.phase);

    // Run through enough time to complete the first full cycle
    for (let i = 0; i < 20; i++) {
      act(() => { jest.advanceTimersByTime(300); });
      observedPhases.add(result.current.phase);
    }

    expect(observedPhases).toContain('typing-command');
    expect(observedPhases).toContain('pause-before-output');
    expect(observedPhases).toContain('pause-after-output');
    expect(observedPhases).not.toContain('typing-output');
    expect(observedPhases).not.toContain('deleting-output');
    expect(observedPhases).not.toContain('deleting-command');
  });

  it('clears history when the cycle wraps around to the first line', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({
        lines,
        playing: true,
        typingBaseMs: 10,
        pauseBeforeOutputMs: 100,
        pauseAfterOutputMs: 100,
      })
    );

    // Advance through enough time to complete both lines and wrap
    for (let i = 0; i < 60; i++) {
      act(() => { jest.advanceTimersByTime(300); });
    }

    // After wrapping, history should be empty since the cycle restarted
    expect(result.current.history).toEqual([]);
  });

  it('provides the default prompt text', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: true })
    );

    expect(result.current.promptText).toBe('$ ');
  });

  it('allows overriding the prompt text', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: true, prompt: '> ' })
    );

    expect(result.current.promptText).toBe('> ');
  });
});
