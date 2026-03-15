import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    useScroll: () => ({
      scrollYProgress: { get: () => 0, on: () => () => {} },
    }),
    useSpring: (value: unknown) => value,
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            style,
            ...rest
          }: { children?: ReactNode; style?: CSSProperties } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>,
        ) => (
          <div ref={ref} style={style as CSSProperties} {...rest}>
            {children}
          </div>
        ),
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
      </ThemeProvider>,
    );

    const bar = screen.getByTestId('scroll-progress-bar');
    expect(bar).toBeInTheDocument();
    expect(bar.style.position).toBe('fixed');
    expect(bar.style.top).toBe('0px');
    expect(bar.style.pointerEvents).toBe('none');
  });
});
