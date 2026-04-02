import { render, screen } from '@testing-library/react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import { aboutMe } from '../../../src/data/cv';
import CV from '../../../src/pages/CV';

jest.mock('@mui/material/useScrollTrigger', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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
  const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

  const renderCV = (initialEntries = ['/cv']) =>
    render(
      <MemoryRouter initialEntries={initialEntries} future={routerFuture}>
        <ThemeProvider>
          <CV />
        </ThemeProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockUseScrollTrigger.mockReturnValue(true);
  });

  it('renders the live CV tree with the accessible bio layer and mocked GitHub content', () => {
    const { container } = renderCV();

    const accessibleLayer = container.querySelector('[data-typewriter-layer="accessible"]');

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText(aboutMe.name)).toBeInTheDocument();
    expect(screen.getByText(aboutMe.title)).toBeInTheDocument();
    expect(accessibleLayer).not.toBeNull();
    expect(accessibleLayer).toHaveTextContent(
      'Software developer building scientific, data, and AI-enabled systems. Currently pursuing an M.S. in applied/computational mathematics, researching macrocirculatory hemodynamics, and contributing to open-source software. Previously built ingestion, analytics, and ML solutions for a healthcare data platform.'
    );
    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('microsoft/playwright')).toBeInTheDocument();
    expect(screen.getByTestId('github-calendar')).toBeInTheDocument();
  });
});
