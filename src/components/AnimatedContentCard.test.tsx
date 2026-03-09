import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { AnimatedContentCard } from './AnimatedContentCard';

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
});
