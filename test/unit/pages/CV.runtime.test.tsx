import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import { aboutMe } from '../../../src/data/cv';
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
  const renderCV = (initialEntries = ['/cv']) =>
    render(
      <MemoryRouter initialEntries={initialEntries} future={routerFuture}>
        <ThemeProvider>
          <CV />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('renders the live CV component tree without invalid element errors', () => {
    renderCV();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText(aboutMe.name)).toBeInTheDocument();
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);
  });

  it('renders all primary CV section headings', () => {
    renderCV();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Education').length).toBeGreaterThan(0);
    expect(screen.getByText('Volunteering')).toBeInTheDocument();
    expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);
    expect(screen.getByText('Certificates')).toBeInTheDocument();
  });

  it('renders the profile card with name, title, and program link', () => {
    renderCV();

    expect(screen.getByText(aboutMe.name)).toBeInTheDocument();
    expect(screen.getByText(aboutMe.title)).toBeInTheDocument();
  });

  it('renders the updated about bio copy', () => {
    const { container } = renderCV();

    const accessibleLayer = container.querySelector('[data-typewriter-layer="accessible"]');

    expect(accessibleLayer).not.toBeNull();
    expect(accessibleLayer).toHaveTextContent(
      'Software developer building scientific, data, and AI-enabled systems. Currently pursuing an M.S. in applied/computational mathematics, researching macrocirculatory hemodynamics, and contributing to open-source software. I previously built ingestion, analytics, and ML solutions for a healthcare data platform.'
    );
  });

  it('renders GitHub section content from mock data', () => {
    renderCV();

    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('microsoft/playwright')).toBeInTheDocument();
    expect(screen.getByTestId('github-calendar')).toBeInTheDocument();
  });
});
