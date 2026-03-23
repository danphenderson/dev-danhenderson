import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogArticleNav } from '../../../../src/components/blog/BlogArticleNav';
import { routerFuture } from '../../../../src/routerFuture';
import type { BlogPostMeta } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  hoverLift: {},
  tapShrink: {},
  cssDuration: { fast: '0.2s' },
}));

const prevPost: BlogPostMeta = {
  slug: 'previous-article',
  title: 'Previous Article',
  excerpt: 'Previous excerpt',
  author: 'Author',
  publishedAt: '2026-01-01',
  readingTimeMinutes: 4,
  tags: ['react'],
};

const nextPost: BlogPostMeta = {
  slug: 'next-article',
  title: 'Next Article',
  excerpt: 'Next excerpt',
  author: 'Author',
  publishedAt: '2026-01-10',
  readingTimeMinutes: 6,
  tags: ['typescript'],
};

describe('BlogArticleNav', () => {
  const renderNav = (prev?: BlogPostMeta, next?: BlogPostMeta) =>
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogArticleNav prev={prev} next={next} />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('returns null when neither prev nor next is provided', () => {
    const { container } = renderNav();

    expect(container.firstChild).toBeNull();
  });

  it('renders a previous link when prev is provided', () => {
    renderNav(prevPost, undefined);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Previous Article')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/previous-article');
  });

  it('renders a next link when next is provided', () => {
    renderNav(undefined, nextPost);

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Next Article')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/next-article');
  });

  it('renders both prev and next links', () => {
    renderNav(prevPost, nextPost);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByText('Previous Article')).toBeInTheDocument();
    expect(screen.getByText('Next Article')).toBeInTheDocument();
  });
});
