import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { normalizeSxProp } from '../../utils/sx';

export const SectionPanel = ({ children, sx, ...props }: BoxProps) => {
  const { sectionPanelSx } = useComponentStyles();

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
