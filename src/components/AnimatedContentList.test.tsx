import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { AnimatedContentList } from './AnimatedContentList';

const getContainerWidth = (containerSx?: { width?: string } | Array<{ width?: string }>) => {
  if (Array.isArray(containerSx)) {
    return containerSx.find((entry) => entry?.width)?.width ?? '';
  }

  return containerSx?.width ?? '';
};

jest.mock('./AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
    containerSx,
  }: {
    children: ReactNode;
    delayMs: number;
    containerSx?: { width?: string } | Array<{ width?: string }>;
  }) => (
    <div
      data-testid="animated-content-item"
      data-delay={String(delayMs)}
      data-container-width={getContainerWidth(containerSx)}
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
});
