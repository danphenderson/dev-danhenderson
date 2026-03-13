import { Box, Stack } from '@mui/material';
import type { CodingExample } from '../../types/cv';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem } from '../TabPanel';
import { AnimatedContentList } from '../AnimatedContentList';
import { CommonLink } from '../CommonLink';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntryTitle, BodyText, ListItemText } from '../text';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
  startDelayMs?: number;
};

export const CodingExamplesSection = ({ examples, startDelayMs = 0 }: CodingExamplesSectionProps) => {
  const { codingExampleLinkSx, contentListStackSpacing, detailBlockSx, getDetailListSx } = useComponentStyles();

  return (
    <AnimatedContentList
      items={examples}
      getItemKey={(example, index) => `${example.title}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(example, index) => {
        const primaryLink = example.links[0];
        const exampleTabs = (example.tabs ?? []).reduce<TabPanelItem[]>((tabs, tab) => {
          if (tab.kind === 'list') {
            const items = tab.items.filter((item) => item.trim().length > 0);

            if (items.length === 0) {
              return tabs;
            }

            tabs.push({
              value: tab.value,
              label: tab.label,
              content: (
                <Box component="ul" sx={getDetailListSx(0, 0)}>
                  {items.map((item) => (
                    <ListItemText key={item}>
                      {item}
                    </ListItemText>
                  ))}
                </Box>
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
            renderContent: (selected) => <SkillsChipList skills={skills} dense in={selected} />,
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
                  <EntryTitle component="span" sx={codingExampleLinkSx}>
                    {example.title}
                  </EntryTitle>
                </CommonLink>
              ) : (
                <EntryTitle>{example.title}</EntryTitle>
              )}
              <BodyText>{example.description}</BodyText>
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
