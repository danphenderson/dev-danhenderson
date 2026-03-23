import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { ScrollProgressBar } from '../../../src/components/ScrollProgressBar';

const mockScrollYProgress = { get: () => 0, on: () => () => {} };
const mockSpringScaleX = { get: () => 0.25, on: () => () => {} };
const mockUseSpring = jest.fn((_value: unknown, _config?: unknown) => mockSpringScaleX);
let mockDuration = 1;

jest.mock('../../../src/motion', () => ({
  ...jest.requireActual('../../../src/motion'),
  useMotionScale: () => ({ duration: mockDuration, stagger: 1, tilt: 1, cssAnimations: true }),
}));

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    useReducedMotion: () => false,
    useScroll: () => ({
      scrollYProgress: mockScrollYProgress,
    }),
    useSpring: (source: unknown, config?: unknown) => mockUseSpring(source, config),
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            style,
            ...rest
          }: {
            children?: ReactNode;
            style?: CSSProperties & { scaleX?: unknown };
          } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>
        ) => (
          <div
            ref={ref}
            data-scale-source={
              style?.scaleX === mockScrollYProgress
                ? 'scroll'
                : style?.scaleX === mockSpringScaleX
                  ? 'spring'
                  : 'unknown'
            }
            style={style as CSSProperties}
            {...rest}
          >
            {children}
          </div>
        )
      ),
    },
  };
});

describe('ScrollProgressBar', () => {
  afterEach(() => {
    mockDuration = 1;
    jest.clearAllMocks();
  });

  it('renders a fixed-position progress bar', () => {
    render(
      <ThemeProvider>
        <ScrollProgressBar />
      </ThemeProvider>
    );

    const bar = screen.getByTestId('scroll-progress-bar');
    expect(bar).toBeInTheDocument();
    expect(bar.style.position).toBe('fixed');
    expect(bar.style.top).toBe('0px');
    expect(bar.style.pointerEvents).toBe('none');
  });

  it('passes scrollYProgress through useSpring to scaleX style', () => {
    render(
      <ThemeProvider>
        <ScrollProgressBar />
      </ThemeProvider>
    );

    // useSpring was called with the scrollYProgress motion value and spring config
    expect(mockUseSpring).toHaveBeenCalledWith(
      mockScrollYProgress,
      expect.objectContaining({ stiffness: 120, damping: 28 })
    );
  });

  it('binds directly to scrollYProgress and bypasses useSpring when motion is off', () => {
    mockDuration = 0;

    render(
      <ThemeProvider>
        <ScrollProgressBar />
      </ThemeProvider>
    );

    expect(mockUseSpring).not.toHaveBeenCalled();
    expect(screen.getByTestId('scroll-progress-bar')).toHaveAttribute(
      'data-scale-source',
      'scroll'
    );
  });
});
