import type { EducationInfo } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { EducationSection } from './EducationSection';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

type CVEducationSectionProps = {
  education: EducationInfo;
  delayMs?: number;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVEducationSection = ({
  education,
  delayMs = 0,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVEducationSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    skipEntranceAnimation={revealed}
    onVisible={onReveal}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Education" />
    <EducationSection
      education={education}
      startDelayMs={itemOffsetMs}
      skipEntranceAnimation={revealed}
    />
  </CVSectionCard>
);
