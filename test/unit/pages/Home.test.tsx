import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import Home from '../../../src/pages/Home';
import {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
} from '../../../src/WelcomeOnboardingProvider';

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

jest.mock('../../../src/components/TerminalHeroContent', () => ({
  TerminalHeroContent: ({
    lines,
    playing,
  }: {
    lines: Array<{ command: string; output: string }>;
    playing?: boolean;
  }) => (
    <div
      data-testid="terminal-hero"
      data-playing={String(Boolean(playing))}
      data-lines={lines
        .map((l: { command: string; output: string }) => `${l.command}:${l.output}`)
        .join(',')}
    >
      {lines
        .map((l: { command: string; output: string }) => `${l.command} → ${l.output}`)
        .join('; ')}
    </div>
  ),
}));

jest.mock('../../../src/components/HeroMotionPath', () => {
  return {
    HeroMotionPath: ({
      children,
      active,
      onComplete,
    }: {
      children: React.ReactNode;
      active: boolean;
      onComplete?: () => void;
    }) => (
      <div data-testid="hero-motion-path" data-active={String(active)}>
        {children}
        <button
          type="button"
          data-testid="complete-hero-motion"
          disabled={!active}
          onClick={() => {
            if (active) {
              onComplete?.();
            }
          }}
        >
          Complete hero motion
        </button>
      </div>
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
  default: ({
    children,
    showShell,
    shellWrapper,
  }: {
    children: React.ReactNode;
    showShell?: boolean;
    shellWrapper?: (shell: React.ReactNode) => React.ReactNode;
  }) => {
    const shell = <div data-testid="background-shell">{children}</div>;

    return (
      <div data-testid="background-paper" data-show-shell={String(Boolean(showShell))}>
        {showShell ? (shellWrapper ? shellWrapper(shell) : shell) : children}
      </div>
    );
  },
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
    expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument();
  });
});

describe('Home welcome flow', () => {
  it('waits for the pause and theme hints to close before showing the hero card after audio starts', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument();

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
    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute(
      'data-lines',
      'node --version:v22.14.0,git log --oneline -1:9ab2238 polish: terminal UI chrome,npm run build:\u2713 Compiled successfully in 2.4s,whoami --passions:mathematics \u00b7 computers \u00b7 adventures,python --version:Python 3.14.3,julia --version:julia version 1.10.10,brew ls:==> Formulae\nopenssl\npipenv\npre-commit\npyenv\npython@3.14\ngitsqlite\ngit-extras\njuliaup\n\n==> Casks\ncodex   iterm2  mactex'
    );

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });

  it('waits for the theme hint to close before showing the hero card after opting out of audio', async () => {
    render(<HomeHarness />);

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument();

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
    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute(
      'data-lines',
      'node --version:v22.14.0,git log --oneline -1:9ab2238 polish: terminal UI chrome,npm run build:\u2713 Compiled successfully in 2.4s,whoami --passions:mathematics \u00b7 computers \u00b7 adventures,python --version:Python 3.14.3,julia --version:julia version 1.10.10,brew ls:==> Formulae\nopenssl\npipenv\npre-commit\npyenv\npython@3.14\ngitsqlite\ngit-extras\njuliaup\n\n==> Casks\ncodex   iterm2  mactex'
    );

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
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
    expect(screen.getByTestId('hero-motion-path')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute(
      'data-lines',
      'node --version:v22.14.0,git log --oneline -1:9ab2238 polish: terminal UI chrome,npm run build:\u2713 Compiled successfully in 2.4s,whoami --passions:mathematics \u00b7 computers \u00b7 adventures,python --version:Python 3.14.3,julia --version:julia version 1.10.10,brew ls:==> Formulae\nopenssl\npipenv\npre-commit\npyenv\npython@3.14\ngitsqlite\ngit-extras\njuliaup\n\n==> Casks\ncodex   iterm2  mactex'
    );

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });
});
