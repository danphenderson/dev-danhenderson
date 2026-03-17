import { Box } from '@mui/material';
import type { EducationGpaEntry, EducationInfo } from '../../types/cv';
import { AnimatedSlideList, getAnimatedSlideListCloseDelayMs } from '../AnimatedSlideList';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem, TabPanelRenderContext } from '../TabPanel';
import { useComponentStyles } from '../../styles/componentStyles';
import { BodyText, ListItemText } from '../text';
import { CVEntryHeader } from './CVEntryHeader';

type EducationSectionProps = {
  education: EducationInfo;
  startDelayMs?: number;
  skipEntranceAnimation?: boolean;
};

const courseworkPrefixPattern = /^(?:Relevant\s+)?Coursework:\s*/i;

const getEducationGpaChipLabels = (gpa?: EducationGpaEntry[]) =>
  (gpa ?? []).map(({ label, value }) => `${label}: ${value}`);

const splitEducationHighlights = (highlights?: string[]) =>
  (highlights ?? []).reduce<{ highlights: string[]; coursework: string[] }>(
    (groups, highlight) => {
      const trimmedHighlight = highlight.trim();

      if (!trimmedHighlight) {
        return groups;
      }

      if (courseworkPrefixPattern.test(trimmedHighlight)) {
        const courses = trimmedHighlight
          .replace(courseworkPrefixPattern, '')
          .split(',')
          .map((course) => course.trim())
          .filter((course) => course.length > 0);

        groups.coursework.push(...(courses.length ? courses : [trimmedHighlight]));
        return groups;
      }

      groups.highlights.push(trimmedHighlight);
      return groups;
    },
    { highlights: [], coursework: [] }
  );

const EducationDetailList = ({
  items,
  selected,
  renderContext,
}: {
  items: string[];
  selected: boolean;
  renderContext: TabPanelRenderContext;
}) => {
  const { getDetailListSx } = useComponentStyles();

  return (
    <AnimatedSlideList
      items={items}
      getItemKey={(item, index) => `${item}-${index}`}
      in={selected}
      container={renderContext.getDrawerContainer}
      keepMountedWhenExited
      reverseExitStagger
      containerComponent="ul"
      containerSx={getDetailListSx(0, 0)}
      itemComponent="li"
      renderItem={(item) => <ListItemText component="span">{item}</ListItemText>}
    />
  );
};

export const EducationSection = ({
  education,
  startDelayMs = 0,
  skipEntranceAnimation = false,
}: EducationSectionProps) => {
  const { contentListStackSpacing, detailBlockSx, motionTokens } = useComponentStyles();

  if (!education.entries || education.entries.length === 0) {
    return null;
  }

  return (
    <AnimatedContentList
      items={education.entries}
      getItemKey={(entry, index) => `${entry.university}-${entry.program}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      skipEntranceAnimation={skipEntranceAnimation}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      tiltItems
      renderItem={(entry, index) => {
        const { highlights: filteredHighlights, coursework: filteredCoursework } =
          splitEducationHighlights(entry.highlights);
        const gpaChipLabels = getEducationGpaChipLabels(entry.gpa);
        const filteredSkills = entry.skills?.filter((tool) => tool.trim().length > 0) ?? [];
        const educationTabs: TabPanelItem[] = [];

        if (filteredHighlights.length) {
          educationTabs.push({
            value: 'highlights',
            label: 'Highlights',
            closeDelayMs: getAnimatedSlideListCloseDelayMs(
              filteredHighlights.length,
              motionTokens.accordionChipStaggerMs
            ),
            renderContent: (selected, renderContext) => (
              <EducationDetailList
                items={filteredHighlights}
                selected={selected}
                renderContext={renderContext}
              />
            ),
          });
        }

        if (filteredCoursework.length) {
          educationTabs.push({
            value: 'coursework',
            label: 'Coursework',
            closeDelayMs: getAnimatedSlideListCloseDelayMs(
              filteredCoursework.length,
              motionTokens.accordionChipStaggerMs
            ),
            renderContent: (selected, renderContext) => (
              <EducationDetailList
                items={filteredCoursework}
                selected={selected}
                renderContext={renderContext}
              />
            ),
          });
        }

        if (filteredSkills.length) {
          educationTabs.push({
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

        return (
          <>
            <CVEntryHeader
              title={entry.program}
              organization={entry.university}
              dateRange={entry.dateRange}
              chips={gpaChipLabels.map((label) => ({ label }))}
              supportingMeta={[
                ...(entry.expectedCompletion ? [entry.expectedCompletion] : []),
                ...(entry.minor ? [`Minor in ${entry.minor}`] : []),
              ].filter(Boolean)}
            />

            <BodyText>{entry.summary}</BodyText>

            {educationTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`education-details-${index}`}
                  ariaLabel={`${entry.program} details`}
                  items={educationTabs}
                  dense
                  hideTabsWhenSingle
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
