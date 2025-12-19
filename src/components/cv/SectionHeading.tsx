import { Box, BoxProps, Typography } from '@mui/material';
import { useCvStyles } from '../../ThemeProvider';

type SectionHeadingProps = BoxProps & {
  overline: string;
  title?: string;
  subtitle?: string;
};

export const SectionHeading = ({ overline, title, subtitle, sx, ...props }: SectionHeadingProps) => {
  const { overlineSx } = useCvStyles();

  return (
    <Box sx={sx} {...props}>
      <Typography variant="overline" sx={overlineSx}>
        {overline}
      </Typography>
      {title && (
        <Typography variant="h4" sx={{ mb: subtitle ? 1 : 2, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
