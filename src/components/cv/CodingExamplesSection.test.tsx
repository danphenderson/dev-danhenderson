import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import type { CodingExample } from '../../types/cv';
import { codingExamples } from '../../data/cv';
import { CodingExamplesSection } from './CodingExamplesSection';

const mockAnimatedContentList = jest.fn();

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

describe('CodingExamplesSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
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
    expect(screen.queryByText('Normalize `None`-related annotations across a codebase.')).not.toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Purpose' }));

    expect(screen.getByText('Normalize `None`-related annotations across a codebase.')).toBeVisible();
    expect(screen.getByText('Target repo-wide cleanup rather than ad-hoc edits.')).toBeVisible();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Stack' }));

    expect(screen.getByText('Python')).toBeVisible();
    expect(screen.getByText('Typer')).toBeVisible();
    expect(screen.queryByRole('tabpanel', { name: 'Purpose' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Stack' }));

    expect(screen.queryByRole('tabpanel', { name: 'Stack' })).not.toBeInTheDocument();
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
