import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BackgroundPaper from '../components/BackgroundPaper';
import { recoveryRouteActions } from '../constants/routeActions';
import { siteRouteMap } from '../constants/siteRoutes';
import { fallbackBackgroundImage } from '../data/photography';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export default function NotFound() {
  const recoveryActions = recoveryRouteActions.map((action) => ({
    ...action,
    routeStatusLabel: siteRouteMap[action.routeId].status?.label,
  }));

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
      <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 560, opacity: 0.78 }}>
        Use one of the shared recovery routes below, or open the command palette with `/` or `Cmd+K`
        to jump somewhere else.
      </Typography>
      <Stack spacing={1.5} sx={{ mt: 3, width: '100%', maxWidth: 640 }}>
        {recoveryActions.map((action, index) => (
          <Stack
            key={action.id}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box>
              <Typography variant="subtitle2">{action.label}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.82 }}>
                {action.description}
              </Typography>
              {action.routeStatusLabel && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {action.routeStatusLabel}
                </Typography>
              )}
            </Box>
            <Button
              variant={index === 0 ? 'contained' : 'outlined'}
              component={RouterLink}
              to={action.path}
            >
              {index === 0 ? 'Go home' : `Open ${action.label}`}
            </Button>
          </Stack>
        ))}
      </Stack>
    </BackgroundPaper>
  );
}
