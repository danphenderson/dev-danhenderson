import { Fragment } from 'react';
import { Box } from '@mui/material';
import type {
  Experience,
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
} from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem } from '../TabPanel';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import { useComponentStyles } from '../../styles/componentStyles';
import { BodyText, ListItemText } from '../text';
import { CVEntryHeader } from './CVEntryHeader';

type ExperienceListProps = {
  experiences: Experience[];
  startDelayMs?: number;
};

const renderInlineSegments = (segments: ExperienceProjectSegment[]) =>
  segments.map((segment, segmentIndex) => {
    const content = segment.link ? (
      <CommonLink
        href={segment.link}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        data-tooltip-id={segment.tooltip ? COMMON_LINK_TOOLTIP_ID : undefined}
        data-tooltip-content={segment.tooltip}
        data-tooltip-place={segment.tooltip ? 'top' : undefined}
      >
        {segment.text}
      </CommonLink>
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
              <CommonLink href={project.link} target="_blank" rel="noopener noreferrer" underline="hover">
                {linkLabel}
              </CommonLink>
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

        const hideSingleSupplementalTab =
          experienceTabs.length === 1 && experienceTabs[0]?.value !== 'skills';

        return (
          <>
            <CVEntryHeader
              title={experience.title}
              organization={experience.company}
              organizationUrl={experience.companyUrl}
              dateRange={`${experience.startDate} – ${experience.endDate}`}
              chip={experience.industry ? { label: experience.industry } : undefined}
            />
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
                  hideTabsWhenSingle={hideSingleSupplementalTab}
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
