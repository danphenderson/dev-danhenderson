import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../src/ThemeProvider';
import { AnimatedContentCard } from '../../../src/components/AnimatedContentCard';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({ children, in: inProp }: { children: ReactNode; in: boolean }) => (
      <div data-testid="zoom" data-in={String(inProp)}>
        {children}
      </div>
    ),
  };
});

const defaultMatchMedia = window.matchMedia;
const defaultIntersectionObserver = window.IntersectionObserver;

const setReducedMotionPreference = (matches: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('AnimatedContentCard', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    window.IntersectionObserver = defaultIntersectionObserver;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders immediately and skips animation wrappers under reduced motion', () => {
    setReducedMotionPreference(true);
    const intersectionObserver = jest.fn();
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: intersectionObserver,
    });

    render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={200}>
          <div>Reduced Motion Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByText('Reduced Motion Card')).toBeInTheDocument();
    expect(screen.queryByTestId('zoom')).not.toBeInTheDocument();
    expect(intersectionObserver).not.toHaveBeenCalled();
  });

  it('uses the provided delay literally when animation is enabled', () => {
    jest.useFakeTimers();
    setReducedMotionPreference(false);

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
    setReducedMotionPreference(false);

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

  it('keeps controlled content hidden under reduced motion until it is shown', () => {
    setReducedMotionPreference(true);

    const { rerender } = render(
      <ThemeProvider>
        <AnimatedContentCard visible={false}>
          <div>Reduced Motion Controlled Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.queryByText('Reduced Motion Controlled Card')).not.toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <AnimatedContentCard visible>
          <div>Reduced Motion Controlled Card</div>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByText('Reduced Motion Controlled Card')).toBeInTheDocument();
  });

  it('does not flash content when visibility is toggled off before the delay completes', () => {
    jest.useFakeTimers();
    setReducedMotionPreference(false);

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
    setReducedMotionPreference(false);

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
});
