import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { GitHubContributions } from '../../../../src/components/cv/GitHubContributions';

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
        <a key={item.key} href={item.href} data-tooltip={item.tooltip}>
          {item.label}
        </a>
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

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'high-stars★ 1,000',
      'low-stars★ 10',
    ]);
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
    expect(screen.getByText('contrib-a').closest('a')).toHaveAttribute(
      'data-tooltip',
      'Open contrib-a on GitHub.'
    );
  });

  it.each(['cards', 'list'] as const)(
    'distinguishes unknown and verified zero counts in %s',
    (variant) => {
      render(
        <ThemeProvider>
          <GitHubContributions
            loading={false}
            variant={variant}
            contributions={[
              { name: 'unknown', url: 'https://github.com/unknown' },
              { name: 'zero', url: 'https://github.com/zero', stars: 0 },
              { name: 'popular', url: 'https://github.com/popular', stars: 50000 },
            ]}
          />
        </ThemeProvider>
      );
      expect(screen.getByLabelText('Star count unavailable')).toHaveTextContent('★ —');
      expect(screen.getByLabelText('0 GitHub stars')).toHaveTextContent('★ 0');
      expect(screen.getByLabelText('50,000 GitHub stars')).toHaveTextContent('★ 50,000');
      expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
        'https://github.com/popular',
        'https://github.com/zero',
        'https://github.com/unknown',
      ]);
    }
  );
});
