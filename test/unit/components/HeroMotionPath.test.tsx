import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { HeroMotionPath } from '../../../src/components/HeroMotionPath';

const mockMotionDivProps = {
  initial: undefined as Record<string, unknown> | false | undefined,
  animate: undefined as Record<string, unknown> | undefined,
  transition: undefined as Record<string, unknown> | undefined,
  style: undefined as CSSProperties | undefined,
};

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
          mockMotionDivProps.initial = initial;
          mockMotionDivProps.animate = animate;
          mockMotionDivProps.transition = transition;
          mockMotionDivProps.style = style;

          return (
            <div ref={ref} data-testid="motion-div" {...rest}>
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

describe('HeroMotionPath', () => {
  beforeEach(() => {
    mockMotionDivProps.initial = undefined;
    mockMotionDivProps.animate = undefined;
    mockMotionDivProps.transition = undefined;
    mockMotionDivProps.style = undefined;

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

    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();

    await waitFor(() => expect(mockMotionDivProps.initial).toBeDefined());
  });

  it('does not render a motion div when not active', () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active={false} onComplete={jest.fn()}>
        <span data-testid="child">content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render a motion div when reduced motion is preferred', () => {
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

  it('calls onComplete when the motion animation completes', async () => {
    setReducedMotionPreference(false);
    const onComplete = jest.fn();

    render(
      <HeroMotionPath active onComplete={onComplete}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(mockMotionDivProps.transition).toBeDefined());
    expect(onComplete).not.toHaveBeenCalled();

    // overflow:hidden is set during the animation for borderRadius clipping
    expect(mockMotionDivProps.style).toEqual(expect.objectContaining({ overflow: 'hidden' }));

    act(() => {
      screen.getByTestId('trigger-complete').click();
    });
    expect(onComplete).toHaveBeenCalledTimes(1);

    // After animation completes, overflow:hidden is removed
    await waitFor(() =>
      expect(mockMotionDivProps.style).not.toEqual(
        expect.objectContaining({ overflow: 'hidden' }),
      ),
    );
  });

  it('measures the shell position and builds measured spiral keyframes', async () => {
    setReducedMotionPreference(false);

    render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(mockMotionDivProps.initial).toBeDefined());

    const initial = mockMotionDivProps.initial as Record<string, number>;
    const animate = mockMotionDivProps.animate as Record<string, number[]>;
    const transition = mockMotionDivProps.transition as Record<string, unknown>;
    const expectedStartX = 1200 / 2 - (760 + 240 / 2);
    const expectedStartY = 900 / 2 - (610 + 120 / 2);

    expect(initial).toEqual({
      x: expectedStartX,
      y: expectedStartY,
      scale: 1,
      rotate: 0,
      borderRadius: 28,
    });
    expect(animate.x[0]).toBe(expectedStartX);
    expect(animate.y[0]).toBe(expectedStartY);
    expect(animate.x[1]).toBe(expectedStartX);
    expect(animate.y[1]).toBe(expectedStartY);
    expect(animate.x[animate.x.length - 1]).toBe(0);
    expect(animate.y[animate.y.length - 1]).toBe(0);
    expect(animate.x).toHaveLength(50);
    expect(animate.y).toHaveLength(50);

    // In-flight keyframed transforms
    expect(animate.scale).toHaveLength(50);
    expect(animate.rotate).toHaveLength(50);
    expect(animate.borderRadius).toHaveLength(50);

    // Hold entries stay at resting values
    expect(animate.scale[0]).toBe(1);
    expect(animate.scale[1]).toBe(1);
    expect(animate.rotate[0]).toBe(0);
    expect(animate.rotate[1]).toBe(0);
    expect(animate.borderRadius[0]).toBe(28);
    expect(animate.borderRadius[1]).toBe(28);

    // Travel entries vary from resting values
    const travelScales = animate.scale.slice(2, -1) as number[];
    expect(travelScales.some((v: number) => v !== 1)).toBe(true);
    const travelRotations = animate.rotate.slice(2, -1) as number[];
    expect(travelRotations.some((v: number) => v !== 0)).toBe(true);
    const travelRadii = animate.borderRadius.slice(2, -1) as number[];
    expect(travelRadii.some((v: number) => v !== 28)).toBe(true);

    // Final settle values
    expect(animate.scale[animate.scale.length - 1]).toBe(1);
    expect(animate.rotate[animate.rotate.length - 1]).toBe(0);
    expect(animate.borderRadius[animate.borderRadius.length - 1]).toBe(28);

    expect(transition).toMatchObject({
      duration: 3.6,
      ease: [0.175, 0.885, 0.32, 1.275],
    });
    const times = transition.times as number[];
    expect(times).toHaveLength(50);
    expect(times[0]).toBe(0);
    expect(times[1]).toBeCloseTo(0.08, 5);
    expect(times[times.length - 1]).toBe(1);
  });

  it('remeasures the shell when the motion path is reactivated', async () => {
    setReducedMotionPreference(false);

    const { rerender } = render(
      <HeroMotionPath active onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    await waitFor(() => expect(mockMotionDivProps.initial).toBeDefined());
    expect(mockMotionDivProps.initial).toEqual({
      x: -280,
      y: -220,
      scale: 1,
      rotate: 0,
      borderRadius: 28,
    });

    rerender(
      <HeroMotionPath active={false} onComplete={jest.fn()}>
        <span>content</span>
      </HeroMotionPath>,
    );

    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();

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

    await waitFor(() =>
      expect(mockMotionDivProps.initial).toEqual({
        x: -220,
        y: -180,
        scale: 1,
        rotate: 0,
        borderRadius: 28,
      }),
    );
  });
});
