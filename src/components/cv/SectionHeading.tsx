import { Box, BoxProps, Typography } from '@mui/material';
import { useCvStyles } from '../../styles/cvStyles';

type SectionHeadingProps = BoxProps & {
  overline: string;
  title?: string;
  subtitle?: string;
};

export const SectionHeading = ({ overline, title, subtitle, sx, ...props }: SectionHeadingProps) => {
  const { overlineSx, sectionHeadingTitleSx, sectionHeadingSubtitleSx } = useCvStyles();

  return (
    <Box sx={sx} {...props}>
      <Typography variant="overline" sx={overlineSx}>
        {overline}
      </Typography>
      {title && (
        <Typography variant="h4" sx={sectionHeadingTitleSx(subtitle)}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="subtitle1" sx={sectionHeadingSubtitleSx}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
