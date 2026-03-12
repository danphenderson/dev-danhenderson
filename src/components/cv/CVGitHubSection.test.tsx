import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVGitHubSection } from './CVGitHubSection';

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: () => <div data-testid="github-calendar" />,
}));

jest.mock('../AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('CVGitHubSection', () => {
  it('renders GitHub activity, contributions, calendar, and projects', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[{ label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' }]}
          contributions={[{ name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright', stars: 999 }]}
          projects={[{ name: 'portfolio-site', url: 'https://github.com/danphenderson/dev-danhenderson' }]}
          loading={false}
          error={null}
          lead="Recent activity, open-source contributions, and public repositories from GitHub."
        />
      </ThemeProvider>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(
      screen.getByText('Recent activity, open-source contributions, and public repositories from GitHub.')
    ).toBeVisible();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Contributions')).toBeInTheDocument();
    expect(screen.getByText('Contribution calendar')).toBeInTheDocument();
    expect(screen.getByText('Public Projects')).toBeInTheDocument();
    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('microsoft/playwright')).toBeInTheDocument();
    expect(screen.getByText('portfolio-site')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity').tagName).toBe('H6');
    expect(screen.getByText('Recent Activity')).toHaveClass('MuiTypography-subtitle2');
  });
});
