import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../src/ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../../../src/components/CommonLink';
import { useClimbingData } from '../../../src/hooks/useClimbingData';
import { PREFERENCE_STORAGE_KEYS } from '../../../src/theme/preferences';
import Climbing from '../../../src/pages/Climbing';

const createMockClimbingData = (overrides = {}) => ({
  ticks: [
    {
      id: 'tick-1',
      date: '6/26/2025',
      route: 'Hyperspace',
      grade: '5.11a',
      location: 'Leavenworth',
      url: 'https://mp.com/route/1',
    },
    {
      id: 'tick-2',
      date: '6/25/2025',
      route: 'Angel',
      grade: '5.10b',
      location: 'Tumwater Canyon',
      url: 'https://mp.com/route/3',
    },
  ],
  todos: [
    {
      id: 'todo-1',
      route: 'The Tooth',
      grade: '5.4',
      location: 'Alpental',
      url: 'https://mp.com/route/2',
    },
  ],
  analytics: {
    overview: {
      tickCount: 2,
      todoCount: 1,
      uniqueLocations: 3,
      mostRecentDate: '6/26/2025',
    },
    gradeProfile: [
      { bucket: '5.4', tickCount: 0, todoCount: 1 },
      { bucket: '5.10', tickCount: 1, todoCount: 0 },
      { bucket: '5.11', tickCount: 1, todoCount: 0 },
    ],
    destinationProfile: {
      topTickLocations: [{ location: 'Leavenworth', count: 1 }],
      topTodoLocations: [{ location: 'Alpental', count: 1 }],
    },
  },
  ...overrides,
});

jest.mock('../../../src/motion', () => {
  const actual = jest.requireActual('../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({
      children,
      intensity,
      disabled,
    }: {
      children: ReactNode;
      intensity?: number;
      disabled?: boolean;
    }) => {
      const { tilt } = actual.useMotionScale();
      const tiltEnabled = !disabled && tilt > 0;

      return (
        <div
          data-testid="climbing-tilt-card"
          data-intensity={String(intensity ?? '')}
          data-disabled={String(Boolean(disabled))}
          data-tilt-enabled={String(tiltEnabled)}
        >
          {children}
        </div>
      );
    },
  };
});

jest.mock('../../../src/hooks/useClimbingData', () => ({
  useClimbingData: jest.fn(),
  TickRow: undefined,
  TodoRow: undefined,
}));

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('Climbing', () => {
  beforeEach(() => {
    jest.mocked(useClimbingData).mockReturnValue(createMockClimbingData());
    window.localStorage.removeItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
  });

  afterEach(() => {
    window.localStorage.removeItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
  });

  it('renders the climbing page with section headings, data grids, and inline route links', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Climbing')).toBeInTheDocument();
    expect(
      screen.getByText(
        /A collection of routes I've remembered to tick on Mountain Project, including some\s+top-rope ascents — I don't climb 5\.14\./
      )
    ).toBeInTheDocument();
    expect(screen.getByText("A collection of routes I'd still like to climb.")).toBeInTheDocument();
    const tickLink = screen.getByRole('link', { name: 'Hyperspace' });
    const todoLink = screen.getByRole('link', { name: 'The Tooth' });

    expect(tickLink).toHaveAttribute('href', 'https://mp.com/route/1');
    expect(tickLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(tickLink).toHaveAttribute(
      'data-tooltip-content',
      'Open Hyperspace on Mountain Project.'
    );
    expect(todoLink).toHaveAttribute('href', 'https://mp.com/route/2');
    expect(todoLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(todoLink).toHaveAttribute('data-tooltip-content', 'Open The Tooth on Mountain Project.');
  });

  it('renders each data grid inside a MotionTiltCard surface', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    const tiltCards = screen.getAllByTestId('climbing-tilt-card');

    expect(tiltCards).toHaveLength(2);
    tiltCards.forEach((tiltCard) => {
      expect(tiltCard).toHaveAttribute('data-intensity', '0.4');
      expect(tiltCard).toHaveAttribute('data-tilt-enabled', 'true');
    });

    expect(tiltCards[0]).toContainElement(screen.getByRole('link', { name: 'Hyperspace' }));
    expect(tiltCards[1]).toContainElement(screen.getByRole('link', { name: 'The Tooth' }));
  });

  it('keeps tilt interaction disabled when motion intensity is off', () => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');

    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    const tiltCards = screen.getAllByTestId('climbing-tilt-card');

    expect(tiltCards).toHaveLength(2);
    tiltCards.forEach((tiltCard) => {
      expect(tiltCard).toHaveAttribute('data-tilt-enabled', 'false');
    });
  });

  it('opens route links in a new tab with noopener noreferrer', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    const tickLink = screen.getByRole('link', { name: 'Hyperspace' });
    const todoLink = screen.getByRole('link', { name: 'The Tooth' });

    expect(tickLink).toHaveAttribute('target', '_blank');
    expect(tickLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(todoLink).toHaveAttribute('target', '_blank');
    expect(todoLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders data grids with expected column headers', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    const routeHeaders = screen.getAllByRole('columnheader', { name: 'Route' });
    const gradeHeaders = screen.getAllByRole('columnheader', { name: 'Grade' });

    expect(routeHeaders.length).toBeGreaterThanOrEqual(1);
    expect(gradeHeaders.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('columnheader', { name: 'Date' })).not.toBeInTheDocument();
  });

  it('renders search inputs with correct placeholders', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByPlaceholderText('Search climbed routes...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search routes to climb...')).toBeInTheDocument();
  });

  it('filters ticks grid when typing into the ticks search box', async () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Hyperspace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Angel' })).toBeInTheDocument();

    const tickSearchInput = screen.getByPlaceholderText('Search climbed routes...');
    fireEvent.change(tickSearchInput, { target: { value: 'Angel' } });

    expect(screen.getByRole('link', { name: 'Angel' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Hyperspace' })).not.toBeInTheDocument();
  });

  it('maintains independent search state between grids', async () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    const tickSearchInput = screen.getByPlaceholderText('Search climbed routes...');
    fireEvent.change(tickSearchInput, { target: { value: 'Angel' } });

    expect(screen.getByRole('link', { name: 'The Tooth' })).toBeInTheDocument();
  });

  it('renders the analytics overview section', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Routes Climbed')).toBeInTheDocument();
    expect(screen.getAllByText('Routes to Climb').length).toBeGreaterThanOrEqual(1);
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

    expect(screen.getByText('Bundled climbing log updated through 6/26/2025.')).toBeInTheDocument();
  });

  it('hides the routes-to-climb table when there is no wishlist data', () => {
    jest.mocked(useClimbingData).mockReturnValue(
      createMockClimbingData({
        todos: [],
        analytics: {
          overview: {
            tickCount: 2,
            todoCount: 0,
            uniqueLocations: 2,
            mostRecentDate: '6/26/2025',
          },
          gradeProfile: [
            { bucket: '5.10', tickCount: 1, todoCount: 0 },
            { bucket: '5.11', tickCount: 1, todoCount: 0 },
          ],
          destinationProfile: {
            topTickLocations: [{ location: 'Leavenworth', count: 1 }],
            topTodoLocations: [],
          },
        },
      })
    );

    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(
      screen.queryByText("A collection of routes I'd still like to climb.")
    ).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search routes to climb...')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'The Tooth' })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('climbing-tilt-card')).toHaveLength(1);
  });
});
