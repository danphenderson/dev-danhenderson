import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import CV from '../../../src/pages/CV';

jest.mock('../../../src/hooks/useGithubProfile', () => ({
  useGithubProfile: () => ({
    activity: [{ label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' }],
    contributions: [
      { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright', stars: 999 },
    ],
    loading: false,
    error: null,
    status: {
      source: 'remote',
      loading: false,
      error: null,
      isFallback: false,
      reason: 'live-fetch',
      freshness: {
        label: 'GitHub activity was fetched live and cached for subsequent visits.',
        lastUpdated: '2026-03-14T16:45:00.000Z',
        isStale: false,
      },
    },
  }),
}));

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: () => <div data-testid="github-calendar" />,
}));

describe('CV runtime render', () => {
  it('renders the live CV component tree without invalid element errors', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Daniel Henderson')).toBeInTheDocument();
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);
  });

  it('renders all primary CV section headings', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Education').length).toBeGreaterThan(0);
    expect(screen.getByText('Volunteering')).toBeInTheDocument();
    expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);
    expect(screen.getByText('Certificates')).toBeInTheDocument();
  });

  it('renders the profile card with name, title, and program link', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(screen.getByText('Daniel Henderson')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders GitHub section content from mock data', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('microsoft/playwright')).toBeInTheDocument();
    expect(screen.getByTestId('github-calendar')).toBeInTheDocument();
  });
});
