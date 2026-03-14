import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVAboutSection } from '../../../../src/components/cv/CVAboutSection';
import { cvSectionMetadata } from '../../../../src/components/cv/cvSectionMetadata';

let mockPrefersReducedMotion = false;

jest.mock('../../../../src/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockPrefersReducedMotion,
}));

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
  }) => (
    <div data-testid={`skills-chip-list-${skills?.join('|') ?? 'empty'}`} data-in={String(inProp)}>
      {skills?.join(', ')}
    </div>
  ),
}));

jest.mock('../../../../src/components/text', () => ({
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
}));

const opportunitiesTestId = 'skills-chip-list-Scientific computing|Data platforms';
const workflowToolsTestId = 'skills-chip-list-Python|React';
const workflowHeadingTestId = 'typewriter-Current workflow:';

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
  beforeEach(() => {
    mockPrefersReducedMotion = false;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reveals opportunities after the bio completes, then starts the workflow heading and chips in sequence', () => {
    jest.useFakeTimers();

    renderAboutSection();

    const profileCard = screen.getByTestId('profile-card');

    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toContainElement(screen.getByTestId('about-actions'));
    expect(screen.getByTestId(opportunitiesTestId)).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'false');
    expect(screen.getByTestId(workflowToolsTestId)).toHaveAttribute('data-in', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId(opportunitiesTestId)).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'false');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'true');
    expect(screen.getByTestId(workflow-title)).toHaveAttribute('data-has-sx', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Complete Current workflow:' }));

    expect(screen.getByTestId(workflowToolsTestId)).toHaveAttribute('data-in', 'true');
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

    expect(screen.queryByTestId(opportunitiesTestId)).not.toBeInTheDocument();
    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Complete Current workflow:' }));

    expect(screen.getByTestId(workflowToolsTestId)).toHaveAttribute('data-in', 'true');
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

    expect(screen.getByTestId(opportunitiesTestId)).toHaveAttribute('data-in', 'true');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId(workflowHeadingTestId)).toHaveAttribute('data-playing', 'true');

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

    expect(screen.getByTestId('skills-chip-list-Distributed systems')).toHaveAttribute(
      'data-in',
      'false'
    );
    expect(screen.getByTestId('typewriter-Current workflow:')).toHaveAttribute(
      'data-playing',
      'false'
    );
    expect(screen.getByTestId('skills-chip-list-Julia')).toHaveAttribute('data-in', 'false');
  });
});
