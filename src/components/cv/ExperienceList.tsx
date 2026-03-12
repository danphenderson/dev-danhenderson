import { Fragment } from 'react';
import { Box, Chip, Link, Stack } from '@mui/material';
import type {
  Experience,
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
} from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { ANIMATED_CARD_DURATION_MS } from '../AnimatedContentCard';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem } from '../TabPanel';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntryTitle, StrongMetaText, MetaText, BodyText, ListItemText, ChipLabel } from '../text';

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
  const { getDetailListSx } = useComponentStyles();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box component="ul" sx={getDetailListSx(0, 0)}>
      {projects.map((project, projectIndex) => {
        if (typeof project === 'string') {
          return (
            <ListItemText key={projectIndex}>
              {project}
            </ListItemText>
          );
        }

        if (Array.isArray(project)) {
          return (
            <ListItemText key={projectIndex}>
              {renderInlineSegments(project)}
            </ListItemText>
          );
        }

        const linkLabel = project.text.replace(/:\s*$/, '');

        return (
          <ListItemText key={projectIndex}>
            {project.link ? (
              <Link href={project.link} target="_blank" rel="noopener noreferrer" underline="hover">
                {linkLabel}
              </Link>
            ) : (
              project.text
            )}
          </ListItemText>
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
    experienceHeaderRowSx,
    experienceIndustryChipSx,
    getItemDelayMs,
    minWidthResetSx,
    secondaryStrongSx,
  } = useComponentStyles();

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
        const initialPanelGrowDelayMs = getItemDelayMs(index, startDelayMs) + ANIMATED_CARD_DURATION_MS + 60;

        if (experience.projects?.length) {
          experienceTabs.push({
            value: 'details',
            label: 'Highlights',
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
            <Stack spacing={0.75} width="100%">
              <Box sx={experienceHeaderRowSx}>
                <EntryTitle sx={minWidthResetSx}>
                  {experience.title}
                </EntryTitle>
                {experience.industry && (
                  <Chip
                    size="small"
                    label={<ChipLabel>{experience.industry}</ChipLabel>}
                    variant="outlined"
                    sx={experienceIndustryChipSx}
                  />
                )}
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={minWidthResetSx}>
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
                  <StrongMetaText>
                    {experience.company}
                  </StrongMetaText>
                )}
                <MetaText>
                  •
                </MetaText>
                <MetaText>
                  {experience.startDate} - {experience.endDate}
                </MetaText>
              </Stack>
            </Stack>
            {experience.description && (
              <BodyText sx={experienceDescriptionSx}>
                {renderExperienceDescription(experience.description)}
              </BodyText>
            )}
            {experienceTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`experience-details-${index}`}
                  ariaLabel={`${experience.title} supplemental information`}
                  items={experienceTabs}
                  dense
                  hideTabsWhenSingle
                  tabsVariant="fullWidth"
                  initialPanelGrowDelayMs={initialPanelGrowDelayMs}
                />
              </Box>
            ) : null}
          </>
        );
      }}
    />
  );
};
