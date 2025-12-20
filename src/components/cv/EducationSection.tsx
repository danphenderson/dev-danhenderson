import { Box, Stack, Typography } from '@mui/material';
import type { EducationInfo } from '../../data/cv';
import { ContentCard } from '../ContentCard';

type EducationSectionProps = {
  education: EducationInfo;
};

export const EducationSection = ({ education }: EducationSectionProps) => {
  if (!education.entries || education.entries.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2.25}>
      {education.entries.map((entry, index) => (
        <ContentCard key={`${entry.university}-${entry.program}-${index}`}>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
            {entry.university}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 0.75 }}>
            {entry.program}
          </Typography>

          {(entry.status || entry.dateRange) && (
            <Stack spacing={0.25} sx={{ mt: 0.5 }}>
              {entry.status && (
                <Typography variant="subtitle2" color="text.secondary">
                  {entry.status}
                </Typography>
              )}
              {entry.dateRange && (
                <Typography variant="subtitle2" color="text.secondary">
                  {entry.dateRange}
                </Typography>
              )}
            </Stack>
          )}

          {entry.highlights?.filter((highlight) => highlight.trim().length > 0).length ? (
            <Box component="ul" sx={{ paddingLeft: 3, margin: '10px 0 0' }}>
              {entry.highlights
                ?.filter((highlight) => highlight.trim().length > 0)
                .map((highlight, highlightIndex) => (
                  <Typography component="li" variant="body2" key={`${highlight}-${highlightIndex}`}>
                    {highlight}
                  </Typography>
                ))}
            </Box>
          ) : null}
        </ContentCard>
      ))}
    </Stack>
  );
};
