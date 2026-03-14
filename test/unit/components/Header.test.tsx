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

  it('toggles theme and dismisses dark mode hint when the theme dial action is clicked', () => {
    const toggleTheme = jest.fn();
    const setAppearance = jest.fn();
    const dismissDarkModeHint = jest.fn();
    mockUseAppTheme.mockReturnValue({
      mode: 'light',
      appearance: 'evergreen',
      setAppearance,
      toggleTheme,
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

    expect(screen.getByRole('link', { name: 'Go to CV' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('shows avatar and mobile menu on mobile for all routes', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/cv');

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
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
});
