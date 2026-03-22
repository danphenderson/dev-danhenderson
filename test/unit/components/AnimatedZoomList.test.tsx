import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedZoomList } from '../../../src/components/AnimatedZoomList';

const mockUseMotionScale = jest.fn(() => ({ duration: 1, stagger: 1, tilt: 1 }));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      appear,
      style,
    }: {
      children: ReactNode;
      in: boolean;
      appear?: boolean;
      style?: React.CSSProperties;
    }) => (
      <div
        data-testid="zoom-item"
        data-in={String(inProp)}
        data-appear={String(appear ?? true)}
        data-transition-delay={style?.transitionDelay ?? ''}
      >
        {children}
      </div>
    ),
  };
});

jest.mock('../../../src/motion', () => ({
  ...jest.requireActual('../../../src/motion'),
  useMotionScale: () => mockUseMotionScale(),
}));

jest.mock('../../../src/styles/componentStyles', () => ({
  useComponentStyles: () => ({
    motionTokens: {
      itemStaggerMs: 20,
    },
    getSectionDelayMs: (index: number, startDelayMs = 0, staggerMs = 80) =>
      startDelayMs + index * staggerMs,
  }),
}));

describe('AnimatedZoomList', () => {
  beforeEach(() => {
    mockUseMotionScale.mockReturnValue({ duration: 1, stagger: 1, tilt: 1 });
  });

  it('uses the shared stagger token for animated zoom items', () => {
    render(
      <AnimatedZoomList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in
        startDelayMs={40}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('zoom-item')).toHaveLength(2);
    expect(screen.getAllByTestId('zoom-item')[0]).toHaveAttribute('data-appear', 'false');
    expect(screen.getAllByTestId('zoom-item')[0]).toHaveAttribute('data-transition-delay', '40ms');
    expect(screen.getAllByTestId('zoom-item')[1]).toHaveAttribute('data-transition-delay', '60ms');
  });

  it('renders items without MUI Zoom when motion is off', () => {
    mockUseMotionScale.mockReturnValue({ duration: 0, stagger: 0, tilt: 0 });

    render(
      <AnimatedZoomList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.queryByTestId('zoom-item')).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
