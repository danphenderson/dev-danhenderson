import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: ({ username }: { username: string }) => (
    <article
      className="react-activity-calendar"
      data-testid="github-calendar"
      data-username={username}
    >
      <div
        className="react-activity-calendar__scroll-container"
        data-testid="github-calendar-scroll-container"
      >
        <svg aria-hidden="true" />
      </div>
    </article>
  ),
}));

const defaultMatchMedia = window.matchMedia;
const defaultIntersectionObserver = window.IntersectionObserver;
const defaultRequestAnimationFrame = window.requestAnimationFrame;
const defaultCancelAnimationFrame = window.cancelAnimationFrame;
const defaultResizeObserver = global.ResizeObserver;

let queuedAnimationFrames = new Map<number, FrameRequestCallback>();
let nextAnimationFrameId = 1;
let handleIntersection: IntersectionObserverCallback | undefined;
let triggerResizeObserver: (() => void) | undefined;

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

const installIntersectionObserverMock = () => {
  const observe = jest.fn();
  const disconnect = jest.fn();

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: jest.fn().mockImplementation((callback: IntersectionObserverCallback) => {
      handleIntersection = callback;

      return {
        observe,
        disconnect,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '0px 0px -10% 0px',
        thresholds: [0],
      };
    }),
  });

  return { observe, disconnect };
};

const installAnimationFrameMock = () => {
  queuedAnimationFrames = new Map<number, FrameRequestCallback>();
  nextAnimationFrameId = 1;

  window.requestAnimationFrame = jest.fn().mockImplementation((callback: FrameRequestCallback) => {
    const frameId = nextAnimationFrameId;
    nextAnimationFrameId += 1;
    queuedAnimationFrames.set(frameId, callback);
    return frameId;
  });

  window.cancelAnimationFrame = jest.fn().mockImplementation((frameId: number) => {
    queuedAnimationFrames.delete(frameId);
  });
};

const runNextAnimationFrame = (timestamp: number) => {
  const nextFrame = queuedAnimationFrames.entries().next();

  if (nextFrame.done) {
    throw new Error('No animation frame is queued.');
  }

  const [frameId, callback] = nextFrame.value;
  queuedAnimationFrames.delete(frameId);

  act(() => {
    callback(timestamp);
  });
};

const triggerEnterView = () => {
  act(() => {
    handleIntersection?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
};

const attachScrollMetrics = (
  node: HTMLElement,
  { clientWidth, scrollWidth }: { clientWidth: number; scrollWidth: number }
) => {
  let currentScrollLeft = 0;

  Object.defineProperty(node, 'scrollLeft', {
    configurable: true,
    get: () => currentScrollLeft,
    set: (value: number) => {
      currentScrollLeft = Number(value);
    },
  });

  const setMetrics = (nextClientWidth: number, nextScrollWidth: number) => {
    Object.defineProperty(node, 'clientWidth', {
      configurable: true,
      value: nextClientWidth,
    });
    Object.defineProperty(node, 'scrollWidth', {
      configurable: true,
      value: nextScrollWidth,
    });
  };

  setMetrics(clientWidth, scrollWidth);

  return {
    getScrollLeft: () => currentScrollLeft,
    setMetrics,
  };
};

const setElementRect = (
  node: Element,
  { top, height, width }: { top: number; height: number; width: number }
) => {
  const left = 0;
  const bottom = top + height;
  const right = left + width;

  Object.defineProperty(node, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: left,
      y: top,
      top,
      bottom,
      left,
      right,
      width,
      height,
      toJSON: () => ({}),
    }),
  });
};

const getCalendarWrapper = (scrollContainer: HTMLElement) => {
  const wrapper = scrollContainer.closest('article')?.parentElement;

  if (!(wrapper instanceof HTMLElement)) {
    throw new Error('Calendar wrapper element is missing.');
  }

  return wrapper;
};

describe('GitHubContributionCalendar', () => {
  beforeEach(() => {
    setReducedMotionPreference(false);
    installAnimationFrameMock();
    installIntersectionObserverMock();
    Object.defineProperty(global, 'ResizeObserver', {
      writable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    window.IntersectionObserver = defaultIntersectionObserver;
    window.requestAnimationFrame = defaultRequestAnimationFrame;
    window.cancelAnimationFrame = defaultCancelAnimationFrame;
    Object.defineProperty(global, 'ResizeObserver', {
      writable: true,
      value: defaultResizeObserver,
    });
    queuedAnimationFrames.clear();
    handleIntersection = undefined;
    triggerResizeObserver = undefined;
    jest.clearAllMocks();
  });

  it('renders calendar title, description, and GitHubCalendar component', () => {
    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    expect(screen.getByText('Contribution calendar')).toBeInTheDocument();
    expect(screen.getByText('Yearly GitHub activity at a glance.')).toBeInTheDocument();
    expect(screen.getByTestId('github-calendar')).toHaveAttribute('data-username', 'testuser');
  });

  it('animates the calendar to the newest weeks the first time it enters view', () => {
    const { observe, disconnect } = installIntersectionObserverMock();

    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    const scrollContainer = screen.getByTestId('github-calendar-scroll-container');
    const metrics = attachScrollMetrics(scrollContainer, { clientWidth: 220, scrollWidth: 520 });
    const wrapper = getCalendarWrapper(scrollContainer);

    setElementRect(wrapper, { top: window.innerHeight + 120, height: 120, width: 420 });

    expect(observe).toHaveBeenCalledTimes(1);
    expect(metrics.getScrollLeft()).toBe(0);

    triggerEnterView();
    expect(queuedAnimationFrames.size).toBe(1);

    runNextAnimationFrame(0);
    expect(metrics.getScrollLeft()).toBe(0);
    expect(queuedAnimationFrames.size).toBe(0);

    act(() => {
      setElementRect(wrapper, { top: 160, height: 120, width: 420 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(queuedAnimationFrames.size).toBe(1);

    runNextAnimationFrame(16);
    expect(metrics.getScrollLeft()).toBe(0);

    runNextAnimationFrame(32);
    expect(metrics.getScrollLeft()).toBe(0);

    runNextAnimationFrame(932);
    expect(metrics.getScrollLeft()).toBe(300);
    expect(disconnect).toHaveBeenCalled();
    expect(queuedAnimationFrames.size).toBe(0);

    act(() => {
      scrollContainer.scrollLeft = 96;
    });

    triggerEnterView();

    expect(metrics.getScrollLeft()).toBe(96);
    expect(queuedAnimationFrames.size).toBe(0);
  });

  it('snaps directly to the newest weeks when reduced motion is preferred', () => {
    setReducedMotionPreference(true);

    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    const scrollContainer = screen.getByTestId('github-calendar-scroll-container');
    const metrics = attachScrollMetrics(scrollContainer, { clientWidth: 200, scrollWidth: 500 });
    const wrapper = getCalendarWrapper(scrollContainer);

    setElementRect(wrapper, { top: 120, height: 120, width: 420 });

    triggerEnterView();
    runNextAnimationFrame(0);

    expect(metrics.getScrollLeft()).toBe(300);
    expect(queuedAnimationFrames.size).toBe(0);
  });

  it('realigns to the current right edge on resize after the initial reveal completes', () => {
    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    const scrollContainer = screen.getByTestId('github-calendar-scroll-container');
    const metrics = attachScrollMetrics(scrollContainer, { clientWidth: 180, scrollWidth: 480 });
    const wrapper = getCalendarWrapper(scrollContainer);

    setElementRect(wrapper, { top: 120, height: 120, width: 420 });

    triggerEnterView();
    runNextAnimationFrame(0);
    runNextAnimationFrame(16);
    runNextAnimationFrame(916);

    expect(metrics.getScrollLeft()).toBe(300);

    act(() => {
      scrollContainer.scrollLeft = 48;
      metrics.setMetrics(240, 620);
      window.dispatchEvent(new Event('resize'));
    });

    runNextAnimationFrame(1000);

    expect(metrics.getScrollLeft()).toBe(380);
  });

  it('does not re-pin the calendar after manual scrolling when resize observers report later size changes', () => {
    Object.defineProperty(global, 'ResizeObserver', {
      writable: true,
      value: jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
        triggerResizeObserver = () => callback([], {} as ResizeObserver);

        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
          unobserve: jest.fn(),
        };
      }),
    });

    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    const scrollContainer = screen.getByTestId('github-calendar-scroll-container');
    const metrics = attachScrollMetrics(scrollContainer, { clientWidth: 180, scrollWidth: 480 });
    const wrapper = getCalendarWrapper(scrollContainer);

    setElementRect(wrapper, { top: 120, height: 120, width: 420 });

    triggerEnterView();
    runNextAnimationFrame(0);
    runNextAnimationFrame(16);
    runNextAnimationFrame(916);

    act(() => {
      scrollContainer.scrollLeft = 92;
      metrics.setMetrics(220, 540);
      triggerResizeObserver?.();
    });

    expect(metrics.getScrollLeft()).toBe(92);
  });
});
