import { Stack, Typography } from '@mui/material';
import type { EducationInfo } from '../../data/cv';
import { ContentCard } from '../ContentCard';

type EducationSectionProps = {
  education: EducationInfo;
};

export const EducationSection = ({ education }: EducationSectionProps) => (
  <ContentCard>
    <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
      {education.university}
    </Typography>
    <Typography variant="subtitle1">{education.degree}</Typography>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
      {education.grades}
    </Typography>
    <Stack spacing={0.5} sx={{ mb: 1.5 }}>
      {education.activities.split('\n').map((activity, index) => (
        <Typography key={`${activity}-${index}`} variant="body2">
          {activity}
        </Typography>
      ))}
    </Stack>
    <Stack spacing={0.5}>
      {education.achievements.split('\n').map((achievement, index) => (
        <Typography key={`${achievement}-${index}`} variant="body2">
          {achievement}
        </Typography>
      ))}
    </Stack>
  </ContentCard>
);
