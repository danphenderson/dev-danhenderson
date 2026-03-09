import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import type { Experience, ExperienceProject } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { useCvStyles } from '../../styles/cvStyles';
import { ToolsAccordion } from '../ToolsAccordion';

type ExperienceListProps = {
  experiences: Experience[];
  startDelayMs?: number;
};

const ExperienceProjects = ({ projects }: { projects?: ExperienceProject[] }) => {
  const { getDetailListSx } = useCvStyles();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box component="ul" sx={getDetailListSx(1.25, 1.25)}>
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

const experienceStaggerMs = 80;

export const ExperienceList = ({ experiences, startDelayMs = 0 }: ExperienceListProps) => {
  const { detailBlockSx, experienceIndustryChipSx, secondaryStrongSx, sectionTitleSx } = useCvStyles();

  return (
    <Stack spacing={2.25}>
      {experiences.map((experience, index) => (
        <AnimatedContentCard
          key={`${experience.company}-${index}`}
          delayMs={startDelayMs + index * experienceStaggerMs}
        >
          <Stack spacing={1.25}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1.5}
              flexWrap="wrap"
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="h6" fontWeight={700} sx={sectionTitleSx}>
                    {experience.title}
                  </Typography>
                  {experience.industry && (
                    <Chip
                      size="small"
                      label={experience.industry}
                      variant="outlined"
                      sx={experienceIndustryChipSx}
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
                      sx={secondaryStrongSx}
                    >
                      {experience.company}
                    </Link>
                  ) : (
                    <Typography variant="subtitle2" sx={secondaryStrongSx}>
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
          {experience.projects?.length ? (
            <Box sx={detailBlockSx}>
              <ToolsAccordion
                id={`experience-projects-${index}`}
                title="Details"
                subtitle=""
                dense
                defaultExpanded={false}
              >
                <ExperienceProjects projects={experience.projects} />
              </ToolsAccordion>
            </Box>
          ) : null}
          {experience.tools?.filter((tool) => tool.trim().length > 0).length ? (
            <Box sx={detailBlockSx}>
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
        </AnimatedContentCard>
      ))}
    </Stack>
  );
};
