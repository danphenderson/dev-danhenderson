import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTerminalTypewriter } from './text/useTerminalTypewriter';
import type { TerminalLine } from './text/useTerminalTypewriter';
import { VscodeTitleBar } from './terminal/VscodeTitleBar';
import { VscodeActivityBar } from './terminal/VscodeActivityBar';
import { VscodeTabBar } from './terminal/VscodeTabBar';
import { VscodeEditorPane } from './terminal/VscodeEditorPane';
import { VscodeTerminalPanel } from './terminal/VscodeTerminalPanel';
import { VscodeStatusBar } from './terminal/VscodeStatusBar';
import { VscodeNotificationToast } from './terminal/VscodeNotificationToast';

// Re-export for consumers that import TerminalLine from this module
export type { TerminalLine };

export interface TerminalHeroContentProps {
  lines: TerminalLine[];
  playing?: boolean;
  /** @deprecated sessionLabel is no longer rendered; kept for API compatibility */
  sessionLabel?: string;
  sx?: SxProps<Theme>;
}

const TOAST_DURATION_MS = 3000;

export const TerminalHeroContent: React.FC<TerminalHeroContentProps> = ({
  lines,
  playing = false,
  sx,
}) => {
  const { commandText, outputText, showCursor, phase, longestCommand, longestOutput } =
    useTerminalTypewriter({
      lines,
      playing,
      prompt: '~ $ ',
      timingPreset: 'headline',
      pauseBeforeOutputMs: 400,
      pauseAfterOutputMs: 2400,
    });

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
      <VscodeTitleBar />

      {/* Editor + activity bar row */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        <VscodeActivityBar />

        {/* Right column: tab bar → editor pane → terminal panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <VscodeTabBar />
          <VscodeEditorPane playing={playing} />
          <VscodeTerminalPanel
            lines={lines}
            commandText={commandText}
            outputText={outputText}
            showCursor={showCursor}
            phase={phase}
            longestCommand={longestCommand}
            longestOutput={longestOutput}
          />
        </Box>
      </Box>

      <VscodeStatusBar commandText={commandText} />

      <VscodeNotificationToast
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </Box>
  );
};
