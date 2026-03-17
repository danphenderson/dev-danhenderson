import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogArticleHeader } from '../../../../src/components/blog/BlogArticleHeader';
import type { BlogPost } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../../src/components/blog/BlogHeroImage', () => ({
  BlogHeroImage: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt ?? ''} data-testid="blog-hero-image" />
  ),
}));

const basePost: BlogPost = {
  slug: 'test-article',
  title: 'Test Article Title',
  subtitle: 'An insightful subtitle',
  excerpt: 'A brief excerpt.',
  author: 'Daniel Henderson',
  publishedAt: '2026-02-20',
  readingTimeMinutes: 8,
  tags: ['architecture', 'frontend'],
  heroImage: '/assets/blog/article-hero.jpg',
  heroImageAlt: 'Architecture diagram',
  content: [],
};

describe('BlogArticleHeader', () => {
  const renderHeader = (overrides: Partial<BlogPost> = {}) =>
    render(
      <ThemeProvider>
        <BlogArticleHeader post={{ ...basePost, ...overrides }} />
      </ThemeProvider>
    );

  it('renders the article title as an h1', () => {
    renderHeader();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Article Title');
  });

  it('renders the subtitle when present', () => {
    renderHeader();

    expect(screen.getByText('An insightful subtitle')).toBeInTheDocument();
  });

  it('does not render the subtitle when absent', () => {
    renderHeader({ subtitle: undefined });

    expect(screen.queryByText('An insightful subtitle')).not.toBeInTheDocument();
  });

  it('renders the hero image when present', () => {
    renderHeader();

    expect(screen.getByTestId('blog-hero-image')).toHaveAttribute(
      'src',
      '/assets/blog/article-hero.jpg'
    );
  });

  it('does not render the hero image when absent', () => {
    renderHeader({ heroImage: undefined });

    expect(screen.queryByTestId('blog-hero-image')).not.toBeInTheDocument();
  });

  it('renders reading time and published date via meta chips', () => {
    renderHeader();

    expect(screen.getByText('8 min read')).toBeInTheDocument();
    expect(screen.getByText('Feb 20, 2026')).toBeInTheDocument();
  });
});
