import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { GitHubActivityList } from '../../../../src/components/cv/GitHubActivityList';

jest.mock('../../../../src/components/LoadingBars', () => ({
  LoadingBars: ({ label }: { label: string }) => <div data-testid="loading-bars">{label}</div>,
}));

jest.mock('../../../../src/components/cv/GitHubLinkChipList', () => ({
  GitHubLinkChipList: ({
    items,
  }: {
    items: Array<{ key: string; label: ReactNode; href?: string; tooltip?: string }>;
  }) => (
    <div data-testid="chip-list">
      {items.map((item) => (
        <span key={item.key} data-tooltip={item.tooltip}>
          {typeof item.label === 'string' ? item.label : item.key}
        </span>
      ))}
    </div>
  ),
}));

describe('GitHubActivityList', () => {
  it('shows loading bars when loading', () => {
    render(
      <ThemeProvider>
        <GitHubActivityList activity={[]} loading={true} />
      </ThemeProvider>
    );

    expect(screen.getByTestId('loading-bars')).toBeInTheDocument();
  });

  it('renders activity items when not loading', () => {
    render(
      <ThemeProvider>
        <GitHubActivityList
          activity={[
            { label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' },
          ]}
          loading={false}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(screen.getByText('Pushed 2 commits to owner/repo')).toHaveAttribute(
      'data-tooltip',
      'Open Pushed 2 commits to owner/repo on GitHub.'
    );
  });

  it('displays an error message when error is provided', () => {
    render(
      <ThemeProvider>
        <GitHubActivityList
          activity={[{ label: 'activity', href: '#' }]}
          loading={false}
          error="Unable to load data"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Unable to load data')).toBeInTheDocument();
  });
});
