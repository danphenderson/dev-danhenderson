import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MemoryRouter } from 'react-router-dom';
import { useAppTheme } from '../../../src/ThemeProvider';
import { createAppTheme } from '../../../src/theme/createAppTheme';
import type { AppAppearanceKey } from '../../../src/theme/appAppearance';
import { useWelcomeAudio } from '../../../src/WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../../../src/WelcomeOnboardingProvider';
import Header from '../../../src/components/Header';
import { routerFuture } from '../../../src/routerFuture';

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('../../../src/ThemeProvider', () => ({
  useAppTheme: jest.fn(),
}));

jest.mock('../../../src/WelcomeAudioProvider', () => ({
  useWelcomeAudio: jest.fn(),
}));

jest.mock('../../../src/WelcomeOnboardingProvider', () => ({
  useWelcomeOnboarding: jest.fn(),
}));

jest.mock('../../../src/components/header/HeaderAppearanceDial', () => ({
  HeaderAppearanceDial: ({
    onChangeAppearance,
    onToggleTheme,
    mode,
  }: {
    onChangeAppearance?: (appearance: AppAppearanceKey) => void;
    onToggleTheme?: () => void;
    mode?: 'light' | 'dark';
  }) => (
    <div data-testid="header-appearance-dial">
      <button type="button" aria-label="Open appearance presets">
        Open appearance presets
      </button>
      {onToggleTheme ? (
        <button
          type="button"
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => onToggleTheme()}
        >
          Toggle theme
        </button>
      ) : null}
      {onChangeAppearance ? (
        <button
          type="button"
          aria-label="Use Ember appearance"
          onClick={() => onChangeAppearance('ember')}
        >
          Use Ember appearance
        </button>
      ) : null}
    </div>
  ),
}));

jest.mock('../../../src/components/header/HeaderMotionDial', () => ({
  HeaderMotionDial: () => <div data-testid="header-motion-dial" />,
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
const mockUseAppTheme = useAppTheme as jest.MockedFunction<typeof useAppTheme>;
const mockUseWelcomeAudio = useWelcomeAudio as jest.MockedFunction<typeof useWelcomeAudio>;
const mockUseWelcomeOnboarding = useWelcomeOnboarding as jest.MockedFunction<
  typeof useWelcomeOnboarding
>;

const createAudioState = (
  overrides: Partial<ReturnType<typeof useWelcomeAudio>> = {}
): ReturnType<typeof useWelcomeAudio> => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  isPlaying: false,
  ready: true,
  error: undefined,
  audioConsent: 'granted',
  grantAudioConsent: jest.fn(),
  declineAudioConsent: jest.fn(),
  ...overrides,
});

const createOnboardingState = (
  overrides: Partial<ReturnType<typeof useWelcomeOnboarding>> = {}
): ReturnType<typeof useWelcomeOnboarding> => ({
  showPauseHint: false,
  showDarkModeHint: false,
  openPauseHint: jest.fn(),
  dismissPauseHint: jest.fn(),
  openDarkModeHint: jest.fn(),
  dismissDarkModeHint: jest.fn(),
  resetHints: jest.fn(),
  ...overrides,
});

const renderHeader = (initialEntry: string) =>
  render(
    <MuiThemeProvider theme={createAppTheme('light', 'evergreen')}>
      <MemoryRouter initialEntries={[initialEntry]} future={routerFuture}>
        <Header />
      </MemoryRouter>
    </MuiThemeProvider>
  );

describe('Header controls', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance: jest.fn(),
      toggleTheme: jest.fn(),
      motionIntensity: 'default' as const,
      setMotionIntensity: jest.fn(),
    });
    mockUseWelcomeAudio.mockReturnValue(createAudioState());
    mockUseWelcomeOnboarding.mockReturnValue(createOnboardingState());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('plays audio when the play button is clicked', () => {
    const play = jest.fn().mockResolvedValue(undefined);
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ isPlaying: false, play }));

    renderHeader('/cv');

    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('pauses audio when the pause button is clicked', () => {
    const pause = jest.fn();
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ isPlaying: true, pause }));

    renderHeader('/cv');

    fireEvent.click(screen.getByRole('button', { name: 'Pause welcome audio' }));
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('hides the audio control when welcome audio consent was declined', () => {
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ audioConsent: 'declined' }));

    renderHeader('/cv');

    expect(screen.queryByRole('button', { name: 'Play welcome audio' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause welcome audio' })).not.toBeInTheDocument();
  });

  it('toggles theme and dismisses dark mode hint when the theme dial action is clicked', () => {
    const toggleTheme = jest.fn();
    const setAppearance = jest.fn();
    const dismissDarkModeHint = jest.fn();
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance,
      toggleTheme,
      motionIntensity: 'default' as const,
      setMotionIntensity: jest.fn(),
    });
    mockUseWelcomeOnboarding.mockReturnValue(
      createOnboardingState({
        showDarkModeHint: true,
        dismissDarkModeHint,
      })
    );

    renderHeader('/cv');

    fireEvent.click(screen.getByLabelText('Switch to dark mode'));
    expect(dismissDarkModeHint).toHaveBeenCalledTimes(1);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders the appearance dial on the home route and forwards preset changes', () => {
    const setAppearance = jest.fn();
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance,
      toggleTheme: jest.fn(),
      motionIntensity: 'default' as const,
      setMotionIntensity: jest.fn(),
    });

    renderHeader('/');

    expect(screen.getByTestId('header-appearance-dial')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Use Ember appearance' }));

    expect(setAppearance).toHaveBeenCalledTimes(1);
    expect(setAppearance).toHaveBeenCalledWith('ember');
  });

  it('always shows navigation links on desktop with avatar home link', () => {
    renderHeader('/cv');

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).toHaveAttribute(
      'href',
      '/climbing'
    );
    expect(screen.getByRole('link', { name: 'Go to Photography' })).toHaveAttribute(
      'href',
      '/photography'
    );
  });

  it('marks the active page with aria-current on desktop', () => {
    renderHeader('/cv');

    expect(screen.getByRole('link', { name: 'Go to CV' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('shows only the mobile menu trigger on mobile away from the home route', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/cv');

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
  });

  it('shows navigation links on the home route without the avatar', () => {
    renderHeader('/');

    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).toHaveAttribute(
      'href',
      '/climbing'
    );
    expect(screen.getByRole('link', { name: 'Go to Photography' })).toHaveAttribute(
      'href',
      '/photography'
    );
  });

  it('shows the mobile menu trigger on the home route', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/');

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
  });

  it('passes photography detail routes through to the mobile menu destination set', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/photography/landscape');

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));

    expect(screen.getByRole('menuitem', { name: 'CV' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Daniel Henderson Home' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Photography' })).not.toBeInTheDocument();
  });
});

describe('Header mobile layout', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance: jest.fn(),
      toggleTheme: jest.fn(),
      motionIntensity: 'default' as const,
      setMotionIntensity: jest.fn(),
    });
    mockUseWelcomeAudio.mockReturnValue(createAudioState());
    mockUseWelcomeOnboarding.mockReturnValue(createOnboardingState());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the site header (AppBar) as a landmark on mobile', () => {
    renderHeader('/cv');
    // MUI AppBar renders as <header role="banner"> — verifies the fixed AppBar is present
    const headerBanner = screen.getByRole('banner');
    expect(headerBanner).toBeInTheDocument();
    expect(headerBanner).toHaveAttribute('id', 'site-navigation');
  });

  it('renders the offset toolbar spacer so content does not slide under the fixed header', () => {
    renderHeader('/cv');
    // The offset Toolbar creates a spacer equal to the header height so the page
    // body starts below the fixed AppBar — regression: without this the header
    // overlaps the main page content on mobile.
    expect(screen.getByTestId('header-offset')).toBeInTheDocument();
  });

  it('renders both the fixed AppBar and the offset spacer on mobile', () => {
    renderHeader('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('header-offset')).toBeInTheDocument();
  });

  it('shows the mobile hamburger menu button rather than inline nav links', () => {
    renderHeader('/cv');
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    // Desktop nav links must not be rendered on mobile
    expect(screen.queryByRole('link', { name: 'Go to CV' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Climbing' })).not.toBeInTheDocument();
  });

  it('opens the mobile nav menu when the hamburger button is clicked', () => {
    renderHeader('/cv');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('hides the mobile menu when isMobile transitions from true to false', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const { rerender } = renderHeader('/cv');

    // Open the mobile menu
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Simulate a viewport resize to desktop
    mockUseMediaQuery.mockReturnValue(false);
    rerender(
      <MuiThemeProvider theme={createAppTheme('light', 'evergreen')}>
        <MemoryRouter initialEntries={['/cv']} future={routerFuture}>
          <Header />
        </MemoryRouter>
      </MuiThemeProvider>
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
