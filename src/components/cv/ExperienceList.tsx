import { Fragment } from 'react';
import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import type {
  Experience,
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
} from '../../data/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel, TabPanelItem } from '../TabPanel';
import { useCvStyles } from '../../styles/cvStyles';

type ExperienceListProps = {
  experiences: Experience[];
  startDelayMs?: number;
};

const renderInlineSegments = (segments: ExperienceProjectSegment[]) =>
  segments.map((segment, segmentIndex) => {
    const content = segment.link ? (
      <Link href={segment.link} target="_blank" rel="noopener noreferrer" underline="hover">
        {segment.text}
      </Link>
    ) : (
      <Box component="span">{segment.text}</Box>
    );

    return (
      <Fragment key={segmentIndex}>
        {segment.lineBreakBefore ? <br /> : null}
        {content}
      </Fragment>
    );
  });

const renderExperienceDescription = (description: ExperienceDescription) =>
  typeof description === 'string' ? description : renderInlineSegments(description);

const ExperienceProjects = ({ projects }: { projects?: ExperienceProject[] }) => {
  const { getDetailListSx } = useCvStyles();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box component="ul" sx={getDetailListSx(0, 0)}>
      {projects.map((project, projectIndex) => {
        if (typeof project === 'string') {
          return (
            <Typography component="li" variant="body2" key={projectIndex}>
              {project}
            </Typography>
          );
        }

        if (Array.isArray(project)) {
          return (
            <Typography component="li" variant="body2" key={projectIndex}>
              {renderInlineSegments(project)}
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

export const ExperienceList = ({ experiences, startDelayMs = 0 }: ExperienceListProps) => {
  const {
    contentListStackSpacing,
    detailBlockSx,
    experienceDescriptionSx,
    experienceIndustryChipSx,
    secondaryStrongSx,
    secondaryTextSx,
    sectionTitleSx,
  } = useCvStyles();

  return (
    <AnimatedContentList
      items={experiences}
      getItemKey={(experience, index) => `${experience.company}-${index}`}
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(experience, index) => {
        const filteredSkills = experience.skills?.filter((tool) => tool.trim().length > 0) ?? [];
        const experienceTabs: TabPanelItem[] = [];

        if (experience.projects?.length) {
          experienceTabs.push({
            value: 'details',
            label: 'Details',
            content: <ExperienceProjects projects={experience.projects} />,
          });
        }

        if (filteredSkills.length) {
          experienceTabs.push({
            value: 'skills',
            label: 'Skills',
            renderContent: (selected) => (
              <SkillsChipList skills={filteredSkills} dense in={selected} />
            ),
          });
        }

        return (
          <>
            <Stack spacing={1.25}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1.5}
                flexWrap="wrap"
                width="100%"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={sectionTitleSx}>
                    {experience.title}
                  </Typography>
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
                    <Typography variant="subtitle2" sx={secondaryTextSx}>
                      •
                    </Typography>
                    <Typography variant="subtitle2" sx={secondaryTextSx}>
                      {experience.startDate} - {experience.endDate}
                    </Typography>
                  </Stack>
                </Box>
                {experience.industry && (
                  <Chip
                    size="small"
                    label={experience.industry}
                    variant="outlined"
                    sx={experienceIndustryChipSx}
                  />
                )}
              </Stack>
            </Stack>
            {experience.description && (
              <Typography variant="body2" sx={experienceDescriptionSx}>
                {renderExperienceDescription(experience.description)}
              </Typography>
            )}
            {experienceTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`experience-details-${index}`}
                  ariaLabel={`${experience.title} supplemental information`}
                  items={experienceTabs}
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
