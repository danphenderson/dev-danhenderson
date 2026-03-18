import React from 'react';
import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedSlideList } from '../../../src/components/AnimatedSlideList';

type MockSlideProps = {
  children: ReactNode;
  direction?: string;
  appear?: boolean;
  in?: boolean;
  container?: (() => Element | null) | Element;
};

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Slide: ({ children, direction, appear, in: inProp, container }: MockSlideProps) => (
      <div
        data-testid="slide-item"
        data-direction={direction}
        data-appear={String(appear ?? true)}
        data-in={String(inProp ?? true)}
        data-has-container={String(Boolean(container))}
      >
        {children}
      </div>
    ),
  };
});

jest.mock('../../../src/motion', () => ({
  ...jest.requireActual('../../../src/motion'),
  useMotionScale: () => ({ duration: 1, stagger: 1, tilt: 1 }),
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

describe('AnimatedSlideList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('enters slide items sequentially when selected and resets them when closed', () => {
    const { rerender } = render(
      <AnimatedSlideList
        items={['React', 'TypeScript', 'MUI']}
        getItemKey={(item) => item}
        in={false}
        startDelayMs={40}
        layout="wrap"
        container={() => document.body}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('slide-item')).toHaveLength(3);
    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'false');
      expect(slide).toHaveAttribute('data-direction', 'up');
      expect(slide).toHaveAttribute('data-appear', 'false');
      expect(slide).toHaveAttribute('data-has-container', 'true');
    });

    rerender(
      <AnimatedSlideList
        items={['React', 'TypeScript', 'MUI']}
        getItemKey={(item) => item}
        in
        startDelayMs={40}
        layout="wrap"
        container={() => document.body}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'false');
    });

    act(() => {
      jest.advanceTimersByTime(39);
    });

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'false');
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.getAllByTestId('slide-item')[0]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[1]).toHaveAttribute('data-in', 'false');
    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(20);
    });

    expect(screen.getAllByTestId('slide-item')[0]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[1]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(20);
    });

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'true');
    });

    rerender(
      <AnimatedSlideList
        items={['React', 'TypeScript', 'MUI']}
        getItemKey={(item) => item}
        in={false}
        startDelayMs={40}
        layout="wrap"
        container={() => document.body}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'false');
    });
  });
});
