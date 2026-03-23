import { Box } from '@mui/material';
import type { Experience, ExperienceProject } from '../../types/cv';
import { AnimatedSlideList, getAnimatedSlideListCloseDelayMs } from '../AnimatedSlideList';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem, TabPanelRenderContext } from '../TabPanel';
import {
  renderExperienceDescriptionContent,
  renderExperienceProjectContent,
} from './experienceContent';
import { useComponentStyles } from '../../styles/componentStyles';
import { Text } from '../text';
import { CVEntryHeader } from './CVEntryHeader';

type ExperienceListProps = {
  experiences: Experience[];
  startDelayMs?: number;
  skipEntranceAnimation?: boolean;
};

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
        return (
          <Text role="body" component="span">
            {renderExperienceProjectContent(project)}
          </Text>
        );
      }}
    />
  );
};

export const ExperienceList = ({
  experiences,
  startDelayMs = 0,
  skipEntranceAnimation = false,
}: ExperienceListProps) => {
  const { contentListStackSpacing, detailBlockSx, experienceDescriptionSx, motionTokens } =
    useComponentStyles();

  return (
    <AnimatedContentList
      items={experiences}
      getItemKey={(experience, index) => `${experience.company}-${index}`}
      startDelayMs={startDelayMs}
      skipEntranceAnimation={skipEntranceAnimation}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      tiltItems
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
              <Text role="body" sx={experienceDescriptionSx}>
                {renderExperienceDescriptionContent(experience.description)}
              </Text>
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
