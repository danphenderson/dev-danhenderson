import type { Certificate } from '../../types/cv';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { CertificatesList } from './CertificatesList';
import { SectionHeading } from '../layout/SectionHeading';

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
  <SectionCard
    delayMs={delayMs}
    triggerOnView={triggerOnView}
    id={sectionId}
    sx={cvSectionAnchorSx}
  >
    <SectionHeading overline="Certificates"/>
    <CertificatesList certificates={certificates} startDelayMs={itemOffsetMs} />
  </SectionCard>
);
