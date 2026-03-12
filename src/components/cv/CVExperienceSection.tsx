import type { Experience } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ExperienceList } from './ExperienceList';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

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
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Experience"/>
    <ExperienceList experiences={experiences} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
