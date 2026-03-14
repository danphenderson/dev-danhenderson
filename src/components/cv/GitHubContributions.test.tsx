import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubContributions } from './GitHubContributions';

jest.mock('../LoadingBars', () => ({
  LoadingBars: ({ label }: { label: string }) => <div data-testid="loading-bars">{label}</div>,
}));

jest.mock('./GitHubLinkChipList', () => ({
  GitHubLinkChipList: ({
    items,
  }: {
    items: Array<{ key: string; label: ReactNode; href?: string }>;
  }) => (
    <div data-testid="chip-list">
      {items.map((item) => (
        <span key={item.key}>{item.key}</span>
      ))}
    </div>
  ),
}));

describe('GitHubContributions', () => {
  it('shows loading bars when loading', () => {
    render(
      <ThemeProvider>
        <GitHubContributions contributions={[]} loading={true} />
      </ThemeProvider>
    );

    expect(screen.getByTestId('loading-bars')).toBeInTheDocument();
  });

  it('shows empty state message when no contributions', () => {
    render(
      <ThemeProvider>
        <GitHubContributions contributions={[]} loading={false} />
      </ThemeProvider>
    );

    expect(
      screen.getByText('No recent community contributions found right now.')
    ).toBeInTheDocument();
  });

  it('renders contribution cards sorted by stars in default cards variant', () => {
    render(
      <ThemeProvider>
        <GitHubContributions
          contributions={[
            { name: 'low-stars', url: 'https://github.com/low', stars: 10 },
            { name: 'high-stars', url: 'https://github.com/high', stars: 1000 },
          ]}
          loading={false}
        />
      </ThemeProvider>
    );

    const names = screen.getAllByText(/stars/).map((el) => el.closest('a')?.textContent);
    expect(screen.getByText('high-stars')).toBeInTheDocument();
    expect(screen.getByText('low-stars')).toBeInTheDocument();
  });

  it('renders list variant using GitHubLinkChipList', () => {
    render(
      <ThemeProvider>
        <GitHubContributions
          contributions={[{ name: 'contrib-a', url: 'https://github.com/a', stars: 50 }]}
          loading={false}
          variant="list"
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('chip-list')).toBeInTheDocument();
  });
});
