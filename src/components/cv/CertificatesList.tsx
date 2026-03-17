import { Button } from '@mui/material';
import type { Certificate } from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntryTitle, MetaText } from '../text';

type CertificatesListProps = {
  certificates: Certificate[];
  startDelayMs?: number;
  skipEntranceAnimation?: boolean;
};

export const CertificatesList = ({
  certificates,
  startDelayMs = 0,
  skipEntranceAnimation = false,
}: CertificatesListProps) => {
  const { certificateActionSx, contentListStackSpacing, supportAccentInteractiveSurfaceSx } =
    useComponentStyles();

  return (
    <AnimatedContentList
      items={certificates}
      getItemKey={(certificate, index) => `${certificate.title}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      skipEntranceAnimation={skipEntranceAnimation}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      tiltItems
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
              sx={[supportAccentInteractiveSurfaceSx, certificateActionSx]}
            >
              View Certificate
            </Button>
          )}
        </>
      )}
    />
  );
};
