import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVGitHubSection } from '../../../../src/components/cv/CVGitHubSection';

const liveGitHubStatus = {
  source: 'remote' as const,
  loading: false,
  error: null,
  isFallback: false,
  reason: 'live-fetch' as const,
  freshness: {
    label: 'GitHub activity was fetched live and cached for subsequent visits.',
    lastUpdated: '2026-03-14T16:45:00.000Z',
    isStale: false,
  },
};

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
          status={liveGitHubStatus}
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
    expect(screen.getByText('Recent Activity').tagName).toBe('H6');
    expect(screen.getByText('Recent Activity')).toHaveClass('MuiTypography-subtitle2');
    expect(screen.getByText('Data status')).toBeInTheDocument();
    expect(
      screen.getByText('Showing live GitHub activity from the latest successful fetch.')
    ).toBeVisible();
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
    expect(screen.getByText('Data status')).toBeInTheDocument();
  });

  it('renders the section without the lead text when lead prop is omitted', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[{ label: 'activity', href: '#' }]}
          contributions={[]}
          loading={false}
          error={null}
          status={liveGitHubStatus}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText(/activity.*contributions.*history/)).not.toBeInTheDocument();
  });

  it('surfaces fallback provenance copy when GitHub data is using bundled highlights', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[{ label: 'activity', href: '#' }]}
          contributions={[]}
          loading={false}
          error="Unable to load GitHub activity right now. Showing recent highlights instead."
          status={{
            source: 'cache',
            loading: false,
            error: 'Unable to load GitHub activity right now. Showing recent highlights instead.',
            isFallback: true,
            reason: 'fallback-content',
            freshness: {
              label: 'GitHub activity is partially or fully backed by bundled fallback highlights.',
              lastUpdated: '2026-03-14T16:45:00.000Z',
              isStale: false,
            },
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText(
        'Showing bundled fallback highlights because the live GitHub response was incomplete or unavailable.'
      )
    ).toBeVisible();
    expect(
      screen.getAllByText(
        'Unable to load GitHub activity right now. Showing recent highlights instead.'
      )
    ).toHaveLength(2);
  });
});
