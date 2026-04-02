import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ThemeProvider from '../../../src/ThemeProvider';

let capturedMotionDivProps: Record<string, unknown> = {};

jest.mock('motion/react', () => {
  const React: typeof import('react') = require('react');

  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      const child = React.Children.only(children) as ReactElement;
      const [exitingChild, setExitingChild] = React.useState<ReactElement | null>(null);
      const previousChildRef = React.useRef<ReactElement | null>(null);

      React.useLayoutEffect(() => {
        const previousChild = previousChildRef.current;

        if (previousChild && previousChild.key !== child.key) {
          setExitingChild(previousChild);
        } else {
          setExitingChild(null);
        }

        previousChildRef.current = child;
      }, [child]);

      return (
        <>
          {exitingChild}
          {child}
        </>
      );
    },
    useReducedMotion: () => false,
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
          ref: Ref<HTMLDivElement>
        ) => {
          capturedMotionDivProps = { initial, animate, exit, transition };

          return (
            <div ref={ref} data-testid="page-transition-div" {...rest}>
              {children}
            </div>
          );
        }
      ),
    },
  };
});

import { PageTransition } from '../../../src/components/PageTransition';

const renderWithProviders = (ui: ReactNode, route = '/') =>
  render(
    <ThemeProvider>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );

const PageTransitionHarness = ({
  freezeRoutesLocation = false,
}: {
  freezeRoutesLocation?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <button onClick={() => navigate('/cv')}>Go to CV</button>
      <PageTransition>
        <Routes location={freezeRoutesLocation ? location : undefined}>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/cv" element={<div>CV Page</div>} />
        </Routes>
      </PageTransition>
    </>
  );
};

describe('PageTransition', () => {
  afterEach(() => {
    capturedMotionDivProps = {};
    jest.clearAllMocks();
  });

  it('renders children inside a motion.div wrapper', () => {
    renderWithProviders(
      <PageTransition>
        <div data-testid="page-content">Hello</div>
      </PageTransition>
    );

    expect(screen.getByTestId('page-transition-div')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('provides enter and exit animation props to the motion wrapper', () => {
    renderWithProviders(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    expect(capturedMotionDivProps.initial).toEqual({ opacity: 0, y: 8 });
    expect(capturedMotionDivProps.animate).toEqual({ opacity: 1, y: 0 });
    expect(capturedMotionDivProps.exit).toEqual(
      expect.objectContaining({
        opacity: 0,
        y: -8,
        transition: expect.objectContaining({
          duration: expect.any(Number),
          ease: expect.any(Array),
        }),
      })
    );
    expect(capturedMotionDivProps.transition).toEqual(
      expect.objectContaining({
        duration: expect.any(Number),
        ease: expect.any(Array),
      })
    );
  });

  it('re-matches exiting routes against the new location when Routes reads live router context', () => {
    renderWithProviders(<PageTransitionHarness />, '/');

    fireEvent.click(screen.getByRole('button', { name: 'Go to CV' }));

    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    expect(screen.getAllByText('CV Page')).toHaveLength(2);
  });

  it('preserves the exiting route match when Routes receives the current location', () => {
    renderWithProviders(<PageTransitionHarness freezeRoutesLocation />, '/');

    fireEvent.click(screen.getByRole('button', { name: 'Go to CV' }));

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('CV Page')).toBeInTheDocument();
  });
});
