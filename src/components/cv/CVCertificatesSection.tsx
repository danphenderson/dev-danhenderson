import type { Certificate } from '../../types/cv';
import type { AnimatedContentCardEntranceDirection } from '../../types/ui';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { CertificatesList } from './CertificatesList';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

type CVCertificatesSectionProps = {
  certificates: Certificate[];
  delayMs?: number;
  entranceDirection?: AnimatedContentCardEntranceDirection;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVCertificatesSection = ({
  certificates,
  delayMs = 0,
  entranceDirection,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVCertificatesSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    entranceDirection={entranceDirection}
    triggerOnView={triggerOnView}
    skipEntranceAnimation={revealed}
    onVisible={onReveal}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Certificates" />
    <CertificatesList certificates={certificates} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
