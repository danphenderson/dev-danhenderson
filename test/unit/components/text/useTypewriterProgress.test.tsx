import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { useTypewriterProgress } from '../../../../src/components/text/useTypewriterProgress';
import { PREFERENCE_STORAGE_KEYS } from '../../../../src/theme/preferences';

type HookProbeProps = Parameters<typeof useTypewriterProgress>[0];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

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
    window.localStorage.removeItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
  });

  it('advances characters deterministically over time when playing is enabled', () => {
    jest.useFakeTimers();

    render(<HookProbe text="Hi" typingBaseMs={1} />, { wrapper });

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
    const { rerender } = render(<HookProbe text="Body copy" timingPreset="body" />, {
      wrapper,
    });

    const progress = screen.getByTestId('typewriter-progress');

    expect(progress).toHaveAttribute('data-base-ms', '2');
    expect(progress).toHaveAttribute('data-min-delay-ms', '8');

    rerender(<HookProbe text="Body copy" timingPreset="body" typingBaseMs={18} />);

    expect(progress).toHaveAttribute('data-base-ms', '18');
    expect(progress).toHaveAttribute('data-min-delay-ms', '8');
  });

  it('stays at the start when playing is disabled', () => {
    jest.useFakeTimers();

    render(<HookProbe text="Paused" playing={false} />, { wrapper });

    const progress = screen.getByTestId('typewriter-progress');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(progress).toHaveAttribute('data-char-index', '0');
    expect(progress).toHaveAttribute('data-is-complete', 'false');
    expect(progress).toHaveAttribute('data-show-cursor', 'false');
    expect(progress).toHaveTextContent('');
  });

  it('renders complete text immediately when motion intensity is off', () => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');

    render(<HookProbe text="Instant" typingBaseMs={54} />, { wrapper });

    const progress = screen.getByTestId('typewriter-progress');

    expect(progress).toHaveAttribute('data-char-index', '7');
    expect(progress).toHaveAttribute('data-is-complete', 'true');
    expect(progress).toHaveAttribute('data-show-cursor', 'false');
    expect(progress).toHaveTextContent('Instant');
  });
});
