import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { LoadingBars } from '../../../src/components/LoadingBars';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    LinearProgress: ({ sx, ...props }: { sx: Record<string, unknown> }) => {
      const barStyles = (sx['& .MuiLinearProgress-bar'] as Record<string, string>) ?? {};

      return (
        <div
          {...props}
          data-testid="loading-bar"
          data-animation={barStyles.animation ?? ''}
          data-delay={barStyles.animationDelay ?? ''}
        />
      );
    },
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

describe('LoadingBars', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    jest.clearAllMocks();
  });

  it('disables pulse animation when reduced motion is enabled', () => {
    setReducedMotionPreference(true);

    render(
      <ThemeProvider>
        <LoadingBars />
      </ThemeProvider>
    );

    screen.getAllByTestId('loading-bar').forEach((bar) => {
      expect(bar).toHaveAttribute('data-animation', 'none');
      expect(bar).toHaveAttribute('data-delay', '0ms');
    });
  });

  it('keeps pulse animation enabled by default', () => {
    setReducedMotionPreference(false);

    render(
      <ThemeProvider>
        <LoadingBars />
      </ThemeProvider>
    );

    expect(screen.getAllByTestId('loading-bar')[0]).not.toHaveAttribute('data-animation', 'none');
  });
});
