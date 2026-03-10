import { Stack } from '@mui/material';
import type { CodingExample, EducationInfo, Experience, VolunteeringEntry } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { useCvStyles } from '../../styles/cvStyles';
import { CodingExamplesSection } from './CodingExamplesSection';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { EducationSection } from './EducationSection';
import { ExperienceList } from './ExperienceList';
import { SectionHeading } from './SectionHeading';
import { VolunteeringList } from './VolunteeringList';

export type CVMainColumnSection = 'experience' | 'education' | 'volunteering' | 'coding';

type CVMainColumnProps = {
  sections: CVMainColumnSection[];
  experiences: Experience[];
  education: EducationInfo;
  volunteering: VolunteeringEntry[];
  codingExamples: CodingExample[];
  experienceDelayMs?: number;
  educationDelayMs?: number;
  volunteeringDelayMs?: number;
  codingDelayMs?: number;
  itemOffsetMs?: number;
  spacing?: number;
  sectionIds?: Partial<Record<CVMainColumnSection, string>>;
};

export const CVMainColumn = ({
  sections,
  experiences,
  education,
  volunteering,
  codingExamples,
  experienceDelayMs = 0,
  educationDelayMs = 0,
  volunteeringDelayMs = 0,
  codingDelayMs = 0,
  itemOffsetMs,
  spacing = 3.5,
  sectionIds,
}: CVMainColumnProps) => {
  const { motionTokens } = useCvStyles();
  const resolvedItemOffsetMs = itemOffsetMs ?? motionTokens.itemOffsetMs;

  return (
    <Stack spacing={spacing}>
      {sections.includes('experience') && (
        <SectionCard delayMs={experienceDelayMs} id={sectionIds?.experience} sx={cvSectionAnchorSx}>
          <SectionHeading overline="Experience" title="Roles & Impact" />
          <ExperienceList experiences={experiences} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}

      {sections.includes('education') && (
        <SectionCard delayMs={educationDelayMs} id={sectionIds?.education} sx={cvSectionAnchorSx}>
          <SectionHeading overline="Education" />
          <EducationSection education={education} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}

      {sections.includes('volunteering') && (
        <SectionCard delayMs={volunteeringDelayMs} id={sectionIds?.volunteering} sx={cvSectionAnchorSx}>
          <SectionHeading overline="Volunteering" title="Community Impact" />
          <VolunteeringList volunteering={volunteering} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}

      {sections.includes('coding') && (
        <SectionCard delayMs={codingDelayMs} id={sectionIds?.coding} sx={cvSectionAnchorSx}>
          <SectionHeading overline="Coding Examples" title="Selected Work" />
          <CodingExamplesSection examples={codingExamples} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}
    </Stack>
  );
};
