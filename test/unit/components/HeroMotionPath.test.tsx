import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HeroMotionPath } from '../../../src/components/HeroMotionPath';

type MockMotionDivProps = {
  initial: Record<string, unknown> | false | undefined;
  animate: Record<string, unknown> | undefined;
  transition: Record<string, unknown> | undefined;
  style: CSSProperties | undefined;
};

const mockMotionDivProps: MockMotionDivProps[] = [];

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            onAnimationComplete,
            initial,
            animate,
            transition,
            style,
            ...rest
          }: {
            children?: ReactNode;
            onAnimationComplete?: () => void;
            initial?: Record<string, unknown> | false;
            animate?: Record<string, unknown>;
            transition?: Record<string, unknown>;
            style?: CSSProperties;
          } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>,
        ) => {
          const motionIndex = mockMotionDivProps.push({
            initial,
            animate,
            transition,
            style,
          });

          return (
            <div ref={ref} data-testid={`motion-div-${motionIndex - 1}`} {...rest}>
              {children}
              {onAnimationComplete && (
                <button
                  type="button"
                  data-testid="trigger-complete"
                  onClick={() => onAnimationComplete()}
                >
                  complete
                </button>
              )}
            </div>
          );
        },
      ),
    },
  };
});

const defaultMatchMedia = window.matchMedia;
const defaultInnerWidth = window.innerWidth;
const defaultInnerHeight = window.innerHeight;
const defaultGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

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

const getPathMotionDivProps = () =>
  mockMotionDivProps.find((props) => Array.isArray(props.animate?.x as unknown));

const getShellMotionDivProps = () =>
  mockMotionDivProps.find((props) => Array.isArray(props.animate?.scale as unknown));

describe('HeroMotionPath', () => {
  beforeEach(() => {
    mockMotionDivProps.length = 0;

    window.innerWidth = 1200;
    window.innerHeight = 900;

    HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 760,
      y: 610,
      left: 760,
      top: 610,
      right: 1000,
      bottom: 730,
      width: 240,
      height: 120,
      toJSON: () => undefined,
    }));
  });

  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    window.innerWidth = defaultInnerWidth;
    window.innerHeight = defaultInnerHeight;
    HTMLElement.prototype.getBoundingClientRect = defaultGetBoundingClientRect;
    jest.clearAllMocks();
  });

  it('renders children inside a motion div when active and motion is not reduced', async () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.getByTestId('motion-div-0')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();

    await waitFor(() => expect(getPathMotionDivProps()?.initial).toBeDefined());
    expect(getShellMotionDivProps()).toBeDefined();
  });

  it('does not render a motion div when not active', () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active={false} onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render a motion div when reduced motion is preferred', () => {
    setReducedMotionPreference(true);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div-0')).not.toBeInTheDocument();
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

  it('calls onComplete when the motion animation completes', async () => {
    setReducedMotionPreference(false);
    const onComplete = jest.fn();

    render(
      <HeroMotionPath active onComplete={onComplete}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(getPathMotionDivProps()?.transition).toBeDefined());
    expect(onComplete).not.toHaveBeenCalled();

    screen.getByTestId('trigger-complete').click();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('measures the shell position and builds measured spiral keyframes', async () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(getPathMotionDivProps()?.initial).toBeDefined());

    const pathMotionDivProps = getPathMotionDivProps() as MockMotionDivProps;
    const shellMotionDivProps = getShellMotionDivProps() as MockMotionDivProps;
    const initial = pathMotionDivProps.initial as Record<string, number>;
    const animate = pathMotionDivProps.animate as Record<string, number[]>;
    const transition = pathMotionDivProps.transition as Record<string, unknown>;
    const shellAnimate = shellMotionDivProps.animate as Record<string, Array<number | string>>;
    const shellTransition = shellMotionDivProps.transition as Record<string, unknown>;
    const expectedStartX = 1200 / 2 - (760 + 240 / 2);
    const expectedStartY = 900 / 2 - (610 + 120 / 2);

    expect(initial).toEqual({
      x: expectedStartX,
      y: expectedStartY,
    });
    expect(animate.x[0]).toBe(expectedStartX);
    expect(animate.y[0]).toBe(expectedStartY);
    expect(animate.x[1]).toBe(expectedStartX);
    expect(animate.y[1]).toBe(expectedStartY);
    expect(animate.x[animate.x.length - 1]).toBe(0);
    expect(animate.y[animate.y.length - 1]).toBe(0);
    expect(animate.x).toHaveLength(50);
    expect(animate.y).toHaveLength(50);
    expect(transition).toMatchObject({
      duration: 3.6,
      ease: 'easeInOut',
    });
    const times = transition.times as number[];
    expect(times).toHaveLength(50);
    expect(times[0]).toBe(0);
    expect(times[1]).toBeCloseTo(0.08, 5);
    expect(times[times.length - 1]).toBe(1);

    expect(shellAnimate.scale).toEqual([1, 1, 0.94, 1.03, 0.985, 1]);
    expect(shellAnimate.rotate).toEqual([0, 0, -7, 5, -2, 0]);
    expect(shellAnimate.borderRadius).toEqual([
      '16px',
      '16px',
      '28px 18px 30px 20px',
      '20px 30px 18px 28px',
      '18px 22px 16px 20px',
      '16px',
    ]);
    expect(shellTransition).toMatchObject({
      duration: 3.6,
      ease: 'easeInOut',
      times: [0, 0.08, 0.34, 0.6, 0.82, 1],
    });
  });

  it('remeasures the shell when the motion path is reactivated', async () => {
    setReducedMotionPreference(false);

    const { rerender } = render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(getPathMotionDivProps()?.initial).toBeDefined());
    expect(getPathMotionDivProps()?.initial).toEqual({ x: -280, y: -220 });

    rerender(
      <HeroMotionPath active={false} onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div-0')).not.toBeInTheDocument();

    HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 680,
      y: 560,
      left: 680,
      top: 560,
      right: 960,
      bottom: 700,
      width: 280,
      height: 140,
      toJSON: () => undefined,
    }));

    rerender(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(getPathMotionDivProps()?.initial).toEqual({ x: -220, y: -180 }));
  });
});
