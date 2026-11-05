import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider, { useAppTheme } from '../../../../src/ThemeProvider';
import { CVAboutSection } from '../../../../src/components/cv/CVAboutSection';
import { cvSectionMetadata } from '../../../../src/components/cv/cvSectionMetadata';

let mockReducedMotion = false;

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockReducedMotion,
}));

jest.mock('../../../../src/motion', () => {
  const actual = jest.requireActual('../../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({
      children,
      intensity,
      disabled,
    }: {
      children: ReactNode;
      intensity?: number;
      disabled?: boolean;
    }) => (
      <div
        data-testid="cv-about-tilt-card"
        data-intensity={String(intensity ?? '')}
        data-disabled={String(Boolean(disabled))}
      >
        {children}
      </div>
    ),
  };
});

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
    bioRevealed,
    onBioAnimationComplete,
  }: {
    actions?: ReactNode;
    bioRevealed?: boolean;
    onBioAnimationComplete?: () => void;
  }) => (
    <div data-testid="profile-card" data-bio-revealed={String(Boolean(bioRevealed))}>
      {actions}
      <button type="button" onClick={onBioAnimationComplete}>
        Complete bio animation
      </button>
    </div>
  ),
}));

jest.mock('../../../../src/components/SkillsChipList', () => ({
  SkillsChipList: ({ skills, in: inProp = true }: { skills?: string[]; in?: boolean }) => {
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

const currentWorkflowTypewriterTestId = 'typewriter-Stack:';
const opportunitiesTypewriterTestId = 'typewriter-Open to opportunities:';

const MotionControls = () => {
  const { setMotionIntensity } = useAppTheme();
  return (
    <>
      <button onClick={() => setMotionIntensity('off')}>Disable motion</button>
      <button onClick={() => setMotionIntensity('default')}>Enable motion</button>
    </>
  );
};

const getSkillsChipListByText = (
  text: string,
  testId: 'opportunities-chip-list' | 'workflow-skills-chip-list'
) => {
  const list = screen.getByText(text).closest(`[data-testid="${testId}"]`);

  if (!(list instanceof HTMLElement)) {
    throw new Error(`Missing skills chip list for "${text}".`);
  }

  return list;
};

const renderAboutSection = (overrides?: Partial<Parameters<typeof CVAboutSection>[0]>) =>
  render(
    <ThemeProvider>
      <MotionControls />
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
    localStorage.clear();
    mockReducedMotion = false;
  });

  it.each([
    ['off', false],
    ['default', true],
  ] as const)(
    'reveals all About content immediately for motion %s and reduced motion %s',
    (level, reduced) => {
      jest.useFakeTimers();
      localStorage.setItem('danhenderson-motion', level);
      mockReducedMotion = reduced;
      const onRevealComplete = jest.fn();

      renderAboutSection({ onRevealComplete });

      expect(screen.getByTestId('profile-card')).toHaveAttribute('data-bio-revealed', 'true');
      expect(screen.queryByTestId(opportunitiesTypewriterTestId)).not.toBeInTheDocument();
      expect(screen.queryByTestId(currentWorkflowTypewriterTestId)).not.toBeInTheDocument();
      expect(screen.getByTestId('opportunities-chip-list')).toHaveAttribute('data-in', 'true');
      expect(screen.getByTestId('workflow-skills-chip-list')).toHaveAttribute('data-in', 'true');
      expect(onRevealComplete).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    }
  );

  it('cancels a pending workflow reveal when motion is disabled and completes only once', () => {
    jest.useFakeTimers();
    const onRevealComplete = jest.fn();
    renderAboutSection({ onRevealComplete });
    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete Open to opportunities:' }));
    expect(jest.getTimerCount()).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Disable motion' }));

    expect(screen.getByTestId('workflow-skills-chip-list')).toHaveAttribute('data-in', 'true');
    expect(onRevealComplete).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
    act(() => jest.runOnlyPendingTimers());
    expect(onRevealComplete).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Enable motion' }));
    expect(screen.getByTestId('profile-card')).toHaveAttribute('data-bio-revealed', 'true');
    expect(screen.queryByTestId(opportunitiesTypewriterTestId)).not.toBeInTheDocument();
    expect(screen.queryByTestId(currentWorkflowTypewriterTestId)).not.toBeInTheDocument();
    expect(onRevealComplete).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('scales the workflow wait with subtle motion', () => {
    jest.useFakeTimers();
    localStorage.setItem('danhenderson-motion', 'subtle');
    renderAboutSection();
    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete Open to opportunities:' }));

    act(() => jest.advanceTimersByTime(179));
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );
    act(() => jest.advanceTimersByTime(1));
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );
  });

  it('renders the About section inside a MotionTiltCard with the configured intensity', () => {
    renderAboutSection();

    const tiltCard = screen.getByTestId('cv-about-tilt-card');

    expect(tiltCard).toHaveAttribute('data-intensity', '0.5');
    expect(tiltCard).toContainElement(
      screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)
    );
  });

  it('reveals opportunities after the bio completes, then starts the workflow heading and chips in sequence', () => {
    jest.useFakeTimers();

    renderAboutSection();

    const profileCard = screen.getByTestId('profile-card');

    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toContainElement(screen.getByTestId('about-actions'));
    expect(
      getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );
    expect(getSkillsChipListByText('Python, React', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId(opportunitiesTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );
    expect(
      getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete Open to opportunities:' }));

    expect(
      getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );
    expect(screen.getByText('Stack:')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Complete Stack:' }));

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
    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId(currentWorkflowTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete Stack:' }));

    expect(getSkillsChipListByText('Python, React', 'workflow-skills-chip-list')).toHaveAttribute(
      'data-in',
      'true'
    );
  });

  it('renders footer controls in a left-aligned footer row', () => {
    renderAboutSection({ footerControls: <div data-testid="about-footer-controls">Footer</div> });

    const footerRow = screen.getByTestId('about-footer-controls').parentElement;

    expect(footerRow).not.toBeNull();
    expect(footerRow).toHaveStyle({ justifyContent: 'flex-start', width: '100%' });
  });

  it('starts the opportunities heading immediately when the bio is empty and resets reveal state when the content changes', () => {
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

    expect(screen.getByTestId(opportunitiesTypewriterTestId)).toHaveAttribute(
      'data-playing',
      'true'
    );
    expect(
      getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Complete Open to opportunities:' }));

    expect(
      getSkillsChipListByText('Scientific computing, Data platforms', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'true');

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

    expect(
      getSkillsChipListByText('Distributed systems', 'opportunities-chip-list')
    ).toHaveAttribute('data-in', 'false');
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
