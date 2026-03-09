import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useCvStyles } from '../../styles/cvTheme';

export const SectionPanel = ({ children, sx, ...props }: BoxProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();
  const sxArray = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Box
      sx={[
        {
          borderRadius: 1.5,
          border: subtleBorder,
          backgroundColor: subtleSurface,
          p: { xs: 1, md: 1 },
        },
        ...sxArray,
      ]}
      {...props}
    >
      {children}
    </Box>
  );
};
