import type { ReactNode, HTMLAttributes, Ref } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
jest.mock('../../../../src/components/cv/CVStorySectionRenderer', () => ({
  CVStorySectionRenderer: ({ item, index }: { item: CVStoryItem; index: number }) => (
    <div data-testid="cv-story-section" data-kind={item.kind} data-index={index} />
  ),
}));

type MockIntersectionObserverInstance = IntersectionObserver & {
  observedTargets: Element[];
  trigger: (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;
};

const mockIntersectionObserverInstances: MockIntersectionObserverInstance[] = [];

const MockIntersectionObserver = function (
  this: MockIntersectionObserverInstance,
  callback: IntersectionObserverCallback
) {
  this.root = null;
  this.rootMargin = '';
  this.thresholds = [];
  this.observedTargets = [];
  this.observe = (target: Element) => {
    this.observedTargets.push(target);
  };
  this.unobserve = () => {};
  this.disconnect = () => {};
  this.takeRecords = () => [];
  this.trigger = (entries: Array<{ target: Element; isIntersecting: boolean }>) => {
    callback(entries as IntersectionObserverEntry[], this);
  };
  mockIntersectionObserverInstances.push(this);
} as unknown as {
  new (callback: IntersectionObserverCallback): MockIntersectionObserverInstance;
};

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

const getObservedTarget = (
  observer: MockIntersectionObserverInstance,
  index: number
): Element | undefined =>
  observer.observedTargets.find((target) => target.getAttribute('data-story-index') === `${index}`);

describe('CVStoryViewer', () => {
  let originalIntersectionObserver: typeof IntersectionObserver | undefined;

  beforeAll(() => {
    originalIntersectionObserver = window.IntersectionObserver;
  });

  beforeEach(() => {
    mockOnExit.mockClear();
    mockIntersectionObserverInstances.length = 0;

    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });

    Object.defineProperty(global, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: originalIntersectionObserver,
    });

    Object.defineProperty(global, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: originalIntersectionObserver,
    });
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

    const observer = mockIntersectionObserverInstances[0];
    const endTarget = getObservedTarget(observer, 4);

    expect(endTarget).toBeDefined();

    act(() => {
      observer.trigger([{ target: endTarget!, isIntersecting: true }]);
    });

    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('resolves the active kind from the full visible section set instead of entry order', () => {
    renderViewer();

    const observer = mockIntersectionObserverInstances[0];
    const experienceTarget = getObservedTarget(observer, 1);
    const codingTarget = getObservedTarget(observer, 3);

    expect(experienceTarget).toBeDefined();
    expect(codingTarget).toBeDefined();

    act(() => {
      observer.trigger([
        { target: experienceTarget!, isIntersecting: true },
        { target: codingTarget!, isIntersecting: true },
      ]);
    });

    expect(screen.getByText('Experience')).toBeInTheDocument();

    act(() => {
      observer.trigger([{ target: experienceTarget!, isIntersecting: false }]);
    });

    expect(screen.getByText('Project')).toBeInTheDocument();
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

  it('renders the progress bar with initial progress 0 and updates on scroll', () => {
    renderViewer();
    expect(screen.getByTestId('cv-story-progress')).toHaveAttribute('data-progress', '0');

    const firstSection = screen.getAllByTestId('cv-story-section')[0];
    const scrollContainer = firstSection.closest('[data-story-index]')
      ?.parentElement as HTMLDivElement;

    Object.defineProperty(scrollContainer, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollContainer, 'clientHeight', {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(scrollContainer, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 200,
    });

    fireEvent.scroll(scrollContainer);

    expect(screen.getByTestId('cv-story-progress')).toHaveAttribute('data-progress', '0.4');
  });

  it('renders with a single item without crashing', () => {
    expect(() => renderViewer([makeAboutItem()])).not.toThrow();
    const sections = screen.getAllByTestId('cv-story-section');
    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute('data-kind', 'about');
  });
});
