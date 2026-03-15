import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import PhotographyCategory from '../../../src/pages/PhotographyCategory';

jest.mock('../../../src/hooks/usePhotographyData', () => ({
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

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/PhotoAlbum', () => ({
  QuiltedImageList: ({ albumLabel }: { albumLabel: string }) => (
    <div data-testid="quilted-image-list">{albumLabel}</div>
  ),
}));

jest.mock('../../../src/components/BackToTopButton', () => ({
  BackToTopButton: () => <div data-testid="back-to-top-button" />,
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
    expect(screen.getByTestId('back-to-top-button')).toBeInTheDocument();
  });

  it('shows not-found message for an unknown slug', () => {
    renderWithSlug('nonexistent');

    expect(screen.getByText('Album not found')).toBeInTheDocument();
    expect(
      screen.getByText(/This album does not exist or has been moved\./)
    ).toBeInTheDocument();
    expect(screen.queryByTestId('quilted-image-list')).not.toBeInTheDocument();
  });

  it('renders a back-to-photography link that navigates to /photography', () => {
    renderWithSlug('landscape');

    const backLink = screen.getByRole('link', { name: /Back to photography/i });

    expect(backLink).toHaveAttribute('href', '/photography');
  });

  it('renders the photography overline on the category page', () => {
    renderWithSlug('landscape');

    expect(screen.getByText('Photography album')).toBeInTheDocument();
  });

  it('passes the category album label to the quilted image list', () => {
    renderWithSlug('landscape');

    expect(screen.getByTestId('quilted-image-list')).toHaveTextContent('Landscape');
  });

  it('renders the back-to-photography link even for an unknown slug', () => {
    renderWithSlug('nonexistent');

    const backLink = screen.getByRole('link', { name: /Back to photography/i });

    expect(backLink).toHaveAttribute('href', '/photography');
  });
});
