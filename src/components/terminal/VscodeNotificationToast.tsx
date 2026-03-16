import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Box from '@mui/material/Box';
import { VSCODE_COLORS, monoFontFamily } from './vscodeTokens';

interface VscodeNotificationToastProps {
  visible: boolean;
  onDismiss: () => void;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const VscodeNotificationToast: React.FC<VscodeNotificationToastProps> = ({
  visible,
  onDismiss,
}) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={motion.div}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
          sx={{
            position: 'absolute',
            bottom: 28,
            right: 12,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: '#252526',
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
            portfolio.ts — No problems detected ✓
          </Box>
          <Box
            component="span"
            onClick={onDismiss}
            sx={{
              cursor: 'pointer',
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
