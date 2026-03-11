import type { StackSection } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { StackAndToolsSection } from './StackAndToolsSection';

type CVStackToolsSectionProps = {
  sections: StackSection[];
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVStackToolsSection = ({
  sections,
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
    <StackAndToolsSection sections={sections} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
