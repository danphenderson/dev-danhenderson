import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BackgroundPaper from '../components/BackgroundPaper';
import { siteRouteMap } from '../constants/siteRoutes';
import { fallbackBackgroundImage } from '../data/photography';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export default function NotFound() {
  useDocumentMetadata({
    ...siteRouteMap['not-found'],
    canonicalPath: '/',
    noIndex: true,
  });

  return (
    <BackgroundPaper image={fallbackBackgroundImage}>
      <Typography variant="h2" marginTop={3}>
        404 Not Found
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
        <Button variant="contained" component={RouterLink} to="/">
          Home
        </Button>
        <Button variant="outlined" component={RouterLink} to="/cv">
          CV
        </Button>
        <Button variant="outlined" component={RouterLink} to="/photography">
          Photography
        </Button>
      </Stack>
    </BackgroundPaper>
  );
}
