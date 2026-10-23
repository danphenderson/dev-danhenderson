import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../../src/routerFuture';
import ThemeProvider from '../../../../src/ThemeProvider';
import { AlbumCard } from '../../../../src/components/photography/AlbumCard';
import type { PhotoCategory } from '../../../../src/types/data';

jest.mock('../../../../src/motion', () => ({
  MotionImage: ({ src, alt, ...rest }: any) => (
    <img src={src} alt={alt} data-testid="album-image" {...rest} />
  ),
}));

const category: PhotoCategory = {
  slug: 'yosemite',
  name: 'Yosemite',
  description: 'Photos from Yosemite National Park.',
  src: '/assets/photography/yosemite/cover.jpg',
  location: 'California, USA',
  dateRange: 'Aug 2024',
  album: [
    { img: '/assets/photography/yosemite/1.jpg', title: 'Half Dome' },
    { img: '/assets/photography/yosemite/2.jpg', title: 'El Capitan' },
  ],
};

describe('AlbumCard', () => {
  const renderCard = (variant: 'hero' | 'grid' = 'grid') =>
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <AlbumCard category={category} variant={variant} />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('renders the album name and description', () => {
    renderCard();

    expect(screen.getByRole('heading', { name: 'Yosemite' })).toBeInTheDocument();
    expect(screen.getByText('Photos from Yosemite National Park.')).toBeInTheDocument();
  });

  it('renders location and date range', () => {
    renderCard();

    expect(screen.getByText('California, USA')).toBeInTheDocument();
    expect(screen.getByText('· Aug 2024')).toBeInTheDocument();
  });

  it('renders photo count', () => {
    renderCard();

    expect(screen.getByText('2 photos')).toBeInTheDocument();
  });

  it('renders a link to the album page', () => {
    renderCard();

    const link = screen.getByRole('link', { name: 'View album' });

    expect(link).toHaveAttribute('href', '/photography/yosemite');
  });

  it('renders the cover image', () => {
    renderCard();

    const img = screen.getByTestId('album-image');

    expect(img).toHaveAttribute('src', '/assets/photography/yosemite/cover.jpg');
    expect(img).toHaveAttribute('alt', 'Yosemite');
  });

  it('omits location info when not provided', () => {
    const noLocation: PhotoCategory = { ...category, location: undefined, dateRange: undefined };

    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <AlbumCard category={noLocation} variant="grid" />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText('California, USA')).not.toBeInTheDocument();
    expect(screen.queryByText('· Aug 2024')).not.toBeInTheDocument();
  });

  describe('when the display derivative fails to load', () => {
    const displayCategory: PhotoCategory = {
      ...category,
      src: '/assets/photography/landscape/landscape-tieton-south-fork-1.jpg',
    };

    const renderWithReady = (onImageReady?: (src: string) => void) =>
      render(
        <MemoryRouter future={routerFuture}>
          <ThemeProvider>
            <AlbumCard category={displayCategory} variant="hero" onImageReady={onImageReady} />
          </ThemeProvider>
        </MemoryRouter>
      );

    it('retries the original photograph instead of leaving the cover blank', () => {
      renderWithReady();

      const img = screen.getByTestId('album-image');
      expect(img).toHaveAttribute('src', expect.stringContaining('/assets/display/'));

      fireEvent.error(img);

      expect(img).toHaveAttribute('src', displayCategory.src);
      expect(img).not.toHaveAttribute('srcset');
    });

    it('keeps the album loading indicator pending until the retry resolves', () => {
      const onImageReady = jest.fn();
      renderWithReady(onImageReady);

      const img = screen.getByTestId('album-image');

      fireEvent.error(img);
      expect(onImageReady).not.toHaveBeenCalled();

      // The original failed too, so the cover must stop being counted as pending.
      fireEvent.error(img);
      expect(onImageReady).toHaveBeenCalledWith(displayCategory.src);
    });

    it('still settles loading when the retry succeeds', () => {
      const onImageReady = jest.fn();
      renderWithReady(onImageReady);

      const img = screen.getByTestId('album-image');

      fireEvent.error(img);
      fireEvent.load(img);

      expect(onImageReady).toHaveBeenCalledWith(displayCategory.src);
    });
  });
});
