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
  it('shows identity and navigation immediately while keeping customization optional', async () => {
    renderHomeRoute();

    expect(screen.getByRole('heading', { level: 1, name: 'Daniel Henderson' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore my CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'View projects' })).toHaveAttribute(
      'href',
      '/cv#cv-coding'
    );
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Customize appearance & audio' }));

    await waitFor(() =>
      expect(screen.getByTestId('customize-modal-open')).toHaveTextContent('true')
    );

    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));

    await waitFor(() => expect(screen.getByTestId('settings-hint-open')).toHaveTextContent('true'));

    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));

    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );
    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });

  it('skips onboarding for returning visitors and renders the ping-pong hero shell immediately', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.queryByText('Play welcome audio?')).not.toBeInTheDocument();
    expect(screen.queryByText('Customize your experience')).not.toBeInTheDocument();
    expect(screen.queryByTestId('first-visit-settings-hint-popover')).not.toBeInTheDocument();
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
