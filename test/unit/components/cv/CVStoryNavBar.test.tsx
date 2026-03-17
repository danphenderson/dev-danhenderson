import type { ReactNode, CSSProperties, HTMLAttributes, Ref } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStoryNavBar } from '../../../../src/components/cv/CVStoryNavBar';
import type { CVStoryItem } from '../../../../src/data/cvStoryItems';

jest.mock('motion/react', () => {
  const React = require('react');

  return {
    motion: {
      div: React.forwardRef(
        (
          { children, ...rest }: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>,
          ref: Ref<HTMLDivElement>
        ) => (
          <div ref={ref} {...rest}>
            {children}
          </div>
        )
      ),
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

jest.mock('../../../../src/motion', () => ({
  MotionCard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const makeItem = (kind: CVStoryItem['kind']): CVStoryItem => {
  switch (kind) {
    case 'about':
      return {
        kind: 'about',
        data: {
          name: 'Dan',
          title: 'Engineer',
          email: 'dan@example.com',
          phone: '',
          location: 'Remote',
          bio: 'A short bio.',
        },
      };
    case 'experience':
      return {
        kind: 'experience',
        sortDate: new Date('2022-01-01'),
        data: {
          title: 'Engineer',
          company: 'ACME',
          startDate: 'Jan 2022',
          endDate: 'Present',
        },
      };
    case 'education':
      return {
        kind: 'education',
        sortDate: new Date('2018-01-01'),
        data: {
          university: 'State University',
          program: 'BS Computer Science',
          summary: 'Graduated with honors.',
        },
      };
    case 'certificate':
      return {
        kind: 'certificate',
        sortDate: new Date('2023-01-01'),
        data: { title: 'AWS SAA', issuer: 'Amazon', date: 'Jan 2023' },
      };
    case 'volunteering':
      return {
        kind: 'volunteering',
        sortDate: new Date('2020-01-01'),
        data: {
          role: 'Mentor',
          organization: 'Org',
          summary: 'Volunteered as a mentor.',
          dateRange: '2020',
          highlights: [],
        },
      };
    case 'coding':
      return {
        kind: 'coding',
        data: {
          title: 'MyProject',
          description: 'A cool project',
          links: ['https://github.com/example/project'],
        },
      };
  }
};

const KINDS: CVStoryItem['kind'][] = [
  'about',
  'experience',
  'education',
  'certificate',
  'volunteering',
  'coding',
];

const buildItems = (kinds: CVStoryItem['kind'][] = KINDS): CVStoryItem[] => kinds.map(makeItem);

const mockOnPrev = jest.fn();
const mockOnNext = jest.fn();
const mockOnJumpTo = jest.fn();

const renderNavBar = (currentIndex = 0, items = buildItems()) =>
  render(
    <ThemeProvider>
      <CVStoryNavBar
        items={items}
        currentIndex={currentIndex}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
        onJumpTo={mockOnJumpTo}
      />
    </ThemeProvider>
  );

describe('CVStoryNavBar', () => {
  beforeEach(() => {
    mockOnPrev.mockClear();
    mockOnNext.mockClear();
    mockOnJumpTo.mockClear();
  });

  it('renders one icon button per unique kind in the items list', () => {
    renderNavBar();
    KINDS.forEach((kind) => {
      expect(screen.getByLabelText(`Jump to ${kind}`)).toBeInTheDocument();
    });
  });

  it('only renders buttons for kinds present in the items list', () => {
    const items = buildItems(['about', 'experience']);
    renderNavBar(0, items);
    expect(screen.getByLabelText('Jump to about')).toBeInTheDocument();
    expect(screen.getByLabelText('Jump to experience')).toBeInTheDocument();
    expect(screen.queryByLabelText('Jump to education')).not.toBeInTheDocument();
  });

  it('calls onJumpTo with the index of the first item of that kind when a kind button is clicked', () => {
    renderNavBar(0);
    fireEvent.click(screen.getByLabelText('Jump to experience'));
    // 'experience' is at index 1 in the default KINDS order
    expect(mockOnJumpTo).toHaveBeenCalledWith(1);
  });

  it('displays the current counter as "<current + 1> / <total>"', () => {
    renderNavBar(2);
    expect(screen.getByText('3 / 6')).toBeInTheDocument();
  });

  it('Previous button is disabled when at the first item (index 0)', () => {
    renderNavBar(0);
    expect(screen.getByLabelText('Previous slide')).toBeDisabled();
  });

  it('Previous button is enabled when not at the first item', () => {
    renderNavBar(1);
    expect(screen.getByLabelText('Previous slide')).not.toBeDisabled();
  });

  it('Next button is disabled when at the last item', () => {
    const items = buildItems();
    renderNavBar(items.length - 1, items);
    expect(screen.getByLabelText('Next slide')).toBeDisabled();
  });

  it('Next button is enabled when not at the last item', () => {
    renderNavBar(0);
    expect(screen.getByLabelText('Next slide')).not.toBeDisabled();
  });

  it('calls onPrev when the Previous button is clicked', () => {
    renderNavBar(2);
    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when the Next button is clicked', () => {
    renderNavBar(0);
    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
