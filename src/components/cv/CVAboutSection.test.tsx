import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVAboutSection } from './CVAboutSection';
import { cvSectionMetadata } from './cvSectionMetadata';

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({
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

jest.mock('./ProfileCard', () => ({
  ProfileCard: () => <div data-testid="profile-card" />,
}));

describe('CVAboutSection', () => {
  it('renders profile content, actions, footer, and section card motion props', () => {
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

    expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    expect(screen.getByTestId('about-actions')).toBeInTheDocument();
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
