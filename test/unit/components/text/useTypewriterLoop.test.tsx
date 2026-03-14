import { act, render, screen } from '@testing-library/react';
import { useTypewriterLoop } from '../../../../src/components/text/useTypewriterLoop';
import type { TypewriterLoopPhase } from '../../../../src/components/text/useTypewriterLoop';

type HookProbeProps = Parameters<typeof useTypewriterLoop>[0];

const HookProbe = (props: HookProbeProps) => {
  const { displayText, showCursor, phase, longestText } = useTypewriterLoop(props);

  return (
    <output
      data-testid="loop-progress"
      data-display-text={displayText}
      data-show-cursor={String(showCursor)}
      data-phase={phase}
      data-longest-text={longestText}
    >
      {displayText}
      {showCursor ? '|' : ''}
    </output>
  );
};

const getPhase = (): TypewriterLoopPhase =>
  screen.getByTestId('loop-progress').getAttribute('data-phase') as TypewriterLoopPhase;

const getDisplayText = (): string =>
  screen.getByTestId('loop-progress').getAttribute('data-display-text') ?? '';

describe('useTypewriterLoop', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('types the prefix character by character then enters pause phase', () => {
    render(
      <HookProbe prefix="Hi " words={['a!']} typingBaseMs={1} pauseMs={500} />
    );

    expect(getPhase()).toBe('typing-prefix');
    expect(getDisplayText()).toBe('');

    // Advance past max per-character delay (260ms) for each char: H, i, space
    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('H');

    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('Hi');

    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('Hi ');
    expect(getPhase()).toBe('pause');
  });

  it('types a word after the prefix pause completes', () => {
    render(
      <HookProbe prefix="A " words={['go!']} typingBaseMs={1} pauseMs={100} />
    );

    // Type full prefix (advance well past any per-character delay)
    act(() => { jest.advanceTimersByTime(260); });
    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('A ');
    expect(getPhase()).toBe('pause');

    // Wait for pause to complete
    act(() => { jest.advanceTimersByTime(100); });
    expect(getPhase()).toBe('typing-word');

    // Type "g", "o", "!"
    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('A g');

    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('A go');

    act(() => { jest.advanceTimersByTime(260); });
    expect(getDisplayText()).toBe('A go!');

    // After word completes → pause
    expect(getPhase()).toBe('pause');
  });

  it('deletes the word after the post-type pause', () => {
    render(
      <HookProbe prefix="" words={['ab']} typingBaseMs={1} pauseMs={100} deleteMs={50} />
    );

    // Empty prefix immediately enters pause
    expect(getPhase()).toBe('pause');

    // Pause → typing-word
    act(() => { jest.advanceTimersByTime(100); });
    expect(getPhase()).toBe('typing-word');

    // Type "a", "b"
    act(() => { jest.advanceTimersByTime(200); });
    act(() => { jest.advanceTimersByTime(200); });
    expect(getDisplayText()).toBe('ab');
    expect(getPhase()).toBe('pause');

    // Pause → deleting-word
    act(() => { jest.advanceTimersByTime(100); });
    expect(getPhase()).toBe('deleting-word');

    // Delete "b"
    act(() => { jest.advanceTimersByTime(50); });
    expect(getDisplayText()).toBe('a');

    // Delete "a"
    act(() => { jest.advanceTimersByTime(50); });
    expect(getDisplayText()).toBe('');
    expect(getPhase()).toBe('pause');
  });

  it('cycles to the next word after deleting the current one', () => {
    render(
      <HookProbe prefix="" words={['A', 'B']} typingBaseMs={1} pauseMs={50} deleteMs={30} />
    );

    // Pause → type first word "A"
    act(() => { jest.advanceTimersByTime(50); });
    expect(getPhase()).toBe('typing-word');
    act(() => { jest.advanceTimersByTime(200); });
    expect(getDisplayText()).toBe('A');

    // Pause → delete "A"
    act(() => { jest.advanceTimersByTime(50); });
    expect(getPhase()).toBe('deleting-word');
    act(() => { jest.advanceTimersByTime(30); });
    expect(getDisplayText()).toBe('');

    // Pause → type second word "B"
    act(() => { jest.advanceTimersByTime(50); });
    expect(getPhase()).toBe('typing-word');
    act(() => { jest.advanceTimersByTime(200); });
    expect(getDisplayText()).toBe('B');
  });

  it('stays at start when playing is false', () => {
    render(
      <HookProbe prefix="Hi" words={['there']} playing={false} />
    );

    act(() => { jest.advanceTimersByTime(5000); });

    expect(getPhase()).toBe('typing-prefix');
    expect(getDisplayText()).toBe('');
    expect(screen.getByTestId('loop-progress')).toHaveAttribute('data-show-cursor', 'false');
  });

  it('computes longestText from the longest word plus prefix', () => {
    render(
      <HookProbe prefix="Hi " words={['a', 'longer', 'b']} />
    );

    expect(screen.getByTestId('loop-progress')).toHaveAttribute(
      'data-longest-text',
      'Hi longer'
    );
  });

  it('shows the cursor while playing', () => {
    render(
      <HookProbe prefix="Hi" words={['there']} playing={true} typingBaseMs={1} />
    );

    expect(screen.getByTestId('loop-progress')).toHaveAttribute('data-show-cursor', 'true');
  });
});
