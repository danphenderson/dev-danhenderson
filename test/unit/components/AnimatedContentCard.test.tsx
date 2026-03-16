import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../src/ThemeProvider';
import { AnimatedContentCard } from '../../../src/components/AnimatedContentCard';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      appear,
    }: {
      children: ReactNode;
      in: boolean;
      appear?: boolean;
    }) => (
      <div data-testid="zoom" data-in={String(inProp)} data-appear={String(appear ?? true)}>
        {children}
      </div>
    ),
  };
});

const defaultIntersectionObserver = window.IntersectionObserver;

describe('AnimatedContentCard', () => {
  afterEach(() => {
    window.IntersectionObserver = defaultIntersectionObserver;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('uses the provided delay literally when animation is enabled', () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={150} triggerOnView={false}>
          <div>Animated Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(149);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
  });

  it('supports externally controlled visibility', () => {
    jest.useFakeTimers();

    const { rerender } = render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={120} visible={false}>
          <div>Controlled Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

    rerender(
      <ThemeProvider>
        <AnimatedContentCard delayMs={120} visible>
          <div>Controlled Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    act(() => {
      jest.advanceTimersByTime(119);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');

    rerender(
      <ThemeProvider>
        <AnimatedContentCard delayMs={120} visible={false}>
          <div>Controlled Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');
  });

  it('does not flash content when visibility is toggled off before the delay completes', () => {
    jest.useFakeTimers();

    const { rerender } = render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={200} visible={false}>
          <div>Flash Guard Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider>
        <AnimatedContentCard delayMs={200} visible>
          <div>Flash Guard Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

    rerender(
      <ThemeProvider>
        <AnimatedContentCard delayMs={200} visible={false}>
          <div>Flash Guard Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');
  });

  it('renders children immediately when delayMs is zero and animation is enabled', () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={0} triggerOnView={false}>
          <div>Zero Delay Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
  });

  it('can skip the entrance animation and notify once when the card is already revealed', () => {
    const handleVisible = jest.fn();

    render(
      <ThemeProvider>
        <AnimatedContentCard skipEntranceAnimation onVisible={handleVisible}>
          <div>Persisted Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId('zoom')).toHaveAttribute('data-appear', 'false');
    expect(handleVisible).toHaveBeenCalledTimes(1);
  });
});
