import type { VolunteeringEntry } from '../../types/cv';
import type { AnimatedContentCardEntranceDirection } from '../../types/ui';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { SectionHeading } from '../layout/SectionHeading';
import { VolunteeringList } from './VolunteeringList';
import { CVSectionCard } from './CVSectionCard';

type CVVolunteeringSectionProps = {
  volunteering: VolunteeringEntry[];
  delayMs?: number;
  entranceDirection?: AnimatedContentCardEntranceDirection;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVVolunteeringSection = ({
  volunteering,
  delayMs = 0,
  entranceDirection,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVVolunteeringSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    entranceDirection={entranceDirection}
    triggerOnView={triggerOnView}
    skipEntranceAnimation={revealed}
    onVisible={onReveal}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Volunteering" />
    <VolunteeringList volunteering={volunteering} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
