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

describe('LoadingBars', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the shared pulse animation and stagger enabled', () => {
    render(
      <ThemeProvider>
        <LoadingBars />
      </ThemeProvider>
    );

    const bars = screen.getAllByTestId('loading-bar');
    expect(bars[0]).toHaveAttribute('data-delay', '0ms');
    expect(bars[1]).toHaveAttribute('data-delay', '200ms');
    expect(bars[2]).toHaveAttribute('data-delay', '400ms');
    expect(bars[0]).not.toHaveAttribute('data-animation', 'none');
  });
});
