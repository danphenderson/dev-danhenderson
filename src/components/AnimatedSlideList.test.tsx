import React from 'react';
import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedSlideList } from './AnimatedSlideList';

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
    Slide: ({
      children,
      direction,
      appear,
      in: inProp,
      container,
    }: MockSlideProps) => (
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

describe('AnimatedSlideList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    window.matchMedia = defaultMatchMedia;
  });

  it('enters slide items sequentially when selected and resets them when closed', () => {
    setReducedMotionPreference(false);

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

  it('renders static items without slide wrappers under reduced motion', () => {
    setReducedMotionPreference(true);

    render(
      <AnimatedSlideList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in
        containerComponent="ul"
        itemComponent="li"
        renderItem={(item) => <span>{item}</span>}
      />
    );

    expect(screen.queryByTestId('slide-item')).not.toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders nothing under reduced motion when inactive', () => {
    setReducedMotionPreference(true);

    const { container } = render(
      <AnimatedSlideList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in={false}
        renderItem={(item) => <span>{item}</span>}
      />
    );

    expect(container.innerHTML).toBe('');
  });
});
