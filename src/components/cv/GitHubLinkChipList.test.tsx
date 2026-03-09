import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubLinkChipList } from './GitHubLinkChipList';

jest.mock('../AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
    containerSx,
  }: {
    children: ReactNode;
    delayMs: number;
    containerSx?: { width?: string };
  }) => (
    <div
      data-testid="animated-chip"
      data-delay={String(delayMs)}
      data-container-width={containerSx?.width ?? ''}
    >
      {children}
    </div>
  ),
}));

describe('GitHubLinkChipList', () => {
  it('animates wrap-layout chips while preserving accessible links', () => {
    render(
      <ThemeProvider>
        <GitHubLinkChipList
          layout="wrap"
          animateItems
          startDelayMs={40}
          itemStaggerMs={20}
          items={[
            { key: 'repo-1', label: 'repo-one', href: 'https://github.com/example/repo-one' },
            { key: 'repo-2', label: 'repo-two', href: 'https://github.com/example/repo-two' },
          ]}
        />
      </ThemeProvider>
    );

    const animatedChips = screen.getAllByTestId('animated-chip');

    expect(animatedChips).toHaveLength(2);
    expect(animatedChips[0]).toHaveAttribute('data-delay', '40');
    expect(animatedChips[1]).toHaveAttribute('data-delay', '60');
    expect(animatedChips[0]).toHaveAttribute('data-container-width', 'auto');
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-one'
    );
    expect(screen.getByRole('link', { name: 'repo-two' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-two'
    );
  });
});
