import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import Blog from '../../../src/pages/Blog';

jest.mock('../../../src/hooks/useBlogData', () => ({
  useBlogData: () => ({
    posts: [
      {
        slug: 'featured-article',
        title: 'Featured Article',
        subtitle: 'A subtitle',
        excerpt: 'Featured excerpt',
        author: 'Dan Henderson',
        publishedAt: '2025-03-01',
        readingTimeMinutes: 10,
        tags: ['react'],
        featured: true,
        heroImage: '/assets/hero.jpg',
        heroImageAlt: 'Hero',
        content: [],
      },
      {
        slug: 'second-article',
        title: 'Second Article',
        excerpt: 'Second excerpt',
        author: 'Dan Henderson',
        publishedAt: '2025-02-15',
        readingTimeMinutes: 6,
        tags: ['typescript'],
        content: [],
      },
    ],
    postMeta: [
      {
        slug: 'featured-article',
        title: 'Featured Article',
        subtitle: 'A subtitle',
        excerpt: 'Featured excerpt',
        author: 'Dan Henderson',
        publishedAt: '2025-03-01',
        readingTimeMinutes: 10,
        tags: ['react'],
        featured: true,
        heroImage: '/assets/hero.jpg',
        heroImageAlt: 'Hero',
      },
      {
        slug: 'second-article',
        title: 'Second Article',
        excerpt: 'Second excerpt',
        author: 'Dan Henderson',
        publishedAt: '2025-02-15',
        readingTimeMinutes: 6,
        tags: ['typescript'],
      },
    ],
    featuredPost: {
      slug: 'featured-article',
      title: 'Featured Article',
      subtitle: 'A subtitle',
      excerpt: 'Featured excerpt',
      author: 'Dan Henderson',
      publishedAt: '2025-03-01',
      readingTimeMinutes: 10,
      tags: ['react'],
      featured: true,
      heroImage: '/assets/hero.jpg',
      heroImageAlt: 'Hero',
      content: [],
    },
    tags: [
      { tag: 'react', count: 1 },
      { tag: 'typescript', count: 1 },
    ],
    getPostBySlug: jest.fn(),
    getRelatedPosts: jest.fn(() => []),
    getAdjacentPosts: jest.fn(() => ({})),
    status: {
      source: 'static',
      loading: false,
      error: null,
      isFallback: false,
      reason: 'bundled-content',
      freshness: { label: 'Bundled', isStale: false },
    },
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

describe('Blog', () => {
  it('renders the blog index with article count and section heading', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Blog />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('2 articles')).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
  });

  it('renders the featured article hero', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Blog />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Featured Article' })).toBeInTheDocument();
    expect(screen.getByText('Featured excerpt')).toBeInTheDocument();
  });

  it('renders tag filter chips', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Blog />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('react (1)')).toBeInTheDocument();
    expect(screen.getByText('typescript (1)')).toBeInTheDocument();
  });

  it('renders non-featured posts in the list', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Blog />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });
});
