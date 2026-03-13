import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedZoomList } from './AnimatedZoomList';

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

jest.mock('../styles/componentStyles', () => ({
  useComponentStyles: () => ({
    motionTokens: {
      accordionChipStaggerMs: 20,
    },
    getSectionDelayMs: (index: number, startDelayMs = 0, staggerMs = 80) => startDelayMs + index * staggerMs,
  }),
}));

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

describe('AnimatedZoomList', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
  });

  it('uses the shared stagger token for animated zoom items', () => {
    setReducedMotionPreference(false);

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

  it('renders static items without zoom wrappers for reduced motion', () => {
    setReducedMotionPreference(true);

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
