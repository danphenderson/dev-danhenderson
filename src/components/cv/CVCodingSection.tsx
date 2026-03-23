import type { CodingExample } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { CodingExamplesSection } from './CodingExamplesSection';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

type CVCodingSectionProps = {
  examples: CodingExample[];
  delayMs?: number;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVCodingSection = ({
  examples,
  delayMs = 0,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVCodingSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    skipEntranceAnimation={revealed}
    onVisible={onReveal}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Coding Examples" />
    <CodingExamplesSection examples={examples} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
