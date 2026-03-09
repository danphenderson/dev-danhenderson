import { Button, Stack, Typography } from '@mui/material';
import type { Certificate } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { useCvStyles } from '../../styles/cvStyles';

type CertificatesListProps = {
  certificates: Certificate[];
};

export const CertificatesList = ({ certificates }: CertificatesListProps) => {
  const { certificateActionSx, secondaryTextSx } = useCvStyles();

  return (
    <Stack spacing={1.5}>
      {certificates.map((certificate, index) => (
        <AnimatedContentCard key={`${certificate.title}-${index}`} delayMs={index * 90}>
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
        </AnimatedContentCard>
      ))}
    </Stack>
  );
};
