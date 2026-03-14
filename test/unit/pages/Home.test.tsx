import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import Home from '../../../src/pages/Home';
import { WelcomeOnboardingProvider, useWelcomeOnboarding } from '../../../src/WelcomeOnboardingProvider';

type MockWelcomeAudioState = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ready: boolean;
  error?: string;
  audioConsent: 'unknown' | 'granted' | 'declined';
  grantAudioConsent: () => void;
  declineAudioConsent: () => void;
};

const mockWelcomeAudioContext = React.createContext<MockWelcomeAudioState | null>(null);

const MockWelcomeAudioProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MockWelcomeAudioState;
}) => <mockWelcomeAudioContext.Provider value={value}>{children}</mockWelcomeAudioContext.Provider>;

jest.mock('../../../src/WelcomeAudioProvider', () => {
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

jest.mock('../../../src/components/text', () => {
  const actual = jest.requireActual('../../../src/components/text');

  return {
    ...actual,
    TypewriterText: ({ text, timingPreset }: { text: string; timingPreset?: string }) => (
      <span data-testid="typewriter-text" data-timing-preset={timingPreset ?? ''}>
        {text}
      </span>
    ),
  };
});

jest.mock('../../../src/components/AnimatedContentCard', () => ({
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

jest.mock('../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children, showShell }: { children: React.ReactNode; showShell?: boolean }) => (
    <div data-testid="background-paper" data-show-shell={String(Boolean(showShell))}>
      {children}
    </div>
  ),
}));

const OnboardingStateProbe = () => {
  const { showPauseHint, showDarkModeHint, dismissPauseHint, dismissDarkModeHint } =
    useWelcomeOnboarding();

  return (
    <>
      <button onClick={dismissPauseHint} type="button">
        Dismiss pause hint
      </button>
      <button onClick={dismissDarkModeHint} type="button">
        Dismiss dark mode hint
      </button>
      <div data-testid="pause-hint-open">{String(showPauseHint)}</div>
      <div data-testid="dark-mode-hint-open">{String(showDarkModeHint)}</div>
    </>
  );
};

const HomeHarness = ({
  initialAudioConsent = 'unknown',
}: {
  initialAudioConsent?: MockWelcomeAudioState['audioConsent'];
}) => {
  const [audioConsent, setAudioConsent] =
    React.useState<MockWelcomeAudioState['audioConsent']>(initialAudioConsent);
  const [isPlaying, setIsPlaying] = React.useState(initialAudioConsent === 'granted');
  const pause = React.useMemo(() => jest.fn(), []);
  const grantAudioConsent = React.useMemo(() => jest.fn(), []);

  const play = React.useCallback(async () => {
    setAudioConsent('granted');
    setIsPlaying(true);
  }, []);

  const declineAudioConsent = React.useCallback(() => {
    setAudioConsent('declined');
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
      }}
    >
      <ThemeProvider>
        <WelcomeOnboardingProvider>
          <Home />
          <OnboardingStateProbe />
        </WelcomeOnboardingProvider>
      </ThemeProvider>
    </MockWelcomeAudioProvider>
  );
};

describe('Home audio prompt', () => {
  it('renders the welcome audio dialog with prompt text and action buttons', async () => {
    render(<HomeHarness />);

    const dialog = await screen.findByRole('dialog');

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Play welcome audio?')).toBeInTheDocument();
    expect(
      screen.getByText(/Would you like to hear a short verse while browsing the site\?/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No thanks' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeInTheDocument();
  });

  it('hides the hero card and background shell while the prompt is open', () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('typewriter-text')).not.toBeInTheDocument();
  });
});

describe('Home welcome flow', () => {
  it('waits for the pause and theme hints to close before showing the hero card after audio starts', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('typewriter-text')).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: 'Play welcome audio' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('pause-hint-open')).toHaveTextContent('true');
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss pause hint' }));

    await waitFor(() =>
      expect(screen.getByTestId('dark-mode-hint-open')).toHaveTextContent('true')
    );
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
    expect(screen.getByTestId('typewriter-text')).toHaveTextContent(
      'Hi, my passions are mathematics, computers, and adventures'
    );
    expect(screen.getByTestId('typewriter-text')).toHaveAttribute('data-timing-preset', 'headline');
  });

  it('waits for the theme hint to close before showing the hero card after opting out of audio', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('typewriter-text')).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: 'No thanks' }));

    await waitFor(() =>
      expect(screen.getByTestId('dark-mode-hint-open')).toHaveTextContent('true')
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'true');
    expect(screen.getByTestId('typewriter-text')).toHaveTextContent(
      'Hi, my passions are mathematics, computers, and adventures'
    );
    expect(screen.getByTestId('typewriter-text')).toHaveAttribute('data-timing-preset', 'headline');
  });

  it('skips the dialog when audio consent is already declined and shows hero after dark mode hint', async () => {
    render(<HomeHarness initialAudioConsent="declined" />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId('dark-mode-hint-open')).toHaveTextContent('true')
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );
    expect(screen.getByTestId('typewriter-text')).toHaveTextContent(
      'Hi, my passions are mathematics, computers, and adventures'
    );
  });
});
