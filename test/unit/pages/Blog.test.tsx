import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect, type ComponentProps, type ComponentType, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import Blog from '../../../src/pages/Blog';

const MemoryRouterWithFuture = MemoryRouter as unknown as ComponentType<
  ComponentProps<typeof MemoryRouter> & { future?: typeof routerFuture }
>;

jest.mock('../../../src/motion', () => {
  const actual = jest.requireActual('../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({ children, intensity }: { children: ReactNode; intensity?: number }) => (
      <div data-testid="blog-tilt-card" data-intensity={String(intensity ?? '')}>
        {children}
      </div>
    ),
  };
});

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
  }),
}));

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({
    children,
    onVisible,
  }: {
    children: ReactNode;
    onVisible?: () => void;
  }) => {
    useEffect(() => {
      onVisible?.();
    }, [onVisible]);

    return <div>{children}</div>;
  },
}));

jest.mock('../../../src/components/text', () => {
  const actual = jest.requireActual('../../../src/components/text');

  return {
    ...actual,
    TypewriterText: ({ text, playing }: { text: string; playing?: boolean }) => (
      <span data-testid="typewriter-text" data-playing={String(Boolean(playing))}>
        {text}
      </span>
    ),
  };
});

describe('Blog', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the blog index with article count and section heading', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    expect(screen.getByText('2 articles')).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
  });

  it('starts the intro typewriter after the intro card becomes visible', () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    expect(screen.getByTestId('typewriter-text')).toHaveAttribute('data-playing', 'false');

    act(() => {
      jest.advanceTimersByTime(480);
    });

    expect(screen.getByTestId('typewriter-text')).toHaveAttribute('data-playing', 'true');
  });

  it('renders the intro card inside a MotionTiltCard surface', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    const introCard = screen.getByText('Blog').closest('[data-testid="blog-tilt-card"]');

    expect(introCard).toHaveAttribute('data-intensity', '0.5');
    expect(introCard).toContainElement(
      screen.getByText(
        'Future home of technical notes on software engineering and applied mathematics.'
      )
    );
  });

  it('renders the featured article hero', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Featured Article' })).toBeInTheDocument();
    expect(screen.getByText('Featured excerpt')).toBeInTheDocument();
  });

  it('renders tag filter chips', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /typescript \(1\)/i })).toBeInTheDocument();
  });

  it('renders non-featured posts in the list', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('hides the featured hero when the active tag does not match it', () => {
    render(
      <ThemeProvider>
        <MemoryRouterWithFuture future={routerFuture}>
          <Blog />
        </MemoryRouterWithFuture>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /typescript \(1\)/i }));

    expect(
      screen.queryByRole('heading', { level: 2, name: 'Featured Article' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });
});
