import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import {
  expectHeroParallaxSource,
  expectTerminalLinesStructure,
  mountLayoutAnchors,
  renderHomeRoute,
  renderHomeWithHeroVisible,
  resetHomeTestEnvironment,
  setElementRect,
  setViewportSize,
  PREFERENCE_STORAGE_KEYS,
} from './helpers/homeTestHarness';

afterEach(() => {
  resetHomeTestEnvironment();
});

describe('Home route integration', () => {
  it('renders the intro and hero immediately and opens preferences only on request', async () => {
    renderHomeRoute();

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
    expect(screen.getByRole('link', { name: 'Explore my CV' })).toBeVisible();
    expect(screen.queryByRole('region', { name: 'Make yourself at home' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Customize appearance & audio' }));
    expect(screen.getByRole('region', { name: 'Make yourself at home' })).toBeVisible();
    await act(async () => screen.getByRole('button', { name: 'Off', exact: true }).focus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Customize appearance & audio' })).toHaveFocus();

    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });

  it('exposes the preferences opener as a disclosure that keyboard users can enter and toggle', async () => {
    renderHomeRoute();
    const opener = screen.getByRole('button', { name: 'Customize appearance & audio' });
    expect(opener).toHaveAttribute('aria-expanded', 'false');
    expect(opener).not.toHaveAttribute('aria-controls');

    // Keyboard and assistive-technology activation dispatch clicks without a pointer count.
    fireEvent.click(opener, { detail: 0 });
    const region = screen.getByRole('region', { name: 'Make yourself at home' });
    expect(opener).toHaveAttribute('aria-expanded', 'true');
    expect(opener).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveFocus();

    fireEvent.click(opener, { detail: 1 });
    expect(opener).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(
        screen.queryByRole('region', { name: 'Make yourself at home' })
      ).not.toBeInTheDocument()
    );

    fireEvent.click(opener, { detail: 1 });
    expect(screen.getByRole('region', { name: 'Make yourself at home' })).not.toHaveFocus();
  });

  it('keeps the preferences panel available and in place while the IDE window is minimized', async () => {
    renderHomeRoute();
    fireEvent.click(screen.getByTestId('ide-minimize-btn'));
    await waitFor(() => expect(screen.queryByTestId('background-shell')).not.toBeInTheDocument());

    const opener = screen.getByRole('button', { name: 'Customize appearance & audio' });
    fireEvent.click(opener, { detail: 0 });
    const region = screen.getByRole('region', { name: 'Make yourself at home' });
    expect(opener).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveFocus();

    const restore = screen.getByRole('button', { name: 'Restore window' });
    await act(async () => restore.focus());
    fireEvent.click(restore);
    await waitFor(() => expect(screen.getByTestId('background-shell')).toBeInTheDocument());
    // Restoring the IDE must not remount the panel or pull focus back into it.
    expect(screen.getByRole('region', { name: 'Make yourself at home' })).toBe(region);
    expect(region).not.toHaveFocus();
  });

  it('skips onboarding for returning visitors and renders the ping-pong hero shell immediately', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.queryByRole('region', { name: 'Make yourself at home' })).not.toBeInTheDocument();
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));
  });

  it('expands inside the visible page viewport and restores the inline hero when toggled off', async () => {
    setViewportSize(1280, 800);
    const { header, mainContent } = mountLayoutAnchors();

    setElementRect(header, { left: 0, top: 0, width: 1280, height: 64 });
    setElementRect(mainContent, { left: 24, top: 40, width: 1000, height: 680 });

    await renderHomeWithHeroVisible();

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '');

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    const expandedOverlay = await screen.findByTestId('home-ide-expanded');

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'true')
    );
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '100%');
    expect(expandedOverlay).toHaveStyle({
      top: '64px',
      left: '24px',
      width: '1000px',
      height: '656px',
    });

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() => expect(screen.queryByTestId('home-ide-expanded')).not.toBeInTheDocument());
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '');
  });

  it('disables the hero parallax motion when the motion intensity preference is off', async () => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'off');

    await renderHomeWithHeroVisible();

    expectHeroParallaxSource('static');
  });
});
