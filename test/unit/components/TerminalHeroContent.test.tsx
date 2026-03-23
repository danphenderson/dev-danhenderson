import type { ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { TerminalHeroContent } from '../../../src/components/TerminalHeroContent';
import type { TerminalLine } from '../../../src/components/TerminalHeroContent';
import { useTerminalBootSequence } from '../../../src/hooks/useTerminalBootSequence';

// Stub the typewriter hook so tests are deterministic and instant
jest.mock('../../../src/components/text/useTerminalTypewriter', () => ({
  useTerminalTypewriter: ({ playing }: { playing?: boolean }) => ({
    commandText: playing ? 'echo hello' : '',
    outputText: playing ? 'hello' : '',
    showCursor: Boolean(playing),
    phase: playing ? 'typing-command' : 'idle',
    history: [],
  }),
}));

jest.mock('../../../src/hooks/useTerminalBootSequence', () => ({
  useTerminalBootSequence: jest.fn(),
}));

const mockUseTerminalBootSequence = useTerminalBootSequence as jest.MockedFunction<
  typeof useTerminalBootSequence
>;

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
    showAuxiliaryControls,
  }: {
    onCommandPaletteToggle?: () => void;
    onWindowDragPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
    windowDragEnabled?: boolean;
    windowDragging?: boolean;
    onClose?: () => void;
    onMinimize?: () => void;
    onExpand?: () => void;
    showAuxiliaryControls?: boolean;
  }) => (
    <div
      data-testid="vscode-title-bar"
      data-drag-enabled={String(Boolean(windowDragEnabled))}
      data-dragging={String(Boolean(windowDragging))}
      data-aux-controls={String(Boolean(showAuxiliaryControls))}
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
  VscodeExplorerSidebar: ({
    activeTab,
    resized,
    visible,
  }: {
    activeTab: string;
    resized?: boolean;
    visible: boolean;
  }) => (
    <div
      data-testid="explorer-sidebar"
      data-active-tab={activeTab}
      data-resized={String(Boolean(resized))}
      data-visible={String(visible)}
    />
  ),
}));

jest.mock('../../../src/components/ide/VscodeTabBar', () => ({
  VscodeTabBar: ({
    activeTab,
    expanded,
    resized,
    onTabChange,
  }: {
    activeTab: string;
    expanded?: boolean;
    resized?: boolean;
    onTabChange?: (tab: string) => void;
  }) => (
    <div
      data-testid="tab-bar"
      data-active-tab={activeTab}
      data-expanded={String(Boolean(expanded))}
      data-resized={String(Boolean(resized))}
    >
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
  VscodeEditorPane: ({
    activeTab,
    expanded,
    resized,
  }: {
    activeTab: string;
    expanded?: boolean;
    resized?: boolean;
  }) => (
    <div
      data-testid="editor-pane"
      data-active-tab={activeTab}
      data-expanded={String(Boolean(expanded))}
      data-resized={String(Boolean(resized))}
    />
  ),
}));

jest.mock('../../../src/components/ide/VscodeTerminalPanel', () => ({
  VscodeTerminalPanel: ({
    commandText,
    outputText,
    expanded,
    resized,
    activeSessionId,
    sessions,
  }: {
    commandText: string;
    outputText: string;
    expanded?: boolean;
    resized?: boolean;
    activeSessionId?: string;
    sessions?: Array<{ id: string; label: string }>;
  }) => (
    <div
      data-testid="terminal-panel"
      data-expanded={String(Boolean(expanded))}
      data-resized={String(Boolean(resized))}
      data-command-text={commandText}
      data-output-text={outputText}
      data-active-session-id={activeSessionId ?? ''}
      data-session-labels={(sessions ?? []).map((session) => session.label).join(',')}
    />
  ),
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
    expanded: boolean;
    lines: TerminalLine[];
    onWindowDragPointerDown: React.PointerEventHandler<HTMLDivElement>;
    playing: boolean;
    windowDragEnabled: boolean;
    windowDragging: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onExpand: () => void;
    bootActive: boolean;
    resizeEnabled: boolean;
    resizeWidth: number;
    resizeHeight: number;
    isResizing: boolean;
    onResizeStart: (
      edge: 'right' | 'bottom' | 'corner',
      event: React.PointerEvent<HTMLDivElement>
    ) => void;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <TerminalHeroContent
        expanded={overrides.expanded}
        bootActive={overrides.bootActive}
        lines={overrides.lines ?? SAMPLE_LINES}
        onWindowDragPointerDown={overrides.onWindowDragPointerDown}
        playing={overrides.playing ?? false}
        windowDragEnabled={overrides.windowDragEnabled}
        windowDragging={overrides.windowDragging}
        onClose={overrides.onClose}
        onMinimize={overrides.onMinimize}
        onExpand={overrides.onExpand}
        resizeEnabled={overrides.resizeEnabled}
        resizeWidth={overrides.resizeWidth}
        resizeHeight={overrides.resizeHeight}
        isResizing={overrides.isResizing}
        onResizeStart={overrides.onResizeStart}
      />
    </ThemeProvider>
  );

describe('TerminalHeroContent', () => {
  beforeEach(() => {
    mockUseTerminalBootSequence.mockImplementation((active: boolean) =>
      active
        ? {
            phase: 'server-output',
            sessions: [{ id: 'server', label: 'uvicorn' }],
            activeSessionId: 'server',
            commandText: 'uvicorn server:app --reload',
            outputText: 'INFO:     Application startup complete.',
            showCursor: true,
            complete: false,
            editorTab: 'server',
          }
        : {
            phase: 'idle',
            sessions: [{ id: 'zsh', label: 'zsh' }],
            activeSessionId: 'zsh',
            commandText: '',
            outputText: '',
            showCursor: false,
            complete: false,
            editorTab: 'server',
          }
    );
  });

  afterEach(() => {
    mockUseTerminalBootSequence.mockClear();
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

    it('sets data-expanded="false" when expanded is omitted', () => {
      renderHero();
      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'false');
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
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-aux-controls', 'false');
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

  describe('expanded layout mode', () => {
    it('threads expanded mode into the IDE shell subcomponents', () => {
      renderHero({ expanded: true });

      expect(screen.getByTestId('terminal-hero')).toHaveAttribute('data-expanded', 'true');
      expect(screen.getByTestId('vscode-title-bar')).toHaveAttribute('data-aux-controls', 'true');
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-expanded', 'true');
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-expanded', 'true');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-expanded', 'true');
    });
  });

  describe('boot sequence handoff', () => {
    it('keeps the normal terminal loop running when boot mode is inactive', () => {
      renderHero({ playing: true, bootActive: false });

      expect(screen.getByTestId('terminal-panel')).toHaveAttribute(
        'data-command-text',
        'echo hello'
      );
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-output-text', 'hello');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-active-session-id', '');
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'server');
    });

    it('shows boot-driven terminal content while boot mode is active', () => {
      renderHero({ playing: true, bootActive: true });

      expect(screen.getByTestId('terminal-panel')).toHaveAttribute(
        'data-command-text',
        'uvicorn server:app --reload'
      );
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute(
        'data-output-text',
        'INFO:     Application startup complete.'
      );
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute(
        'data-active-session-id',
        'server'
      );
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute(
        'data-session-labels',
        'uvicorn'
      );
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-active-tab', 'server');
    });

    it('auto-opens the explorer once when boot reaches the explorer-open phase', () => {
      mockUseTerminalBootSequence.mockReturnValue({
        phase: 'explorer-open',
        sessions: [{ id: 'zsh', label: 'zsh' }],
        activeSessionId: 'zsh',
        commandText: '',
        outputText: '',
        showCursor: false,
        complete: false,
        editorTab: 'server',
      });

      renderHero({ bootActive: true });

      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'true');
    });

    it('does not force the explorer back open after the user closes it during boot', () => {
      mockUseTerminalBootSequence.mockReturnValue({
        phase: 'explorer-open',
        sessions: [{ id: 'zsh', label: 'zsh' }],
        activeSessionId: 'zsh',
        commandText: '',
        outputText: '',
        showCursor: false,
        complete: false,
        editorTab: 'server',
      });

      const view = renderHero({ bootActive: true });

      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'true');

      fireEvent.click(screen.getByLabelText('Activity icon 0'));

      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'false');
      expect(screen.getByTestId('activity-bar')).toHaveAttribute('data-active-index', '-1');

      view.rerender(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} bootActive />
        </ThemeProvider>
      );

      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-visible', 'false');
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

  describe('resize handles', () => {
    it('does not render resize handles when resizeEnabled is omitted', () => {
      renderHero();
      expect(screen.queryByTestId('resize-handle-right')).not.toBeInTheDocument();
      expect(screen.queryByTestId('resize-handle-bottom')).not.toBeInTheDocument();
      expect(screen.queryByTestId('resize-handle-corner')).not.toBeInTheDocument();
    });

    it('does not render resize handles when resizeEnabled is false', () => {
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeEnabled={false} />
        </ThemeProvider>
      );
      expect(screen.queryByTestId('resize-handle-right')).not.toBeInTheDocument();
    });

    it('renders all three resize handles when resizeEnabled is true', () => {
      renderHero({ resizeEnabled: true });
      expect(screen.getByTestId('resize-handle-right')).toBeInTheDocument();
      expect(screen.getByTestId('resize-handle-bottom')).toBeInTheDocument();
      expect(screen.getByTestId('resize-handle-corner')).toBeInTheDocument();
    });

    it('does not render resize handles or gutters in expanded mode', () => {
      renderHero({ expanded: true, resizeEnabled: true });

      expect(screen.queryByTestId('resize-handle-right')).not.toBeInTheDocument();
      expect(screen.queryByTestId('resize-handle-bottom')).not.toBeInTheDocument();
      expect(screen.queryByTestId('resize-handle-corner')).not.toBeInTheDocument();
    });

    it('calls onResizeStart with "right" when the right edge is pointer-downed', () => {
      const onResizeStart = jest.fn();
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeEnabled onResizeStart={onResizeStart} />
        </ThemeProvider>
      );
      fireEvent.pointerDown(screen.getByTestId('resize-handle-right'), { button: 0 });
      expect(onResizeStart).toHaveBeenCalledTimes(1);
      expect(onResizeStart).toHaveBeenCalledWith('right', expect.anything());
    });

    it('calls onResizeStart with "bottom" when the bottom edge is pointer-downed', () => {
      const onResizeStart = jest.fn();
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeEnabled onResizeStart={onResizeStart} />
        </ThemeProvider>
      );
      fireEvent.pointerDown(screen.getByTestId('resize-handle-bottom'), { button: 0 });
      expect(onResizeStart).toHaveBeenCalledWith('bottom', expect.anything());
    });

    it('calls onResizeStart with "corner" when the corner handle is pointer-downed', () => {
      const onResizeStart = jest.fn();
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeEnabled onResizeStart={onResizeStart} />
        </ThemeProvider>
      );
      fireEvent.pointerDown(screen.getByTestId('resize-handle-corner'), { button: 0 });
      expect(onResizeStart).toHaveBeenCalledWith('corner', expect.anything());
    });
  });

  describe('resize-to-child threading', () => {
    it('does not set resized on children when no resizeWidth/resizeHeight is supplied', () => {
      renderHero();
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-resized', 'false');
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-resized', 'false');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-resized', 'false');
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-resized', 'false');
    });

    it('sets resized=true on children when resizeWidth is provided', () => {
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeWidth={600} />
        </ThemeProvider>
      );
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('explorer-sidebar')).toHaveAttribute('data-resized', 'true');
    });

    it('sets resized=true on children when resizeHeight is provided', () => {
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeHeight={400} />
        </ThemeProvider>
      );
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('tab-bar')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-resized', 'true');
    });

    it('sets resized=true on children when both resizeWidth and resizeHeight are provided', () => {
      render(
        <ThemeProvider>
          <TerminalHeroContent lines={SAMPLE_LINES} resizeWidth={600} resizeHeight={400} />
        </ThemeProvider>
      );
      expect(screen.getByTestId('editor-pane')).toHaveAttribute('data-resized', 'true');
      expect(screen.getByTestId('terminal-panel')).toHaveAttribute('data-resized', 'true');
    });
  });
});
