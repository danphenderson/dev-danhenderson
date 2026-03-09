import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AnimatedZoomList } from './AnimatedZoomList';

const mockGetAnimatedZoomItemSx = jest.fn((delayMs: number) => ({
  transitionDelay: `${delayMs}ms`,
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      appear,
    }: {
      children: ReactNode;
      in: boolean;
      appear?: boolean;
    }) => (
      <div data-testid="zoom-item" data-in={String(inProp)} data-appear={String(appear ?? true)}>
        {children}
      </div>
    ),
  };
});

jest.mock('../styles/cvStyles', () => ({
  useCvStyles: () => ({
    motionTokens: {
      accordionChipStaggerMs: 20,
    },
    getSectionDelayMs: (index: number, startDelayMs = 0, staggerMs = 80) => startDelayMs + index * staggerMs,
    getAnimatedZoomItemSx: mockGetAnimatedZoomItemSx,
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
    mockGetAnimatedZoomItemSx.mockClear();
  });

  it('uses the shared stagger token for animated zoom items', () => {
    setReducedMotionPreference(false);

    render(
      <AnimatedZoomList
        items={['React', 'TypeScript']}
        getItemKey={(item) => item}
        in
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(screen.getAllByTestId('zoom-item')).toHaveLength(2);
    expect(screen.getAllByTestId('zoom-item')[0]).toHaveAttribute('data-appear', 'false');
    expect(mockGetAnimatedZoomItemSx).toHaveBeenNthCalledWith(1, 0);
    expect(mockGetAnimatedZoomItemSx).toHaveBeenNthCalledWith(2, 20);
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
    expect(mockGetAnimatedZoomItemSx).not.toHaveBeenCalled();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
