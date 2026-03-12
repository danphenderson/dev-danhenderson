import { Box, Chip, Stack } from '@mui/material';
import { CVSectionKey, cvSectionMetadata } from './cvSectionMetadata';
import { useComponentStyles } from '../../styles/componentStyles';
import { SectionLabel, ChipLabel } from '../text';

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
      <SectionLabel sx={sectionNavigatorLeadSx}>
        Jump to
      </SectionLabel>
      <Stack direction="row" spacing={1} sx={sectionNavigatorRailSx}>
        {sections.map((sectionKey) => (
          <Chip
            key={sectionKey}
            label={<ChipLabel>{cvSectionMetadata[sectionKey].navLabel}</ChipLabel>}
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
