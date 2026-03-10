import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import Home from './Home';

type MockWelcomeAudioState = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ready: boolean;
  error?: string;
  audioConsent: 'unknown' | 'granted' | 'declined';
  grantAudioConsent: () => void;
  declineAudioConsent: () => void;
  showPauseHint: boolean;
  setShowPauseHint: (show: boolean) => void;
  showDarkModeHint: boolean;
  setShowDarkModeHint: (show: boolean) => void;
};

const mockWelcomeAudioContext = React.createContext<MockWelcomeAudioState | null>(null);

const MockWelcomeAudioProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MockWelcomeAudioState;
}) => <mockWelcomeAudioContext.Provider value={value}>{children}</mockWelcomeAudioContext.Provider>;

jest.mock('../WelcomeAudioProvider', () => {
  const React = require('react');

  return {
    useWelcomeAudio: () => {
      const value = React.useContext(mockWelcomeAudioContext);
      if (!value) {
        throw new Error('Missing mock welcome audio state.');
      }
      return value;
    },
  };
});

jest.mock('../components/AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    visible,
  }: {
    children: React.ReactNode;
    visible?: boolean;
  }) => (
    <div data-testid="hero-card" data-visible={String(Boolean(visible))}>
      {children}
    </div>
  ),
}));

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({
    children,
    showShell,
  }: {
    children: React.ReactNode;
    showShell?: boolean;
  }) => (
    <div data-testid="background-paper" data-show-shell={String(Boolean(showShell))}>
      {children}
    </div>
  ),
}));

const HomeHarness = ({ initialAudioConsent = 'unknown' }: { initialAudioConsent?: MockWelcomeAudioState['audioConsent'] }) => {
  const [audioConsent, setAudioConsent] = React.useState<MockWelcomeAudioState['audioConsent']>(initialAudioConsent);
  const [isPlaying, setIsPlaying] = React.useState(initialAudioConsent === 'granted');
  const [showPauseHint, setShowPauseHint] = React.useState(false);
  const [showDarkModeHint, setShowDarkModeHint] = React.useState(false);
  const pause = React.useMemo(() => jest.fn(), []);
  const grantAudioConsent = React.useMemo(() => jest.fn(), []);

  const play = React.useCallback(async () => {
    setAudioConsent('granted');
    setIsPlaying(true);
  }, []);

  const declineAudioConsent = React.useCallback(() => {
    setAudioConsent('declined');
    setShowPauseHint(false);
  }, []);

  return (
    <MockWelcomeAudioProvider
      value={{
        play,
        pause,
        isPlaying,
        ready: true,
        error: undefined,
        audioConsent,
        grantAudioConsent,
        declineAudioConsent,
        showPauseHint,
        setShowPauseHint,
        showDarkModeHint,
        setShowDarkModeHint,
      }}
    >
      <ThemeProvider>
        <Home />
        <button onClick={() => setShowPauseHint(false)} type="button">
          Dismiss pause hint
        </button>
        <button onClick={() => setShowDarkModeHint(false)} type="button">
          Dismiss dark mode hint
        </button>
        <div data-testid="pause-hint-open">{String(showPauseHint)}</div>
        <div data-testid="dark-mode-hint-open">{String(showDarkModeHint)}</div>
      </ThemeProvider>
    </MockWelcomeAudioProvider>
  );
};

describe('Home welcome flow', () => {
  it('waits for the pause and theme hints to close before showing the hero card after audio starts', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');

    fireEvent.click(await screen.findByRole('button', { name: 'Play welcome audio' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('pause-hint-open')).toHaveTextContent('true');
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss pause hint' }));

    await waitFor(() => expect(screen.getByTestId('dark-mode-hint-open')).toHaveTextContent('true'));
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

    await waitFor(() => expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true'));
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
  });

  it('waits for the theme hint to close before showing the hero card after opting out of audio', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');

    fireEvent.click(await screen.findByRole('button', { name: 'No thanks' }));

    await waitFor(() => expect(screen.getByTestId('dark-mode-hint-open')).toHaveTextContent('true'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

    await waitFor(() => expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true'));
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
  });
});
