import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { AnimatedContentList } from './AnimatedContentList';

type MockSx = { [key: string]: unknown } | Array<{ [key: string]: unknown }>;

const getContainerWidth = (containerSx?: { width?: string } | Array<{ width?: string }>) => {
  if (Array.isArray(containerSx)) {
    return containerSx.find((entry) => entry?.width)?.width ?? '';
  }

  return containerSx?.width ?? '';
};

const hasSxEntry = (sx?: MockSx, predicate?: (entry: { [key: string]: unknown }) => boolean) => {
  const sxEntries = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return predicate ? sxEntries.some((entry) => predicate(entry)) : false;
};

jest.mock('./AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
    containerSx,
    sx,
  }: {
    children: ReactNode;
    delayMs: number;
    containerSx?: { width?: string } | Array<{ width?: string }>;
    sx?: MockSx;
  }) => (
    <div
      data-testid="animated-content-item"
      data-delay={String(delayMs)}
      data-container-width={getContainerWidth(containerSx)}
      data-has-card-reset={String(
        hasSxEntry(
          sx,
          (entry) =>
            entry.background === 'none' &&
            entry.backgroundColor === 'transparent' &&
            entry.border === 'none' &&
            entry.boxShadow === 'none'
        )
      )}
      data-has-panel-surface={String(
        hasSxEntry(sx, (entry) => entry.borderRadius === 1.5 && entry.p === 1)
      )}
    >
      {children}
    </div>
  ),
}));

describe('AnimatedContentList', () => {
  it('computes stack delays from the provided offset and stagger', () => {
    render(
      <ThemeProvider>
        <AnimatedContentList
          items={['Experience', 'Education']}
          getItemKey={(item) => item}
          startDelayMs={120}
          itemStaggerMs={80}
          renderItem={(item) => <div>{item}</div>}
        />
      </ThemeProvider>
    );

    const items = screen.getAllByTestId('animated-content-item');

    expect(items[0]).toHaveAttribute('data-delay', '120');
    expect(items[1]).toHaveAttribute('data-delay', '200');
  });

  it('computes wrap delays and uses auto-width containers', () => {
    render(
      <ThemeProvider>
        <AnimatedContentList
          items={['GitHub', 'Projects']}
          getItemKey={(item) => item}
          layout="wrap"
          startDelayMs={40}
          itemStaggerMs={20}
          renderItem={(item) => <div>{item}</div>}
        />
      </ThemeProvider>
    );

    const items = screen.getAllByTestId('animated-content-item');

    expect(items[0]).toHaveAttribute('data-delay', '40');
    expect(items[1]).toHaveAttribute('data-delay', '60');
    expect(items[0]).toHaveAttribute('data-container-width', 'auto');
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('can downgrade items to panel surfaces without reusing the full card treatment', () => {
    render(
      <ThemeProvider>
        <AnimatedContentList
          items={['Experience']}
          getItemKey={(item) => item}
          itemSurface="panel"
          renderItem={(item) => <div>{item}</div>}
        />
      </ThemeProvider>
    );

    const item = screen.getByTestId('animated-content-item');

    expect(item).toHaveAttribute('data-has-card-reset', 'true');
    expect(item).toHaveAttribute('data-has-panel-surface', 'true');
  });

  it('can render plain animated wrappers when the child already owns its surface', () => {
    render(
      <ThemeProvider>
        <AnimatedContentList
          items={['Tools']}
          getItemKey={(item) => item}
          itemSurface="plain"
          renderItem={(item) => <div>{item}</div>}
        />
      </ThemeProvider>
    );

    const item = screen.getByTestId('animated-content-item');

    expect(item).toHaveAttribute('data-has-card-reset', 'true');
    expect(item).toHaveAttribute('data-has-panel-surface', 'false');
  });
});
