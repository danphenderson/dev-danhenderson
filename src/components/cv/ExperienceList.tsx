import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import type { Experience, ExperienceProject } from '../../data/cv';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';

type ExperienceListProps = {
  experiences: Experience[];
};

const ExperienceProjects = ({ projects }: { projects?: ExperienceProject[] }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box component="ul" sx={{ paddingLeft: 3, margin: '10px 0' }}>
      {projects.map((project, projectIndex) => {
        if (typeof project === 'string') {
          return (
            <Typography component="li" variant="body2" key={projectIndex}>
              {project}
            </Typography>
          );
        }

        return (
          <Typography component="li" variant="body2" key={projectIndex}>
            {project.text}
            {project.link && (
              <>
                {' '}
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
              </>
            )}
          </Typography>
        );
      })}
    </Box>
  );
};

export const ExperienceList = ({ experiences }: ExperienceListProps) => {
  const { accentColor, accentTint } = useCvStyles();

  return (
    <Stack spacing={2.25}>
      {experiences.map((experience, index) => (
        <ContentCard key={`${experience.company}-${index}`}>
          <Stack spacing={1.25}>
            <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} flexWrap="wrap">
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', color: 'text.primary' }}>
                  <span>{experience.title}</span>
                  <span>@</span>
                  {experience.companyUrl ? (
                    <Link href={experience.companyUrl} target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                      {experience.company}
                    </Link>
                  ) : (
                    <span>{experience.company}</span>
                  )}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    {experience.startDate} - {experience.endDate}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {experience.industry && (
                      <Chip
                        size="small"
                        label={experience.industry}
                        variant="outlined"
                        sx={{
                          borderColor: accentColor,
                          color: 'text.primary',
                          backgroundColor: accentTint,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Stack>
          {experience.description && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {experience.description}
            </Typography>
          )}
          <ExperienceProjects projects={experience.projects} />
        </ContentCard>
      ))}
    </Stack>
  );
};
