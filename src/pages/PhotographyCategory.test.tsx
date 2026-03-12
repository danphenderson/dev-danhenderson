import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { routerFuture } from '../routerFuture';
import ThemeProvider from '../ThemeProvider';
import PhotographyCategory from './PhotographyCategory';

jest.mock('../hooks/usePhotographyData', () => ({
  usePhotographyData: () => ({
    categories: [
      {
        slug: 'landscape',
        name: 'Landscape',
        description: 'Landscape photos',
        src: '/assets/landscape.jpg',
        album: [
          { img: '/img1.jpg', title: 'Photo 1' },
          { img: '/img2.jpg', title: 'Photo 2' },
        ],
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

jest.mock('../components/PhotoAlbum', () => ({
  QuiltedImageList: ({ albumLabel }: { albumLabel: string }) => (
    <div data-testid="quilted-image-list">{albumLabel}</div>
  ),
}));

const renderWithSlug = (slug: string) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/photography/${slug}`]} future={routerFuture}>
        <Routes>
          <Route path="/photography/:slug" element={<PhotographyCategory />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('PhotographyCategory', () => {
  it('renders the album for a matching slug', () => {
    renderWithSlug('landscape');

    expect(screen.getByRole('heading', { name: 'Landscape' })).toBeInTheDocument();
    expect(screen.getByText('Landscape photos')).toBeInTheDocument();
    expect(screen.getByText('2 photos')).toBeInTheDocument();
    expect(screen.getByTestId('quilted-image-list')).toBeInTheDocument();
    expect(screen.getByText('Back to photography')).toBeInTheDocument();
  });

  it('shows not-found message for an unknown slug', () => {
    renderWithSlug('nonexistent');

    expect(screen.getByText('Album not found')).toBeInTheDocument();
    expect(screen.getByText('This album does not exist or has been moved.')).toBeInTheDocument();
  });
});
