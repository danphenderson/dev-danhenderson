import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import BlogPost from '../../../src/pages/BlogPost';

jest.mock('../../../src/motion', () => {
  const actual = jest.requireActual('../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({ children, intensity }: { children: ReactNode; intensity?: number }) => (
      <div data-testid="blog-post-back-link-tilt-card" data-intensity={String(intensity ?? '')}>
        {children}
      </div>
    ),
  };
});

jest.mock('../../../src/components/layout/SectionHeading', () => ({
  SectionHeading: ({ overline, title }: { overline: string; title?: string }) => (
    <div data-testid="section-heading" data-overline={overline} data-title={title ?? ''}>
      {title}
    </div>
  ),
}));

const mockPost = {
  slug: 'test-article',
  title: 'Test Article Title',
  subtitle: 'A test subtitle',
  excerpt: 'Test excerpt',
  author: 'Dan Henderson',
  publishedAt: '2025-03-01',
  readingTimeMinutes: 7,
  tags: ['react', 'typescript'],
  heroImage: '/assets/hero.jpg',
  heroImageAlt: 'Hero',
  content: [
    { type: 'paragraph' as const, text: 'First paragraph content.' },
    { type: 'heading' as const, level: 2 as const, text: 'Section Heading' },
    { type: 'paragraph' as const, text: 'Second paragraph content.' },
  ],
};

jest.mock('../../../src/hooks/useBlogData', () => ({
  useBlogData: () => ({
    posts: [mockPost],
    postMeta: [],
    featuredPost: mockPost,
    tags: [],
    getPostBySlug: (slug: string) => (slug === 'test-article' ? mockPost : undefined),
    getRelatedPosts: () => [],
    getAdjacentPosts: () => ({ prev: undefined, next: undefined }),
  }),
}));

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

function renderBlogPost(slug: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/blog/${slug}`]} future={routerFuture}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('BlogPost', () => {
  it('renders the article content when slug matches', () => {
    renderBlogPost('test-article');

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('First paragraph content.')).toBeInTheDocument();
    expect(screen.getByText('Section Heading')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph content.')).toBeInTheDocument();
  });

  it('renders the back to blog button', () => {
    renderBlogPost('test-article');

    expect(screen.getByText('Back to blog')).toBeInTheDocument();
  });

  it('renders the back to blog button inside a MotionTiltCard surface', () => {
    renderBlogPost('test-article');

    const tiltCard = screen
      .getByText('Back to blog')
      .closest('[data-testid="blog-post-back-link-tilt-card"]');

    expect(tiltCard).toHaveAttribute('data-intensity', '0.5');
  });

  it('renders not-found recovery when slug does not match', () => {
    renderBlogPost('nonexistent-slug');

    expect(screen.getByText('Post not found')).toBeInTheDocument();
  });

  it('uses the shared section heading for the not-found recovery branch', () => {
    renderBlogPost('nonexistent-slug');

    expect(screen.getByTestId('section-heading')).toHaveAttribute('data-overline', 'Blog');
    expect(screen.getByTestId('section-heading')).toHaveAttribute('data-title', 'Post not found');
  });
});
