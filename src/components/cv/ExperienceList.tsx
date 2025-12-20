import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import type { Experience, ExperienceProject } from '../../data/cv';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';
import { ToolsAccordion } from '../ToolsAccordion';

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

        const linkLabel = project.text.replace(/:\s*$/, '');

        return (
          <Typography component="li" variant="body2" key={projectIndex}>
            {project.link ? (
              <Link href={project.link} target="_blank" rel="noopener noreferrer" underline="hover">
                {linkLabel}
              </Link>
            ) : (
              project.text
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
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                    {experience.title}
                  </Typography>
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
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  {experience.companyUrl ? (
                    <Link
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      underline="hover"
                      variant="subtitle2"
                      sx={{ color: 'text.secondary', fontWeight: 700 }}
                    >
                      {experience.company}
                    </Link>
                  ) : (
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {experience.company}
                    </Typography>
                  )}
                  <Typography variant="subtitle2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {experience.startDate} - {experience.endDate}
                  </Typography>
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
          {experience.tools?.filter((tool) => tool.trim().length > 0).length ? (
            <Box sx={{ mt: 1.5 }}>
              <ToolsAccordion
                id={`experience-tools-${index}`}
                title="Tools used"
                subtitle=""
                tools={experience.tools}
                dense
                defaultExpanded={false}
              />
            </Box>
          ) : null}
        </ContentCard>
      ))}
    </Stack>
  );
};
