import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedSlideList } from './AnimatedSlideList';

const mockGetAnimatedSlideItemSx = jest.fn((delayMs: number) => ({
  transitionDelay: `${delayMs}ms`,
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Slide: ({
      children,
      direction,
      appear,
      container,
    }: {
      children: ReactNode;
      direction?: string;
      appear?: boolean;
      container?: (() => Element | null) | Element;
    }) => (
      <div
        data-testid="slide-item"
        data-direction={direction}
        data-appear={String(appear ?? true)}
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
    getAnimatedSlideItemSx: mockGetAnimatedSlideItemSx,
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
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    mockGetAnimatedSlideItemSx.mockClear();
  });

  it('renders upward slides with the shared stagger token and container callback', () => {
    setReducedMotionPreference(false);

    render(
      <AnimatedSlideList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in
        startDelayMs={40}
        layout="wrap"
        container={() => document.body}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('slide-item')).toHaveLength(2);
    screen.getAllByTestId('slide-item').forEach((slide) => {
      expect(slide).toHaveAttribute('data-direction', 'up');
      expect(slide).toHaveAttribute('data-appear', 'false');
      expect(slide).toHaveAttribute('data-has-container', 'true');
    });
    expect(mockGetAnimatedSlideItemSx).toHaveBeenNthCalledWith(1, 40);
    expect(mockGetAnimatedSlideItemSx).toHaveBeenNthCalledWith(2, 60);
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
    expect(mockGetAnimatedSlideItemSx).not.toHaveBeenCalled();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
