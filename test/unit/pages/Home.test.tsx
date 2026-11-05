import { fireEvent, screen, waitFor } from '@testing-library/react';
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
  it('renders the intro and hero immediately with only the CV action', async () => {
    renderHomeRoute();

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
    expect(screen.getByRole('link', { name: 'Explore my CV' })).toBeVisible();
    expect(screen.queryByRole('region', { name: 'Make yourself at home' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View projects' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Customize appearance & audio' })
    ).not.toBeInTheDocument();

    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });

  it('renders the ping-pong hero shell immediately with audio declined', async () => {
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
