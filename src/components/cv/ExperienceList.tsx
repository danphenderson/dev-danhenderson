import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import type { Experience, ExperienceProject } from '../../data/cv';
import { ContentCard } from './ContentCard';
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
  const { accentColor } = useCvStyles();

  return (
    <Stack spacing={2.25}>
      {experiences.map((experience, index) => (
        <ContentCard key={`${experience.company}-${index}`}>
          <Stack spacing={1.25}>
            <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} flexWrap="wrap">
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', color: '#0f172a' }}>
                  <span>{experience.title}</span>
                  <span>@</span>
                  <span>{experience.company}</span>
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" color="textSecondary">
                    {experience.startDate} - {experience.endDate}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {experience.companyUrl && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<LaunchIcon />}
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textTransform: 'none', borderColor: 'rgba(14,165,233,0.4)', color: '#0f172a', backgroundColor: 'rgba(14,165,233,0.08)' }}
                      >
                        Company site
                      </Button>
                    )}
                    {experience.industry && (
                      <Chip
                        size="small"
                        label={experience.industry}
                        variant="outlined"
                        sx={{
                          borderColor: accentColor,
                          color: '#0f172a',
                          backgroundColor: 'rgba(14,165,233,0.12)',
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
