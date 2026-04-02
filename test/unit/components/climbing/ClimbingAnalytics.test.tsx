import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { ClimbingAnalytics } from '../../../../src/components/climbing/ClimbingAnalytics';
import type { ClimbingAnalytics as ClimbingAnalyticsType } from '../../../../src/hooks/useClimbingData';

jest.mock('../../../../src/motion', () => {
  const actual = jest.requireActual('../../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({ children, intensity }: { children: ReactNode; intensity?: number }) => (
      <div data-testid="climbing-analytics-tilt-card" data-intensity={String(intensity ?? '')}>
        {children}
      </div>
    ),
  };
});

const mockAnalytics: ClimbingAnalyticsType = {
  overview: {
    tickCount: 42,
    todoCount: 15,
    uniqueLocations: 8,
    mostRecentDate: '2024-11-01',
  },
  gradeProfile: [
    { bucket: '5.10', tickCount: 12, todoCount: 3 },
    { bucket: '5.11', tickCount: 5, todoCount: 7 },
    { bucket: '5.9', tickCount: 0, todoCount: 2 },
  ],
  destinationProfile: {
    topTickLocations: [
      { location: 'Red River Gorge', count: 10 },
      { location: 'New River Gorge', count: 8 },
    ],
    topTodoLocations: [
      { location: 'Indian Creek', count: 5 },
      { location: 'Rifle', count: 3 },
    ],
  },
};

describe('ClimbingAnalytics', () => {
  it('renders overview metrics', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} />
      </ThemeProvider>
    );

    expect(screen.getByText('42')).toHaveStyle({ fontWeight: '700', fontSize: '1.5rem' });
    expect(screen.getByText('Routes Climbed')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Routes to Climb')).toBeInTheDocument();
    expect(screen.getByText('Unique Locations')).toBeInTheDocument();
    expect(screen.getByText('2024-11-01')).toBeInTheDocument();
    expect(screen.getByText('Most Recent Tick')).toBeInTheDocument();
  });

  it('renders grade profile chips for climbed and to-do grades', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} />
      </ThemeProvider>
    );

    const climbedCard = screen
      .getByText('Climbed')
      .closest('[data-testid="climbing-analytics-tilt-card"]');
    const toClimbCard = screen
      .getByText('To Climb')
      .closest('[data-testid="climbing-analytics-tilt-card"]');

    if (!climbedCard || !toClimbCard) {
      throw new Error('Expected grade profile tilt cards to render.');
    }

    expect(screen.getByText('Climbed')).toBeInTheDocument();
    expect(screen.getByText('To Climb')).toBeInTheDocument();
    expect(screen.getByText('5.10 (12)')).toBeInTheDocument();
    expect(screen.getByText('5.11 (5)')).toBeInTheDocument();
    // 5.9 has tickCount 0, so no tick chip
    expect(screen.queryByText('5.9 (0)')).not.toBeInTheDocument();
    // 5.9 has todoCount 2
    expect(screen.getByText('5.9 (2)')).toBeInTheDocument();
    expect(climbedCard).toHaveAttribute('data-intensity', '0.4');
    expect(toClimbCard).toHaveAttribute('data-intensity', '0.4');
    expect(climbedCard).toContainElement(screen.getByText('5.10 (12)'));
    expect(climbedCard).toContainElement(screen.getByText('5.11 (5)'));
    expect(toClimbCard).toContainElement(screen.getByText('5.10 (3)'));
    expect(toClimbCard).toContainElement(screen.getByText('5.11 (7)'));
    expect(toClimbCard).toContainElement(screen.getByText('5.9 (2)'));
  });

  it('renders grade and destination sections inside tilt cards', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} />
      </ThemeProvider>
    );

    const tiltCards = screen.getAllByTestId('climbing-analytics-tilt-card');
    const climbedCard = screen
      .getByText('Climbed')
      .closest('[data-testid="climbing-analytics-tilt-card"]');
    const toClimbCard = screen
      .getByText('To Climb')
      .closest('[data-testid="climbing-analytics-tilt-card"]');
    const mostClimbedCard = screen
      .getByText('Most Climbed')
      .closest('[data-testid="climbing-analytics-tilt-card"]');
    const mostWantedCard = screen
      .getByText('Most Wanted')
      .closest('[data-testid="climbing-analytics-tilt-card"]');

    if (!climbedCard || !toClimbCard || !mostClimbedCard || !mostWantedCard) {
      throw new Error('Expected analytics tilt cards to render.');
    }

    expect(tiltCards).toHaveLength(4);
    tiltCards.forEach((tiltCard) => {
      expect(tiltCard).toHaveAttribute('data-intensity', '0.4');
    });
    expect(climbedCard).toContainElement(screen.getByText('Climbed'));
    expect(toClimbCard).toContainElement(screen.getByText('To Climb'));
    expect(mostClimbedCard).toContainElement(screen.getByText('Red River Gorge'));
    expect(mostClimbedCard).toContainElement(screen.getByText('New River Gorge'));
    expect(mostWantedCard).toContainElement(screen.getByText('Indian Creek'));
    expect(mostWantedCard).toContainElement(screen.getByText('Rifle'));
  });

  it('renders the bundled freshness label from analytics recency', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} />
      </ThemeProvider>
    );

    expect(
      screen.getByText('Bundled climbing log updated through 2024-11-01.')
    ).toBeInTheDocument();
  });

  it('renders a fallback bundled freshness label when no recency date exists', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics
          analytics={{
            ...mockAnalytics,
            overview: {
              ...mockAnalytics.overview,
              mostRecentDate: '',
            },
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText('Bundled climbing log data is available in the client build.')
    ).toBeInTheDocument();
  });
});
