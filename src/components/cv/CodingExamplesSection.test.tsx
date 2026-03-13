import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import type { CodingExample } from '../../types/cv';
import { codingExamples } from '../../data/cv';
import { CodingExamplesSection } from './CodingExamplesSection';

const mockAnimatedContentList = jest.fn();
const mockAnimatedSlideList = jest.fn();

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    mountItemsOnView?: boolean;
    startDelayMs?: number;
  }) => {
    mockAnimatedContentList(props);

    return <div>{props.items.map((item, index) => <div key={index}>{props.renderItem(item, index)}</div>)}</div>;
  },
}));

jest.mock('../AnimatedSlideList', () => ({
  AnimatedSlideList: (props: {
    items: unknown[];
    getItemKey: (item: unknown, index: number) => string;
    renderItem: (item: unknown, index: number) => ReactNode;
    in: boolean;
    layout?: 'stack' | 'wrap';
    containerComponent?: React.ElementType;
    itemComponent?: React.ElementType;
  }) => {
    mockAnimatedSlideList(props);

    const React = require('react');

    const ContainerComponent = props.containerComponent ?? 'div';
    const ItemComponent = props.itemComponent ?? 'div';

    return React.createElement(
      ContainerComponent,
      { 'data-testid': 'animated-slide-list', 'data-layout': props.layout ?? 'stack' },
      props.in
        ? props.items.map((item, index) =>
          React.createElement(ItemComponent, { key: props.getItemKey(item, index) }, props.renderItem(item, index))
        )
        : null
    );
  },
}));

describe('CodingExamplesSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('waits for the section list to enter view before mounting animated work items', () => {
    render(
      <ThemeProvider>
        <CodingExamplesSection examples={[codingExamples[0]]} startDelayMs={120} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(expect.objectContaining({
      mountItemsOnView: true,
      startDelayMs: 120,
    }));
  });

  it('renders project tabs from data, shows the summary immediately, and toggles between list and stack content', () => {
    render(
      <ThemeProvider>
        <CodingExamplesSection examples={[codingExamples[0]]} />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'typewriter CLI' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson/python-typewriter'
    );
    expect(screen.getByRole('tab', { name: 'Purpose' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Rewrites' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Stack' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Typewriter is a pip-installable CLI built on Typer and LibCST to normalize None-related type annotations while preserving formatting and comments.'
      )
    ).toBeVisible();
    expect(screen.queryByText('Normalize `Union[..., None]` and default-`None` annotations across Python source files.')).not.toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Purpose' }));

    expect(screen.getByText('Normalize `Union[..., None]` and default-`None` annotations across Python source files.')).toBeVisible();
    expect(mockAnimatedSlideList.mock.calls.some(([props]) => props.containerComponent === 'ul' && props.itemComponent === 'li')).toBe(true);
    expect(screen.getByText('Support dry-run auditing with unified diffs through `typewriter run ... --check`.')).toBeVisible();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Stack' }));

    expect(screen.getByText('Python')).toBeVisible();
    expect(screen.getByText('Typer')).toBeVisible();
    expect(mockAnimatedSlideList.mock.calls.some(([props]) => props.layout === 'wrap')).toBe(true);
    expect(screen.queryByText('Normalize `Union[..., None]` and default-`None` annotations across Python source files.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Stack' }));

    expect(screen.queryByText('Python')).not.toBeInTheDocument();
    expect(screen.queryByText('Typer')).not.toBeInTheDocument();
  });

  it('falls back to title and description only when tabs are empty or missing', () => {
    const examples: CodingExample[] = [
      {
        title: 'No tabs example',
        description: 'This example intentionally has no supplemental tabs.',
        links: ['https://example.com/no-tabs'],
      },
      {
        title: 'Empty tabs example',
        description: 'This example has an empty tabs array.',
        links: ['https://example.com/empty-tabs'],
        tabs: [],
      },
    ];

    render(
      <ThemeProvider>
        <CodingExamplesSection examples={examples} />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'No tabs example' })).toHaveAttribute(
      'href',
      'https://example.com/no-tabs'
    );
    expect(screen.getByRole('link', { name: 'Empty tabs example' })).toHaveAttribute(
      'href',
      'https://example.com/empty-tabs'
    );
    expect(screen.getByText('This example intentionally has no supplemental tabs.')).toBeVisible();
    expect(screen.getByText('This example has an empty tabs array.')).toBeVisible();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
