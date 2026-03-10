import { Stack } from '@mui/material';
import type { StackSection } from '../../data/cv';
import { useCvStyles } from '../../styles/cvStyles';
import { AnimatedContentList } from '../AnimatedContentList';
import { SkillsAccordion } from '../SkillsAccordion';
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

  return (
    <Stack spacing={compactSidebarSectionSpacing}>
      <SectionHeading overline="Stack & Tools" sx={sectionHeadingCompactSx} />

      <AnimatedContentList
        items={sections}
        getItemKey={(section, index) => `${section.title}-${index}`}
        startDelayMs={startDelayMs}
        stackSpacing={compactSidebarSectionSpacing}
        itemSurface="plain"
        renderItem={(section) => (
          <SkillsAccordion
            title={section.title}
            subtitle=""
            skills={section.items}
            dense
            defaultExpanded={false}
          />
        )}
      />
    </Stack>
  );
};
