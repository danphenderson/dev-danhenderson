import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useTheme as useAppTheme } from '../ThemeProvider';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import Header from './Header';

jest.mock('../ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../WelcomeAudioProvider', () => ({
  useWelcomeAudio: jest.fn(),
}));

const mockUseAppTheme = useAppTheme as jest.MockedFunction<typeof useAppTheme>;
const mockUseWelcomeAudio = useWelcomeAudio as jest.MockedFunction<typeof useWelcomeAudio>;

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
  showPauseHint: false,
  setShowPauseHint: jest.fn(),
  showDarkModeHint: false,
  setShowDarkModeHint: jest.fn(),
  ...overrides,
});

describe('Header controls', () => {
  beforeEach(() => {
    mockUseAppTheme.mockReturnValue({
      theme: {} as any,
      mode: 'light',
      toggleTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('plays audio when the play button is clicked', () => {
    const play = jest.fn().mockResolvedValue(undefined);
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ isPlaying: false, play }));

    render(
      <MemoryRouter initialEntries={['/cv']}>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('pauses audio when the pause button is clicked', () => {
    const pause = jest.fn();
    mockUseWelcomeAudio.mockReturnValue(createAudioState({ isPlaying: true, pause }));

    render(
      <MemoryRouter initialEntries={['/cv']}>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pause welcome audio' }));
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('toggles theme and dismisses dark mode hint when theme button is clicked', () => {
    const toggleTheme = jest.fn();
    const setShowDarkModeHint = jest.fn();
    mockUseAppTheme.mockReturnValue({
      theme: {} as any,
      mode: 'light',
      toggleTheme,
    });
    mockUseWelcomeAudio.mockReturnValue(
      createAudioState({
        showDarkModeHint: true,
        setShowDarkModeHint,
      })
    );

    render(
      <MemoryRouter initialEntries={['/cv']}>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Toggle color theme'));
    expect(setShowDarkModeHint).toHaveBeenCalledWith(false);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
