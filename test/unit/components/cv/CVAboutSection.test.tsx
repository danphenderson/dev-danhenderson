import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVAboutSection } from '../../../../src/components/cv/CVAboutSection';
import { cvSectionMetadata } from '../../../../src/components/cv/cvSectionMetadata';

jest.mock('../../../../src/components/cv/CVSectionCard', () => ({
  CVSectionCard: ({
    children,
    id,
    delayMs,
    triggerOnView,
  }: {
    children: ReactNode;
    id?: string;
    delayMs?: number;
    triggerOnView?: boolean;
  }) => (
    <div
      id={id}
      data-testid={id ? `section-card-${id}` : 'section-card'}
      data-delay-ms={delayMs ?? 0}
      data-trigger-on-view={String(triggerOnView ?? true)}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../../../src/components/cv/ProfileCard', () => ({
  ProfileCard: ({
    actions,
    onBioAnimationComplete,
  }: {
    actions?: ReactNode;
    onBioAnimationComplete?: () => void;
  }) => (
    <div data-testid="profile-card">
      {actions}
      <button type="button" onClick={onBioAnimationComplete}>
        Complete bio animation
      </button>
    </div>
  ),
}));

jest.mock('../../../../src/components/SkillsChipList', () => ({
  SkillsChipList: ({
    skills,
    in: inProp = true,
  }: {
    skills?: string[];
    in?: boolean;
  }) => {
    const label = skills?.join(', ') ?? '';
    const testIdByLabel: Record<string, 'opportunities-chip-list' | 'workflow-skills-chip-list'> = {
      'Scientific computing, Data platforms': 'opportunities-chip-list',
      'Distributed systems': 'opportunities-chip-list',
      'Python, React': 'workflow-skills-chip-list',
      Julia: 'workflow-skills-chip-list',
    };
    const testId = testIdByLabel[label] ?? 'workflow-skills-chip-list';

    return (
      <div data-testid={testId} data-in={String(inProp)}>
        {label}
      </div>
    );
  },
}));

jest.mock('../../../../src/components/text', () => {
  const actual = jest.requireActual('../../../../src/components/text');

  return {
    ...actual,
    SubsectionTitle: ({ children, sx }: { children: ReactNode; sx?: unknown }) => (
      <div data-testid="workflow-title" data-has-sx={String(Boolean(sx))}>
        {children}
      </div>
    ),
    TypewriterText: ({
      text,
      playing = true,
      onComplete,
    }: {
      text: string;
      playing?: boolean;
      onComplete?: () => void;
    }) => (
      <div data-testid={`typewriter-${text}`} data-playing={String(playing)}>
        <span>{text}</span>
        <button type="button" onClick={onComplete}>
          Complete {text}
        </button>
      </div>
    ),
  };
});

const currentWorkflowTypewriterTestId = 'typewriter-Current workflow:';

const getSkillsChipListByText = (text: string, testId: 'opportunities-chip-list' | 'workflow-skills-chip-list') => {
  const list = screen.getByText(text).closest(`[data-testid="${testId}"]`);

  if (!(list instanceof HTMLElement)) {
    throw new Error(`Missing skills chip list for "${text}".`);
  }

  return list;
};

const renderAboutSection = (overrides?: Partial<Parameters<typeof CVAboutSection>[0]>) =>
  render(
    <ThemeProvider>
      <CVAboutSection
        about={{
          name: 'Dan',
          title: 'Engineer',
          bio: 'Bio',
          opportunities: ['Scientific computing', 'Data platforms'],
          email: 'dan@example.com',
          phone: '',
          location: 'Seattle, WA',
          ...overrides?.about,
        }}
        actions={<div data-testid="about-actions">Actions</div>}
        currentWorkflowTools={['Python', 'React']}
        delayMs={120}
        triggerOnView={false}
        sectionId={cvSectionMetadata.about.id}
        {...overrides}
      />
    </ThemeProvider>
  );

describe('CVAboutSection', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('reveals opportunities after the bio completes, then starts the workflow heading and chips in sequence', () => {
    jest.useFakeTimers();

    renderAboutSection();

    const profileCard = screen.getByTestId('profile-card');

    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toContainElement(screen.getByTestId('about-actions'));
    expect(getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')).toHaveAttribute(
      'data-in',
      'false'
    );
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute('data-playing', 'false');
    expect(getSkillsChipListByText('Python, React', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')).toHaveAttribute(
      'data-in',
      'true'
    );
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute('data-playing', 'false');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute('data-playing', 'true');
    expect(screen.getByTestId('workflow-title')).toHaveAttribute('data-has-sx', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Complete Current workflow:' }));

    expect(getSkillsChipListByText('Python, React', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'true'
    );
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)).toHaveAttribute(
      'data-delay-ms',
      '120'
    );
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)).toHaveAttribute(
      'data-trigger-on-view',
      'false'
    );
  });

  it('starts the workflow heading immediately after the bio when there are no opportunities', () => {
    renderAboutSection({
      about: {
        name: 'Dan',
        title: 'Engineer',
        bio: 'Bio',
        opportunities: [],
        email: 'dan@example.com',
        phone: '',
        location: 'Seattle, WA',
      },
    });

    expect(screen.queryByText('Scientific computing, Data platforms')).not.toBeInTheDocument();
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute('data-playing', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute('data-playing', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Complete Current workflow:' }));

    expect(getSkillsChipListByText('Python, React', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'true'
    );
  });

  it('shows opportunities immediately when the bio is empty and resets reveal state when the content changes', () => {
    jest.useFakeTimers();

    const { rerender } = renderAboutSection({
      about: {
        name: 'Dan',
        title: 'Engineer',
        bio: '   ',
        opportunities: ['Scientific computing', 'Data platforms'],
        email: 'dan@example.com',
        phone: '',
        location: 'Seattle, WA',
      },
    });

    expect(getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')).toHaveAttribute(
      'data-in',
      'true'
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );

    rerender(
      <ThemeProvider>
        <CVAboutSection
          about={{
            name: 'Dan',
            title: 'Engineer',
            bio: 'Fresh bio',
            opportunities: ['Distributed systems'],
            email: 'dan@example.com',
            phone: '',
            location: 'Seattle, WA',
          }}
          actions={<div data-testid="about-actions">Actions</div>}
          currentWorkflowTools={['Julia']}
          delayMs={120}
          triggerOnView={false}
          sectionId={cvSectionMetadata.about.id}
        />
      </ThemeProvider>
    );

    expect(getSkillsChipListByText('Distributed systems', 'opportunities-chip-list')).toHaveAttribute(
      'data-in',
      'false'
    );
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );
    expect(getSkillsChipListByText('Julia', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'false'
    );
  });
});
