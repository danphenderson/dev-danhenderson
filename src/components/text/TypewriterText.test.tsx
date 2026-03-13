import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { TypewriterText } from './TypewriterText';

let mockPrefersReducedMotion = false;

jest.mock('../../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockPrefersReducedMotion,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const getAnimatedTextNode = (container: HTMLElement) => {
  const nodes = container.querySelectorAll('[aria-hidden="true"]');
  return nodes[nodes.length - 1] as HTMLElement;
};

describe('TypewriterText', () => {
  beforeEach(() => {
    mockPrefersReducedMotion = false;
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('types from empty to full text over time while exposing the full heading text accessibly', () => {
    jest.useFakeTimers();

    const { container } = render(
      <h1>
        <TypewriterText text="Hi" typingBaseMs={1} />
      </h1>,
      { wrapper }
    );

    const animatedText = getAnimatedTextNode(container);

    expect(screen.getByRole('heading', { name: 'Hi' })).toBeInTheDocument();
    expect(animatedText).toHaveTextContent('|');

    act(() => {
      jest.advanceTimersByTime(51);
    });

    expect(animatedText).toHaveTextContent('|');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(animatedText).toHaveTextContent('H|');

    act(() => {
      jest.advanceTimersByTime(37);
    });

    expect(animatedText).toHaveTextContent('H|');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(animatedText).toHaveTextContent('Hi');
  });

  it('hides the cursor after typing completes', () => {
    jest.useFakeTimers();

    const { container } = render(<TypewriterText text="Go" typingBaseMs={1} />, { wrapper });
    const animatedText = getAnimatedTextNode(container);

    act(() => {
      jest.advanceTimersByTime(52);
    });

    act(() => {
      jest.advanceTimersByTime(38);
    });

    expect(animatedText).toHaveTextContent('Go');
    expect(animatedText).not.toHaveTextContent('|');
  });

  it('uses the headline timing preset instead of the default timing profile', () => {
    jest.useFakeTimers();

    const defaultRender = render(<TypewriterText text="AB" />, { wrapper });
    const defaultAnimatedText = getAnimatedTextNode(defaultRender.container);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(defaultAnimatedText).toHaveTextContent('A|');
    defaultRender.unmount();

    const headlineRender = render(<TypewriterText text="AB" timingPreset="headline" />, { wrapper });
    const headlineAnimatedText = getAnimatedTextNode(headlineRender.container);

    act(() => {
      jest.advanceTimersByTime(55);
    });

    act(() => {
      jest.advanceTimersByTime(55);
    });

    expect(headlineAnimatedText).toHaveTextContent('AB');
  });

  it('lets typingBaseMs override the preset when a caller needs a one-off speed', () => {
    jest.useFakeTimers();

    const { container } = render(
      <TypewriterText text="AB" timingPreset="headline" typingBaseMs={54} />,
      { wrapper }
    );
    const animatedText = getAnimatedTextNode(container);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(animatedText).toHaveTextContent('A|');
  });

  it('renders the full text immediately when reduced motion is preferred', () => {
    mockPrefersReducedMotion = true;

    const { container } = render(<TypewriterText text="Reduced motion" />, { wrapper });
    const animatedText = getAnimatedTextNode(container);

    expect(animatedText).toHaveTextContent('Reduced motion');
    expect(animatedText).not.toHaveTextContent('|');
  });
});
