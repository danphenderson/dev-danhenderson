import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { getCVEntryAnchor } from '../../utils/cvEvidence';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import type { CodingExample, CVEntryRequest, ExperienceProjectSegment } from '../../types/cv';
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
  entryRequest?: CVEntryRequest;
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
  entryRequest,
  startDelayMs = 0,
  skipEntranceAnimation = false,
}: CodingExamplesSectionProps) => {
  const { codingExampleLinkSx, contentListStackSpacing, detailBlockSx, motionTokens } =
    useComponentStyles();

  const [visibleEntries, setVisibleEntries] = useState<Set<string>>(() => new Set());
  const [activeTabs, setActiveTabs] = useState<Record<string, string | false>>({});
  useEffect(() => {
    if (entryRequest?.kind !== 'coding') return;
    const example = examples.find((entry) => entry.id === entryRequest.entryId);
    if (example?.tabs?.some((tab) => tab.value === 'approach')) {
      setActiveTabs((previous) => ({ ...previous, [entryRequest.entryId]: 'approach' }));
    }
  }, [entryRequest, examples]);

  return (
    <AnimatedContentList
      items={examples}
      getItemKey={(example, index) => example.id ?? `${example.title}-${index}`}
      mountItemsOnView={!entryRequest}
      onItemVisible={(example) => {
        if (!example.id) return;
        setVisibleEntries((previous) =>
          previous.has(example.id!) ? previous : new Set(previous).add(example.id!)
        );
      }}
      startDelayMs={startDelayMs}
      skipEntranceAnimation={skipEntranceAnimation}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      tiltItems
      renderItem={(example, index) => {
        const primaryLink = example.links[0];
        const entryKey = example.id ?? `${example.title}-${index}`;
        const anchor = example.id ? getCVEntryAnchor('coding', example.id) : undefined;
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
          <Box
            id={anchor}
            data-cv-entry-visible={visibleEntries.has(example.id ?? '')}
            sx={cvSectionAnchorSx}
          >
            <Stack spacing={1.25}>
              <Text
                role="cardTitle"
                id={anchor ? `${anchor}-heading` : undefined}
                tabIndex={anchor ? -1 : undefined}
                sx={codingExampleLinkSx}
              >
                {primaryLink ? (
                  <CommonLink
                    href={primaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                    sx={{ textDecorationColor: 'currentColor' }}
                  >
                    {example.title}
                  </CommonLink>
                ) : (
                  example.title
                )}
              </Text>
              <Text role="body">{example.description}</Text>
            </Stack>
            {exampleTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`coding-example-details-${index}`}
                  ariaLabel={`${example.title} project details`}
                  items={exampleTabs}
                  value={activeTabs[entryKey]}
                  onChange={(value) =>
                    setActiveTabs((previous) => ({ ...previous, [entryKey]: value }))
                  }
                  dense
                  hideTabsWhenSingle
                  tabsVariant="fullWidth"
                />
              </Box>
            ) : null}
          </Box>
        );
      }}
    />
  );
};
