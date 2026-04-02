import { render, screen } from '@testing-library/react';
import { useEffect, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import Photography from '../../../src/pages/Photography';

const mockCategories = [
  {
    slug: 'landscape',
    name: 'Landscape',
    description: 'Landscape photos',
    src: '/assets/landscape.jpg',
    featured: true,
    album: [{ img: '/img1.jpg', title: 'Photo 1' }],
  },
  {
    slug: 'astro',
    name: 'Astrophotography',
    description: 'Night sky photos',
    src: '/assets/astro.jpg',
    album: [{ img: '/img2.jpg', title: 'Photo 2' }],
  },
];

jest.mock('../../../src/motion', () => {
  const actual = jest.requireActual('../../../src/motion');

  return {
    ...actual,
    MotionTiltCard: ({ children, intensity }: { children: ReactNode; intensity?: number }) => (
      <div data-testid="photography-tilt-card" data-intensity={String(intensity ?? '')}>
        {children}
      </div>
    ),
  };
});

jest.mock('../../../src/hooks/usePhotographyData', () => ({
  usePhotographyData: () => ({
    categories: mockCategories,
    featuredCategory: mockCategories[0],
    totalPhotos: 2,
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

jest.mock('../../../src/components/BackToTopButton', () => ({
  BackToTopButton: () => <div data-testid="back-to-top-button" />,
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

describe('Photography', () => {
  it('renders the photography page with album count and category cards', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('2 photos · 2 albums')).toBeInTheDocument();
    expect(screen.getByText('Landscape')).toBeInTheDocument();
    expect(screen.getByText('Astrophotography')).toBeInTheDocument();
    expect(screen.getByText('Landscape photos')).toBeInTheDocument();
    expect(screen.getByText('Night sky photos')).toBeInTheDocument();
    expect(screen.getAllByText('View album')).toHaveLength(2);
    expect(screen.queryByTestId('back-to-top-button')).not.toBeInTheDocument();
  });

  it('renders category cards with links to their slug routes', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    const viewAlbumLinks = screen.getAllByRole('link', { name: 'View album' });

    expect(viewAlbumLinks).toHaveLength(2);
    expect(viewAlbumLinks[0]).toHaveAttribute('href', '/photography/landscape');
    expect(viewAlbumLinks[1]).toHaveAttribute('href', '/photography/astro');
  });

  it('renders the photography overline heading', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('A collection of photo albums.')).toBeInTheDocument();
  });

  it('starts the subtitle typewriter when the intro card becomes visible', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByTestId('typewriter-text')).toHaveAttribute('data-playing', 'true');
  });

  it('renders the intro and album cards inside MotionTiltCard surfaces', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    const tiltCards = screen.getAllByTestId('photography-tilt-card');
    const introCard = screen
      .getByText('Photography')
      .closest('[data-testid="photography-tilt-card"]');
    const featuredAlbumCard = screen
      .getByText('Landscape')
      .closest('[data-testid="photography-tilt-card"]');
    const supportingAlbumCard = screen
      .getByText('Astrophotography')
      .closest('[data-testid="photography-tilt-card"]');

    expect(tiltCards).toHaveLength(3);
    expect(introCard).toHaveAttribute('data-intensity', '0.5');
    expect(featuredAlbumCard).not.toBeNull();
    expect(supportingAlbumCard).not.toBeNull();
  });
});
