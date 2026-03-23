import { act, render, screen } from '@testing-library/react';
import { useTypewriterProgress } from '../../../../src/components/text/useTypewriterProgress';

type HookProbeProps = Parameters<typeof useTypewriterProgress>[0];

const HookProbe = (props: HookProbeProps) => {
  const { charIndex, visibleText, isComplete, showCursor, resolvedTimingProfile } =
    useTypewriterProgress(props);

  return (
    <output
      data-testid="typewriter-progress"
      data-char-index={charIndex}
      data-visible-text={visibleText}
      data-is-complete={String(isComplete)}
      data-show-cursor={String(showCursor)}
      data-base-ms={resolvedTimingProfile.baseMs}
      data-min-delay-ms={resolvedTimingProfile.minDelayMs}
    >
      {visibleText}
      {showCursor ? '|' : ''}
    </output>
  );
};

describe('useTypewriterProgress', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('advances characters deterministically over time when playing is enabled', () => {
    jest.useFakeTimers();

    render(<HookProbe text="Hi" typingBaseMs={1} />);

    const progress = screen.getByTestId('typewriter-progress');

    expect(progress).toHaveAttribute('data-char-index', '0');
    expect(progress).toHaveTextContent('|');

    act(() => {
      jest.advanceTimersByTime(51);
    });

    expect(progress).toHaveAttribute('data-char-index', '0');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(progress).toHaveAttribute('data-char-index', '1');
    expect(progress).toHaveTextContent('H|');

    act(() => {
      jest.advanceTimersByTime(37);
    });

    expect(progress).toHaveAttribute('data-char-index', '1');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(progress).toHaveAttribute('data-char-index', '2');
    expect(progress).toHaveTextContent('Hi');
    expect(progress).toHaveAttribute('data-is-complete', 'true');
  });

  it('resolves the body preset and still lets callers override the base typing speed', () => {
    const { rerender } = render(<HookProbe text="Body copy" timingPreset="body" />);

    const progress = screen.getByTestId('typewriter-progress');

    expect(progress).toHaveAttribute('data-base-ms', '2');
    expect(progress).toHaveAttribute('data-min-delay-ms', '8');

    rerender(<HookProbe text="Body copy" timingPreset="body" typingBaseMs={18} />);

    expect(progress).toHaveAttribute('data-base-ms', '18');
    expect(progress).toHaveAttribute('data-min-delay-ms', '8');
  });

  it('stays at the start when playing is disabled', () => {
    jest.useFakeTimers();

    render(<HookProbe text="Paused" playing={false} />);

    const progress = screen.getByTestId('typewriter-progress');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(progress).toHaveAttribute('data-char-index', '0');
    expect(progress).toHaveAttribute('data-is-complete', 'false');
    expect(progress).toHaveAttribute('data-show-cursor', 'false');
    expect(progress).toHaveTextContent('');
  });
});
