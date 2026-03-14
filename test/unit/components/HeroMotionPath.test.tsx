import { render, screen } from '@testing-library/react';
import { HeroMotionPath } from '../../../src/components/HeroMotionPath';

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            onAnimationComplete,
            style,
            initial,
            animate,
            transition,
            ...rest
          }: {
            children?: React.ReactNode;
            onAnimationComplete?: () => void;
            style?: React.CSSProperties;
            initial?: Record<string, unknown>;
            animate?: Record<string, unknown>;
            transition?: Record<string, unknown>;
          } & React.HTMLAttributes<HTMLDivElement>,
          ref: React.Ref<HTMLDivElement>,
        ) => (
          <div
            ref={ref}
            data-testid="motion-div"
            data-initial={JSON.stringify(initial)}
            data-animate={JSON.stringify(animate)}
            data-delay={String((transition as Record<string, unknown>)?.delay ?? '')}
            {...rest}
          >
            {children}
            {onAnimationComplete && (
              <button
                data-testid="trigger-complete"
                type="button"
                onClick={() => onAnimationComplete()}
              >
                complete
              </button>
            )}
          </div>
        ),
      ),
    },
  };
});

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

describe('HeroMotionPath', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    jest.clearAllMocks();
  });

  it('renders children inside a motion.div when active and motion is not reduced', () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render motion.div when not active', () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active={false} onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render motion.div when reduced motion is preferred', () => {
    setReducedMotionPreference(true);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls onComplete immediately when reduced motion is preferred and active', () => {
    setReducedMotionPreference(true);
    const onComplete = jest.fn();

    render(
      <HeroMotionPath active onComplete={onComplete}>
        <span>content</span>
      </HeroMotionPath>,
    );

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not call onComplete when reduced motion is preferred but not active', () => {
    setReducedMotionPreference(true);
    const onComplete = jest.fn();

    render(
      <HeroMotionPath active={false} onComplete={onComplete}>
        <span>content</span>
      </HeroMotionPath>,
    );

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('calls onComplete when the motion animation completes', () => {
    setReducedMotionPreference(false);
    const onComplete = jest.fn();

    render(
      <HeroMotionPath active onComplete={onComplete}>
        <span>content</span>
      </HeroMotionPath>,
    );

    expect(onComplete).not.toHaveBeenCalled();

    screen.getByTestId('trigger-complete').click();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('sets initial and animate properties for offset-distance on the motion div', () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    const motionDiv = screen.getByTestId('motion-div');
    expect(JSON.parse(motionDiv.getAttribute('data-initial')!)).toEqual({
      offsetDistance: '0%',
    });
    expect(JSON.parse(motionDiv.getAttribute('data-animate')!)).toEqual({
      offsetDistance: '100%',
    });
  });
});
