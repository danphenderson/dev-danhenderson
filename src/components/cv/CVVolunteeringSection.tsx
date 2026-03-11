import type { VolunteeringEntry } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { SectionHeading } from './SectionHeading';
import { VolunteeringList } from './VolunteeringList';

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
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Volunteering" title="Community Impact" />
    <VolunteeringList volunteering={volunteering} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
