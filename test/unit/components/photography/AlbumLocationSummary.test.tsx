import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { AlbumLocationSummary } from '../../../../src/components/photography/AlbumLocationSummary';
import type { PhotoItem } from '../../../../src/types/data';

const photos: PhotoItem[] = [
  { img: '/a.jpg', title: 'A', location: 'Yosemite' },
  { img: '/b.jpg', title: 'B', location: 'Zion' },
  { img: '/c.jpg', title: 'C', location: 'Yosemite' },
  { img: '/d.jpg', title: 'D' },
];

describe('AlbumLocationSummary', () => {
  it('returns null when no location, dateRange, or photo locations exist', () => {
    const { container } = render(
      <ThemeProvider>
        <AlbumLocationSummary photos={[{ img: '/x.jpg', title: 'X' }]} />
      </ThemeProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders album location and date range', () => {
    render(
      <ThemeProvider>
        <AlbumLocationSummary albumLocation="California" dateRange="Summer 2024" photos={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('· Summer 2024')).toBeInTheDocument();
  });

  it('renders unique photo location chips when more than one exists', () => {
    render(
      <ThemeProvider>
        <AlbumLocationSummary photos={photos} />
      </ThemeProvider>
    );

    expect(screen.getByText('Yosemite')).toBeInTheDocument();
    expect(screen.getByText('Zion')).toBeInTheDocument();
  });

  it('does not render location chips when only one unique location exists', () => {
    const singleLocation: PhotoItem[] = [
      { img: '/a.jpg', title: 'A', location: 'Yosemite' },
      { img: '/b.jpg', title: 'B', location: 'Yosemite' },
    ];

    render(
      <ThemeProvider>
        <AlbumLocationSummary photos={singleLocation} />
      </ThemeProvider>
    );

    // Only one unique location — no chips rendered (the threshold is > 1)
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
