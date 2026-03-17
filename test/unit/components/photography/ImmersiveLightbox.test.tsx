import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { ImmersiveLightbox } from '../../../../src/components/photography/ImmersiveLightbox';
import type { PhotoItem } from '../../../../src/types/data';

const photos: PhotoItem[] = [
  { img: '/assets/photography/photo-0.jpg', title: 'Mountain Vista' },
  { img: '/assets/photography/photo-1.jpg', title: 'Valley Floor' },
  { img: '/assets/photography/photo-2.jpg', title: 'MISSING', location: 'Yosemite' },
];

const onCloseMock = jest.fn();

const renderLightbox = (
  overrides: Partial<{
    photos: PhotoItem[];
    initialIndex: number;
    open: boolean;
    albumLabel: string;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <ImmersiveLightbox
        photos={overrides.photos ?? photos}
        initialIndex={overrides.initialIndex ?? 0}
        open={overrides.open ?? true}
        onClose={onCloseMock}
        albumLabel={overrides.albumLabel ?? 'Test Album'}
      />
    </ThemeProvider>
  );

describe('ImmersiveLightbox', () => {
  beforeEach(() => {
    onCloseMock.mockClear();
  });

  describe('rendering', () => {
    it('renders nothing when photos array is empty', () => {
      const { container } = render(
        <ThemeProvider>
          <ImmersiveLightbox photos={[]} initialIndex={0} open onClose={onCloseMock} />
        </ThemeProvider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders the photo at initialIndex when opened', () => {
      renderLightbox({ initialIndex: 1 });
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', photos[1].img);
      expect(img).toHaveAttribute('alt', photos[1].title);
    });

    it('shows the photo count indicator', () => {
      renderLightbox({ initialIndex: 0 });
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('uses a fallback title for a photo whose title is "MISSING"', () => {
      renderLightbox({ initialIndex: 2 });
      const img = screen.getByRole('img');
      // Should not use "MISSING" as alt text
      expect(img.getAttribute('alt')).not.toBe('MISSING');
      expect(img.getAttribute('alt')).toContain('Test Album');
    });

    it('renders location when the current photo has one', () => {
      renderLightbox({ initialIndex: 2 });
      expect(screen.getByText('Yosemite')).toBeInTheDocument();
    });

    it('does not render location when the current photo lacks one', () => {
      renderLightbox({ initialIndex: 0 });
      expect(screen.queryByText('Yosemite')).not.toBeInTheDocument();
    });
  });

  describe('navigation buttons', () => {
    it('advances to the next photo when the Next button is clicked', () => {
      renderLightbox({ initialIndex: 0 });
      fireEvent.click(screen.getByLabelText('Next photo'));
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[1].img);
    });

    it('retreats to the previous photo when the Previous button is clicked', () => {
      renderLightbox({ initialIndex: 1 });
      fireEvent.click(screen.getByLabelText('Previous photo'));
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[0].img);
    });

    it('wraps from the last photo to the first on Next', () => {
      renderLightbox({ initialIndex: 2 });
      fireEvent.click(screen.getByLabelText('Next photo'));
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[0].img);
    });

    it('wraps from the first photo to the last on Previous', () => {
      renderLightbox({ initialIndex: 0 });
      fireEvent.click(screen.getByLabelText('Previous photo'));
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[2].img);
    });

    it('does not render navigation buttons when there is only one photo', () => {
      renderLightbox({ photos: [photos[0]], initialIndex: 0 });
      expect(screen.queryByLabelText('Next photo')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous photo')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('advances to the next photo on ArrowRight', () => {
      renderLightbox({ initialIndex: 0 });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[1].img);
    });

    it('retreats to the previous photo on ArrowLeft', () => {
      renderLightbox({ initialIndex: 1 });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[0].img);
    });
  });

  describe('close', () => {
    it('calls onClose when the Close button is clicked', () => {
      renderLightbox();
      fireEvent.click(screen.getByLabelText('Close lightbox'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('initialIndex sync when re-opened', () => {
    it('resets to the new initialIndex when the lightbox is reopened with a different index', () => {
      const { rerender } = renderLightbox({ initialIndex: 0, open: false });
      rerender(
        <ThemeProvider>
          <ImmersiveLightbox
            photos={photos}
            initialIndex={2}
            open
            onClose={onCloseMock}
            albumLabel="Test Album"
          />
        </ThemeProvider>
      );
      expect(screen.getByRole('img')).toHaveAttribute('src', photos[2].img);
    });
  });

  describe('download link', () => {
    it('renders a download link with the correct filename from the photo URL', () => {
      renderLightbox({ initialIndex: 0 });
      const downloadLink = screen.getByLabelText(`Download ${photos[0].title}`);
      expect(downloadLink).toHaveAttribute('download', 'photo-0.jpg');
    });

    it('strips query strings from the download filename', () => {
      const photosWithQuery: PhotoItem[] = [
        { img: '/assets/photo.jpg?v=123', title: 'Scenic View' },
      ];
      renderLightbox({ photos: photosWithQuery, initialIndex: 0 });
      const downloadLink = screen.getByLabelText('Download Scenic View');
      expect(downloadLink).toHaveAttribute('download', 'photo.jpg');
    });

    it('strips hash fragments from the download filename', () => {
      const photosWithHash: PhotoItem[] = [
        { img: '/assets/photo.jpg#section', title: 'Scenic View' },
      ];
      renderLightbox({ photos: photosWithHash, initialIndex: 0 });
      const downloadLink = screen.getByLabelText('Download Scenic View');
      expect(downloadLink).toHaveAttribute('download', 'photo.jpg');
    });
  });
});
