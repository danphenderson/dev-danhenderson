import { render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import { QuiltedImageList } from './PhotoAlbum';

describe('QuiltedImageList', () => {
  it('renders a download action for each photo tile', () => {
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

    const titledDownloadLink = screen.getByRole('link', { name: 'Download Sunset Ridge' });
    const fallbackDownloadLink = screen.getByRole('link', { name: 'Download Landscape 2' });

    expect(titledDownloadLink).toHaveAttribute(
      'href',
      '/assets/photography/landscape/sunset-ridge.jpg'
    );
    expect(titledDownloadLink).toHaveAttribute('download', 'sunset-ridge.jpg');
    expect(fallbackDownloadLink).toHaveAttribute('download', 'fallback-name.jpg');
  });
});
