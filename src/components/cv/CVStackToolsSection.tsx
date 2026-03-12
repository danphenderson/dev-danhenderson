import type { StackSection } from '../../types/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { StackAndToolsSection } from './StackAndToolsSection';

type CVStackToolsSectionProps = {
  sections: StackSection[];
  lead?: string;
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVStackToolsSection = ({
  sections,
  lead,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVStackToolsSectionProps) => (
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <StackAndToolsSection sections={sections} lead={lead} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
