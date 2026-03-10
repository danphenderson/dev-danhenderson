import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useCvStyles } from '../../styles/cvStyles';

export const SectionPanel = ({ children, sx, ...props }: BoxProps) => {
  const { sectionPanelSx } = useCvStyles();
  const sxArray = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Box
      sx={[
        sectionPanelSx,
        ...sxArray,
      ]}
      {...props}
    >
      {children}
    </Box>
  );
};
