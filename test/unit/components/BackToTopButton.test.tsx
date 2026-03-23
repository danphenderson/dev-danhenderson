import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import ThemeProvider from '../../../src/ThemeProvider';
import { BackToTopButton } from '../../../src/components/BackToTopButton';

let mockDuration = 1;

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      timeout,
      unmountOnExit,
    }: {
      children: ReactNode;
      in: boolean;
      timeout?: number | { enter?: number; exit?: number };
      unmountOnExit?: boolean;
    }) => {
      if (!inProp && unmountOnExit) {
        return null;
      }

      return (
        <div
          data-testid="back-to-top-zoom"
          data-timeout={
            typeof timeout === 'number' ? String(timeout) : JSON.stringify(timeout ?? null)
          }
        >
          {children}
        </div>
      );
    },
  };
});

jest.mock('@mui/material/useScrollTrigger', () => jest.fn());

jest.mock('../../../src/motion', () => ({
  ...jest.requireActual('../../../src/motion'),
  useMotionScale: () => ({
    duration: mockDuration,
    stagger: 1,
    tilt: 1,
    cssAnimations: mockDuration !== 0,
  }),
}));

const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

describe('BackToTopButton', () => {
  const scrollToMock = jest.fn();

  beforeEach(() => {
    mockDuration = 1;
    mockUseScrollTrigger.mockReturnValue(false);
    scrollToMock.mockReset();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render before the shared header threshold has been crossed', () => {
    render(
      <ThemeProvider>
        <BackToTopButton />
      </ThemeProvider>
    );

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });

  it('renders after the shared header threshold and scrolls smoothly by default', () => {
    mockUseScrollTrigger.mockReturnValue(true);

    render(
      <ThemeProvider>
        <BackToTopButton />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('collapses zoom timing and scrolls instantly when motion is off', () => {
    mockDuration = 0;
    mockUseScrollTrigger.mockReturnValue(true);

    render(
      <ThemeProvider>
        <BackToTopButton />
      </ThemeProvider>
    );

    expect(screen.getByTestId('back-to-top-zoom')).toHaveAttribute('data-timeout', '0');

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'auto',
    });
  });
});
