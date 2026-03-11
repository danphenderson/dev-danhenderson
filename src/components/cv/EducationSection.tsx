import { Box, Stack, Typography } from '@mui/material';
import type { EducationInfo } from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel, TabPanelItem } from '../TabPanel';
import { useCvStyles } from '../../styles/cvStyles';

type EducationSectionProps = {
  education: EducationInfo;
  startDelayMs?: number;
};

const courseworkPrefixPattern = /^(?:Relevant\s+)?Coursework:\s*/i;

const splitEducationHighlights = (highlights?: string[]) =>
  (highlights ?? []).reduce<{ highlights: string[]; coursework: string[] }>(
    (groups, highlight) => {
      const trimmedHighlight = highlight.trim();

      if (!trimmedHighlight) {
        return groups;
      }

      if (courseworkPrefixPattern.test(trimmedHighlight)) {
        const courses = trimmedHighlight
          .replace(courseworkPrefixPattern, '')
          .split(',')
          .map((course) => course.trim())
          .filter((course) => course.length > 0);

        groups.coursework.push(...(courses.length ? courses : [trimmedHighlight]));
        return groups;
      }

      groups.highlights.push(trimmedHighlight);
      return groups;
    },
    { highlights: [], coursework: [] }
  );

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
      mountItemsOnView
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(entry, index) => {
        const { highlights: filteredHighlights, coursework: filteredCoursework } = splitEducationHighlights(
          entry.highlights
        );
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

        if (filteredCoursework.length) {
          educationTabs.push({
            value: 'coursework',
            label: 'Coursework',
            content: (
              <Box component="ul" sx={getDetailListSx(0, 0)}>
                {filteredCoursework.map((course, courseIndex) => (
                  <Typography component="li" variant="body2" key={`${course}-${courseIndex}`}>
                    {course}
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
