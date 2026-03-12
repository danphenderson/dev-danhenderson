import type { VolunteeringEntry } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { SectionHeading } from '../layout/SectionHeading';
import { VolunteeringList } from './VolunteeringList';
import { CVSectionCard } from './CVSectionCard';

type CVVolunteeringSectionProps = {
  volunteering: VolunteeringEntry[];
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVVolunteeringSection = ({
  volunteering,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVVolunteeringSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Volunteering"/>
    <VolunteeringList volunteering={volunteering} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
