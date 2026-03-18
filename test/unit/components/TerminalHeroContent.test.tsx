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

// Stub IDE subcomponents with testable stand-ins that forward key events/props
jest.mock('../../../src/components/ide/VscodeTitleBar', () => ({
  VscodeTitleBar: ({
    onCommandPaletteToggle,
    onWindowDragPointerDown,
    windowDragEnabled,
    windowDragging,
    onClose,
    onMinimize,
    onExpand,
  }: {
    onCommandPaletteToggle?: () => void;
    onWindowDragPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
    windowDragEnabled?: boolean;
    windowDragging?: boolean;
    onClose?: () => void;
    onMinimize?: () => void;
    onExpand?: () => void;
  }) => (
    <div
      data-testid="vscode-title-bar"
      data-drag-enabled={String(Boolean(windowDragEnabled))}
      data-dragging={String(Boolean(windowDragging))}
    >
      <button
        type="button"
        data-testid="title-bar-palette-btn"
        onClick={onCommandPaletteToggle}
        aria-label="Toggle command palette"
      >
        Toggle palette
      </button>
      <button
        type="button"
        data-testid="title-bar-drag-handle"
        onPointerDown={onWindowDragPointerDown}
        aria-label="Start window drag"
      >
        Drag window
      </button>
      {onClose && (
        <button
          type="button"
          data-testid="title-bar-close"
          onClick={onClose}
          aria-label="Close window"
        >
          Close
        </button>
      )}
      {onMinimize && (
        <button
          type="button"
          data-testid="title-bar-minimize"
          onClick={onMinimize}
          aria-label="Minimize window"
        >
          Minimize
        </button>
      )}
      {onExpand && (
        <button
          type="button"
          data-testid="title-bar-expand"
          onClick={onExpand}
          aria-label="Expand window"
        >
          Expand
        </button>
      )}
    </div>
  ),
}));

jest.mock('../../../src/components/ide/VscodeActivityBar', () => ({
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

jest.mock('../../../src/components/ide/VscodeExplorerSidebar', () => ({
  VscodeExplorerSidebar: ({ activeTab, visible }: { activeTab: string; visible: boolean }) => (
    <div
      data-testid="explorer-sidebar"
      data-active-tab={activeTab}
      data-visible={String(visible)}
    />
  ),
}));

jest.mock('../../../src/components/ide/VscodeTabBar', () => ({
  VscodeTabBar: ({
    activeTab,
    onTabChange,
  }: {
    activeTab: string;
    onTabChange?: (tab: string) => void;
  }) => (
    <div data-testid="tab-bar" data-active-tab={activeTab}>
      <button type="button" aria-label="Server tab" onClick={() => onTabChange?.('server')}>
        Server
      </button>
      <button type="button" aria-label="Client tab" onClick={() => onTabChange?.('client')}>
        Client
      </button>
    </div>
  ),
}));

jest.mock('../../../src/components/ide/VscodeEditorPane', () => ({
  VscodeEditorPane: ({ activeTab }: { activeTab: string }) => (
    <div data-testid="editor-pane" data-active-tab={activeTab} />
  ),
}));

jest.mock('../../../src/components/ide/VscodeTerminalPanel', () => ({
  VscodeTerminalPanel: () => <div data-testid="terminal-panel" />,
}));

jest.mock('../../../src/components/ide/VscodeStatusBar', () => ({
  VscodeStatusBar: ({ activeTab }: { activeTab: string }) => (
    <div data-testid="status-bar" data-active-tab={activeTab} />
  ),
}));

jest.mock('../../../src/components/ide/VscodeNotificationToast', () => ({
  VscodeNotificationToast: ({
    activeTab,
    visible,
    onDismiss,
  }: {
    activeTab: string;
    visible: boolean;
    onDismiss: () => void;
  }) => (
    <div
      data-testid="notification-toast"
      data-active-tab={activeTab}
      data-visible={String(visible)}
    >
      {visible && (
        <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  ),
}));

jest.mock('../../../src/components/ide/VscodeCommandPalette', () => ({
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

const renderHero = (
  overrides: Partial<{
    lines: TerminalLine[];
    onWindowDragPointerDown: React.PointerEventHandler<HTMLDivElement>;
    playing: boolean;
    windowDragEnabled: boolean;
    windowDragging: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onExpand: () => void;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <TerminalHeroContent
        lines={overrides.lines ?? SAMPLE_LINES}
        onWindowDragPointerDown={overrides.onWindowDragPointerDown}
        playing={overrides.playing ?? false}
        windowDragEnabled={overrides.windowDragEnabled}
        windowDragging={overrides.windowDragging}
        onClose={overrides.onClose}
        onMinimize={overrides.onMinimize}
        onExpand={overrides.onExpand}
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

    it('leaves title-bar dragging disabled by default', () => {
      renderHero();
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-drag-enabled', 'false');
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-dragging', 'false');
    });

    it('renders with server.py as the active tab by default', () => {
      renderHero();
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('status-bar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-active-tab', 'server');
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

    it('forwards the title-bar drag handler when dragging is enabled', () => {
      const onWindowDragPointerDown = jest.fn();

      renderHero({
        onWindowDragPointerDown,
        windowDragEnabled: true,
        windowDragging: true,
      });

      fireEvent.pointerDown(screen.getByLabelText('Start window drag'));

      expect(onWindowDragPointerDown).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-drag-enabled', 'true');
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-dragging', 'true');
    });

    it('hides the VS Code command palette on a second click', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Toggle command palette'));
      fireEvent.click(screen.getByLabelText('Dismiss command palette'));
      expect(screen.getByTestId('vscode-command-palette')).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('tab switching', () => {
    it('switches active tab to "client" when the client tab is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Client tab'));
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'client');
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-active-tab', 'client');
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-active-tab', 'client');
      expect(screen.getByTestId('status-bar')).toHaveAttribute('data-active-tab', 'client');
      expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-active-tab', 'client');
    });

    it('switches back to "server" when the server tab is clicked', () => {
      renderHero();
      fireEvent.click(screen.getByLabelText('Client tab'));
      fireEvent.click(screen.getByLabelText('Server tab'));
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('status-bar')).toHaveAttribute('data-active-tab', 'server');
      expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-active-tab', 'server');
    });
  });

  describe('notification toast', () => {
    it('is hidden initially', () => {
      renderHero();
      expect(screen.getByTestId('notification-toast')).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('window action callbacks', () => {
    it('forwards the onClose callback to the title bar', () => {
      const onClose = jest.fn();
      renderHero({ onClose });
      fireEvent.click(screen.getByTestId('title-bar-close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('forwards the onMinimize callback to the title bar', () => {
      const onMinimize = jest.fn();
      renderHero({ onMinimize });
      fireEvent.click(screen.getByTestId('title-bar-minimize'));
      expect(onMinimize).toHaveBeenCalledTimes(1);
    });

    it('forwards the onExpand callback to the title bar', () => {
      const onExpand = jest.fn();
      renderHero({ onExpand });
      fireEvent.click(screen.getByTestId('title-bar-expand'));
      expect(onExpand).toHaveBeenCalledTimes(1);
    });

    it('does not render close button when onClose is not provided', () => {
      renderHero();
      expect(screen.queryByTestId('title-bar-close')).not.toBeInTheDocument();
    });
  });
});
