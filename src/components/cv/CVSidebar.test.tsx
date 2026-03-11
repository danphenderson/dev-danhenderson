import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVSidebar } from './CVSidebar';
import { cvSectionMetadata } from './cvSectionMetadata';

const mockCertificatesList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="certificates-list" />);
const mockCVGitHubSection = jest.fn((_: { itemOffsetMs?: number }) => <div data-testid="github-section" />);
const mockStackAndToolsSection = jest.fn((_: { startDelayMs?: number }) => <div data-testid="stack-tools-section" />);
const renderedSectionCardIds: string[] = [];

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({ children, id }: { children: ReactNode; id?: string }) => {
    if (id) {
      renderedSectionCardIds.push(id);
    }

    return (
      <div data-testid={id ? `section-card-${id}` : 'section-card'} id={id}>
        {children}
      </div>
    );
  },
}));

jest.mock('./CertificatesList', () => ({
  CertificatesList: (props: { startDelayMs?: number }) => mockCertificatesList(props),
}));

jest.mock('./CVGitHubSection', () => ({
  CVGitHubSection: (props: { itemOffsetMs?: number }) => mockCVGitHubSection(props),
}));

jest.mock('./ProfileCard', () => ({
  ProfileCard: () => <div data-testid="profile-card" />,
}));

jest.mock('./StackAndToolsSection', () => ({
  StackAndToolsSection: (props: { startDelayMs?: number }) => mockStackAndToolsSection(props),
}));

describe('CVSidebar', () => {
  afterEach(() => {
    mockCertificatesList.mockClear();
    mockCVGitHubSection.mockClear();
    mockStackAndToolsSection.mockClear();
    renderedSectionCardIds.length = 0;
  });

  it('passes the shared item offset and section ids to the sidebar sections', () => {
    render(
      <ThemeProvider>
        <CVSidebar
          sections={['about', 'github', 'certificates', 'tools']}
          about={{
            name: 'Dan',
            title: 'Engineer',
            bio: 'Bio',
            email: 'dan@example.com',
            phone: '555-0100',
            location: 'Seattle, WA',
          }}
          aboutActions={<div data-testid="about-actions">Actions</div>}
          aboutFooter={<div data-testid="about-footer">Navigator</div>}
          activity={[]}
          contributions={[]}
          projects={[]}
          loading={false}
          error={null}
          certificates={[]}
          stackAndTools={[]}
          itemOffsetMs={120}
          sectionIds={{
            about: cvSectionMetadata.about.id,
            github: cvSectionMetadata.github.id,
            certificates: cvSectionMetadata.certificates.id,
            tools: cvSectionMetadata.tools.id,
          }}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('about-actions')).toBeInTheDocument();
    expect(screen.getByTestId('about-footer')).toBeInTheDocument();
    expect(renderedSectionCardIds).toEqual([
      cvSectionMetadata.about.id,
      cvSectionMetadata.certificates.id,
      cvSectionMetadata.tools.id,
    ]);
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.about.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.certificates.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.tools.id}`)).toBeInTheDocument();
    expect(mockCertificatesList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockCVGitHubSection.mock.calls[0][0]).toEqual(expect.objectContaining({
      itemOffsetMs: 120,
      sectionId: cvSectionMetadata.github.id,
    }));
    expect(mockStackAndToolsSection.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
  });
});
