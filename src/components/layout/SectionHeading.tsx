import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import type { ReactNode } from 'react';
import { useComponentStyles } from '../../styles/componentStyles';
import { Text } from '../text';

type SectionHeadingProps = BoxProps & {
  overline: string;
  title?: string;
  subtitle?: ReactNode;
};

export const SectionHeading = ({
  overline,
  title,
  subtitle,
  sx,
  ...props
}: SectionHeadingProps) => {
  const hasSubtitle = subtitle !== undefined && subtitle !== null && subtitle !== false;
  const {
    sectionHeadingOverlineTextSx,
    sectionHeadingTitleSx,
    sectionHeadingTitleTextSx,
    sectionHeadingSubtitleSx,
    sectionHeadingSubtitleTextSx,
  } = useComponentStyles();

  return (
    <Box sx={sx} {...props}>
      <Text role="sectionEyebrow" tone="support" sx={sectionHeadingOverlineTextSx}>
        {overline}
      </Text>
      {title && (
        <Text
          role="sectionTitle"
          sx={[sectionHeadingTitleSx(hasSubtitle), sectionHeadingTitleTextSx]}
        >
          {title}
        </Text>
      )}
      {hasSubtitle && (
        <Text role="sectionSubtitle" sx={[sectionHeadingSubtitleSx, sectionHeadingSubtitleTextSx]}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};
