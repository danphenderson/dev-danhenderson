import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { duration } from '../../../../src/motion/tokens';
import { PREFERENCE_STORAGE_KEYS } from '../../../../src/theme/preferences';
import { HEADER_SETTINGS_TRIGGER_ID } from '../../../../src/components/header/HeaderSettingsPopover';

const AUTO_EXPAND_PULSE_DURATION_MS = Math.round(duration.slow * 1000);
const mockScrollYProgress = { get: () => 0, on: () => () => {} };
const mockHeroScaleMotionValue = { get: () => 1.08, on: () => () => {} };
const mockHeroOpacityMotionValue = { get: () => 0.6, on: () => () => {} };
let mockPrefersReducedMotion = false;
let mountedLayoutAnchors: HTMLElement[] = [];

jest.mock('motion/react', () => {
  const React = require('react');
  const actual = jest.requireActual('motion/react');

  const MotionDiv = React.forwardRef(
    (
      {
        children,
        style,
        drag,
        dragConstraints,
        dragControls,
        dragElastic,
        dragListener,
        dragMomentum,
        initial,
        animate,
        exit,
        layout,
        transition,
        variants,
        viewport,
        whileHover,
        whileInView,
        whileTap,
        ...rest
      }: {
        children?: React.ReactNode;
        style?: React.CSSProperties & { scale?: unknown; opacity?: unknown };
        drag?: unknown;
        dragConstraints?: unknown;
        dragControls?: unknown;
        dragElastic?: unknown;
        dragListener?: unknown;
        dragMomentum?: unknown;
        initial?: unknown;
        animate?: unknown;
        exit?: unknown;
        layout?: unknown;
        transition?: unknown;
        variants?: unknown;
        viewport?: unknown;
        whileHover?: unknown;
        whileInView?: unknown;
        whileTap?: unknown;
      } & React.HTMLAttributes<HTMLDivElement>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        data-testid={
          style?.scale != null || style?.opacity != null ? 'hero-parallax-wrapper' : undefined
        }
        data-scale-source={
          style?.scale === 1
            ? 'static'
            : (style?.scale as unknown) === mockHeroScaleMotionValue
              ? 'motion-value'
              : 'other'
        }
        data-opacity-source={
          style?.opacity === 1
            ? 'static'
            : (style?.opacity as unknown) === mockHeroOpacityMotionValue
              ? 'motion-value'
              : 'other'
        }
        style={style as React.CSSProperties}
        {...rest}
      >
        {children}
      </div>
    )
  );

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: MotionDiv,
    },
    useDragControls: () => ({ start: jest.fn() }),
    useReducedMotion: () => mockPrefersReducedMotion,
    useScroll: () => ({
      scrollYProgress: mockScrollYProgress,
    }),
    useTransform: (_value: unknown, _input: number[], output: number[]) => {
      if (output[0] === 1 && output[1] === 1.08) {
        return mockHeroScaleMotionValue;
      }

      if (output[0] === 1 && output[1] === 0.6) {
        return mockHeroOpacityMotionValue;
      }

      return { get: () => output[0], on: () => () => {} };
    },
  };
});

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

jest.mock('../../../../src/WelcomeAudioProvider', () => {
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

jest.mock('../../../../src/components/TerminalHeroContent', () => {
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
            .map((line: { command: string; output: string }) => `${line.command}:${line.output}`)
            .join(',')}
          data-width={String(resolveWidth(sx) ?? '')}
          data-resize-enabled={String(Boolean(resizeEnabled))}
          data-is-resizing={String(Boolean(isResizing))}
          data-resize-width={resizeWidth != null ? String(resizeWidth) : ''}
          data-resize-height={resizeHeight != null ? String(resizeHeight) : ''}
        >
          {lines
            .map((line: { command: string; output: string }) => `${line.command} → ${line.output}`)
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
              onPointerDown={(event) => onResizeStart('right', event)}
            >
              Start resize
            </button>
          )}
        </div>
      );
    },
  };
});

jest.mock('../../../../src/components/HeroMotionPath', () => ({
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
}));

jest.mock('../../../../src/components/AnimatedContentCard', () => ({
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

jest.mock('../../../../src/components/BackgroundPaper', () => ({
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

const ThemeProvider = require('../../../../src/ThemeProvider').default;
const Home = require('../../../../src/pages/Home').default;
const {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} = require('../../../../src/WelcomeOnboardingProvider');

const OnboardingStateProbe = () => {
  const { onboardingCompleted, showCustomizeModal, showSettingsHint, completeOnboarding } =
    useWelcomeOnboarding();

  return (
    <>
      <button onClick={completeOnboarding} type="button">
        Complete onboarding
      </button>
      <div data-testid="onboarding-completed">{String(onboardingCompleted)}</div>
      <div data-testid="customize-modal-open">{String(showCustomizeModal)}</div>
      <div data-testid="settings-hint-open">{String(showSettingsHint)}</div>
    </>
  );
};

const HomeHarness = ({
  initialAudioConsent = 'unknown',
  error,
}: {
  initialAudioConsent?: MockWelcomeAudioState['audioConsent'];
  error?: string;
}) => {
  const [audioConsent, setAudioConsent] =
    React.useState<MockWelcomeAudioState['audioConsent']>(initialAudioConsent);
  const [isPlaying, setIsPlaying] = React.useState(initialAudioConsent === 'granted');
  const pause = React.useMemo(() => jest.fn(() => setIsPlaying(false)), []);
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
          <button id={HEADER_SETTINGS_TRIGGER_ID} type="button">
            Header settings anchor
          </button>
          <Home />
          <OnboardingStateProbe />
        </WelcomeOnboardingProvider>
      </ThemeProvider>
    </MockWelcomeAudioProvider>
  );
};

export const renderHomeRoute = ({
  initialAudioConsent = 'unknown',
  error,
}: {
  initialAudioConsent?: MockWelcomeAudioState['audioConsent'];
  error?: string;
} = {}) => render(<HomeHarness initialAudioConsent={initialAudioConsent} error={error} />);

export const expectTerminalLinesStructure = (element: HTMLElement) => {
  const dataLines = element.getAttribute('data-lines') ?? '';
  const lines = dataLines.split(',').filter((segment) => segment.includes(':'));

  expect(lines.length).toBeGreaterThanOrEqual(1);
  expect(dataLines).toMatch(/^node --version:/);
  expect(dataLines).toContain('brew ls:');
};

export const renderHomeWithHeroVisible = async () => {
  window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');
  window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
  renderHomeRoute({ initialAudioConsent: 'declined' });

  await waitFor(() =>
    expect(screen.getByTestId('hero-card')).toHaveAttribute('data-visible', 'true')
  );

  fireEvent.click(screen.getByTestId('complete-hero-motion'));

  await waitFor(() =>
    expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true')
  );
};

export const expectHeroParallaxSource = (scaleSource: 'motion-value' | 'static') => {
  const heroMotionWrapper = screen.getByTestId('hero-parallax-wrapper');

  expect(heroMotionWrapper).toHaveAttribute('data-scale-source', scaleSource);
  expect(heroMotionWrapper).toHaveAttribute('data-opacity-source', scaleSource);
};

export const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

export const setElementRect = (
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

export const mountLayoutAnchors = () => {
  const header = document.createElement('div');
  header.id = 'site-navigation';

  const mainContent = document.createElement('div');
  mainContent.id = 'main-content';

  document.body.append(header, mainContent);
  mountedLayoutAnchors.push(header, mainContent);

  return { header, mainContent };
};

export const dispatchPointerMove = (clientX: number, clientY: number) => {
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

export const dispatchPointerUp = () => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
      })
    );
  });
};

export const setPointerDevice = (matches: boolean) => {
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

export const setMockPrefersReducedMotion = (value: boolean) => {
  mockPrefersReducedMotion = value;
};

export const resetHomeTestEnvironment = () => {
  mockPrefersReducedMotion = false;
  mountedLayoutAnchors.forEach((anchor) => anchor.remove());
  mountedLayoutAnchors = [];
  window.localStorage.clear();
};

export {
  AUTO_EXPAND_PULSE_DURATION_MS,
  Home,
  ONBOARDING_COMPLETED_STORAGE_KEY,
  PREFERENCE_STORAGE_KEYS,
};
