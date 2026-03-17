import type { ReactNode, HTMLAttributes, Ref } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStoryViewer } from '../../../../src/components/cv/CVStoryViewer';
import type { CVStoryItem } from '../../../../src/data/cvStoryItems';

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            drag,
            dragConstraints,
            dragElastic,
            dragDirectionLock,
            onDragEnd,
            ...rest
          }: {
            children?: ReactNode;
            drag?: string;
            dragConstraints?: unknown;
            dragElastic?: number;
            dragDirectionLock?: boolean;
            onDragEnd?: unknown;
          } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>
        ) => (
          <div ref={ref} {...rest}>
            {children}
          </div>
        )
      ),
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    useMotionValue: () => ({ get: () => 0, on: () => () => {} }),
  };
});

// Stub sub-components that use motion internally
jest.mock('../../../../src/components/cv/CVStoryProgress', () => ({
  CVStoryProgress: ({ progress }: { progress: number }) => (
    <div data-testid="cv-story-progress" data-progress={progress} />
  ),
}));

jest.mock('../../../../src/components/cv/CVStoryNavBar', () => ({
  CVStoryNavBar: ({
    currentIndex,
    onPrev,
    onNext,
    onJumpTo,
  }: {
    items: CVStoryItem[];
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onJumpTo: (index: number) => void;
  }) => (
    <div data-testid="cv-story-nav-bar" data-current-index={currentIndex}>
      <button type="button" aria-label="Prev" onClick={onPrev}>
        Prev
      </button>
      <button type="button" aria-label="Next" onClick={onNext}>
        Next
      </button>
      <button type="button" aria-label="JumpTo2" onClick={() => onJumpTo(2)}>
        Jump to 2
      </button>
    </div>
  ),
}));

// Stub the slide renderer so we can identify the current item by kind
jest.mock('../../../../src/components/cv/CVStorySlideRenderer', () => ({
  CVStorySlideRenderer: ({ item }: { item: CVStoryItem }) => (
    <div data-testid="cv-story-slide" data-kind={item.kind} />
  ),
}));

const makeAboutItem = (): CVStoryItem => ({
  kind: 'about',
  data: {
    name: 'Dan',
    title: 'Engineer',
    email: 'dan@example.com',
    phone: '',
    location: 'Remote',
    bio: 'Bio text.',
  },
});

const makeExperienceItem = (label = 'ACME'): CVStoryItem => ({
  kind: 'experience',
  sortDate: new Date('2022-01-01'),
  data: { title: label, company: label, startDate: '2022', endDate: 'Present' },
});

const makeCodingItem = (): CVStoryItem => ({
  kind: 'coding',
  data: { title: 'Project', description: 'Desc', links: [] },
});

const buildItems = (): CVStoryItem[] => [
  makeAboutItem(),
  makeExperienceItem('ACME'),
  makeExperienceItem('Beta'),
  makeCodingItem(),
];

const mockOnExit = jest.fn();

const renderViewer = (items = buildItems()) =>
  render(
    <ThemeProvider>
      <CVStoryViewer items={items} onExit={mockOnExit} />
    </ThemeProvider>
  );

describe('CVStoryViewer', () => {
  beforeEach(() => {
    mockOnExit.mockClear();
  });

  it('renders the first item on mount (index 0)', () => {
    renderViewer();
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'about');
  });

  it('shows the kind label for the current item', () => {
    renderViewer();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('advances to the next item on ArrowRight', () => {
    renderViewer();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'experience');
  });

  it('advances to the next item on ArrowDown', () => {
    renderViewer();
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'experience');
  });

  it('does not retreat past the first item on ArrowLeft', () => {
    renderViewer();
    fireEvent.keyDown(window, { key: 'ArrowLeft' }); // should be no-op at index 0
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'about');
  });

  it('retreats to the previous item on ArrowLeft after advancing', () => {
    renderViewer();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'about');
  });

  it('calls onExit when Escape is pressed', () => {
    renderViewer();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('calls onExit when the close button is clicked', () => {
    renderViewer();
    fireEvent.click(screen.getByLabelText('Exit story mode'));
    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('updates the progress bar as items advance', () => {
    renderViewer(buildItems());
    const items = buildItems();
    const totalItems = items.length;

    // Initially at index 0: progress = 1 / totalItems
    expect(screen.getByTestId('cv-story-progress')).toHaveAttribute(
      'data-progress',
      String(1 / totalItems)
    );

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByTestId('cv-story-progress')).toHaveAttribute(
      'data-progress',
      String(2 / totalItems)
    );
  });

  it('passes the current index to the nav bar', () => {
    renderViewer();
    expect(screen.getByTestId('cv-story-nav-bar')).toHaveAttribute('data-current-index', '0');
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('cv-story-nav-bar')).toHaveAttribute('data-current-index', '1');
  });

  it('jumps to a specific index via onJumpTo from the nav bar', () => {
    renderViewer();
    fireEvent.click(screen.getByLabelText('JumpTo2'));
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'experience');
  });

  it('does not advance past the last item on ArrowRight', () => {
    const items = buildItems();
    renderViewer(items);
    // Advance to last item
    for (let i = 0; i < items.length - 1; i++) {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    }
    // Try to advance past last
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'coding');
  });

  it('renders with a single item without crashing', () => {
    expect(() => renderViewer([makeAboutItem()])).not.toThrow();
    expect(screen.getByTestId('cv-story-slide')).toHaveAttribute('data-kind', 'about');
  });
});
