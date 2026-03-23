import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { QuiltedImageList } from '../../../src/components/PhotoAlbum';

jest.mock('../../../src/components/photography/TiltCard', () => ({
  TiltCard: ({ children, ...props }: { children: ReactNode }) => (
    <div data-testid="photo-tile-tilt" {...props}>
      {children}
    </div>
  ),
}));

describe('QuiltedImageList', () => {
  it('wraps each photo tile in a tilt card and renders a download action for each photo tile', () => {
    render(
      <ThemeProvider>
        <QuiltedImageList
          imageData={[
            {
              img: '/assets/photography/landscape/sunset-ridge.jpg',
              title: 'Sunset Ridge',
              rows: 1,
              cols: 1,
            },
            {
              img: '/assets/photography/landscape/fallback-name.jpg?cache=1',
              title: 'Missing',
              rows: 1,
              cols: 1,
            },
          ]}
          albumLabel="Landscape"
        />
      </ThemeProvider>
    );

    const tiltWrappers = screen.getAllByTestId('photo-tile-tilt');
    const titledDownloadLink = screen.getByRole('link', { name: 'Download Sunset Ridge' });
    const fallbackDownloadLink = screen.getByRole('link', { name: 'Download Landscape 2' });

    expect(tiltWrappers).toHaveLength(2);
    tiltWrappers.forEach((wrapper) => {
      expect(wrapper).toHaveStyle({ height: '100%', width: '100%' });
    });
    expect(titledDownloadLink).toHaveAttribute(
      'href',
      '/assets/photography/landscape/sunset-ridge.jpg'
    );
    expect(titledDownloadLink).toHaveAttribute('download', 'sunset-ridge.jpg');
    expect(fallbackDownloadLink).toHaveAttribute('download', 'fallback-name.jpg');
  });

  it('keeps a photo tile clickable when onPhotoClick is provided', () => {
    const onPhotoClick = jest.fn();

    render(
      <ThemeProvider>
        <QuiltedImageList
          imageData={[
            {
              img: '/assets/photography/landscape/sunset-ridge.jpg',
              title: 'Sunset Ridge',
              rows: 1,
              cols: 1,
            },
          ]}
          albumLabel="Landscape"
          onPhotoClick={onPhotoClick}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sunset Ridge' }));

    expect(onPhotoClick).toHaveBeenCalledWith(0);
  });
});
