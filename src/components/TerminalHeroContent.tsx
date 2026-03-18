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
import {
  VSCODE_WINDOW_SHADOW,
  VSCODE_WINDOW_RADIUS,
  VSCODE_COLORS,
  VSCODE_LAYOUT,
} from './ide/vscodeTokens';

export type { TerminalLine };

export interface TerminalHeroContentProps {
  lines: TerminalLine[];
  playing?: boolean;
  /** @deprecated sessionLabel is no longer rendered; kept for API compatibility */
  sessionLabel?: string;
  onWindowDragPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  windowDragEnabled?: boolean;
  windowDragging?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  sx?: SxProps<Theme>;
}

const TOAST_DURATION_MS = 3000;

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
  onWindowDragPointerDown,
  windowDragEnabled = false,
  windowDragging = false,
  onClose,
  onMinimize,
  onExpand,
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

  const accessibleLabel = lines.map((l) => `${l.command}: ${l.output}`).join('; ');
  const terminalWindowWidth = explorerVisible
    ? `calc(${VSCODE_LAYOUT.activityBarWidth}px + ${VSCODE_LAYOUT.explorerWidth}px + ${VSCODE_LAYOUT.editorColumnWidth})`
    : `calc(${VSCODE_LAYOUT.activityBarWidth}px + ${VSCODE_LAYOUT.editorColumnWidth})`;

  return (
    <Box
      aria-label={accessibleLabel}
      data-testid="terminal-hero"
      data-playing={String(Boolean(playing))}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          width: terminalWindowWidth,
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: VSCODE_COLORS.editorBg,
          borderRadius: `${VSCODE_WINDOW_RADIUS}px`,
          boxShadow: VSCODE_WINDOW_SHADOW,
          // Subtle outer border for the desktop-window chrome look
          border: '1px solid rgba(255,255,255,0.06)',
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
      />

      {/* Editor + activity bar row */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        <VscodeActivityBar activeIndex={activityBarIndex} onIconClick={handleActivityBarClick} />

        {/* Explorer sidebar */}
        <VscodeExplorerSidebar activeTab={activeTab} visible={explorerVisible} />

        {/* Right column: tab bar → editor pane → terminal panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <VscodeTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <VscodeEditorPane activeTab={activeTab} />
          <VscodeTerminalPanel
            commandText={commandText}
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
  );
};
