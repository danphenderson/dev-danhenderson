import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../src/ThemeProvider';
import { AnimatedContentCard } from '../../../src/components/AnimatedContentCard';
import { PREFERENCE_STORAGE_KEYS } from '../../../src/theme/preferences';

const mockUseReducedMotion = jest.fn().mockReturnValue(false);

jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react');

  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      appear,
    }: {
      children: ReactNode;
      in: boolean;
      appear?: boolean;
    }) => (
      <div data-testid="zoom" data-in={String(inProp)} data-appear={String(appear ?? true)}>
        {children}
      </div>
    ),
  };
});

const defaultIntersectionObserver = window.IntersectionObserver;
const getDirectionalWrapper = (testId: string = 'directional-card') =>
  screen.getByTestId(testId).parentElement as HTMLElement;
const installNonIntersectingObserver = () => {
  const observe = jest.fn();
  window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => []),
  })) as unknown as typeof IntersectionObserver;
  return observe;
};

describe('AnimatedContentCard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.IntersectionObserver = defaultIntersectionObserver;
    mockUseReducedMotion.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
    jest.useRealTimers();
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it.each(['off', 'reduced'])('reveals immediately without an observer with %s motion', (mode) => {
    const observe = installNonIntersectingObserver();
    const onVisible = jest.fn();
    if (mode === 'off') {
      window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');
    } else {
      mockUseReducedMotion.mockReturnValue(true);
    }

    const { rerender } = render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={500} onVisible={onVisible}>
          Instant Card
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId('zoom')).toHaveAttribute('data-appear', 'false');
    expect(observe).not.toHaveBeenCalled();
    expect(onVisible).toHaveBeenCalledTimes(1);

    rerender(
      <ThemeProvider>
        <AnimatedContentCard delayMs={500} onVisible={onVisible}>
          Instant Card Updated
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('keeps normal-motion cards gated until they intersect', () => {
    jest.useFakeTimers();
    const observe = installNonIntersectingObserver();
    const onVisible = jest.fn();

    render(
      <ThemeProvider>
        <AnimatedContentCard delayMs={150} onVisible={onVisible}>
          Waiting Card
        </AnimatedContentCard>
      </ThemeProvider>
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(observe).toHaveBeenCalled();
    expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');
    expect(onVisible).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'preserves controlled hidden content with motion off and skip %s',
    (skip) => {
      installNonIntersectingObserver();
      window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');
      const onVisible = jest.fn();

      render(
        <ThemeProvider>
          <AnimatedContentCard visible={false} skipEntranceAnimation={skip} onVisible={onVisible}>
            Controlled Hidden Card
          </AnimatedContentCard>
        </ThemeProvider>
      );

      expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');
      expect(onVisible).not.toHaveBeenCalled();
    }
  );

  it.each([true, false])(
    'settles a pending reveal with triggerOnView %s when motion is disabled and stays visible when reenabled',
    (triggerOnView) => {
      jest.useFakeTimers();
      installNonIntersectingObserver();
      const onVisible = jest.fn();
      const card = (
        <ThemeProvider>
          <AnimatedContentCard delayMs={500} triggerOnView={triggerOnView} onVisible={onVisible}>
            Pending Card
          </AnimatedContentCard>
        </ThemeProvider>
      );
      const { rerender } = render(card);

      expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'false');

      mockUseReducedMotion.mockReturnValue(true);
      rerender(
        <ThemeProvider>
          <AnimatedContentCard delayMs={500} triggerOnView={triggerOnView} onVisible={onVisible}>
            Pending Card
          </AnimatedContentCard>
        </ThemeProvider>
      );

      expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
      expect(onVisible).toHaveBeenCalledTimes(1);

      mockUseReducedMotion.mockReturnValue(false);
      rerender(card);
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('zoom')).toHaveAttribute('data-in', 'true');
      expect(onVisible).toHaveBeenCalledTimes(1);
    }
  );

  it('uses the provided delay literally when animation is enabled', () => {
    jest.useFakeTimers();

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

  it('does not flash content when visibility is toggled off before the delay completes', () => {
    jest.useFakeTimers();

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

  it('keeps directional cards hidden from assistive tech and interaction before reveal', () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <AnimatedContentCard
          delayMs={150}
          triggerOnView={false}
          entranceDirection="left"
          data-testid="directional-card"
        >
          <button type="button">Directional Action</button>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    const wrapper = getDirectionalWrapper();

    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveStyle({
      visibility: 'hidden',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'translate3d(-40px, 0, 0)',
    });
    expect(screen.queryByRole('button', { name: 'Directional Action' })).not.toBeInTheDocument();
  });

  it('reveals directional cards after the configured delay', () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <AnimatedContentCard
          delayMs={150}
          triggerOnView={false}
          entranceDirection="right"
          data-testid="directional-card"
        >
          <button type="button">Reveal Action</button>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    act(() => {
      jest.advanceTimersByTime(149);
    });

    expect(getDirectionalWrapper()).toHaveAttribute('aria-hidden', 'true');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(getDirectionalWrapper()).not.toHaveAttribute('aria-hidden');
    expect(getDirectionalWrapper()).toHaveStyle({
      visibility: 'visible',
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    });
    expect(screen.getByRole('button', { name: 'Reveal Action' })).toBeInTheDocument();
  });

  it('renders directional cards immediately once eligible when reduced motion is enabled', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <ThemeProvider>
        <AnimatedContentCard
          delayMs={150}
          triggerOnView={false}
          entranceDirection="left"
          data-testid="directional-card"
        >
          <button type="button">Reduced Motion Action</button>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(getDirectionalWrapper()).not.toHaveAttribute('aria-hidden');
    expect(getDirectionalWrapper()).toHaveStyle({
      visibility: 'visible',
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    });
    expect(screen.getByRole('button', { name: 'Reduced Motion Action' })).toBeInTheDocument();
  });

  it('can skip the directional entrance animation and notify once when the card is already revealed', () => {
    const handleVisible = jest.fn();

    render(
      <ThemeProvider>
        <AnimatedContentCard
          skipEntranceAnimation
          entranceDirection="left"
          data-testid="directional-card"
          onVisible={handleVisible}
        >
          <button type="button">Persisted Action</button>
        </AnimatedContentCard>
      </ThemeProvider>
    );

    expect(getDirectionalWrapper()).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('button', { name: 'Persisted Action' })).toBeInTheDocument();
    expect(handleVisible).toHaveBeenCalledTimes(1);
  });
});
