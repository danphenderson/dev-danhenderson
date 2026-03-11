import type { Experience } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ExperienceList } from './ExperienceList';
import { SectionHeading } from './SectionHeading';

type CVExperienceSectionProps = {
  experiences: Experience[];
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVExperienceSection = ({
  experiences,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVExperienceSectionProps) => (
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Experience"/>
    <ExperienceList experiences={experiences} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
