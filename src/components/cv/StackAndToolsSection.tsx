import { Stack } from '@mui/material';
import type { StackSection } from '../../data/cv';
import { useCvStyles } from '../../styles/cvStyles';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel, TabPanelItem } from '../TabPanel';
import { SectionHeading } from './SectionHeading';

type StackAndToolsSectionProps = {
  sections: StackSection[];
  startDelayMs?: number;
};

export const StackAndToolsSection = ({
  sections,
  startDelayMs = 0,
}: StackAndToolsSectionProps) => {
  const {
    compactSidebarSectionSpacing,
    sectionHeadingCompactSx,
  } = useCvStyles();
  const stackTabs: TabPanelItem[] = sections.map((section, index) => ({
    value: `${index}`,
    label: section.title,
    shortLabel: section.tabLabel,
    renderContent: (selected) => <SkillsChipList skills={section.items} dense in={selected} />,
  }));

  if (stackTabs.length === 0) {
    return null;
  }

  return (
    <Stack spacing={compactSidebarSectionSpacing}>
      <SectionHeading overline="Stack & Tools" sx={sectionHeadingCompactSx} />

      <AnimatedContentList
        items={['stack-tools']}
        getItemKey={(item) => item}
        startDelayMs={startDelayMs}
        stackSpacing={compactSidebarSectionSpacing}
        itemSurface="plain"
        renderItem={() => (
          <TabPanel
            ariaLabel="Stack and tools categories"
            items={stackTabs}
            dense
            tabsVariant="scrollable"
          />
        )}
      />
    </Stack>
  );
};
