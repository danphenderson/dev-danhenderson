import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogBlockquote } from '../../../../src/components/blog/BlogBlockquote';

describe('BlogBlockquote', () => {
  it('renders the quote text', () => {
    render(
      <ThemeProvider>
        <BlogBlockquote text="Design is not just what it looks like." />
      </ThemeProvider>
    );

    expect(screen.getByText('Design is not just what it looks like.')).toBeInTheDocument();
  });

  it('renders the attribution when provided', () => {
    render(
      <ThemeProvider>
        <BlogBlockquote text="Stay hungry, stay foolish." attribution="Steve Jobs" />
      </ThemeProvider>
    );

    expect(screen.getByText('— Steve Jobs')).toBeInTheDocument();
  });

  it('does not render attribution when absent', () => {
    const { container } = render(
      <ThemeProvider>
        <BlogBlockquote text="No attribution here." />
      </ThemeProvider>
    );

    expect(container.querySelector('blockquote')).toBeInTheDocument();
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it('renders as a blockquote element', () => {
    const { container } = render(
      <ThemeProvider>
        <BlogBlockquote text="Semantic blockquote." />
      </ThemeProvider>
    );

    expect(container.querySelector('blockquote')).toBeInTheDocument();
  });
});
