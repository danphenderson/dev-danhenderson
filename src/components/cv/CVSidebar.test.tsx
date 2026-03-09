import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVSidebar } from './CVSidebar';

const mockCertificatesList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="certificates-list" />);
const mockCVGitHubSection = jest.fn((_: { itemOffsetMs?: number }) => <div data-testid="github-section" />);

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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

jest.mock('../ToolsAccordion', () => ({
  ToolsAccordion: () => <div data-testid="tools-accordion" />,
}));

describe('CVSidebar', () => {
  afterEach(() => {
    mockCertificatesList.mockClear();
    mockCVGitHubSection.mockClear();
  });

  it('passes the shared item offset to certificates and GitHub content', () => {
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
          resumeDownloadAction={<div>Download</div>}
          activity={[]}
          contributions={[]}
          projects={[]}
          loading={false}
          error={null}
          certificates={[]}
          stackAndTools={[]}
          itemOffsetMs={120}
        />
      </ThemeProvider>
    );

    expect(mockCertificatesList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockCVGitHubSection.mock.calls[0][0]).toEqual(expect.objectContaining({ itemOffsetMs: 120 }));
  });
});
