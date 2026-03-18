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

jest.mock('../../../src/components/TerminalHeroContent', () => {
  const resolveWidth = (input?: { width?: string } | Array<{ width?: string }>) => {
    if (Array.isArray(input)) {
      return input.find((entry) => entry && 'width' in entry)?.width;
    }

    return input?.width;
  };

  return {
    TerminalHeroContent: ({
      lines,
      playing,
      onClose,
      onMinimize,
      onExpand,
      sx,
    }: {
      lines: Array<{ command: string; output: string }>;
      playing?: boolean;
      onClose?: () => void;
      onMinimize?: () => void;
      onExpand?: () => void;
      sx?: { width?: string } | Array<{ width?: string }>;
    }) => {
      return (
        <div
          data-testid="terminal-hero"
          data-playing={String(Boolean(playing))}
          data-lines={lines
            .map((l: { command: string; output: string }) => `${l.command}:${l.output}`)
            .join(',')}
          data-width={String(resolveWidth(sx) ?? '')}
        >
          {lines
            .map((l: { command: string; output: string }) => `${l.command} → ${l.output}`)
            .join('; ')}
          {onClose && (
            <button type="button" data-testid="ide-close-btn" onClick={onClose}>
              Close
            </button>
          )}
          {onMinimize && (
            <button type="button" data-testid="ide-minimize-btn" onClick={onMinimize}>
              Minimize
            </button>
          )}
          {onExpand && (
            <button type="button" data-testid="ide-expand-btn" onClick={onExpand}>
              Expand
            </button>
          )}
        </div>
      );
    },
  };
});

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

/** Validate data-lines structure without hard-coding exact content. */
const expectTerminalLinesStructure = (el: HTMLElement) => {
  const dataLines = el.getAttribute('data-lines') ?? '';
  const lines = dataLines.split(',').filter((seg) => seg.includes(':'));

  expect(lines.length).toBeGreaterThanOrEqual(1);
  expect(dataLines).toMatch(/^node --version:/);
  expect(dataLines).toContain('brew ls:');
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
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

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
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

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
    expectTerminalLinesStructure(screen.getByTestId('terminal-hero'));

    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );
  });
});

/** Helper: render Home, dismiss dialogs / hints, and wait for the hero to be visible. */
const renderHomeWithHeroVisible = async () => {
  render(<HomeHarness initialAudioConsent="declined" />);

  fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));

  await waitFor(() =>
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
  );

  fireEvent.click(screen.getByTestId('complete-hero-motion'));

  await waitFor(() =>
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
  );
};

describe('Home IDE window actions', () => {
  it('toggles the expanded IDE width when expand is clicked', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '');

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '100%')
    );

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '')
    );
  });

  it('hides the IDE and shows the restore button when close is clicked', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.getByTestId('terminal-hero')).toBeInTheDocument();
    expect(screen.queryByTestId('ide-restore-button')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('ide-close-btn'));

    await waitFor(() => expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument());
    expect(screen.getByTestId('ide-restore-button')).toBeInTheDocument();
    expect(screen.getByLabelText('Open Visual Studio Code')).toBeInTheDocument();
  });

  it('restores the IDE when the restore button is clicked after close', async () => {
    await renderHomeWithHeroVisible();

    const firstSessionKey = screen.getByTestId('home-hero-window').getAttribute('data-session-key');

    fireEvent.click(screen.getByTestId('ide-close-btn'));

    await waitFor(() => expect(screen.getByTestId('ide-restore-button')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('ide-restore-button'));

    await waitFor(() => expect(screen.getByTestId('terminal-hero')).toBeInTheDocument());
    expect(screen.getByTestId('home-hero-window')).not.toHaveAttribute(
      'data-session-key',
      firstSessionKey ?? ''
    );
    await waitFor(() => expect(screen.queryByTestId('ide-restore-button')).not.toBeInTheDocument());
  });

  it('hides the IDE and shows the minimized bar when minimize is clicked', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.getByTestId('terminal-hero')).toBeInTheDocument();
    expect(screen.queryByTestId('ide-minimized-bar')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('ide-minimize-btn'));

    await waitFor(() => expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument());
    expect(screen.getByTestId('ide-minimized-bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Restore window')).toBeInTheDocument();
  });

  it('restores the IDE when the minimized bar is clicked', async () => {
    await renderHomeWithHeroVisible();

    const firstSessionKey = screen.getByTestId('home-hero-window').getAttribute('data-session-key');

    fireEvent.click(screen.getByTestId('ide-minimize-btn'));

    await waitFor(() => expect(screen.getByTestId('ide-minimized-bar')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('ide-minimized-bar'));

    await waitFor(() => expect(screen.getByTestId('terminal-hero')).toBeInTheDocument());
    expect(screen.getByTestId('home-hero-window')).not.toHaveAttribute(
      'data-session-key',
      firstSessionKey ?? ''
    );
    await waitFor(() => expect(screen.queryByTestId('ide-minimized-bar')).not.toBeInTheDocument());
  });

  it('does not show restore controls when the IDE is in normal state', async () => {
    await renderHomeWithHeroVisible();

    expect(screen.queryByTestId('ide-restore-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ide-minimized-bar')).not.toBeInTheDocument();
  });
});
