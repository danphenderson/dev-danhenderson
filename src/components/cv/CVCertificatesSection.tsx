import type { Certificate } from '../../types/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { CertificatesList } from './CertificatesList';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';

type CVCertificatesSectionProps = {
  certificates: Certificate[];
  delayMs?: number;
  triggerOnView?: boolean;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVCertificatesSection = ({
  certificates,
  delayMs = 0,
  triggerOnView = true,
  itemOffsetMs,
  sectionId,
}: CVCertificatesSectionProps) => (
  <CVSectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Certificates"/>
    <CertificatesList certificates={certificates} startDelayMs={itemOffsetMs} />
  </CVSectionCard>
);
