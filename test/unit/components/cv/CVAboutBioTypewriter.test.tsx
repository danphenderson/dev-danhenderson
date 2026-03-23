import { act, render, screen, within } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { ComponentProps } from 'react';
import { createAppTheme } from '../../../../src/theme/createAppTheme';
import { CVAboutBioTypewriter } from '../../../../src/components/cv/CVAboutBioTypewriter';
import type { AboutMe } from '../../../../src/types/cv';

const defaultIntersectionObserver = window.IntersectionObserver;
let handleIntersection: IntersectionObserverCallback | undefined;

const aboutWithRichBio: AboutMe = {
  name: 'Test User',
  title: 'Software Engineer',
  email: 'test@example.com',
  phone: '',
  location: 'Seattle, WA',
  bioLink: {
    text: 'Mathematics cohort',
    url: 'https://example.com/program',
    tooltip: 'View the graduate program page.',
  },
  bio: 'Mathematics cohort building systems.\nOpen to opportunities in platform engineering.',
};

const theme = createAppTheme('light', 'evergreen');

const renderTypewriter = (props?: Partial<ComponentProps<typeof CVAboutBioTypewriter>>) =>
  render(
    <MuiThemeProvider theme={theme}>
      <p>
        <CVAboutBioTypewriter about={aboutWithRichBio} typingBaseMs={1} {...props} />
      </p>
    </MuiThemeProvider>
  );

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

const triggerEnterView = () => {
  act(() => {
    handleIntersection?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
};

const advanceUntil = (predicate: () => boolean, { stepMs = 20, maxMs = 3000 } = {}) => {
  let elapsedMs = 0;

  while (!predicate() && elapsedMs < maxMs) {
    act(() => {
      jest.advanceTimersByTime(stepMs);
    });

    elapsedMs += stepMs;
  }

  if (!predicate()) {
    throw new Error(`Condition was not met within ${maxMs}ms.`);
  }
};

const getLayer = (container: HTMLElement, layer: string) => {
  const node = container.querySelector(`[data-typewriter-layer="${layer}"]`);

  if (!(node instanceof HTMLElement)) {
    throw new Error(`Missing ${layer} layer.`);
  }

  return node;
};

describe('CVAboutBioTypewriter', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    installIntersectionObserverMock();
  });

  afterEach(() => {
    window.IntersectionObserver = defaultIntersectionObserver;
    handleIntersection = undefined;
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('stays empty before the bio enters view and keeps the reserve layer fully hidden', () => {
    jest.useFakeTimers();

    const { container } = renderTypewriter();

    const animatedLayer = getLayer(container, 'animated');
    const reserveLayer = getLayer(container, 'reserve');

    expect(animatedLayer.textContent).toBe('');
    expect(animatedLayer).not.toHaveTextContent('Open to opportunities');
    expect(getComputedStyle(reserveLayer).visibility).toBe('hidden');
  });

  it('starts after entering view, preserves link and status styling while typing, and does not replay', () => {
    jest.useFakeTimers();
    const handleComplete = jest.fn();

    const { container } = renderTypewriter({ startDelayMs: 30, onComplete: handleComplete });
    const animatedLayer = getLayer(container, 'animated');

    triggerEnterView();

    act(() => {
      jest.advanceTimersByTime(29);
    });

    expect(animatedLayer.textContent).toBe('');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(animatedLayer.textContent).toBe('|');

    advanceUntil(() => animatedLayer.querySelector('a') instanceof HTMLAnchorElement);

    const partialLink = animatedLayer.querySelector('a') as HTMLAnchorElement;
    expect(partialLink.textContent).not.toBe('');
    expect(partialLink).toHaveAttribute('href', 'https://example.com/program');
    expect(partialLink).toHaveAttribute('tabindex', '-1');

    advanceUntil(() => (animatedLayer.textContent ?? '').includes('Open to'));

    const statusText = within(animatedLayer).getByText(/Open to/i);
    const probe = document.createElement('div');
    probe.style.color = theme.palette.secondary.main;
    document.body.appendChild(probe);
    const expectedColor = getComputedStyle(probe).color;
    probe.remove();

    expect(getComputedStyle(statusText).color).toBe(expectedColor);
    expect(handleComplete).not.toHaveBeenCalled();

    advanceUntil(
      () =>
        (animatedLayer.textContent ?? '').includes(
          'Open to opportunities in platform engineering.'
        ) && !(animatedLayer.textContent ?? '').includes('|'),
      { maxMs: 3000 }
    );

    expect(animatedLayer).toHaveTextContent('Mathematics cohort building systems.');
    expect(animatedLayer).toHaveTextContent('Open to opportunities in platform engineering.');
    expect(animatedLayer).not.toHaveTextContent('|');
    expect(handleComplete).toHaveBeenCalledTimes(1);

    const finalLink = within(animatedLayer).getByRole('link', { name: 'Mathematics cohort' });
    expect(finalLink).not.toHaveAttribute('tabindex', '-1');

    triggerEnterView();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(animatedLayer).toHaveTextContent('Open to opportunities in platform engineering.');
    expect(animatedLayer).not.toHaveTextContent('|');
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('renders the full bio immediately when already revealed', () => {
    const { container } = renderTypewriter({ revealed: true });
    const animatedLayer = getLayer(container, 'animated');

    expect(animatedLayer).toHaveTextContent('Mathematics cohort building systems.');
    expect(animatedLayer).toHaveTextContent('Open to opportunities in platform engineering.');
    expect(animatedLayer.querySelector('a')).toHaveAttribute('href', 'https://example.com/program');
    expect(container.querySelector('[data-typewriter-layer="accessible"]')).toBeNull();
    expect(window.IntersectionObserver).not.toHaveBeenCalled();
  });

});
