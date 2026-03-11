import type { CodingExample } from '../../data/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { CodingExamplesSection } from './CodingExamplesSection';
import { SectionHeading } from './SectionHeading';

type CVCodingSectionProps = {
  examples: CodingExample[];
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVCodingSection = ({
  examples,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVCodingSectionProps) => (
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Coding Examples" title="Selected Work" />
    <CodingExamplesSection examples={examples} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
