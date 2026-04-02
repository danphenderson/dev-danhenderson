import type { EducationInfo } from '../../types/cv';
import type { AnimatedContentCardEntranceDirection } from '../../types/ui';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { EducationSection } from './EducationSection';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

type CVEducationSectionProps = {
  education: EducationInfo;
  delayMs?: number;
  entranceDirection?: AnimatedContentCardEntranceDirection;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVEducationSection = ({
  education,
  delayMs = 0,
  entranceDirection,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVEducationSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    entranceDirection={entranceDirection}
    triggerOnView={triggerOnView}
    skipEntranceAnimation={revealed}
    onVisible={onReveal}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Education" />
    <EducationSection education={education} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
