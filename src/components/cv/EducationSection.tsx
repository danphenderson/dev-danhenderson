import { Box, Stack, Typography } from '@mui/material';
import type { EducationInfo } from '../../data/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel, TabPanelItem } from '../TabPanel';
import { useCvStyles } from '../../styles/cvStyles';

type EducationSectionProps = {
  education: EducationInfo;
  startDelayMs?: number;
};

export const EducationSection = ({ education, startDelayMs = 0 }: EducationSectionProps) => {
  const {
    contentListStackSpacing,
    detailBlockSx,
    educationMetaSx,
    educationProgramSx,
    getDetailListSx,
    sectionTitleSx,
    secondaryTextSx,
  } = useCvStyles();

  if (!education.entries || education.entries.length === 0) {
    return null;
  }

  return (
    <AnimatedContentList
      items={education.entries}
      getItemKey={(entry, index) => `${entry.university}-${entry.program}-${index}`}
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(entry, index) => {
        const filteredHighlights = entry.highlights?.filter((highlight) => highlight.trim().length > 0) ?? [];
        const filteredSkills = entry.skills?.filter((tool) => tool.trim().length > 0) ?? [];
        const educationTabs: TabPanelItem[] = [];

        if (filteredHighlights.length) {
          educationTabs.push({
            value: 'highlights',
            label: 'Highlights',
            content: (
              <Box component="ul" sx={getDetailListSx(0, 0)}>
                {filteredHighlights.map((highlight, highlightIndex) => (
                  <Typography component="li" variant="body2" key={`${highlight}-${highlightIndex}`}>
                    {highlight}
                  </Typography>
                ))}
              </Box>
            ),
          });
        }

        if (filteredSkills.length) {
          educationTabs.push({
            value: 'skills',
            label: 'Skills',
            renderContent: (selected) => (
              <SkillsChipList skills={filteredSkills} dense in={selected} />
            ),
          });
        }

        return (
          <>
            <Typography variant="h6" sx={sectionTitleSx}>
              {entry.university}
            </Typography>

            <Typography variant="subtitle1" sx={educationProgramSx}>
              {entry.program}
            </Typography>

            {(entry.status || entry.dateRange) && (
              <Stack spacing={0.25} sx={educationMetaSx}>
                {entry.status && (
                  <Typography variant="subtitle2" sx={secondaryTextSx}>
                    {entry.status}
                  </Typography>
                )}
                {entry.dateRange && (
                  <Typography variant="subtitle2" sx={secondaryTextSx}>
                    {entry.dateRange}
                  </Typography>
                )}
              </Stack>
            )}

            {educationTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`education-details-${index}`}
                  ariaLabel={`${entry.program} details`}
                  items={educationTabs}
                  dense
                  tabsVariant="fullWidth"
                />
              </Box>
            ) : null}
          </>
        );
      }}
    />
  );
};
