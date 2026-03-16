import { renderHook, act } from '@testing-library/react';
import { useTerminalTypewriter } from '../../../../src/components/text/useTerminalTypewriter';
import type { TerminalLine, TerminalTypewriterPhase } from '../../../../src/components/text/useTerminalTypewriter';

const lines: TerminalLine[] = [
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
  });

  it('begins typing the command when playing transitions to true', () => {
    const { result, rerender } = renderHook(
      ({ playing }: { playing: boolean }) =>
        useTerminalTypewriter({ lines, playing }),
      { initialProps: { playing: false } }
    );

    expect(result.current.phase).toBe('idle');

    rerender({ playing: true });

    expect(result.current.phase).toBe('typing-command');
    expect(result.current.showCursor).toBe(true);
  });

  it('types the full command character by character', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: true, typingBaseMs: 10, deleteMs: 10 })
    );

    expect(result.current.phase).toBe('typing-command');

    // Advance enough times to type 'hello' (5 chars)
    for (let i = 0; i < 5; i++) {
      act(() => { jest.advanceTimersByTime(300); });
    }

    expect(result.current.commandText).toBe('hello');
    expect(result.current.phase).toBe('pause-before-output');
  });

  it('transitions through all phases in a full cycle', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({
        lines,
        playing: true,
        typingBaseMs: 10,
        deleteMs: 10,
        pauseBeforeOutputMs: 50,
        pauseAfterOutputMs: 50,
      })
    );

    const observedPhases: TerminalTypewriterPhase[] = [result.current.phase];

    // Type the command 'hello' (5 chars)
    for (let i = 0; i < 6; i++) {
      act(() => { jest.advanceTimersByTime(300); });
      if (!observedPhases.includes(result.current.phase)) {
        observedPhases.push(result.current.phase);
      }
    }

    // Pause before output
    act(() => { jest.advanceTimersByTime(100); });
    if (!observedPhases.includes(result.current.phase)) {
      observedPhases.push(result.current.phase);
    }

    // Type the output 'world' (5 chars)
    for (let i = 0; i < 6; i++) {
      act(() => { jest.advanceTimersByTime(300); });
      if (!observedPhases.includes(result.current.phase)) {
        observedPhases.push(result.current.phase);
      }
    }

    // Pause after output
    act(() => { jest.advanceTimersByTime(100); });
    if (!observedPhases.includes(result.current.phase)) {
      observedPhases.push(result.current.phase);
    }

    // Delete output (5 chars)
    for (let i = 0; i < 6; i++) {
      act(() => { jest.advanceTimersByTime(100); });
      if (!observedPhases.includes(result.current.phase)) {
        observedPhases.push(result.current.phase);
      }
    }

    // Delete command (5 chars)
    for (let i = 0; i < 6; i++) {
      act(() => { jest.advanceTimersByTime(100); });
      if (!observedPhases.includes(result.current.phase)) {
        observedPhases.push(result.current.phase);
      }
    }

    expect(observedPhases).toContain('typing-command');
    expect(observedPhases).toContain('pause-before-output');
    expect(observedPhases).toContain('typing-output');
    expect(observedPhases).toContain('pause-after-output');
    expect(observedPhases).toContain('deleting-output');
    expect(observedPhases).toContain('deleting-command');
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

  it('computes longestCommand and longestOutput', () => {
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines, playing: false })
    );

    expect(result.current.longestCommand).toBe('hello');
    expect(result.current.longestOutput).toBe('world');
  });

  it('computes longest values when they come from different lines', () => {
    const mixedLines: TerminalLine[] = [
      { command: 'short', output: 'much longer output' },
      { command: 'a much longer command', output: 'tiny' },
    ];
    const { result } = renderHook(() =>
      useTerminalTypewriter({ lines: mixedLines, playing: false })
    );

    expect(result.current.longestCommand).toBe('a much longer command');
    expect(result.current.longestOutput).toBe('much longer output');
  });
});
