import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { SkillsChipList } from '../../../src/components/SkillsChipList';

const mockAnimatedZoomList = jest.fn();
const mockAnimatedSlideList = jest.fn();

jest.mock('../../../src/components/AnimatedZoomList', () => ({
  AnimatedZoomList: (props: {
    items: string[];
    in: boolean;
    startDelayMs?: number;
    renderItem: (item: string, index: number) => React.ReactNode;
  }) => {
    mockAnimatedZoomList(props);

    return <div data-testid="animated-zoom-list">{props.items.map(props.renderItem)}</div>;
  },
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
  afterEach(() => {
    mockAnimatedZoomList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('uses the zoom list by default', () => {
    const { rerender } = render(
      <ThemeProvider>
        <SkillsChipList skills={['React', 'TypeScript']} in={false} />
      </ThemeProvider>
    );

    expect(mockAnimatedZoomList.mock.calls[0][0]).toEqual(expect.objectContaining({ in: false }));
    expect(mockAnimatedSlideList).not.toHaveBeenCalled();

    rerender(
      <ThemeProvider>
        <SkillsChipList skills={['React', 'TypeScript']} in />
      </ThemeProvider>
    );

    expect(mockAnimatedZoomList.mock.calls[1][0]).toEqual(expect.objectContaining({ in: true }));
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

    expect(mockAnimatedZoomList).not.toHaveBeenCalled();
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
