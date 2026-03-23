import { Box, Stack } from '@mui/material';
import type { CodingExample, ExperienceProjectSegment } from '../../types/cv';
import { AnimatedSlideList, getAnimatedSlideListCloseDelayMs } from '../AnimatedSlideList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem, TabPanelRenderContext } from '../TabPanel';
import { AnimatedContentList } from '../AnimatedContentList';
import { CommonLink } from '../CommonLink';
import { useComponentStyles } from '../../styles/componentStyles';
import { Text } from '../text';
import { renderExperienceSegments } from './experienceContent';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
  startDelayMs?: number;
  skipEntranceAnimation?: boolean;
};

const CodingExampleDetailList = ({
  items,
  selected,
  renderContext,
}: {
  items: Array<string | ExperienceProjectSegment[]>;
  selected: boolean;
  renderContext: TabPanelRenderContext;
}) => {
  const { getDetailListSx } = useComponentStyles();

  return (
    <AnimatedSlideList
      items={items}
      getItemKey={(_item, index) => `coding-example-item-${index}`}
      in={selected}
      container={renderContext.getDrawerContainer}
      keepMountedWhenExited
      reverseExitStagger
      containerComponent="ul"
      containerSx={getDetailListSx(0, 0)}
      itemComponent="li"
      renderItem={(item) => (
        <Text role="body" component="span">
          {Array.isArray(item) ? renderExperienceSegments(item) : item}
        </Text>
      )}
    />
  );
};

export const CodingExamplesSection = ({
  examples,
  startDelayMs = 0,
  skipEntranceAnimation = false,
}: CodingExamplesSectionProps) => {
  const { codingExampleLinkSx, contentListStackSpacing, detailBlockSx, motionTokens } =
    useComponentStyles();

  return (
    <AnimatedContentList
      items={examples}
      getItemKey={(example, index) => `${example.title}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      skipEntranceAnimation={skipEntranceAnimation}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      tiltItems
      renderItem={(example, index) => {
        const primaryLink = example.links[0];
        const exampleTabs = (example.tabs ?? []).reduce<TabPanelItem[]>((tabs, tab) => {
          if (tab.kind === 'list') {
            const items = tab.items.filter((item) =>
              Array.isArray(item) ? item.length > 0 : item.trim().length > 0
            );

            if (items.length === 0) {
              return tabs;
            }

            tabs.push({
              value: tab.value,
              label: tab.label,
              closeDelayMs: getAnimatedSlideListCloseDelayMs(
                items.length,
                motionTokens.accordionChipStaggerMs
              ),
              renderContent: (selected, renderContext) => (
                <CodingExampleDetailList
                  items={items}
                  selected={selected}
                  renderContext={renderContext}
                />
              ),
            });

            return tabs;
          }

          const skills = tab.skills.filter((skill) => skill.trim().length > 0);

          if (skills.length === 0) {
            return tabs;
          }

          tabs.push({
            value: tab.value,
            label: tab.label,
            closeDelayMs: getAnimatedSlideListCloseDelayMs(
              skills.length,
              motionTokens.accordionChipStaggerMs
            ),
            renderContent: (selected, renderContext) => (
              <SkillsChipList
                skills={skills}
                dense
                in={selected}
                animation="slide"
                keepMountedWhenExited
                reverseExitStagger
                drawerContainer={renderContext.getDrawerContainer}
              />
            ),
          });

          return tabs;
        }, []);

        return (
          <>
            <Stack spacing={1.25}>
              {primaryLink ? (
                <CommonLink
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="hover"
                  sx={{ textDecorationColor: 'currentColor' }}
                >
                  <Text role="cardTitle" component="span" sx={codingExampleLinkSx}>
                    {example.title}
                  </Text>
                </CommonLink>
              ) : (
                <Text role="cardTitle">{example.title}</Text>
              )}
              <Text role="body">{example.description}</Text>
            </Stack>
            {exampleTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`coding-example-details-${index}`}
                  ariaLabel={`${example.title} project details`}
                  items={exampleTabs}
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
