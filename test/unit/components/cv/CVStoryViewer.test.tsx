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
            ...rest
          }: {
            children?: ReactNode;
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

// Stub the section renderer so we can identify items by kind
jest.mock('../../../../src/components/cv/CVStorySlideRenderer', () => ({
  CVStorySectionRenderer: ({ item, index }: { item: CVStoryItem; index: number }) => (
    <div data-testid="cv-story-section" data-kind={item.kind} data-index={index} />
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

const makeEndItem = (): CVStoryItem => ({
  kind: 'end',
  data: {
    headline: "Let's Connect",
    body: 'Thanks for reading.',
    channels: [{ label: 'Email', url: 'mailto:test@example.com', icon: 'email' as const }],
  },
});

const buildItems = (): CVStoryItem[] => [
  makeAboutItem(),
  makeExperienceItem('ACME'),
  makeExperienceItem('Beta'),
  makeCodingItem(),
  makeEndItem(),
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

  it('renders all items in the scrollable narrative', () => {
    renderViewer();
    const sections = screen.getAllByTestId('cv-story-section');
    expect(sections).toHaveLength(5);
    expect(sections[0]).toHaveAttribute('data-kind', 'about');
    expect(sections[1]).toHaveAttribute('data-kind', 'experience');
    expect(sections[4]).toHaveAttribute('data-kind', 'end');
  });

  it('shows the active kind label', () => {
    renderViewer();
    expect(screen.getByText('About')).toBeInTheDocument();
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

  it('renders the progress bar with initial progress 0', () => {
    renderViewer();
    expect(screen.getByTestId('cv-story-progress')).toHaveAttribute('data-progress', '0');
  });

  it('renders with a single item without crashing', () => {
    expect(() => renderViewer([makeAboutItem()])).not.toThrow();
    const sections = screen.getAllByTestId('cv-story-section');
    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute('data-kind', 'about');
  });
});
