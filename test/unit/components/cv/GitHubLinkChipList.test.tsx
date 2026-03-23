import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../../../../src/components/CommonLink';
import { GitHubLinkChipList } from '../../../../src/components/cv/GitHubLinkChipList';

const mockUseControlledAnimatedList = jest.fn();

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
    Zoom: ({ children, in: inProp }: { children: ReactNode; in?: boolean }) => (
      <div data-testid="zoom-item" data-in={String(inProp ?? true)}>
        {children}
      </div>
    ),
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

jest.mock('../../../../src/components/animatedListShared', () => ({
  useControlledAnimatedList: (options: {
    items: Array<{ key: string }>;
    getItemKey: (item: { key: string }) => string;
    containerSx?: Record<string, unknown> | Array<Record<string, unknown>>;
  }) => mockUseControlledAnimatedList(options),
}));

describe('GitHubLinkChipList', () => {
  beforeEach(() => {
    mockUseControlledAnimatedList.mockImplementation(
      ({
        items,
        getItemKey,
        containerSx,
      }: {
        items: Array<{ key: string }>;
        getItemKey: (item: { key: string }) => string;
        containerSx?: Record<string, unknown> | Array<Record<string, unknown>>;
      }) => ({
        durationFactor: 1,
        isMotionDisabled: false,
        itemEntries: items.map((item, index) => ({
          item,
          index,
          key: getItemKey(item),
          isEntered: true,
          nodeRef: { current: null },
        })),
        resolvedContainerSx: containerSx,
      })
    );
  });

  afterEach(() => {
    mockUseControlledAnimatedList.mockClear();
  });

  it('animates wrap-layout chips while preserving accessible links', () => {
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

    expect(mockUseControlledAnimatedList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 40, itemStaggerMs: 20 })
    );
    expect(getSxValue(mockUseControlledAnimatedList.mock.calls[0][0].containerSx, 'display')).toBe(
      'flex'
    );
    expect(getSxValue(mockUseControlledAnimatedList.mock.calls[0][0].containerSx, 'flexWrap')).toBe(
      'wrap'
    );
    expect(screen.getAllByTestId('zoom-item')).toHaveLength(2);
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

    expect(mockUseControlledAnimatedList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 120, itemStaggerMs: 30 })
    );
    expect(getSxValue(mockUseControlledAnimatedList.mock.calls[0][0].containerSx, 'display')).toBe(
      'flex'
    );
    expect(
      getSxValue(mockUseControlledAnimatedList.mock.calls[0][0].containerSx, 'flexDirection')
    ).toBe('column');
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

    expect(mockUseControlledAnimatedList).not.toHaveBeenCalled();
    expect(screen.getAllByTestId('github-chip-tilt')).toHaveLength(2);
  });
});
