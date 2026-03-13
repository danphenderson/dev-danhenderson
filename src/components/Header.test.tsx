import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MemoryRouter } from 'react-router-dom';
import { useAppTheme } from '../ThemeProvider';
import { createAppTheme } from '../theme/createAppTheme';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';
import Header from './Header';
import { routerFuture } from '../routerFuture';

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('../ThemeProvider', () => ({
  useAppTheme: jest.fn(),
}));

jest.mock('../WelcomeAudioProvider', () => ({
  useWelcomeAudio: jest.fn(),
}));

jest.mock('../WelcomeOnboardingProvider', () => ({
  useWelcomeOnboarding: jest.fn(),
}));

jest.mock('./header/HeaderPageDial', () => ({
  HeaderPageDial: ({
    actions,
  }: {
    actions: Array<{ id: string; label: string; to?: string }>;
  }) => (
    <div data-testid="header-page-dial">
      <button type="button" aria-label="Open page navigation">
        Open page navigation
      </button>
      {actions.map((action) => (
        <span
          key={action.id}
          data-testid="header-page-dial-action"
          data-label={action.label}
          data-path={action.to ?? ''}
        >
          {action.label}
        </span>
      ))}
    </div>
  ),
}));

jest.mock('./header/HeaderAppearanceDial', () => ({
  HeaderAppearanceDial: ({
    onChangeAppearance,
    onToggleTheme,
    mode,
  }: {
    onChangeAppearance?: (appearance: string) => void;
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
const mockUseWelcomeOnboarding = useWelcomeOnboarding as jest.MockedFunction<typeof useWelcomeOnboarding>;

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

const getPageDialActions = () =>
  screen.getAllByTestId('header-page-dial-action').map((action) => ({
    label: action.getAttribute('data-label'),
    path: action.getAttribute('data-path'),
  }));

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

  it('keeps the current desktop navigation links on the home route', () => {
    renderHeader('/');

    expect(screen.queryByTestId('header-page-dial')).not.toBeInTheDocument();
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

  it('keeps the current mobile menu trigger on the home route', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/');

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
    expect(screen.queryByTestId('header-page-dial')).not.toBeInTheDocument();
  });

  it('shows the cv page dial actions and hides the desktop nav links', () => {
    renderHeader('/cv');

    expect(screen.getByRole('button', { name: 'Open page navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('header-appearance-dial')).toBeInTheDocument();
    expect(getPageDialActions()).toEqual([
      { label: 'Climbing', path: '/climbing' },
      { label: 'Photography', path: '/photography' },
      { label: 'Home', path: '/' },
    ]);
    expect(screen.queryByRole('link', { name: 'Go to CV' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Climbing' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Photography' })).not.toBeInTheDocument();
  });

  it('hides the mobile hamburger when the page dial is active', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderHeader('/cv');

    expect(screen.getByRole('button', { name: 'Open page navigation' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open navigation menu' })).not.toBeInTheDocument();
  });

  it('uses the climbing page dial target set on the climbing route', () => {
    renderHeader('/climbing');

    expect(getPageDialActions()).toEqual([
      { label: 'CV', path: '/cv' },
      { label: 'Photography', path: '/photography' },
      { label: 'Home', path: '/' },
    ]);
  });

  it('uses the photography page dial target set on photography detail routes', () => {
    renderHeader('/photography/landscape');

    expect(getPageDialActions()).toEqual([
      { label: 'CV', path: '/cv' },
      { label: 'Climbing', path: '/climbing' },
      { label: 'Home', path: '/' },
    ]);
  });
});
