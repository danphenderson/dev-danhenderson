import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogPostList } from '../../../../src/components/blog/BlogPostList';
import { routerFuture } from '../../../../src/routerFuture';
import type { BlogPostMeta } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  StaggerChildren: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MotionItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MotionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  fadeInUp: {},
  hoverLift: {},
  tapShrink: {},
  cssDuration: { slow: '0.5s', fast: '0.2s' },
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

describe('BlogPostList', () => {
  it('returns null when the posts array is empty', () => {
    const { container } = render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogPostList posts={[]} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders one card per post', () => {
    const posts = [makePost('post-a', 'Post A'), makePost('post-b', 'Post B')];

    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogPostList posts={posts} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Post A')).toBeInTheDocument();
    expect(screen.getByText('Post B')).toBeInTheDocument();
  });

  it('renders the correct number of links for each post', () => {
    const posts = [
      makePost('post-a', 'Post A'),
      makePost('post-b', 'Post B'),
      makePost('post-c', 'Post C'),
    ];

    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogPostList posts={posts} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/blog/post-a');
    expect(links[1]).toHaveAttribute('href', '/blog/post-b');
    expect(links[2]).toHaveAttribute('href', '/blog/post-c');
  });
});
