import React from 'react';
import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedSlideList } from '../../../src/components/AnimatedSlideList';

type MockSlideProps = {
  children: ReactNode;
  direction?: string;
  appear?: boolean;
  in?: boolean;
  timeout?: number | { appear?: number; enter?: number; exit?: number };
  container?: (() => Element | null) | Element;
};

const mockUseMotionScale = jest.fn(() => ({
  duration: 1,
  stagger: 1,
  tilt: 1,
  cssAnimations: true,
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Slide: (props: MockSlideProps) => (
      <div
        data-testid="slide-item"
        data-direction={props.direction}
        data-appear={String(props.appear ?? true)}
        data-in={String(props.in ?? true)}
        data-timeout={
          typeof props.timeout === 'number'
            ? String(props.timeout)
            : JSON.stringify(props.timeout ?? '')
        }
        data-has-container={String(Boolean(props.container))}
      >
        {props.children}
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

describe('AnimatedSlideList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseMotionScale.mockReturnValue({
      duration: 1,
      stagger: 1,
      tilt: 1,
      cssAnimations: true,
    });
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
      expect(slide).toHaveAttribute('data-timeout', '220');
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

  it('supports per-item slide directions', () => {
    render(
      <AnimatedSlideList
        items={['React', 'TypeScript', 'MUI']}
        getItemKey={(item) => item}
        in={false}
        getItemDirection={(_item, index) => (index % 2 === 0 ? 'right' : 'left')}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('slide-item').map((slide) => slide.getAttribute('data-direction'))).toEqual([
      'right',
      'left',
      'right',
    ]);
  });

  it('renders instantly when motion intensity is off', () => {
    mockUseMotionScale.mockReturnValue({
      duration: 0,
      stagger: 0,
      tilt: 0,
      cssAnimations: false,
    });

    render(
      <AnimatedSlideList
        items={['React', 'TypeScript', 'MUI']}
        getItemKey={(item) => item}
        in
        getItemDirection={(_item, index) => (index % 2 === 0 ? 'right' : 'left')}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'true');
      expect(slide).toHaveAttribute('data-timeout', '0');
    });
  });
});
