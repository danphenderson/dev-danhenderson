import type { ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { TerminalHeroContent } from '../../../src/components/TerminalHeroContent';
import type { TerminalLine } from '../../../src/components/TerminalHeroContent';

// Stub the typewriter hook so tests are deterministic and instant
jest.mock('../../../src/components/text/useTerminalTypewriter', () => ({
  useTerminalTypewriter: () => ({
    commandText: 'echo hello',
    outputText: 'hello',
    showCursor: true,
    phase: 'idle',
    history: [],
  }),
}));

// Stub terminal subcomponents with testable stand-ins that forward key events/props
jest.mock('../../../src/components/terminal/VscodeTitleBar', () => ({
  VscodeTitleBar: ({ onCommandPaletteToggle }: { onCommandPaletteToggle?: () => void }) => (
    <button
      type="button"
      data-testid="title-bar-palette-btn"
      onClick={onCommandPaletteToggle}
      aria-label="Toggle command palette"
    >
      Toggle palette
    </button>
  ),
}));

jest.mock('../../../src/components/terminal/VscodeActivityBar', () => ({
  VscodeActivityBar: ({
    activeIndex,
    onIconClick,
  }: {
    activeIndex: number;
    onIconClick?: (index: number) => void;
  }) => (
    <div data-testid="activity-bar" data-active-index={activeIndex}>
      <button
        type="button"
        data-testid="activity-icon-0"
        aria-label="Activity icon 0"
        onClick={() => onIconClick?.(0)}
      >
        Explorer
      </button>
      <button
        type="button"
        data-testid="activity-icon-1"
        aria-label="Activity icon 1"
        onClick={() => onIconClick?.(1)}
      >
        Search
      </button>
    </div>
  ),
}));

jest.mock('../../../src/components/terminal/VscodeExplorerSidebar', () => ({
  VscodeExplorerSidebar: ({ visible }: { visible: boolean }) => (
    <div data-testid="explorer-sidebar" data-visible={String(visible)} />
  ),
}));

jest.mock('../../../src/components/terminal/VscodeTabBar', () => ({
  VscodeTabBar: ({
    activeTab,
    onTabChange,
  }: {
    activeTab: string;
    onTabChange?: (tab: string) => void;
  }) => (
    <div data-testid="tab-bar" data-active-tab={activeTab}>
      <button type="button" aria-label="Portfolio tab" onClick={() => onTabChange?.('portfolio')}>
        Portfolio
      </button>
      <button type="button" aria-label="Terminal tab" onClick={() => onTabChange?.('terminal')}>
        Terminal
      </button>
    </div>
  ),
}));

jest.mock('../../../src/components/terminal/VscodeEditorPane', () => ({
  VscodeEditorPane: () => <div data-testid="editor-pane" />,
}));

jest.mock('../../../src/components/terminal/VscodeTerminalPanel', () => ({
  VscodeTerminalPanel: () => <div data-testid="terminal-panel" />,
}));

jest.mock('../../../src/components/terminal/VscodeStatusBar', () => ({
  VscodeStatusBar: () => <div data-testid="status-bar" />,
}));

jest.mock('../../../src/components/terminal/VscodeNotificationToast', () => ({
  VscodeNotificationToast: ({
    visible,
    onDismiss,
  }: {
    visible: boolean;
    onDismiss: () => void;
  }) => (
    <div data-testid="notification-toast" data-visible={String(visible)}>
      {visible && (
        <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  ),
}));

jest.mock('../../../src/components/terminal/VscodeCommandPalette', () => ({
  VscodeCommandPalette: ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => (
    <div data-testid="vscode-command-palette" data-visible={String(visible)}>
      {visible && (
        <button type="button" aria-label="Dismiss command palette" onClick={onDismiss}>
          Close palette
        </button>
      )}
    </div>
  ),
}));

const SAMPLE_LINES: TerminalLine[] = [
  { command: 'echo hello', output: 'hello' },
  { command: 'ls', output: 'src  tests' },
];

const renderHero = (overrides: Partial<{ lines: TerminalLine[]; playing: boolean }> = {}) =>
  render(
    <ThemeProvider>
      <TerminalHeroContent
        lines={overrides.lines ?? SAMPLE_LINES}
        playing={overrides.playing ?? false}
      />
    </ThemeProvider>
  );

describe('TerminalHeroContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial render', () => {
    it('renders the terminal hero container with the correct test id', () => {
      renderHero();
      expect(screen.getByTestId('terminal-hero')).toBeInTheDocument();
    });

    it('sets data-playing="false" when playing is false', () => {
      renderHero({ playing: false });
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'false');
    });

    it('sets data-playing="true" when playing is true', () => {
      renderHero({ playing: true });
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true');
    });

    it('carries an aria-label derived from the lines prop', () => {
      renderHero();
      const hero = screen.getByTestId('terminal-hero');
      expect(hero).toHaveAttribute('aria-label');
      expect(hero.getAttribute('aria-label')).toContain('echo hello');
    });

    it('renders the explorer sidebar hidden by default', () => {
      renderHero();
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'false');
    });

    it('renders the VS Code command palette hidden by default', () => {
      renderHero();
      expect(screen.getByTestId('vscode-command-palette')).toHaveAttribute('data-visible', 'false');
    });

    it('renders with portfolio as the active tab by default', () => {
      renderHero();
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'portfolio');
    });
  });

  describe('explorer sidebar toggle', () => {
    it('shows the explorer sidebar when activity bar icon 0 is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Activity icon 0'));
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'true');
    });

    it('hides the explorer sidebar on a second click of icon 0', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Activity icon 0'));
      fireEvent.click(screen.getByLabelText('Activity icon 0'));
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'false');
    });

    it('hides the explorer sidebar when a different activity icon is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Activity icon 0'));
      fireEvent.click(screen.getByLabelText('Activity icon 1'));
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('VS Code command palette toggle', () => {
    it('shows the VS Code command palette when the title-bar toggle is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Toggle command palette'));
      expect(screen.getByTestId('vscode-command-palette')).toHaveAttribute('data-visible', 'true');
    });

    it('hides the VS Code command palette on a second click', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Toggle command palette'));
      fireEvent.click(screen.getByLabelText('Dismiss command palette'));
      expect(screen.getByTestId('vscode-command-palette')).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('tab switching', () => {
    it('switches active tab to "terminal" when the terminal tab is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Terminal tab'));
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'terminal');
    });

    it('switches back to "portfolio" tab when portfolio is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Terminal tab'));
      fireEvent.click(screen.getByLabelText('Portfolio tab'));
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'portfolio');
    });
  });

  describe('notification toast', () => {
    it('is hidden initially', () => {
      renderHero();
      expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-visible', 'false');
    });
  });
});
