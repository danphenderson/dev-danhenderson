import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';

const mockScrollYProgress = { get: () => 0, on: () => () => {} };
const mockUseSpring = jest.fn((value: unknown) => value);

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    useScroll: () => ({
      scrollYProgress: mockScrollYProgress,
    }),
    useSpring: (...args: unknown[]) => mockUseSpring(...args),
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            style,
            ...rest
          }: { children?: ReactNode; style?: CSSProperties } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>
        ) => (
          <div ref={ref} style={style as CSSProperties} {...rest}>
            {children}
          </div>
        )
      ),
    },
  };
});

import { ScrollProgressBar } from '../../../src/components/ScrollProgressBar';

describe('ScrollProgressBar', () => {
  afterEach(() => {
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
});
