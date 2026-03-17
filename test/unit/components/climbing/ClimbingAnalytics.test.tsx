import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { ClimbingAnalytics } from '../../../../src/components/climbing/ClimbingAnalytics';
import type { ClimbingAnalytics as ClimbingAnalyticsType } from '../../../../src/hooks/useClimbingData';
import type { SharedDataStatus } from '../../../../src/types/data';

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

const mockStatus: SharedDataStatus = {
  source: 'static',
  loading: false,
  error: null,
  isFallback: false,
  reason: 'bundled-content',
  freshness: {
    label: 'Data sourced from static bundle.',
    isStale: false,
  },
};

describe('ClimbingAnalytics', () => {
  it('renders overview metrics', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} status={mockStatus} />
      </ThemeProvider>
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Routes Climbed')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Routes To Do')).toBeInTheDocument();
    expect(screen.getByText('Unique Locations')).toBeInTheDocument();
    expect(screen.getByText('2024-11-01')).toBeInTheDocument();
    expect(screen.getByText('Most Recent Tick')).toBeInTheDocument();
  });

  it('renders grade profile chips for climbed and to-do grades', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} status={mockStatus} />
      </ThemeProvider>
    );

    expect(screen.getByText('Climbed')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('5.10 (12)')).toBeInTheDocument();
    expect(screen.getByText('5.11 (5)')).toBeInTheDocument();
    // 5.9 has tickCount 0, so no tick chip
    expect(screen.queryByText('5.9 (0)')).not.toBeInTheDocument();
    // 5.9 has todoCount 2
    expect(screen.getByText('5.9 (2)')).toBeInTheDocument();
  });

  it('renders top destination locations', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} status={mockStatus} />
      </ThemeProvider>
    );

    expect(screen.getByText('Most Climbed')).toBeInTheDocument();
    expect(screen.getByText('Red River Gorge')).toBeInTheDocument();
    expect(screen.getByText('New River Gorge')).toBeInTheDocument();
    expect(screen.getByText('Most Wanted')).toBeInTheDocument();
    expect(screen.getByText('Indian Creek')).toBeInTheDocument();
    expect(screen.getByText('Rifle')).toBeInTheDocument();
  });

  it('renders the freshness status label', () => {
    render(
      <ThemeProvider>
        <ClimbingAnalytics analytics={mockAnalytics} status={mockStatus} />
      </ThemeProvider>
    );

    expect(screen.getByText('Data sourced from static bundle.')).toBeInTheDocument();
  });
});
