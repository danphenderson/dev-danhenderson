import { Button, Typography } from '@mui/material';
import type { Certificate } from '../../data/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useCvStyles } from '../../styles/cvStyles';

type CertificatesListProps = {
  certificates: Certificate[];
  startDelayMs?: number;
};

export const CertificatesList = ({ certificates, startDelayMs = 0 }: CertificatesListProps) => {
  const { certificateActionSx, contentListStackSpacing, secondaryTextSx } = useCvStyles();

  return (
    <AnimatedContentList
      items={certificates}
      getItemKey={(certificate, index) => `${certificate.title}-${index}`}
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(certificate) => (
        <>
          <Typography variant="h6">{certificate.title}</Typography>
          <Typography variant="subtitle2" sx={secondaryTextSx}>
            {certificate.issuer} issued on {certificate.date}
          </Typography>
          {certificate.link && (
            <Button
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              sx={certificateActionSx}
            >
              View Certificate
            </Button>
          )}
        </>
      )}
    />
  );
};
