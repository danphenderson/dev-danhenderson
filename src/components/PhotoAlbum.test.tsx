import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QuiltedImageList } from './PhotoAlbum';

describe('QuiltedImageList', () => {
  it('renders a download action for each photo with an accessible label and filename', () => {
    render(
      <QuiltedImageList
        albumLabel="Landscape"
        ImageData={[
          { img: '/assets/photography/landscape/photo-one.jpg', title: 'Sunset Rim' },
          { img: '/assets/photography/landscape/photo-two.jpg', title: 'Missing' },
        ]}
      />
    );

    const titledDownload = screen.getByRole('link', { name: 'Download Sunset Rim' });
    expect(titledDownload).toHaveAttribute('href', '/assets/photography/landscape/photo-one.jpg');
    expect(titledDownload).toHaveAttribute('download', 'photo-one.jpg');

    const fallbackDownload = screen.getByRole('link', { name: 'Download Landscape 2' });
    expect(fallbackDownload).toHaveAttribute('href', '/assets/photography/landscape/photo-two.jpg');
    expect(fallbackDownload).toHaveAttribute('download', 'photo-two.jpg');
  });
});
