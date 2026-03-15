import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVGitHubStatusTooltip } from '../../../../src/components/cv/CVGitHubStatusTooltip';

describe('CVGitHubStatusTooltip', () => {
  it('shows the live GitHub status details in a tooltip', async () => {
    render(
      <ThemeProvider>
        <CVGitHubStatusTooltip
          status={{
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
          }}
        />
      </ThemeProvider>
    );

    fireEvent.mouseOver(screen.getByTestId('cv-github-status-tooltip-trigger'));

    expect(await screen.findByRole('tooltip')).toBeVisible();
    expect(
      await screen.findByText('Showing live GitHub activity from the latest successful fetch.')
    ).toBeVisible();
    expect(
      screen.getByText('GitHub activity was fetched live and cached for subsequent visits.')
    ).toBeVisible();
    expect(screen.getByText(/Last refreshed/)).toBeVisible();
  });

  it('includes partial failure details when some GitHub sources fail', async () => {
    render(
      <ThemeProvider>
        <CVGitHubStatusTooltip
          status={{
            source: 'cache',
            loading: false,
            error: 'Unable to load all GitHub data right now. Showing recent highlights instead.',
            isFallback: true,
            reason: 'partial-fallback',
            freshness: {
              label: 'GitHub activity is partially or fully backed by bundled fallback highlights.',
              lastUpdated: '2026-03-14T16:45:00.000Z',
              isStale: false,
            },
            sourceDetail: [
              { id: 'events', label: 'Events', ok: true },
              { id: 'enrichment', label: 'Enrichment', ok: false },
            ],
          }}
        />
      </ThemeProvider>
    );

    fireEvent.mouseOver(screen.getByTestId('cv-github-status-tooltip-trigger'));

    expect(await screen.findByRole('tooltip')).toBeVisible();
    expect(
      await screen.findByText(
        'Some GitHub data sources responded while others fell back to bundled highlights.'
      )
    ).toBeVisible();
    expect(
      screen.getByText('Unable to load all GitHub data right now. Showing recent highlights instead.')
    ).toBeVisible();
    expect(screen.getByText('Partial failure: enrichment did not respond.')).toBeVisible();
  });
});
