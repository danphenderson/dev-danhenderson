import { render, screen } from '@testing-library/react';
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
  ProfileCard: ({ actions }: { actions?: ReactNode }) => (
    <div data-testid="profile-card">{actions}</div>
  ),
}));

describe('CVAboutSection', () => {
  it('forwards actions into the profile card, renders footer, and keeps section card motion props', () => {
    render(
      <ThemeProvider>
        <CVAboutSection
          about={{
            name: 'Dan',
            title: 'Engineer',
            bio: 'Bio',
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
