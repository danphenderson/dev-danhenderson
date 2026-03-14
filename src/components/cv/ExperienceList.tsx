import { Fragment } from 'react';
import { Box } from '@mui/material';
import type {
  Experience,
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
} from '../../types/cv';
import { AnimatedSlideList, getAnimatedSlideListCloseDelayMs } from '../AnimatedSlideList';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem, TabPanelRenderContext } from '../TabPanel';
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

const ExperienceProjects = ({
  projects,
  selected,
  renderContext,
}: {
  projects?: ExperienceProject[];
  selected: boolean;
  renderContext: TabPanelRenderContext;
}) => {
  const { getDetailListSx } = useComponentStyles();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <AnimatedSlideList
      items={projects}
      getItemKey={(_project, projectIndex) => `experience-project-${projectIndex}`}
      in={selected}
      container={renderContext.getDrawerContainer}
      keepMountedWhenExited
      reverseExitStagger
      containerComponent="ul"
      containerSx={getDetailListSx(0, 0)}
      itemComponent="li"
      renderItem={(project) => {
        if (typeof project === 'string') {
          return <ListItemText component="span">{project}</ListItemText>;
        }

        if (Array.isArray(project)) {
          return <ListItemText component="span">{renderInlineSegments(project)}</ListItemText>;
        }

        const linkLabel = project.text.replace(/:\s*$/, '');

        return (
          <ListItemText component="span">
            {project.link ? (
              <CommonLink
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {linkLabel}
              </CommonLink>
            ) : (
              project.text
            )}
          </ListItemText>
        );
      }}
    />
  );
};

export const ExperienceList = ({ experiences, startDelayMs = 0 }: ExperienceListProps) => {
  const { contentListStackSpacing, detailBlockSx, experienceDescriptionSx, motionTokens } =
    useComponentStyles();

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
            closeDelayMs: getAnimatedSlideListCloseDelayMs(
              experience.projects.length,
              motionTokens.accordionChipStaggerMs
            ),
            renderContent: (selected, renderContext) => (
              <ExperienceProjects
                projects={experience.projects}
                selected={selected}
                renderContext={renderContext}
              />
            ),
          });
        }

        if (filteredSkills.length) {
          experienceTabs.push({
            value: 'skills',
            label: 'Skills',
            closeDelayMs: getAnimatedSlideListCloseDelayMs(
              filteredSkills.length,
              motionTokens.accordionChipStaggerMs
            ),
            renderContent: (selected, renderContext) => (
              <SkillsChipList
                skills={filteredSkills}
                dense
                in={selected}
                animation="slide"
                keepMountedWhenExited
                reverseExitStagger
                drawerContainer={renderContext.getDrawerContainer}
              />
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
              organizationTooltip={experience.companyTooltip}
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
