import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../../../../src/components/CommonLink';
import { GitHubLinkChipList } from '../../../../src/components/cv/GitHubLinkChipList';

jest.mock('../../../../src/motion', () => ({
  MotionTiltCard: ({
    children,
    intensity,
    style,
  }: {
    children: ReactNode;
    intensity?: number;
    style?: { width?: string };
  }) => (
    <div
      data-testid="github-chip-tilt"
      data-intensity={String(intensity ?? '')}
      data-width={String(style?.width ?? '')}
    >
      {children}
    </div>
  ),
}));

jest.mock('@mui/material', () => {
  const React = require('react');
  const actual = jest.requireActual('@mui/material');

  const getSxValue = (
    sx: Record<string, unknown> | Array<Record<string, unknown>> | undefined,
    key: string
  ) => {
    if (Array.isArray(sx)) {
      return sx.find((entry) => entry && key in entry)?.[key];
    }

    return sx?.[key];
  };

  return {
    ...actual,
    Chip: ({
      component,
      href,
      target,
      rel,
      label,
      sx,
      'data-tooltip-id': tooltipId,
      'data-tooltip-content': tooltipContent,
      'data-tooltip-place': tooltipPlace,
    }: {
      component?: string;
      href?: string;
      target?: string;
      rel?: string;
      label: ReactNode;
      sx?: Record<string, unknown> | Array<Record<string, unknown>>;
      'data-tooltip-id'?: string;
      'data-tooltip-content'?: string;
      'data-tooltip-place'?: string;
    }) =>
      React.createElement(
        component === 'a' ? 'a' : 'div',
        {
          href,
          target,
          rel,
          'data-tooltip-id': tooltipId,
          'data-tooltip-content': tooltipContent,
          'data-tooltip-place': tooltipPlace,
          'data-animation': String(getSxValue(sx, 'animation') ?? ''),
          'data-animation-delay': String(getSxValue(sx, 'animationDelay') ?? ''),
          'data-background-size': String(getSxValue(sx, 'backgroundSize') ?? ''),
        },
        label
      ),
  };
});

const getSxValue = (
  sx: Record<string, unknown> | Array<Record<string, unknown>> | undefined,
  key: string
) => {
  if (Array.isArray(sx)) {
    return sx.find((entry) => entry && key in entry)?.[key];
  }

  return sx?.[key];
};

jest.mock('../../../../src/components/AnimatedSlideList', () => ({
  AnimatedSlideList: ({
    children,
    items,
    renderItem,
    layout,
    getItemDirection,
    startDelayMs,
    itemStaggerMs,
    stackSpacing,
    wrapGap,
  }: {
    children?: ReactNode;
    items: Array<{ key: string }>;
    renderItem: (item: { key: string }, index: number) => ReactNode;
    layout?: 'stack' | 'wrap';
    getItemDirection?: (item: { key: string }, index: number) => string;
    startDelayMs?: number;
    itemStaggerMs?: number;
    stackSpacing?: number;
    wrapGap?: number;
  }) => (
    <div
      data-testid="animated-slide-list"
      data-start-delay={String(startDelayMs ?? 0)}
      data-stagger={String(itemStaggerMs ?? '')}
      data-layout={String(layout ?? 'stack')}
      data-stack-spacing={String(stackSpacing ?? '')}
      data-wrap-gap={String(wrapGap ?? '')}
      data-first-direction={String(getItemDirection?.(items[0], 0) ?? '')}
      data-second-direction={String(getItemDirection?.(items[1], 1) ?? '')}
    >
      {children}
      {items.map((item, index) => renderItem(item, index))}
    </div>
  ),
}));

describe('GitHubLinkChipList', () => {
  it('animates wrap-layout chips with alternating slide directions while preserving accessible links', () => {
    render(
      <ThemeProvider>
        <GitHubLinkChipList
          layout="wrap"
          animateItems
          startDelayMs={40}
          itemStaggerMs={20}
          items={[
            {
              key: 'repo-1',
              label: 'repo-one',
              href: 'https://github.com/example/repo-one',
              tooltip: 'Open repo-one on GitHub.',
            },
            {
              key: 'repo-2',
              label: 'repo-two',
              href: 'https://github.com/example/repo-two',
              tooltip: 'Open repo-two on GitHub.',
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-start-delay', '40');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-stagger', '20');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-layout', 'wrap');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-wrap-gap', '0.75');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-first-direction', 'right');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-second-direction', 'left');
    expect(screen.getAllByTestId('github-chip-tilt')).toHaveLength(2);
    screen.getAllByTestId('github-chip-tilt').forEach((wrapper) => {
      expect(wrapper).toHaveAttribute('data-intensity', '0.5');
      expect(wrapper).toHaveAttribute('data-width', '');
    });
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-one'
    );
    expect(screen.getByRole('link', { name: 'repo-two' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo-two'
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-tooltip-id',
      COMMON_LINK_TOOLTIP_ID
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-tooltip-content',
      'Open repo-one on GitHub.'
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-tooltip-place',
      'top'
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-animation',
      expect.stringContaining('8600ms linear infinite')
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-animation-delay',
      '0s'
    );
    expect(screen.getByRole('link', { name: 'repo-two' })).toHaveAttribute(
      'data-animation-delay',
      '0.75s'
    );
    expect(screen.getByRole('link', { name: 'repo-one' })).toHaveAttribute(
      'data-background-size',
      '240% 100%'
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

    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-start-delay', '120');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-stagger', '30');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-layout', 'stack');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-stack-spacing', '0.5');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-first-direction', 'right');
    expect(screen.getByTestId('animated-slide-list')).toHaveAttribute('data-second-direction', 'left');
    expect(screen.getAllByTestId('github-chip-tilt')).toHaveLength(2);
    screen.getAllByTestId('github-chip-tilt').forEach((wrapper) => {
      expect(wrapper).toHaveAttribute('data-width', '100%');
    });
  });

  it('wraps non-animated chips in tilt cards too', () => {
    render(
      <ThemeProvider>
        <GitHubLinkChipList
          layout="wrap"
          items={[
            { key: 'repo-1', label: 'repo-one', href: 'https://github.com/example/repo-one' },
            { key: 'repo-2', label: 'repo-two', href: 'https://github.com/example/repo-two' },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('animated-slide-list')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('github-chip-tilt')).toHaveLength(2);
  });
});
