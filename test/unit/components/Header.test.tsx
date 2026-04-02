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

jest.mock('../../../src/components/header/HeaderSettingsPopover', () => ({
  HeaderSettingsPopover: ({
    onChangeAppearance,
    onToggleTheme,
    onToggleAudio,
    mode,
    showAudioControl,
    isPlaying,
    highlightSettingsTrigger,
  }: {
    onChangeAppearance?: (appearance: AppAppearanceKey) => void;
    onToggleTheme?: () => void;
    onToggleAudio?: () => void;
    mode?: 'light' | 'dark';
    showAudioControl?: boolean;
    isPlaying?: boolean;
    highlightSettingsTrigger?: boolean;
  }) => (
    <div
      data-testid="header-settings-popover"
      data-highlighted={highlightSettingsTrigger ? 'true' : 'false'}
    >
      <button type="button" aria-label="Open settings">
        Open settings
      </button>
      {onToggleTheme ? (
        <label>
          <input
            type="checkbox"
            aria-label="Toggle dark mode"
            checked={mode === 'dark'}
            onChange={() => onToggleTheme()}
          />
          Toggle dark mode
        </label>
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
      {showAudioControl && onToggleAudio ? (
        <button
          type="button"
          aria-label={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
          onClick={() => onToggleAudio()}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      ) : null}
    </div>
  ),
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
  onboardingCompleted: false,
  showCustomizeModal: false,
  showSettingsHint: false,
  openCustomizeModal: jest.fn(),
  advanceToSettingsHint: jest.fn(),
  completeOnboarding: jest.fn(),
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
      effectiveMotionIntensity: 'default' as const,
      isSystemMotionOverrideActive: false,
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

  it('hides the audio control when welcome audio consent was declined before onboarding completed', () => {
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ audioConsent: 'declined' }));

    renderHeader('/cv');

    expect(screen.queryByRole('button', { name: 'Play welcome audio' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause welcome audio' })).not.toBeInTheDocument();
  });

  it('shows the audio control after onboarding is completed even when audio was declined', () => {
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ audioConsent: 'declined' }));
    mockUseWelcomeOnboarding.mockReturnValue(createOnboardingState({ onboardingCompleted: true }));

    renderHeader('/cv');

    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeInTheDocument();
  });

  it('toggles theme when the theme action is clicked', () => {
    const toggleTheme = jest.fn();
    const setAppearance = jest.fn();
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance,
      toggleTheme,
      motionIntensity: 'default' as const,
      effectiveMotionIntensity: 'default' as const,
      isSystemMotionOverrideActive: false,
      setMotionIntensity: jest.fn(),
    });

    renderHeader('/cv');

    fireEvent.click(screen.getByLabelText('Toggle dark mode'));
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders the settings popover on the home route and forwards preset changes', () => {
    const setAppearance = jest.fn();
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance,
      toggleTheme: jest.fn(),
      motionIntensity: 'default' as const,
      effectiveMotionIntensity: 'default' as const,
      isSystemMotionOverrideActive: false,
      setMotionIntensity: jest.fn(),
    });

    renderHeader('/');

    expect(screen.getByTestId('header-settings-popover')).toBeInTheDocument();
    expect(screen.getByTestId('header-settings-popover')).toHaveAttribute(
      'data-highlighted',
      'false'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Use Ember appearance' }));

    expect(setAppearance).toHaveBeenCalledTimes(1);
    expect(setAppearance).toHaveBeenCalledWith('ember');
  });

  it('highlights the settings trigger on the home route while the settings hint is open', () => {
    mockUseWelcomeOnboarding.mockReturnValue(createOnboardingState({ showSettingsHint: true }));

    renderHeader('/');

    expect(screen.getByTestId('header-settings-popover')).toHaveAttribute(
      'data-highlighted',
      'true'
    );
  });

  it('does not highlight the settings trigger on non-home routes even while the settings hint is open', () => {
    mockUseWelcomeOnboarding.mockReturnValue(createOnboardingState({ showSettingsHint: true }));

    renderHeader('/cv');

    expect(screen.getByTestId('header-settings-popover')).toHaveAttribute(
      'data-highlighted',
      'false'
    );
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

  it('switches from desktop links to the mobile menu trigger when the viewport crosses below md', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { rerender } = renderHeader('/cv');

    expect(screen.getByRole('link', { name: 'Go to CV' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open navigation menu' })).not.toBeInTheDocument();

    mockUseMediaQuery.mockReturnValue(true);
    rerender(
      <MuiThemeProvider theme={createAppTheme('light', 'evergreen')}>
        <MemoryRouter initialEntries={['/cv']} future={routerFuture}>
          <Header />
        </MemoryRouter>
      </MuiThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to CV' })).not.toBeInTheDocument();
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
      effectiveMotionIntensity: 'default' as const,
      isSystemMotionOverrideActive: false,
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
