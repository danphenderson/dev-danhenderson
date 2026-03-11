import { render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import CV from './CV';

jest.mock('../hooks/useGithubProfile', () => ({
  useGithubProfile: () => ({
    activity: [{ label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' }],
    projects: [{ name: 'portfolio-site', url: 'https://github.com/danphenderson/dev-danhenderson' }],
    contributions: [{ name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright', stars: 999 }],
    loading: false,
    error: null,
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
});
