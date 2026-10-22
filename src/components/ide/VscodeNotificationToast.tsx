import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Box from '@mui/material/Box';
import { duration, useMotionScale } from '../../motion';
import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS, monoFontFamily } from './vscodeTokens';
import { getVscodeEditorTabMetadata } from './vscodeEditorTabs';

interface VscodeNotificationToastProps {
  activeTab?: VscodeEditorTab;
  visible: boolean;
  onDismiss: () => void;
}

export const VscodeNotificationToast: React.FC<VscodeNotificationToastProps> = ({
  activeTab = 'server',
  visible,
  onDismiss,
}) => {
  const { duration: motionScale } = useMotionScale();
  const prefersReducedMotion = motionScale === 0;
  const activeTabMetadata = getVscodeEditorTabMetadata(activeTab);

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={motion.div}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: duration.fast * motionScale }}
          sx={{
            position: 'absolute',
            bottom: 28,
            right: 12,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: VSCODE_COLORS.tabBarBg,
            border: `1px solid ${VSCODE_COLORS.panelBorder}`,
            borderRadius: '3px',
            px: 1.5,
            py: 0.75,
            fontFamily: monoFontFamily,
            fontSize: '0.72rem',
            color: VSCODE_COLORS.foreground,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
          }}
        >
          <Box component="span" sx={{ color: VSCODE_COLORS.syntaxComment }}>
            {`${activeTabMetadata.fileName} — No problems detected ✓`}
          </Box>
          <Box
            component="button"
            type="button"
            aria-label="Dismiss editor notification"
            onClick={onDismiss}
            sx={{
              cursor: 'pointer',
              background: 'transparent',
              border: 0,
              color: VSCODE_COLORS.inactiveTab,
              fontSize: '0.8rem',
              lineHeight: 1,
              ml: 0.5,
              '&:hover': { color: VSCODE_COLORS.foreground },
            }}
          >
            ×
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};
