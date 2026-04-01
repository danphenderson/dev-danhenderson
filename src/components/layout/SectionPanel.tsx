import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { mergeSx } from '../../utils/sx';

export const SectionPanel = ({ children, sx, ...props }: BoxProps) => {
  const { sectionPanelSx } = useComponentStyles();

  return (
    <Box sx={mergeSx(sectionPanelSx, sx)} {...props}>
      {children}
    </Box>
  );
};
