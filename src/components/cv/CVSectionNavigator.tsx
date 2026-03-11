import { Box, Chip, Stack, Typography } from '@mui/material';
import { CVSectionKey, cvSectionMetadata } from './cvSectionMetadata';
import { useComponentStyles } from '../../styles/componentStyles';

type CVSectionNavigatorProps = {
  sections: CVSectionKey[];
  testId?: string;
};

export const CVSectionNavigator = ({
  sections,
  testId,
}: CVSectionNavigatorProps) => {
  const {
    sectionNavigatorRootSx,
    sectionNavigatorLeadSx,
    sectionNavigatorRailSx,
    sectionNavigatorChipSx,
  } = useComponentStyles();

  const handleJumpToSection = (sectionKey: CVSectionKey) => () => {
    document.getElementById(cvSectionMetadata[sectionKey].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Box component="nav" aria-label="CV section navigation" sx={sectionNavigatorRootSx} data-testid={testId}>
      <Typography variant="overline" sx={sectionNavigatorLeadSx}>
        Jump to
      </Typography>
      <Stack direction="row" spacing={1} sx={sectionNavigatorRailSx}>
        {sections.map((sectionKey) => (
          <Chip
            key={sectionKey}
            label={cvSectionMetadata[sectionKey].navLabel}
            onClick={handleJumpToSection(sectionKey)}
            clickable
            size="small"
            variant="outlined"
            sx={sectionNavigatorChipSx}
          />
        ))}
      </Stack>
    </Box>
  );
};
