import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../routerFuture';
import ThemeProvider from '../ThemeProvider';
import Photography from './Photography';

jest.mock('../hooks/usePhotographyData', () => ({
  usePhotographyData: () => ({
    categories: [
      {
        slug: 'landscape',
        name: 'Landscape',
        description: 'Landscape photos',
        src: '/assets/landscape.jpg',
        album: [{ img: '/img1.jpg', title: 'Photo 1' }],
      },
      {
        slug: 'astro',
        name: 'Astrophotography',
        description: 'Night sky photos',
        src: '/assets/astro.jpg',
        album: [{ img: '/img2.jpg', title: 'Photo 2' }],
      },
    ],
  }),
}));

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/BackToTopButton', () => ({
  BackToTopButton: () => <div data-testid="back-to-top-button" />,
}));

describe('Photography', () => {
  it('renders the photography page with album count and category cards', () => {
    render(
      <ThemeProvider>
        <MemoryRouter future={routerFuture}>
          <Photography />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('2 albums')).toBeInTheDocument();
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
    expect(
      screen.getByText('A selection of field work, climbing days, and stargazing nights.')
    ).toBeInTheDocument();
  });
});
