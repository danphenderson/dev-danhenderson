import type { ReactNode, Ref, CSSProperties, HTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../src/ThemeProvider';

let capturedMotionDivProps: Record<string, unknown> = {};

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            exit,
            transition,
            style,
            ...rest
          }: {
            children?: ReactNode;
            initial?: Record<string, unknown> | false;
            animate?: Record<string, unknown>;
            exit?: Record<string, unknown>;
            transition?: Record<string, unknown>;
            style?: CSSProperties;
          } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>,
        ) => {
          capturedMotionDivProps = { initial, animate, exit, transition };

          return (
            <div ref={ref} data-testid="page-transition-div" {...rest}>
              {children}
            </div>
          );
        },
      ),
    },
  };
});

import { PageTransition } from '../../../src/components/PageTransition';

const defaultMatchMedia = window.matchMedia;

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

const renderWithProviders = (ui: ReactNode, route = '/') =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
    </ThemeProvider>,
  );

describe('PageTransition', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    capturedMotionDivProps = {};
    jest.clearAllMocks();
  });

  it('renders children inside a motion.div wrapper when motion is enabled', () => {
    setReducedMotionPreference(false);

    renderWithProviders(
      <PageTransition>
        <div data-testid="page-content">Hello</div>
      </PageTransition>,
    );

    expect(screen.getByTestId('page-transition-div')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('provides enter and exit animation props to the motion wrapper', () => {
    setReducedMotionPreference(false);

    renderWithProviders(
      <PageTransition>
        <div>Content</div>
      </PageTransition>,
    );

    expect(capturedMotionDivProps.initial).toEqual({ opacity: 0, y: 8 });
    expect(capturedMotionDivProps.animate).toEqual({ opacity: 1, y: 0 });
    expect(capturedMotionDivProps.exit).toEqual({ opacity: 0 });
    expect(capturedMotionDivProps.transition).toEqual(
      expect.objectContaining({
        duration: expect.any(Number),
        ease: expect.any(Array),
      }),
    );
  });

  it('skips animation wrapper and renders children directly under reduced motion', () => {
    setReducedMotionPreference(true);

    renderWithProviders(
      <PageTransition>
        <div data-testid="page-content">No Animation</div>
      </PageTransition>,
    );

    expect(screen.queryByTestId('page-transition-div')).not.toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });
});
