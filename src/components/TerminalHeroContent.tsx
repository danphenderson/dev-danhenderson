import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTerminalTypewriter } from './text/useTerminalTypewriter';
import type { TerminalLine } from '../types/ui';
import { VscodeTitleBar } from './terminal/VscodeTitleBar';
import { VscodeActivityBar } from './terminal/VscodeActivityBar';
import { VscodeTabBar } from './terminal/VscodeTabBar';
import { VscodeEditorPane } from './terminal/VscodeEditorPane';
import { VscodeTerminalPanel } from './terminal/VscodeTerminalPanel';
import { VscodeStatusBar } from './terminal/VscodeStatusBar';
import { VscodeNotificationToast } from './terminal/VscodeNotificationToast';
import { VscodeExplorerSidebar } from './terminal/VscodeExplorerSidebar';
import { VscodeCommandPalette } from './terminal/VscodeCommandPalette';

export type { TerminalLine };

export interface TerminalHeroContentProps {
  lines: TerminalLine[];
  playing?: boolean;
  /** @deprecated sessionLabel is no longer rendered; kept for API compatibility */
  sessionLabel?: string;
  sx?: SxProps<Theme>;
}

const TOAST_DURATION_MS = 3000;

type ActiveTab = 'portfolio' | 'terminal';

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
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
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('portfolio');

  const accessibleLabel = lines.map((l) => `${l.command}: ${l.output}`).join('; ');

  return (
    <Box
      aria-label={accessibleLabel}
      data-testid="terminal-hero"
      data-playing={String(Boolean(playing))}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          // Ensure the inner dark surface fills the shell card
          backgroundColor: '#1e1e1e',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <VscodeTitleBar onCommandPaletteToggle={() => setCommandPaletteVisible((prev) => !prev)} />

      {/* Editor + activity bar row */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        <VscodeActivityBar activeIndex={activityBarIndex} onIconClick={handleActivityBarClick} />

        {/* Explorer sidebar */}
        <VscodeExplorerSidebar visible={explorerVisible} />

        {/* Right column: tab bar → editor pane → terminal panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <VscodeTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <VscodeEditorPane playing={playing} />
          <VscodeTerminalPanel
            commandText={commandText}
            outputText={outputText}
            showCursor={showCursor}
            phase={phase}
            history={history}
          />
        </Box>
      </Box>

      <VscodeStatusBar commandText={commandText} historyLineCount={historyLineCount} />

      <VscodeNotificationToast visible={toastVisible} onDismiss={() => setToastVisible(false)} />

      <VscodeCommandPalette
        visible={commandPaletteVisible}
        onDismiss={() => setCommandPaletteVisible(false)}
      />
    </Box>
  );
};
