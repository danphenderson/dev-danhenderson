import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { AlbumShareButton } from '../../../../src/components/photography/AlbumShareButton';

describe('AlbumShareButton', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a share button with the album name in the accessible label', () => {
    render(
      <ThemeProvider>
        <AlbumShareButton
          albumName="Yosemite"
          albumSlug="yosemite"
          albumDescription="Nature photos"
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Share Yosemite album' })).toBeInTheDocument();
  });

  it('copies the canonical URL to clipboard when navigator.share is unavailable', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    // Ensure navigator.share is not present
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });

    render(
      <ThemeProvider>
        <AlbumShareButton
          albumName="Yosemite"
          albumSlug="yosemite"
          albumDescription="Nature photos"
        />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Share Yosemite album' }).click();
    });

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/photography/yosemite'));
  });

  it('shows a copied confirmation state after successful clipboard write', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });

    render(
      <ThemeProvider>
        <AlbumShareButton
          albumName="Yosemite"
          albumSlug="yosemite"
          albumDescription="Nature photos"
        />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Share Yosemite album' }).click();
    });

    expect(
      screen.getByRole('button', { name: 'Album link copied to clipboard' })
    ).toBeInTheDocument();
  });
});
