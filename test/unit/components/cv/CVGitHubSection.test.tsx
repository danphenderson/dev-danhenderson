import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVGitHubSection } from '../../../../src/components/cv/CVGitHubSection';

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: () => <div data-testid="github-calendar" />,
}));

jest.mock('../../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('CVGitHubSection', () => {
  it('renders GitHub activity, contributions, and the calendar without a projects block', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[
            { label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' },
          ]}
          contributions={[
            {
              name: 'microsoft/playwright',
              url: 'https://github.com/microsoft/playwright',
              stars: 999,
            },
          ]}
          loading={false}
          error={null}
          lead="Recent activity, open-source contributions, and contribution history from GitHub."
        />
      </ThemeProvider>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Recent activity, open-source contributions, and contribution history from GitHub.'
      )
    ).toBeVisible();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Contributions')).toBeInTheDocument();
    expect(screen.getByText('Contribution calendar')).toBeInTheDocument();
    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('microsoft/playwright')).toBeInTheDocument();
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    expect(screen.queryByText('Public Projects')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: 'Recent Activity' })).toBeVisible();
  });

  it('renders the section structure even when loading is true', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection activity={[]} contributions={[]} loading={true} error={null} />
      </ThemeProvider>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Contributions')).toBeInTheDocument();
  });

  it('renders the section without the lead text when lead prop is omitted', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[{ label: 'activity', href: '#' }]}
          contributions={[]}
          loading={false}
          error={null}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText(/activity.*contributions.*history/)).not.toBeInTheDocument();
  });
});
