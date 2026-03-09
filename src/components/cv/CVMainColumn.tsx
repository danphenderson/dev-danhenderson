import { Stack } from '@mui/material';
import type { CodingExample, EducationInfo, Experience } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { CodingExamplesSection } from './CodingExamplesSection';
import { EducationSection } from './EducationSection';
import { ExperienceList } from './ExperienceList';
import { SectionHeading } from './SectionHeading';

export type CVMainColumnSection = 'experience' | 'education' | 'coding';

type CVMainColumnProps = {
  sections: CVMainColumnSection[];
  experiences: Experience[];
  education: EducationInfo;
  codingExamples: CodingExample[];
  experienceDelayMs?: number;
  educationDelayMs?: number;
  codingDelayMs?: number;
  experienceItemsDelayMs?: number;
  spacing?: number;
};

export const CVMainColumn = ({
  sections,
  experiences,
  education,
  codingExamples,
  experienceDelayMs = 0,
  educationDelayMs = 0,
  codingDelayMs = 0,
  experienceItemsDelayMs = 0,
  spacing = 3.5,
}: CVMainColumnProps) => {
  return (
    <Stack spacing={spacing}>
      {sections.includes('experience') && (
        <SectionCard delayMs={experienceDelayMs}>
          <SectionHeading overline="Experience" title="Roles & Impact" />
          <ExperienceList experiences={experiences} startDelayMs={experienceItemsDelayMs} />
        </SectionCard>
      )}

      {sections.includes('education') && (
        <SectionCard delayMs={educationDelayMs}>
          <SectionHeading overline="Education" />
          <EducationSection education={education} />
        </SectionCard>
      )}

      {sections.includes('coding') && (
        <SectionCard delayMs={codingDelayMs}>
          <SectionHeading overline="Coding Examples" title="Selected Work" />
          <CodingExamplesSection examples={codingExamples} />
        </SectionCard>
      )}
    </Stack>
  );
};
