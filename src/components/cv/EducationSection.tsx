import { Box, Stack, Typography } from '@mui/material';
import type { EducationInfo } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { ToolsAccordion } from '../ToolsAccordion';
import { useCvStyles } from '../../styles/cvStyles';

type EducationSectionProps = {
  education: EducationInfo;
};

export const EducationSection = ({ education }: EducationSectionProps) => {
  const {
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
    <Stack spacing={2.25}>
      {education.entries.map((entry, index) => (
        <AnimatedContentCard key={`${entry.university}-${entry.program}-${index}`} delayMs={index * 90}>
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

          {entry.highlights?.filter((highlight) => highlight.trim().length > 0).length ? (
            <Box component="ul" sx={getDetailListSx(1.25, 0)}>
              {entry.highlights
                ?.filter((highlight) => highlight.trim().length > 0)
                .map((highlight, highlightIndex) => (
                  <Typography component="li" variant="body2" key={`${highlight}-${highlightIndex}`}>
                    {highlight}
                  </Typography>
                ))}
            </Box>
          ) : null}

          {entry.tools?.filter((tool) => tool.trim().length > 0).length ? (
            <Box sx={detailBlockSx}>
              <ToolsAccordion
                id={`education-tools-${index}`}
                title="Tools used"
                subtitle=""
                tools={entry.tools}
                dense
                defaultExpanded={false}
              />
            </Box>
          ) : null}
        </AnimatedContentCard>
      ))}
    </Stack>
  );
};
