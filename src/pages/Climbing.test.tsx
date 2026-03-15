import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import Climbing from './Climbing';

jest.mock('../hooks/useClimbingData', () => ({
  useClimbingData: () => ({
    ticks: [
      { id: 'tick-1', date: '6/26/2025', route: 'Hyperspace', grade: '5.11a', location: 'Leavenworth', url: 'https://mp.com/route/1' },
    ],
    todos: [
      { id: 'todo-1', route: 'The Tooth', grade: '5.4', location: 'Alpental', url: 'https://mp.com/route/2' },
    ],
    analytics: {
      overview: {
        tickCount: 1,
        todoCount: 1,
        uniqueLocations: 2,
        mostRecentDate: '6/26/2025',
      },
      gradeProfile: [
        { bucket: '5.4', tickCount: 0, todoCount: 1 },
        { bucket: '5.11', tickCount: 1, todoCount: 0 },
      ],
      destinationProfile: {
        topTickLocations: [{ location: 'Leavenworth', count: 1 }],
        topTodoLocations: [{ location: 'Alpental', count: 1 }],
      },
    },
    status: {
      dataFreshness: 'Tick data current through 6/26/2025.',
    },
  }),
  TickRow: undefined,
  TodoRow: undefined,
}));

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('Climbing', () => {
  it('renders the climbing page with section headings and data grids', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Climbing')).toBeInTheDocument();
    expect(screen.getByText('TODO Routes')).toBeInTheDocument();
    expect(screen.getByText("A collection of routes I've remembered to tick on Mountain Project.")).toBeInTheDocument();
    expect(screen.getByText("A collection of routes I'm interested in climbing.")).toBeInTheDocument();
  });

  it('renders the analytics overview section', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Routes Climbed')).toBeInTheDocument();
    expect(screen.getByText('Routes To Do')).toBeInTheDocument();
    expect(screen.getByText('Unique Locations')).toBeInTheDocument();
    expect(screen.getByText('Most Recent Tick')).toBeInTheDocument();
  });

  it('renders the grade profile section', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Grade Profile')).toBeInTheDocument();
    expect(screen.getByText('5.11 (1)')).toBeInTheDocument();
    expect(screen.getByText('5.4 (1)')).toBeInTheDocument();
  });

  it('renders the destination profile section', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Top Destinations')).toBeInTheDocument();
    expect(screen.getByText('Most Climbed')).toBeInTheDocument();
    expect(screen.getByText('Most Wanted')).toBeInTheDocument();
    expect(screen.getAllByText('Leavenworth').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Alpental').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the data freshness indicator', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Tick data current through 6/26/2025.')).toBeInTheDocument();
  });
});
