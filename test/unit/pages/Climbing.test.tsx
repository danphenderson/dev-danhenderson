import { render, screen, fireEvent, within } from '@testing-library/react';
import { useEffect, type ReactNode } from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import ThemeProvider from '../../../src/ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../../../src/components/CommonLink';
import { useClimbingData } from '../../../src/hooks/useClimbingData';
import { PREFERENCE_STORAGE_KEYS } from '../../../src/theme/preferences';
import Climbing from '../../../src/pages/Climbing';

const climbingIntroText =
  'A collection of ascents that were recorded on Mountain Project, including everything from the rare onsights to noteworthy top-ropes.';

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

jest.mock('@mui/material/useScrollTrigger', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({
    children,
    onVisible,
    delayMs,
    entranceDirection,
    triggerOnView,
  }: {
    children: ReactNode;
    onVisible?: () => void;
    delayMs?: number;
    entranceDirection?: string;
    triggerOnView?: boolean;
  }) => {
    useEffect(() => {
      onVisible?.();
    }, [onVisible]);

    return (
      <div
        data-testid="animated-card"
        data-delay-ms={String(delayMs ?? 0)}
        data-entrance-direction={entranceDirection ?? 'zoom'}
        data-trigger-on-view={String(triggerOnView ?? true)}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('../../../src/components/text', () => {
  const actual = jest.requireActual('../../../src/components/text');

  return {
    ...actual,
    TypewriterText: ({
      text,
      playing,
      onComplete,
    }: {
      text: string;
      playing?: boolean;
      onComplete?: () => void;
    }) => {
      useEffect(() => {
        if (!playing) {
          return;
        }

        onComplete?.();
      }, [onComplete, playing]);

      return (
        <span data-testid="typewriter-text" data-playing={String(Boolean(playing))}>
          {text}
        </span>
      );
    },
  };
});

describe('Climbing', () => {
  const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

  const renderClimbing = ({ scrolledPastHeaderCollapse = false } = {}) => {
    mockUseScrollTrigger.mockReturnValue(scrolledPastHeaderCollapse);

    return render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.mocked(useClimbingData).mockReturnValue(createMockClimbingData());
    mockUseScrollTrigger.mockReturnValue(false);
    window.localStorage.removeItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
  });

  afterEach(() => {
    window.localStorage.removeItem(PREFERENCE_STORAGE_KEYS.motionIntensity);
  });

  it('renders only the climbing intro on initial load and defers the main content', () => {
    renderClimbing();

    expect(screen.getByText('Climbing')).toBeInTheDocument();
    expect(screen.getByText(climbingIntroText)).toBeInTheDocument();
    expect(screen.getByTestId('climbing-scroll-unlock-runway')).toBeInTheDocument();
    expect(screen.queryByText('Routes Climbed')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Hyperspace' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'The Tooth' })).not.toBeInTheDocument();
  });

  it('renders the deferred content after the header collapse threshold is crossed', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByText(climbingIntroText)).toBeInTheDocument();
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

  it('starts the intro typewriter when the intro card becomes visible', () => {
    renderClimbing();

    const introCard = screen
      .getByTestId('climbing-intro-label')
      .closest('[data-testid="animated-card"]');

    if (!(introCard instanceof HTMLElement)) {
      throw new Error('Expected the climbing intro card to be an HTMLElement.');
    }

    const introTypewriters = within(introCard).getAllByTestId('typewriter-text');

    expect(introTypewriters).toHaveLength(2);
    introTypewriters.forEach((typewriter) => {
      expect(typewriter).toHaveAttribute('data-playing', 'true');
    });
  });

  it('uses the deferred content card motion contract after unlock while keeping the intro card separate', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    const contentCard = screen.getByText('Routes Climbed').closest('[data-testid="animated-card"]');

    if (!contentCard) {
      throw new Error('Expected the deferred climbing content card to render.');
    }

    if (!(contentCard instanceof HTMLElement)) {
      throw new Error('Expected the deferred climbing content card to be an HTMLElement.');
    }

    expect(contentCard).toHaveAttribute('data-delay-ms', '120');
    expect(contentCard).toHaveAttribute('data-entrance-direction', 'right');
    expect(contentCard).toHaveAttribute('data-trigger-on-view', 'true');
    expect(contentCard).not.toContainElement(screen.getByText(climbingIntroText));

    const introCard = screen
      .getByTestId('climbing-intro-label')
      .closest('[data-testid="animated-card"]');

    if (!introCard) {
      throw new Error('Expected the climbing intro card to remain mounted after unlock.');
    }

    if (!(introCard instanceof HTMLElement)) {
      throw new Error('Expected the climbing intro card to be an HTMLElement.');
    }

    expect(introCard).toHaveAttribute('data-delay-ms', '0');
    expect(introCard).toHaveAttribute('data-trigger-on-view', 'false');
    expect(introCard).toContainElement(screen.getByText(climbingIntroText));

    const introTypewriters = within(introCard).getAllByTestId('typewriter-text');

    expect(introTypewriters).toHaveLength(2);
    expect(introTypewriters[0]).toHaveTextContent('Climbing');
    expect(introTypewriters[1]).toHaveTextContent(climbingIntroText);
    introTypewriters.forEach((typewriter) => {
      expect(contentCard).not.toContainElement(typewriter);
    });
  });

  it('renders the intro and each data surface inside MotionTiltCard wrappers', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    const tiltCards = screen.getAllByTestId('climbing-tilt-card');
    const introCard = screen
      .getByTestId('climbing-intro-label')
      .closest('[data-testid="climbing-tilt-card"]');
    const climbedGradesCard = screen
      .getByText('Climbed')
      .closest('[data-testid="climbing-tilt-card"]');
    const toClimbGradesCard = screen
      .getByText('To Climb')
      .closest('[data-testid="climbing-tilt-card"]');
    const mostClimbedCard = screen
      .getByText('Most Climbed')
      .closest('[data-testid="climbing-tilt-card"]');
    const mostWantedCard = screen
      .getByText('Most Wanted')
      .closest('[data-testid="climbing-tilt-card"]');
    const climbedRoutesCard = screen
      .getByRole('link', { name: 'Hyperspace' })
      .closest('[data-testid="climbing-tilt-card"]');
    const todoRoutesCard = screen
      .getByRole('link', { name: 'The Tooth' })
      .closest('[data-testid="climbing-tilt-card"]');

    if (
      !introCard ||
      !climbedGradesCard ||
      !toClimbGradesCard ||
      !mostClimbedCard ||
      !mostWantedCard ||
      !climbedRoutesCard ||
      !todoRoutesCard
    ) {
      throw new Error('Expected all climbing tilt card surfaces to render.');
    }

    expect(tiltCards).toHaveLength(7);
    tiltCards.forEach((tiltCard) => {
      expect(tiltCard).toHaveAttribute('data-tilt-enabled', 'true');
    });

    expect(introCard).toHaveAttribute('data-intensity', '0.5');
    expect(introCard).toContainElement(screen.getByText(climbingIntroText));
    expect(climbedGradesCard).toHaveAttribute('data-intensity', '0.4');
    expect(toClimbGradesCard).toHaveAttribute('data-intensity', '0.4');
    expect(mostClimbedCard).toHaveAttribute('data-intensity', '0.4');
    expect(mostWantedCard).toHaveAttribute('data-intensity', '0.4');
    expect(climbedRoutesCard).toHaveAttribute('data-intensity', '0.4');
    expect(todoRoutesCard).toHaveAttribute('data-intensity', '0.4');
    expect(climbedGradesCard).toContainElement(screen.getByText('Climbed'));
    expect(toClimbGradesCard).toContainElement(screen.getByText('To Climb'));
    expect(mostClimbedCard).toContainElement(screen.getByText('Most Climbed'));
    expect(mostWantedCard).toContainElement(screen.getByText('Most Wanted'));
    expect(climbedRoutesCard).toContainElement(screen.getByRole('link', { name: 'Hyperspace' }));
    expect(todoRoutesCard).toContainElement(screen.getByRole('link', { name: 'The Tooth' }));
  });

  it('keeps tilt interaction disabled when motion intensity is off', () => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');

    renderClimbing({ scrolledPastHeaderCollapse: true });

    const tiltCards = screen.getAllByTestId('climbing-tilt-card');

    expect(tiltCards).toHaveLength(7);
    tiltCards.forEach((tiltCard) => {
      expect(tiltCard).toHaveAttribute('data-tilt-enabled', 'false');
    });
  });

  it('opens route links in a new tab with noopener noreferrer', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    const tickLink = screen.getByRole('link', { name: 'Hyperspace' });
    const todoLink = screen.getByRole('link', { name: 'The Tooth' });

    expect(tickLink).toHaveAttribute('target', '_blank');
    expect(tickLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(todoLink).toHaveAttribute('target', '_blank');
    expect(todoLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders data grids with expected column headers', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    const routeHeaders = screen.getAllByRole('columnheader', { name: 'Route' });
    const gradeHeaders = screen.getAllByRole('columnheader', { name: 'Grade' });

    expect(routeHeaders.length).toBeGreaterThanOrEqual(1);
    expect(gradeHeaders.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('columnheader', { name: 'Date' })).not.toBeInTheDocument();
  });

  it('renders search inputs with correct placeholders', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByPlaceholderText('Search climbed routes...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search routes to climb...')).toBeInTheDocument();
  });

  it('filters ticks grid when typing into the ticks search box', async () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByRole('link', { name: 'Hyperspace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Angel' })).toBeInTheDocument();

    const tickSearchInput = screen.getByPlaceholderText('Search climbed routes...');
    fireEvent.change(tickSearchInput, { target: { value: 'Angel' } });

    expect(screen.getByRole('link', { name: 'Angel' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Hyperspace' })).not.toBeInTheDocument();
  });

  it('maintains independent search state between grids', async () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    const tickSearchInput = screen.getByPlaceholderText('Search climbed routes...');
    fireEvent.change(tickSearchInput, { target: { value: 'Angel' } });

    expect(screen.getByRole('link', { name: 'The Tooth' })).toBeInTheDocument();
  });

  it('renders the analytics overview metrics', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByText('Routes Climbed')).toBeInTheDocument();
    expect(screen.getAllByText('Routes to Climb').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Unique Locations')).toBeInTheDocument();
    expect(screen.getByText('Most Recent Tick')).toBeInTheDocument();

    const routesClimbedMetric = screen.getByText('Routes Climbed').parentElement;
    const routesToClimbMetric = screen.getAllByText('Routes to Climb')[0]?.parentElement;
    const uniqueLocationsMetric = screen.getByText('Unique Locations').parentElement;
    const mostRecentTickMetric = screen.getByText('Most Recent Tick').parentElement;

    if (
      !routesClimbedMetric ||
      !routesToClimbMetric ||
      !uniqueLocationsMetric ||
      !mostRecentTickMetric
    ) {
      throw new Error('Expected analytics metric containers to render.');
    }

    expect(within(routesClimbedMetric).getByText('2')).toBeInTheDocument();
    expect(within(routesToClimbMetric).getByText('1')).toBeInTheDocument();
    expect(within(uniqueLocationsMetric).getByText('3')).toBeInTheDocument();
    expect(within(mostRecentTickMetric).getByText('6/26/2025')).toBeInTheDocument();
  });

  it('renders the grade profile section', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByText('Grade Profile')).toBeInTheDocument();
    expect(screen.getByText('5.11 (1)')).toBeInTheDocument();
    expect(screen.getByText('5.4 (1)')).toBeInTheDocument();
  });

  it('renders the destination profile section', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(screen.getByText('Top Destinations')).toBeInTheDocument();
    expect(screen.getByText('Most Climbed')).toBeInTheDocument();
    expect(screen.getByText('Most Wanted')).toBeInTheDocument();
    expect(screen.getAllByText('Leavenworth').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Alpental').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the data freshness indicator', () => {
    renderClimbing({ scrolledPastHeaderCollapse: true });

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

    renderClimbing({ scrolledPastHeaderCollapse: true });

    expect(
      screen.queryByText("A collection of routes I'd still like to climb.")
    ).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search routes to climb...')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'The Tooth' })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('climbing-tilt-card')).toHaveLength(6);
  });
});
