import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubProjects } from './GitHubProjects';

jest.mock('./GitHubLinkChipList', () => ({
  GitHubLinkChipList: ({
    items,
    layout,
  }: {
    items: Array<{ key: string; label: ReactNode; href?: string }>;
    layout: string;
  }) => (
    <div data-testid="chip-list" data-layout={layout}>
      {items.map((item) => (
        <a key={item.key} href={item.href}>{typeof item.label === 'string' ? item.label : item.key}</a>
      ))}
    </div>
  ),
}));

describe('GitHubProjects', () => {
  it('maps projects to chip items with wrap layout', () => {
    render(
      <ThemeProvider>
        <GitHubProjects
          projects={[
            { name: 'repo-a', url: 'https://github.com/user/repo-a' },
            { name: 'repo-b', url: 'https://github.com/user/repo-b' },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('chip-list')).toHaveAttribute('data-layout', 'wrap');
    expect(screen.getByRole('link', { name: 'repo-a' })).toHaveAttribute('href', 'https://github.com/user/repo-a');
    expect(screen.getByRole('link', { name: 'repo-b' })).toHaveAttribute('href', 'https://github.com/user/repo-b');
  });
});
