import React from 'react';
import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedSlideList } from '../../../src/components/AnimatedSlideList';

const mockUseMotionScale = jest.fn(() => ({ duration: 1, stagger: 1, tilt: 1 }));

type MockSlideProps = {
  children: ReactNode;
  direction?: string;
  appear?: boolean;
  in?: boolean;
  container?: (() => Element | null) | Element;
  nodeRef?: React.RefObject<HTMLElement>;
};

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Slide: ({ children, direction, appear, in: inProp, container, nodeRef }: MockSlideProps) => (
      <div
        data-testid="slide-item"
        data-direction={direction}
        data-appear={String(appear ?? true)}
        data-in={String(inProp ?? true)}
        data-has-container={String(Boolean(container))}
        data-has-node-ref={String(Boolean(nodeRef))}
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

describe('AnimatedSlideList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseMotionScale.mockReturnValue({ duration: 1, stagger: 1, tilt: 1 });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    mockUseMotionScale.mockClear();
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
      expect(slide).toHaveAttribute('data-appear', 'true');
      expect(slide).toHaveAttribute('data-has-container', 'true');
      expect(slide).toHaveAttribute('data-has-node-ref', 'true');
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

  it('keeps an in-progress stagger running when rerendered with the same open items', () => {
    const items = ['React', 'TypeScript', 'MUI'];
    const { rerender } = render(
      <AnimatedSlideList
        items={items}
        getItemKey={(item) => item}
        in
        startDelayMs={40}
        layout="wrap"
        renderItem={(item) => <div>{item}</div>}
      />
    );

    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-in', 'false');
    });

    act(() => {
      jest.advanceTimersByTime(40);
    });

    expect(screen.getAllByTestId('slide-item')[0]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[1]).toHaveAttribute('data-in', 'false');
    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'false');

    rerender(
      <AnimatedSlideList
        items={[...items]}
        getItemKey={(item) => item}
        in
        startDelayMs={40}
        layout="wrap"
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('slide-item')[0]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[1]).toHaveAttribute('data-in', 'false');
    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(20);
    });

    expect(screen.getAllByTestId('slide-item')[1]).toHaveAttribute('data-in', 'true');
    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'false');

    act(() => {
      jest.advanceTimersByTime(20);
    });

    expect(screen.getAllByTestId('slide-item')[2]).toHaveAttribute('data-in', 'true');
  });

  it('renders plain list items without Slide transitions when motion is off', () => {
    mockUseMotionScale.mockReturnValue({ duration: 0, stagger: 0, tilt: 0 });

    render(
      <AnimatedSlideList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in={false}
        keepMountedWhenExited
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.queryByTestId('slide-item')).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
