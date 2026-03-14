import { Stack } from '@mui/material';
import type { StackSection } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsChipList } from '../SkillsChipList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem } from '../TabPanel';
import { SectionHeading } from '../layout/SectionHeading';
import { SectionLeadText } from '../text';

type StackAndToolsSectionProps = {
  sections: StackSection[];
  lead?: string;
  startDelayMs?: number;
};

export const StackAndToolsSection = ({
  sections,
  lead,
  startDelayMs = 0,
}: StackAndToolsSectionProps) => {
  const { compactSidebarSectionSpacing, sectionHeadingCompactSx } = useComponentStyles();
  const stackTabs: TabPanelItem[] = sections.map((section, index) => ({
    value: `${index}`,
    label: section.title,
    shortLabel: section.tabLabel,
    renderContent: (selected, renderContext) => (
      <SkillsChipList
        skills={section.items}
        dense
        in={selected}
        animation="slide"
        drawerContainer={renderContext.getDrawerContainer}
      />
    ),
  }));

  if (stackTabs.length === 0) {
    return null;
  }

  return (
    <Stack spacing={compactSidebarSectionSpacing}>
      <SectionHeading overline="Stack & Tools" sx={sectionHeadingCompactSx} />
      {lead && <SectionLeadText>{lead}</SectionLeadText>}

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
            hideTabsWhenSingle
            tabsVariant="scrollable"
          />
        )}
      />
    </Stack>
  );
};
