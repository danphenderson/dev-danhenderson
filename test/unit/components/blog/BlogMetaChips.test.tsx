import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogMetaChips } from '../../../../src/components/blog/BlogMetaChips';

describe('BlogMetaChips', () => {
  it('renders the published date and reading time', () => {
    render(
      <ThemeProvider>
        <BlogMetaChips publishedAt="2026-03-10" readingTimeMinutes={12} />
      </ThemeProvider>
    );

    expect(screen.getByText('Mar 10, 2026')).toBeInTheDocument();
    expect(screen.getByText('12 min read')).toBeInTheDocument();
  });

  it('renders tag chips when tags are provided', () => {
    render(
      <ThemeProvider>
        <BlogMetaChips
          publishedAt="2026-01-01"
          readingTimeMinutes={5}
          tags={['react', 'typescript']}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('does not render tag chips when tags are absent', () => {
    render(
      <ThemeProvider>
        <BlogMetaChips publishedAt="2026-01-01" readingTimeMinutes={5} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onTagClick when a tag chip is clicked', () => {
    const onTagClick = jest.fn();

    render(
      <ThemeProvider>
        <BlogMetaChips
          publishedAt="2026-01-01"
          readingTimeMinutes={5}
          tags={['react', 'typescript']}
          onTagClick={onTagClick}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('react'));

    expect(onTagClick).toHaveBeenCalledWith('react');
  });

  it('prevents tag clicks from bubbling to a parent link', () => {
    const onTagClick = jest.fn();
    const onParentClick = jest.fn();

    render(
      <ThemeProvider>
        <a href="/blog/test-post" onClick={onParentClick}>
          <BlogMetaChips
            publishedAt="2026-01-01"
            readingTimeMinutes={5}
            tags={['react', 'typescript']}
            onTagClick={onTagClick}
          />
        </a>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'react' }));

    expect(onTagClick).toHaveBeenCalledWith('react');
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('respects maxTags to limit displayed tags', () => {
    render(
      <ThemeProvider>
        <BlogMetaChips
          publishedAt="2026-01-01"
          readingTimeMinutes={5}
          tags={['react', 'typescript', 'design']}
          maxTags={2}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.queryByText('design')).not.toBeInTheDocument();
  });
});
