import type { EducationInfo } from '../../types/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { EducationSection } from './EducationSection';
import { SectionHeading } from './SectionHeading';

type CVEducationSectionProps = {
  education: EducationInfo;
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVEducationSection = ({
  education,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVEducationSectionProps) => (
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Education" />
    <EducationSection education={education} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
