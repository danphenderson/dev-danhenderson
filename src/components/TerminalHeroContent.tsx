import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTerminalTypewriter } from './text/useTerminalTypewriter';
import type { TerminalLine, VscodeEditorTab } from '../types/ui';
import { VscodeTitleBar } from './ide/VscodeTitleBar';
import { VscodeActivityBar } from './ide/VscodeActivityBar';
import { VscodeTabBar } from './ide/VscodeTabBar';
import { VscodeEditorPane } from './ide/VscodeEditorPane';
import { VscodeTerminalPanel } from './ide/VscodeTerminalPanel';
import { VscodeStatusBar } from './ide/VscodeStatusBar';
import { VscodeNotificationToast } from './ide/VscodeNotificationToast';
import { VscodeExplorerSidebar } from './ide/VscodeExplorerSidebar';
import { VscodeCommandPalette } from './ide/VscodeCommandPalette';
import { VscodeResizeHandle } from './ide/VscodeResizeHandle';
import {
  VSCODE_WINDOW_SHADOW,
  VSCODE_WINDOW_RADIUS,
  VSCODE_COLORS,
  VSCODE_LAYOUT,
} from './ide/vscodeTokens';
import type { IdeResizeEdge } from '../types/ui';

export type { TerminalLine };

export interface TerminalHeroContentProps {
  lines: TerminalLine[];
  playing?: boolean;
  expanded?: boolean;
  /** @deprecated sessionLabel is no longer rendered; kept for API compatibility */
  sessionLabel?: string;
  onWindowDragPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  windowDragEnabled?: boolean;
  windowDragging?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  resizeWidth?: number;
  resizeHeight?: number;
  resizeEnabled?: boolean;
  isResizing?: boolean;
  onResizeStart?: (edge: IdeResizeEdge, event: React.PointerEvent<HTMLDivElement>) => void;
  expandHighlighted?: boolean;
  sx?: SxProps<Theme>;
}

const TOAST_DURATION_MS = 3000;

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
  expanded = false,
  onWindowDragPointerDown,
  windowDragEnabled = false,
  windowDragging = false,
  onClose,
  onMinimize,
  onExpand,
  resizeWidth,
  resizeHeight,
  resizeEnabled = false,
  isResizing = false,
  onResizeStart,
  expandHighlighted,
  sx,
}) => {
  const { commandText, outputText, showCursor, phase, history } = useTerminalTypewriter({
    lines,
    playing,
    prompt: '~ $ ',
    timingPreset: 'headline',
    pauseBeforeOutputMs: 400,
    pauseAfterOutputMs: 2400,
  });

  const historyLineCount = React.useMemo(
    () => history.reduce((count, line) => count + 1 + line.output.split('\n').length, 0),
    [history]
  );

  // Notification toast — fires once when the first output completes
  const [toastVisible, setToastVisible] = React.useState(false);
  const hasShownToastRef = React.useRef(false);

  React.useEffect(() => {
    if (phase !== 'pause-after-output' || hasShownToastRef.current) return;
    hasShownToastRef.current = true;
    setToastVisible(true);
    const timerId = window.setTimeout(() => setToastVisible(false), TOAST_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [phase]);

  // Explorer sidebar toggle
  const [explorerVisible, setExplorerVisible] = React.useState(false);
  const [activityBarIndex, setActivityBarIndex] = React.useState(0);

  const handleActivityBarClick = React.useCallback((index: number) => {
    if (index === 0) {
      setExplorerVisible((prev) => {
        const next = !prev;
        setActivityBarIndex(next ? 0 : -1);
        return next;
      });
    } else {
      setExplorerVisible(false);
      setActivityBarIndex(index);
    }
  }, []);

  // Command palette toggle
  const [commandPaletteVisible, setCommandPaletteVisible] = React.useState(false);

  // Clickable tab focus
  const [activeTab, setActiveTab] = React.useState<VscodeEditorTab>('server');

  const isUserResized = resizeWidth != null || resizeHeight != null;
  const showResizeHandles = resizeEnabled && !expanded;
  const fluidEditorLayout = explorerVisible;
  const autoWidth = `calc(${VSCODE_LAYOUT.activityBarWidth}px + ${VSCODE_LAYOUT.editorColumnWidth})`;
  const terminalWindowWidth = expanded ? '100%' : resizeWidth != null ? resizeWidth : autoWidth;
  const terminalWindowHeight = expanded ? '100%' : resizeHeight != null ? resizeHeight : undefined;

  return (
    <Box
      sx={{
        height: terminalWindowHeight,
        minHeight: expanded ? 0 : undefined,
        minWidth: 0,
        width: terminalWindowWidth,
        maxWidth: '100%',
        position: 'relative',
      }}
    >
      <Box
        aria-label={lines.map((l) => `${l.command}: ${l.output}`).join('; ')}
        data-expanded={String(expanded)}
        data-testid="terminal-hero"
        data-playing={String(Boolean(playing))}
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
            height: terminalWindowHeight == null ? undefined : '100%',
            minHeight: expanded ? 0 : undefined,
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: VSCODE_COLORS.editorBg,
            borderRadius: `${VSCODE_WINDOW_RADIUS}px`,
            boxShadow: VSCODE_WINDOW_SHADOW,
            // Subtle outer border for the desktop-window chrome look
            border: '1px solid rgba(255,255,255,0.06)',
            ...(isResizing && { userSelect: 'none' }),
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        <VscodeTitleBar
          onCommandPaletteToggle={() => setCommandPaletteVisible((prev) => !prev)}
          onWindowDragPointerDown={onWindowDragPointerDown}
          windowDragEnabled={windowDragEnabled}
          windowDragging={windowDragging}
          onClose={onClose}
          onMinimize={onMinimize}
          onExpand={onExpand}
          expandHighlighted={expandHighlighted}
        />

        {/* Editor + activity bar row */}
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <VscodeActivityBar activeIndex={activityBarIndex} onIconClick={handleActivityBarClick} />

          {/* Explorer sidebar */}
          <VscodeExplorerSidebar
            activeTab={activeTab}
            resized={isUserResized}
            visible={explorerVisible}
          />

          {/* Right column: tab bar → editor pane → terminal panel */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <VscodeTabBar
              activeTab={activeTab}
              expanded={expanded}
              fluidLayout={fluidEditorLayout}
              resized={isUserResized}
              onTabChange={setActiveTab}
            />
            <VscodeEditorPane
              activeTab={activeTab}
              expanded={expanded}
              fluidLayout={fluidEditorLayout}
              resized={isUserResized}
            />
            <VscodeTerminalPanel
              commandText={commandText}
              expanded={expanded}
              fluidLayout={fluidEditorLayout}
              resized={isUserResized}
              outputText={outputText}
              showCursor={showCursor}
              phase={phase}
              history={history}
            />
          </Box>
        </Box>

        <VscodeStatusBar
          activeTab={activeTab}
          commandText={commandText}
          historyLineCount={historyLineCount}
        />

        <VscodeNotificationToast
          activeTab={activeTab}
          visible={toastVisible}
          onDismiss={() => setToastVisible(false)}
        />

        <VscodeCommandPalette
          visible={commandPaletteVisible}
          onDismiss={() => setCommandPaletteVisible(false)}
        />
      </Box>

      <VscodeResizeHandle disabled={!showResizeHandles} onResizeStart={onResizeStart} />
    </Box>
  );
};
