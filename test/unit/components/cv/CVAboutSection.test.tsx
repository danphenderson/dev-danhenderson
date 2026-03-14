import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  }) => (
    <div data-testid="opportunities-chip-list" data-in={String(inProp)}>
      {skills?.join(', ')}
    </div>
  ),
}));

describe('CVAboutSection', () => {
  it('forwards actions into the profile card, reveals opportunities after the bio completes, renders footer, and keeps section card motion props', async () => {
    const user = userEvent.setup();

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
          }}
          actions={<div data-testid="about-actions">Actions</div>}
          footer={<div data-testid="about-footer">Footer</div>}
          delayMs={120}
          triggerOnView={false}
          sectionId={cvSectionMetadata.about.id}
        />
      </ThemeProvider>
    );

    const profileCard = screen.getByTestId('profile-card');

    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toContainElement(screen.getByTestId('about-actions'));
    expect(screen.getByTestId('about-footer')).toBeInTheDocument();
    expect(screen.getByTestId('opportunities-chip-list')).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId('opportunities-chip-list')).toHaveTextContent(
      'Scientific computing, Data platforms'
    );

    await user.click(screen.getByRole('button', { name: 'Complete bio animation' }));

    expect(screen.getByTestId('opportunities-chip-list')).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)).toHaveAttribute(
      'data-delay-ms',
      '120'
    );
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)).toHaveAttribute(
      'data-trigger-on-view',
      'false'
    );
  });
});
