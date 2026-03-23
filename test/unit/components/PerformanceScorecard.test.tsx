import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { PerformanceScorecard } from '../../../src/components/PerformanceScorecard';

let mockDuration = 1;
const mockMetrics = new Map();

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
    Dialog: ({
      children,
      open,
      transitionDuration,
      'aria-labelledby': ariaLabelledBy,
    }: {
      children: ReactNode;
      open: boolean;
      transitionDuration?: number;
      'aria-labelledby'?: string;
    }) =>
      open ? (
        <div
          role="dialog"
          data-testid="performance-scorecard-dialog"
          data-transition-duration={String(transitionDuration ?? '')}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </div>
      ) : null,
  };
});

jest.mock('../../../src/hooks/useWebVitals', () => ({
  useWebVitals: () => ({
    metrics: mockMetrics,
    collected: mockMetrics.size > 0,
  }),
}));

jest.mock('../../../src/motion', () => ({
  ...jest.requireActual('../../../src/motion'),
  useMotionScale: () => ({
    duration: mockDuration,
    stagger: 1,
    tilt: 1,
    cssAnimations: mockDuration !== 0,
  }),
}));

describe('PerformanceScorecard', () => {
  beforeEach(() => {
    mockDuration = 1;
    mockMetrics.clear();
  });

  it('opens the dialog with the default transition duration', () => {
    render(
      <ThemeProvider>
        <PerformanceScorecard />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open performance scorecard' }));

    expect(screen.getByTestId('performance-scorecard-dialog')).toHaveAttribute(
      'data-transition-duration',
      '225'
    );
  });

  it('collapses the dialog transition when motion is off', () => {
    mockDuration = 0;

    render(
      <ThemeProvider>
        <PerformanceScorecard />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open performance scorecard' }));

    expect(screen.getByTestId('performance-scorecard-dialog')).toHaveAttribute(
      'data-transition-duration',
      '0'
    );
  });
});
