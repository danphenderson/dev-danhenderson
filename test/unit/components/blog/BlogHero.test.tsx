import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogHero } from '../../../../src/components/blog/BlogHero';
import { routerFuture } from '../../../../src/routerFuture';
import type { BlogPost } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  cssDuration: { normal: '0.35s' },
}));

jest.mock('../../../../src/components/blog/BlogHeroImage', () => ({
  BlogHeroImage: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt ?? ''} data-testid="blog-hero-image" />
  ),
}));

const basePost: BlogPost = {
  slug: 'featured-post',
  title: 'Featured Post Title',
  subtitle: 'A subtitle for the featured post',
  excerpt: 'This is the excerpt of the featured blog post.',
  author: 'Test Author',
  publishedAt: '2026-03-10',
  readingTimeMinutes: 12,
  tags: ['design-systems', 'react'],
  featured: true,
  heroImage: '/assets/blog/hero.jpg',
  heroImageAlt: 'Abstract shapes',
  content: [],
};

describe('BlogHero', () => {
  const renderHero = (overrides: Partial<BlogPost> = {}) =>
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <BlogHero post={{ ...basePost, ...overrides }} />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('renders the featured post title, excerpt, and "Featured Article" label', () => {
    renderHero();

    expect(screen.getByText('Featured Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is the excerpt of the featured blog post.')).toBeInTheDocument();
    expect(screen.getByText('Featured Article')).toBeInTheDocument();
  });

  it('renders the subtitle when present', () => {
    renderHero();

    expect(screen.getByText('A subtitle for the featured post')).toBeInTheDocument();
  });

  it('does not render a subtitle when absent', () => {
    renderHero({ subtitle: undefined });

    expect(screen.queryByText('A subtitle for the featured post')).not.toBeInTheDocument();
  });

  it('links to the correct blog post route', () => {
    renderHero();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/featured-post');
  });

  it('renders the hero image when present', () => {
    renderHero();

    expect(screen.getByTestId('blog-hero-image')).toHaveAttribute('src', '/assets/blog/hero.jpg');
  });

  it('does not render the hero image when absent', () => {
    renderHero({ heroImage: undefined });

    expect(screen.queryByTestId('blog-hero-image')).not.toBeInTheDocument();
  });
});
