import { Button, Stack, Typography } from '@mui/material';
import type { Certificate } from '../../data/cv';
import { ContentCard } from '../ContentCard';

type CertificatesListProps = {
  certificates: Certificate[];
};

export const CertificatesList = ({ certificates }: CertificatesListProps) => (
  <Stack spacing={1.5}>
    {certificates.map((certificate, index) => (
      <ContentCard key={`${certificate.title}-${index}`}>
        <Typography variant="h6">{certificate.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {certificate.issuer} issued on {certificate.date}
        </Typography>
        {certificate.link && (
          <Button
            href={certificate.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            sx={{ mt: 1, textTransform: 'none' }}
          >
            View Certificate
          </Button>
        )}
      </ContentCard>
    ))}
  </Stack>
);
