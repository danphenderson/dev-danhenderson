import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { useTheme, alpha } from '@mui/material/styles';
import { duration, easing } from '../../motion/tokens';

type CVStoryProgressProps = {
  progress: number;
};

export const CVStoryProgress = ({ progress }: CVStoryProgressProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 1,
        background: alpha(theme.palette.primary.main, 0.12),
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: theme.palette.primary.main,
          originX: 0,
        }}
        animate={{ scaleX: progress }}
        transition={{ duration: duration.normal, ease: easing.decel }}
      />
    </Box>
  );
};
