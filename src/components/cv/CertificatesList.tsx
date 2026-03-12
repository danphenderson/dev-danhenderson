import { Button } from '@mui/material';
import type { Certificate } from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntryTitle, MetaText } from '../text';

type CertificatesListProps = {
  certificates: Certificate[];
  startDelayMs?: number;
};

export const CertificatesList = ({ certificates, startDelayMs = 0 }: CertificatesListProps) => {
  const { certificateActionSx, contentListStackSpacing, interactiveSurfaceSx } = useComponentStyles();

  return (
    <AnimatedContentList
      items={certificates}
      getItemKey={(certificate, index) => `${certificate.title}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(certificate) => (
        <>
          <EntryTitle>{certificate.title}</EntryTitle>
          <MetaText>
            {certificate.issuer} issued on {certificate.date}
          </MetaText>
          {certificate.link && (
            <Button
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              sx={[interactiveSurfaceSx, certificateActionSx]}
            >
              View Certificate
            </Button>
          )}
        </>
      )}
    />
  );
};
