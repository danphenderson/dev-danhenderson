import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubLinkChipList } from './GitHubLinkChipList';

const getSxValue = (
  sx: Record<string, unknown> | Array<Record<string, unknown>> | undefined,
  key: string
) => {
  if (Array.isArray(sx)) {
    return sx.find((entry) => entry && key in entry)?.[key];
  }

  return sx?.[key];
};

jest.mock('../AnimatedZoomList', () => ({
  AnimatedZoomList: ({
    children,
    items,
    renderItem,
    startDelayMs,
    itemStaggerMs,
    containerSx,
  }: {
    children?: ReactNode;
    items: Array<{ key: string }>;
    renderItem: (item: { key: string }, index: number) => ReactNode;
    startDelayMs?: number;
    itemStaggerMs?: number;
    containerSx?: Record<string, unknown> | Array<Record<string, unknown>>;
  }) => (
    <div
      data-testid="animated-zoom-list"
      data-start-delay={String(startDelayMs ?? 0)}
      data-stagger={String(itemStaggerMs ?? '')}
      data-display={String(getSxValue(containerSx, 'display') ?? '')}
      data-flex-direction={String(getSxValue(containerSx, 'flexDirection') ?? '')}
      data-flex-wrap={String(getSxValue(containerSx, 'flexWrap') ?? '')}
    >
      {children}
      {items.map((item, index) => renderItem(item, index))}
    </div>
  ),
}));

describe('GitHubLinkChipList', () => {
  it('animates wrap-layout chips with the compact zoom list while preserving accessible links', () => {
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

    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-start-delay', '40');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-stagger', '20');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-display', 'flex');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-flex-wrap', 'wrap');
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-one'
    );
    expect(screen.getByRole('link', { name: 'repo-two' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-two'
    );
  });

  it('animates stacked chips in a compact vertical container', () => {
    render(
      <ThemeProvider>
        <GitHubLinkChipList
          layout="stack"
          animateItems
          startDelayMs={120}
          itemStaggerMs={30}
          items={[
            { key: 'repo-1', label: 'repo-one', href: 'https://github.com/example/repo-one' },
            { key: 'repo-2', label: 'repo-two', href: 'https://github.com/example/repo-two' },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-start-delay', '120');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-stagger', '30');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-display', 'flex');
    expect(screen.getByTestId('animated-zoom-list')).toHaveAttribute('data-flex-direction', 'column');
  });
});
