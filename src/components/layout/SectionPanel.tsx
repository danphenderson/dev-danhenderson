import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useCvStyles } from '../../styles/cvStyles';
import { normalizeSxProp } from '../../utils/sx';

export const SectionPanel = ({ children, sx, ...props }: BoxProps) => {
  const { sectionPanelSx } = useCvStyles();

  return (
    <Box
      sx={[
        sectionPanelSx,
        ...normalizeSxProp(sx),
      ]}
      {...props}
    >
      {children}
    </Box>
  );
};
