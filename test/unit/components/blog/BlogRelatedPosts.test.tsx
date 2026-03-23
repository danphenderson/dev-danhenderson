import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogRelatedPosts } from '../../../../src/components/blog/BlogRelatedPosts';
import { routerFuture } from '../../../../src/routerFuture';
import type { BlogPostMeta } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  StaggerChildren: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MotionItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  cssDuration: { fast: '0.2s' },
}));

const makePost = (slug: string, title: string): BlogPostMeta => ({
  slug,
  title,
  excerpt: `Excerpt for ${title}`,
  author: 'Author',
  publishedAt: '2026-02-01',
  readingTimeMinutes: 4,
  tags: ['react'],
});

describe('BlogRelatedPosts', () => {
  it('returns null when the posts array is empty', () => {
    const { container } = render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogRelatedPosts posts={[]} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders the "Related articles" heading', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogRelatedPosts posts={[makePost('post-a', 'Post A')]} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Related articles' })).toBeInTheDocument();
  });

  it('renders a link and title for each related post', () => {
    const posts = [makePost('post-a', 'Post A'), makePost('post-b', 'Post B')];

    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogRelatedPosts posts={posts} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Post A')).toBeInTheDocument();
    expect(screen.getByText('Post B')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/blog/post-a');
    expect(links[1]).toHaveAttribute('href', '/blog/post-b');
  });

  it('renders the excerpt for each related post', () => {
    const posts = [makePost('post-a', 'Post A')];

    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogRelatedPosts posts={posts} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Excerpt for Post A')).toBeInTheDocument();
  });
});
