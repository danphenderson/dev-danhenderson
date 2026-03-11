import { Chip, Stack, Typography } from '@mui/material';
import { ContentCard } from '../ContentCard';
import { CVSectionKey, cvSectionMetadata } from './cvSectionMetadata';
import { useCvStyles } from '../../styles/cvStyles';

type CVSectionNavigatorProps = {
  sections: CVSectionKey[];
  sticky?: boolean;
  testId?: string;
};

export const CVSectionNavigator = ({
  sections,
  sticky = false,
  testId,
}: CVSectionNavigatorProps) => {
  const {
    getSectionNavigatorContainerSx,
    sectionNavigatorCardSx,
    sectionNavigatorLeadSx,
    sectionNavigatorRailSx,
    sectionNavigatorChipSx,
  } = useCvStyles();

  const handleJumpToSection = (sectionKey: CVSectionKey) => () => {
    document.getElementById(cvSectionMetadata[sectionKey].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Stack sx={getSectionNavigatorContainerSx(sticky)} data-testid={testId}>
      <ContentCard component="nav" aria-label="CV section navigation" sx={sectionNavigatorCardSx}>
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
      </ContentCard>
    </Stack>
  );
};
