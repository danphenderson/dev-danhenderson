import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CodingExamplesSection } from './CodingExamplesSection';

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: ({
    items,
    renderItem,
  }: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
  }) => <div>{items.map((item, index) => <div key={index}>{renderItem(item, index)}</div>)}</div>,
}));

describe('CodingExamplesSection', () => {
  it('renders example title as a link when links are provided', () => {
    render(
      <ThemeProvider>
        <CodingExamplesSection
          examples={[
            {
              title: 'BlockOpt.jl',
              description: 'A Julia optimization framework',
              links: ['https://github.com/example/blockopt'],
            },
          ]}
        />
      </ThemeProvider>
    );

    const link = screen.getByRole('link', { name: 'BlockOpt.jl' });
    expect(link).toHaveAttribute('href', 'https://github.com/example/blockopt');
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByText('A Julia optimization framework')).toBeInTheDocument();
  });

  it('renders title as plain text when no links are provided', () => {
    render(
      <ThemeProvider>
        <CodingExamplesSection
          examples={[
            {
              title: 'No Link Example',
              description: 'Description only',
              links: [],
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('No Link Example')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'No Link Example' })).not.toBeInTheDocument();
  });
});
