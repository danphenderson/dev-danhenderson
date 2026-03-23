import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { SkillsChipList } from '../../../src/components/SkillsChipList';

const mockAnimatedSlideList = jest.fn();
const mockUseControlledAnimatedList = jest.fn();

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({ children, in: inProp }: { children: React.ReactNode; in?: boolean }) => (
      <div data-testid="zoom-chip-item" data-in={String(inProp ?? true)}>
        {children}
      </div>
    ),
  };
});

jest.mock('../../../src/components/animatedListShared', () => ({
  useControlledAnimatedList: (options: {
    items: string[];
    getItemKey: (item: string, index: number) => string;
    in: boolean;
  }) => mockUseControlledAnimatedList(options),
}));

jest.mock('../../../src/components/AnimatedSlideList', () => ({
  AnimatedSlideList: (props: {
    items: string[];
    in: boolean;
    layout?: 'stack' | 'wrap';
    startDelayMs?: number;
    renderItem: (item: string, index: number) => React.ReactNode;
  }) => {
    mockAnimatedSlideList(props);

    return (
      <div data-testid="animated-slide-list" data-layout={props.layout ?? 'stack'}>
        {props.in ? props.items.map(props.renderItem) : null}
      </div>
    );
  },
}));

describe('SkillsChipList', () => {
  beforeEach(() => {
    mockUseControlledAnimatedList.mockImplementation(
      ({
        items,
        getItemKey,
      }: {
        items: string[];
        getItemKey: (item: string, index: number) => string;
      }) => ({
        durationFactor: 1,
        isMotionDisabled: false,
        itemEntries: items.map((item, index) => ({
          item,
          index,
          key: getItemKey(item, index),
          isEntered: true,
          nodeRef: { current: null },
        })),
        resolvedContainerSx: { display: 'flex', flexWrap: 'wrap' },
      })
    );
  });

  afterEach(() => {
    mockAnimatedSlideList.mockClear();
    mockUseControlledAnimatedList.mockClear();
  });

  it('uses the local zoom-specialized path by default', () => {
    const { rerender } = render(
      <ThemeProvider>
        <SkillsChipList skills={['React', 'TypeScript']} in={false} />
      </ThemeProvider>
    );

    expect(mockUseControlledAnimatedList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ in: false })
    );
    expect(mockAnimatedSlideList).not.toHaveBeenCalled();

    rerender(
      <ThemeProvider>
        <SkillsChipList skills={['React', 'TypeScript']} in />
      </ThemeProvider>
    );

    expect(mockUseControlledAnimatedList.mock.calls[1][0]).toEqual(
      expect.objectContaining({ in: true })
    );
    expect(screen.getAllByTestId('zoom-chip-item')).toHaveLength(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('uses the slide list in wrap mode for tab-drawer animation', () => {
    const drawerContainer = jest.fn(() => document.body);

    render(
      <ThemeProvider>
        <SkillsChipList
          skills={['React', 'TypeScript']}
          in
          animation="slide"
          drawerContainer={drawerContainer}
        />
      </ThemeProvider>
    );

    expect(mockUseControlledAnimatedList).not.toHaveBeenCalled();
    expect(mockAnimatedSlideList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ in: true, layout: 'wrap', container: drawerContainer })
    );
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-layout', 'wrap');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('forwards explicit start delays to slide animations', () => {
    render(
      <ThemeProvider>
        <SkillsChipList skills={['React', 'TypeScript']} in animation="slide" startDelayMs={480} />
      </ThemeProvider>
    );

    expect(mockAnimatedSlideList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ in: true, layout: 'wrap', startDelayMs: 480 })
    );
  });
});
