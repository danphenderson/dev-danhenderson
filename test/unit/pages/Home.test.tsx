import * as React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import Home from '../../../src/pages/Home';
import { duration } from '../../../src/motion/tokens';
import {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
} from '../../../src/WelcomeOnboardingProvider';

const AUTO_EXPAND_PULSE_DURATION_MS = Math.round(duration.slow * 1000);

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
  const React = require('react');
  let nextInstanceId = 0;

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
      expanded,
      bootActive,
      onClose,
      onMinimize,
      onExpand,
      resizeEnabled,
      isResizing,
      resizeWidth,
      resizeHeight,
      onResizeStart,
      sx,
    }: {
      lines: Array<{ command: string; output: string }>;
      playing?: boolean;
      expanded?: boolean;
      bootActive?: boolean;
      onClose?: () => void;
      onMinimize?: () => void;
      onExpand?: () => void;
      resizeEnabled?: boolean;
      isResizing?: boolean;
      resizeWidth?: number;
      resizeHeight?: number;
      onResizeStart?: (edge: string, event: unknown) => void;
      sx?: { width?: string } | Array<{ width?: string }>;
    }) => {
      const instanceId = React.useRef(null);

      if (instanceId.current === null) {
        nextInstanceId += 1;
        instanceId.current = nextInstanceId;
      }

      return (
        <div
          data-testid="terminal-hero"
          data-expanded={String(Boolean(expanded))}
          data-boot-active={String(Boolean(bootActive))}
          data-instance-id={String(instanceId.current)}
          data-playing={String(Boolean(playing))}
          data-lines={lines
            .map((l: { command: string; output: string }) => `${l.command}:${l.output}`)
            .join(',')}
          data-width={String(resolveWidth(sx) ?? '')}
          data-resize-enabled={String(Boolean(resizeEnabled))}
          data-is-resizing={String(Boolean(isResizing))}
          data-resize-width={resizeWidth != null ? String(resizeWidth) : ''}
          data-resize-height={resizeHeight != null ? String(resizeHeight) : ''}
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
          {onResizeStart && (
            <button
              type="button"
              data-testid="ide-resize-start-btn"
              onPointerDown={(e) => onResizeStart('right', e)}
            >
              Start resize
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
    contentRef,
    shellWrapper,
  }: {
    children: React.ReactNode;
    showShell?: boolean;
    contentRef?: React.Ref<HTMLDivElement>;
    shellWrapper?: (shell: React.ReactNode) => React.ReactNode;
  }) => {
    const shell = <div data-testid="background-shell">{children}</div>;

    return (
      <div data-testid="background-paper" data-show-shell={String(Boolean(showShell))}>
        <div data-testid="background-content" ref={contentRef}>
          {showShell ? (shellWrapper ? shellWrapper(shell) : shell) : children}
        </div>
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

const OnboardingBootstrap = ({
  openPauseHintOnMount = false,
}: {
  openPauseHintOnMount?: boolean;
}) => {
  const { openPauseHint } = useWelcomeOnboarding();

  React.useEffect(() => {
    if (!openPauseHintOnMount) {
      return;
    }

    openPauseHint();
  }, [openPauseHintOnMount, openPauseHint]);

  return null;
};

const HomeHarness = ({
  initialAudioConsent = 'unknown',
  error,
  openPauseHintOnMount = false,
}: {
  initialAudioConsent?: MockWelcomeAudioState['audioConsent'];
  error?: string;
  openPauseHintOnMount?: boolean;
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
        error,
        audioConsent,
        grantAudioConsent,
        declineAudioConsent,
      }}
    >
      <ThemeProvider>
        <WelcomeOnboardingProvider>
          <OnboardingBootstrap openPauseHintOnMount={openPauseHintOnMount} />
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

  it('uses shared text primitives for the prompt body and error copy', async () => {
    render(<HomeHarness error="Playback failed" />);

    const bodyText = await screen.findByText(
      'Would you like to hear a short verse while browsing the site? Use the pause button in the header to stop it anytime.'
    );
    const errorText = screen.getByText('Playback failed');

    expect(bodyText.tagName).toBe('P');
    expect(bodyText).toHaveClass('MuiTypography-body2');
    expect(errorText.tagName).toBe('SPAN');
    expect(errorText).toHaveClass('MuiTypography-caption');
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
    render(<HomeHarness initialAudioConsent="granted" openPauseHintOnMount />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('pause-hint-open')).toHaveTextContent('true'));

    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('background-paper')).toHaveAttribute('data-show-shell', 'false');
    expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument();

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

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'No thanks' }));
    });

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

const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

const setElementRect = (
  element: Element,
  rect: { left: number; top: number; width: number; height: number }
) => {
  const domRect = {
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON: () => ({}),
  } as DOMRect;

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => domRect,
  });
};

const mountLayoutAnchors = () => {
  const header = document.createElement('div');
  header.id = 'site-navigation';

  const mainContent = document.createElement('div');
  mainContent.id = 'main-content';

  document.body.append(header, mainContent);

  return { header, mainContent };
};

const dispatchPointerMove = (clientX: number, clientY: number) => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX,
        clientY,
      })
    );
  });
};

const dispatchPointerUp = () => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
      })
    );
  });
};

afterEach(() => {
  document.getElementById('site-navigation')?.remove();
  document.getElementById('main-content')?.remove();
});

describe('Home IDE window actions', () => {
  it('expands inside the visible page viewport and restores the normal hero when toggled off', async () => {
    setViewportSize(1280, 800);
    const { header, mainContent } = mountLayoutAnchors();

    setElementRect(header, { left: 0, top: 0, width: 1280, height: 64 });
    setElementRect(mainContent, { left: 24, top: 40, width: 1000, height: 680 });

    await renderHomeWithHeroVisible();

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-width', '');

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    const expandedOverlay = await screen.findByTestId('home-ide-expanded');

    await waitFor(() => {
      const hero = screen.getByTestId('terminal-hero');

      expect(hero).toHaveAttribute('data-expanded', 'true');
      expect(hero).toHaveAttribute('data-width', '100%');
    });
    expect(expandedOverlay).toHaveStyle({
      top: '64px',
      left: '24px',
      width: '1000px',
      height: '656px',
    });

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() => {
      const hero = screen.getByTestId('terminal-hero');

      expect(screen.queryByTestId('home-ide-expanded')).not.toBeInTheDocument();
      expect(hero).toHaveAttribute('data-expanded', 'false');
      expect(hero).toHaveAttribute('data-width', '');
    });
  });

  it('preserves the same hero instance across expand and collapse', async () => {
    setViewportSize(1280, 800);
    const { header, mainContent } = mountLayoutAnchors();

    setElementRect(header, { left: 0, top: 0, width: 1280, height: 64 });
    setElementRect(mainContent, { left: 24, top: 40, width: 1000, height: 680 });

    await renderHomeWithHeroVisible();

    const initialInstanceId = screen.getByTestId('terminal-hero').getAttribute('data-instance-id');

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('home-ide-expanded')).toBeInTheDocument();
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'true');
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute(
        'data-instance-id',
        initialInstanceId ?? ''
      );
    });

    fireEvent.click(screen.getByTestId('ide-expand-btn'));

    await waitFor(() => {
      expect(screen.queryByTestId('home-ide-expanded')).not.toBeInTheDocument();
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute(
        'data-instance-id',
        initialInstanceId ?? ''
      );
    });
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

describe('Home auto-expand after motion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setViewportSize(1280, 800);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('automatically expands the IDE after the motion path completes', async () => {
    setViewportSize(1280, 800);
    const { header, mainContent } = mountLayoutAnchors();
    setElementRect(header, { left: 0, top: 0, width: 1280, height: 64 });
    setElementRect(mainContent, { left: 24, top: 40, width: 1000, height: 680 });

    render(<HomeHarness initialAudioConsent="declined" />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));
    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');

    // Complete the motion-path — typewriter starts, auto-expand is queued
    fireEvent.click(screen.getByTestId('complete-hero-motion'));

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );

    // IDE should still be in normal state before the delay elapses
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-boot-active', 'false');
    expect(screen.queryByTestId('home-ide-expanded')).not.toBeInTheDocument();

    // Advance through the pulse duration — triggers the expand
    act(() => {
      jest.advanceTimersByTime(AUTO_EXPAND_PULSE_DURATION_MS);
    });

    // The expanded portal should now render
    const expandedPortal = await screen.findByTestId('home-ide-expanded');
    expect(expandedPortal).toBeInTheDocument();
    expect(within(expandedPortal).getByTestId('terminal-hero')).toHaveAttribute(
      'data-expanded',
      'true'
    );
    expect(within(expandedPortal).getByTestId('terminal-hero')).toHaveAttribute(
      'data-boot-active',
      'false'
    );
  });

  it('cancels the auto-expand when the user manually closes the IDE before the delay', async () => {
    render(<HomeHarness initialAudioConsent="declined" />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));
    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );

    fireEvent.click(screen.getByTestId('complete-hero-motion'));
    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );

    // Close IDE before the auto-expand delay fires
    act(() => {
      fireEvent.click(screen.getByTestId('ide-close-btn'));
    });

    // The restore button should appear (IDE closed)
    await waitFor(() => expect(screen.getByTestId('ide-restore-button')).toBeInTheDocument());

    act(() => {
      jest.advanceTimersByTime(AUTO_EXPAND_PULSE_DURATION_MS);
    });

    // Should remain closed — auto-expand was cancelled
    expect(screen.queryByTestId('home-ide-expanded')).not.toBeInTheDocument();
    expect(screen.getByTestId('ide-restore-button')).toBeInTheDocument();
  });

  it('does not re-trigger auto-expand after the IDE is manually restored', async () => {
    render(<HomeHarness initialAudioConsent="declined" />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss dark mode hint' }));
    await waitFor(() =>
      expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
    );

    fireEvent.click(screen.getByTestId('complete-hero-motion'));
    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
    );

    // Close and restore — simulates user interaction cycle
    fireEvent.click(screen.getByTestId('ide-close-btn'));
    await waitFor(() => expect(screen.getByTestId('ide-restore-button')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('ide-restore-button'));
    await waitFor(() => expect(screen.getByTestId('terminal-hero')).toBeInTheDocument());

    // Advance well past the auto-expand delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // IDE should remain in normal state — auto-expand fires only once
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
  });
});

// ---------------------------------------------------------------------------
// Resize tests
// ---------------------------------------------------------------------------

/** Stub matchMedia to report (or not report) a hover/pointer-fine device. */
const setPointerDevice = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
};

describe('Home IDE resize', () => {
  beforeEach(() => {
    setPointerDevice(true);
    setViewportSize(1280, 800);
  });

  afterEach(() => {
    setPointerDevice(false);
    jest.clearAllMocks();
  });

  it('passes resizeEnabled=false when the device is not pointer-fine', async () => {
    setPointerDevice(false);
    await renderHomeWithHeroVisible();
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-enabled', 'false');
  });

  it('passes resizeEnabled=true in normal window state on a pointer-fine device', async () => {
    await renderHomeWithHeroVisible();
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-enabled', 'true');
  });

  it('does not render a resize trigger in expanded mode', async () => {
    await renderHomeWithHeroVisible();
    fireEvent.click(screen.getByTestId('ide-expand-btn'));
    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'true')
    );
    // Expanded TerminalHeroContent receives no onResizeStart → no trigger button
    expect(screen.queryByTestId('ide-resize-start-btn')).not.toBeInTheDocument();
  });

  it('sets isResizing=true while a resize is in progress', async () => {
    await renderHomeWithHeroVisible();
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-is-resizing', 'false');

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 100,
      clientY: 100,
      button: 0,
    });

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-is-resizing', 'true')
    );
  });

  it('locks the current hero width and height as soon as resize starts', async () => {
    await renderHomeWithHeroVisible();

    const hero = screen.getByTestId('terminal-hero');
    const backgroundContent = screen.getByTestId('background-content');

    setElementRect(backgroundContent, { left: 0, top: 0, width: 1000, height: 700 });
    setElementRect(hero, { left: 80, top: 60, width: 420, height: 312 });

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 500,
      clientY: 180,
      button: 0,
    });

    await waitFor(() => expect(hero).toHaveAttribute('data-is-resizing', 'true'));
    expect(hero).toHaveAttribute('data-resize-width', '420');
    expect(hero).toHaveAttribute('data-resize-height', '312');
  });

  it('updates resize dimensions on pointermove and clears isResizing on pointerup', async () => {
    await renderHomeWithHeroVisible();

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 100,
      clientY: 100,
      button: 0,
    });

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-is-resizing', 'true')
    );

    dispatchPointerMove(300, 250);

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero').getAttribute('data-resize-width')).not.toBe('')
    );

    dispatchPointerUp();

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-is-resizing', 'false')
    );
  });

  it('clamps resize width to the remaining space when the dragged window is near the right edge', async () => {
    await renderHomeWithHeroVisible();

    const hero = screen.getByTestId('terminal-hero');
    const backgroundContent = screen.getByTestId('background-content');

    setElementRect(backgroundContent, { left: 0, top: 0, width: 1000, height: 700 });
    setElementRect(hero, { left: 650, top: 100, width: 300, height: 300 });

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 950,
      clientY: 160,
      button: 0,
    });
    dispatchPointerMove(1150, 160);

    await waitFor(() => expect(hero).toHaveAttribute('data-resize-width', '350'));
  });

  it('clears resize dimensions when the window is closed and then restored', async () => {
    await renderHomeWithHeroVisible();

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    dispatchPointerMove(300, 250);
    dispatchPointerUp();

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero').getAttribute('data-resize-width')).not.toBe('')
    );

    fireEvent.click(screen.getByTestId('ide-close-btn'));
    await waitFor(() => expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument());

    fireEvent.click(screen.getByTestId('ide-restore-button'));
    await waitFor(() => expect(screen.getByTestId('terminal-hero')).toBeInTheDocument());

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-width', '');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-height', '');
  });

  it('clears resize dimensions when the window is minimized and then restored', async () => {
    await renderHomeWithHeroVisible();

    fireEvent.pointerDown(screen.getByTestId('ide-resize-start-btn'), {
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    dispatchPointerMove(300, 250);
    dispatchPointerUp();

    await waitFor(() =>
      expect(screen.getByTestId('terminal-hero').getAttribute('data-resize-width')).not.toBe('')
    );

    fireEvent.click(screen.getByTestId('ide-minimize-btn'));
    await waitFor(() => expect(screen.queryByTestId('terminal-hero')).not.toBeInTheDocument());

    fireEvent.click(screen.getByTestId('ide-minimized-bar'));
    await waitFor(() => expect(screen.getByTestId('terminal-hero')).toBeInTheDocument());

    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-width', '');
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-resize-height', '');
  });
});
