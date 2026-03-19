import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogPostCard } from '../../../../src/components/blog/BlogPostCard';
import { routerFuture } from '../../../../src/routerFuture';
import type { BlogPostMeta } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MotionTiltCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  hoverLift: {},
  tapShrink: {},
  cssDuration: { slow: '0.5s' },
}));

const baseMeta: BlogPostMeta = {
  slug: 'test-post',
  title: 'Test Post Title',
  excerpt: 'This is a test excerpt for the blog post card.',
  author: 'Test Author',
  publishedAt: '2026-01-15',
  readingTimeMinutes: 5,
  tags: ['react', 'typescript'],
};

describe('BlogPostCard', () => {
  const renderCard = (props: Partial<BlogPostMeta> = {}, onTagClick?: (tag: string) => void) =>
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogPostCard post={{ ...baseMeta, ...props }} onTagClick={onTagClick} />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('renders the post title and excerpt', () => {
    renderCard();

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt for the blog post card.')).toBeInTheDocument();
  });

  it('links to the correct blog post route', () => {
    renderCard();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('renders the hero image when present', () => {
    renderCard({ heroImage: '/assets/blog/hero.jpg', heroImageAlt: 'Hero alt text' });

    const image = screen.getByRole('img', { name: 'Hero alt text' });
    expect(image).toHaveAttribute('src', '/assets/blog/hero.jpg');
  });

  it('does not render an image when heroImage is absent', () => {
    renderCard();

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders meta chips with reading time and date', () => {
    renderCard();

    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2026')).toBeInTheDocument();
  });
});
