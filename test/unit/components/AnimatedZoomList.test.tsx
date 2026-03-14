import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedZoomList } from '../../../src/components/AnimatedZoomList';

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
});
