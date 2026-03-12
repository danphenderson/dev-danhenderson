import type { StackSection } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { StackAndToolsSection } from './StackAndToolsSection';
import { CVSectionCard } from './CVSectionCard';

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
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <StackAndToolsSection sections={sections} lead={lead} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
