import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  MotionFadeIn,
  MotionScaleIn,
  MotionSection,
  StaggerChildren,
} from '../../../src/motion/components';
import { duration, easing } from '../../../src/motion/tokens';
import { fadeIn, fadeInUp, scaleIn } from '../../../src/motion/variants';

const mockUseInView = jest.fn();
const mockUseMotionScale = jest.fn(() => ({ duration: 1, stagger: 1, tilt: 1 }));

jest.mock('motion/react', () => {
  const React = jest.requireActual('react');

  const MockMotionDiv = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
      initial?: string;
      animate?: string;
      variants?: unknown;
    }
  >(({ children, initial, animate, variants, ...rest }, ref) => (
    <div
      ref={ref}
      data-testid="motion-div"
      data-initial={typeof initial === 'string' ? initial : ''}
      data-animate={typeof animate === 'string' ? animate : ''}
      data-variants={JSON.stringify(variants)}
      {...rest}
    >
      {children}
    </div>
  ));

  MockMotionDiv.displayName = 'MockMotionDiv';

  return {
    motion: {
      div: MockMotionDiv,
    },
    useInView: () => mockUseInView(),
    useMotionValue: () => ({ set: jest.fn() }),
    useSpring: (value: unknown) => value,
  };
});

jest.mock('../../../src/motion/hooks', () => ({
  useMotionScale: () => mockUseMotionScale(),
}));

describe('motion components', () => {
  beforeEach(() => {
    mockUseInView.mockReturnValue(false);
    mockUseMotionScale.mockReturnValue({ duration: 1, stagger: 1, tilt: 1 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds exit definitions to the shared entrance variants', () => {
    expect(fadeInUp).toMatchObject({
      exit: {
        opacity: 0,
        y: -16,
        transition: { duration: duration.fast, ease: easing.accel },
      },
    });

    expect(fadeIn).toMatchObject({
      exit: {
        opacity: 0,
        transition: { duration: duration.fast, ease: easing.accel },
      },
    });

    expect(scaleIn).toMatchObject({
      exit: {
        opacity: 0,
        scale: 0.96,
        transition: { duration: duration.fast, ease: easing.accel },
      },
    });
  });

  it('scales exit durations along with the rest of the variant set', () => {
    mockUseMotionScale.mockReturnValue({ duration: 0.5, stagger: 1, tilt: 1 });

    render(
      <MotionFadeIn once={false} exitOnLeave>
        content
      </MotionFadeIn>
    );

    const variants = JSON.parse(
      screen.getByTestId('motion-div').getAttribute('data-variants') ?? '{}'
    );
    expect(variants.visible.transition.duration).toBeCloseTo(duration.normal * 0.5);
    expect(variants.exit.transition.duration).toBeCloseTo(duration.fast * 0.5);
  });

  it('keeps the previous hidden reset behavior by default when a section leaves view', () => {
    let inView = false;
    mockUseInView.mockImplementation(() => inView);

    const { rerender } = render(<MotionSection once={false}>content</MotionSection>);

    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'hidden');

    inView = true;
    rerender(<MotionSection once={false}>content</MotionSection>);
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'visible');

    inView = false;
    rerender(<MotionSection once={false}>content</MotionSection>);
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'hidden');
  });

  it('uses the exit target after a section has been seen and leaves view when opted in', () => {
    let inView = false;
    mockUseInView.mockImplementation(() => inView);

    const { rerender } = render(
      <MotionSection once={false} exitOnLeave>
        content
      </MotionSection>
    );

    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'hidden');

    inView = true;
    rerender(
      <MotionSection once={false} exitOnLeave>
        content
      </MotionSection>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'visible');

    inView = false;
    rerender(
      <MotionSection once={false} exitOnLeave>
        content
      </MotionSection>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'exit');
  });

  it.each([
    ['MotionFadeIn', MotionFadeIn],
    ['MotionScaleIn', MotionScaleIn],
  ])('%s uses the exit target after first visibility', (_name, Component) => {
    let inView = false;
    mockUseInView.mockImplementation(() => inView);

    const { rerender } = render(
      <Component once={false} exitOnLeave>
        content
      </Component>
    );

    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'hidden');

    inView = true;
    rerender(
      <Component once={false} exitOnLeave>
        content
      </Component>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'visible');

    inView = false;
    rerender(
      <Component once={false} exitOnLeave>
        content
      </Component>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'exit');
  });

  it('propagates the exit target through stagger containers', () => {
    let inView = false;
    mockUseInView.mockImplementation(() => inView);

    const { rerender } = render(
      <StaggerChildren once={false} exitOnLeave>
        <div>content</div>
      </StaggerChildren>
    );

    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'hidden');

    inView = true;
    rerender(
      <StaggerChildren once={false} exitOnLeave>
        <div>content</div>
      </StaggerChildren>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'visible');

    inView = false;
    rerender(
      <StaggerChildren once={false} exitOnLeave>
        <div>content</div>
      </StaggerChildren>
    );
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'exit');
  });

  it('preserves explicit animate overrides for stagger containers', () => {
    render(
      <StaggerChildren once={false} exitOnLeave animate="visible">
        <div>content</div>
      </StaggerChildren>
    );

    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animate', 'visible');
  });

  it('renders plain content when motion is off', () => {
    mockUseMotionScale.mockReturnValue({ duration: 0, stagger: 0, tilt: 0 });

    render(
      <MotionFadeIn once={false} exitOnLeave>
        content
      </MotionFadeIn>
    );

    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
