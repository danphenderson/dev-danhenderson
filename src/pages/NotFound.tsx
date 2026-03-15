import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BackgroundPaper from '../components/BackgroundPaper';
import { RouteRecoveryPanel } from '../components/RouteRecoveryPanel';
import { getRecoveryContext } from '../constants/recoveryContext';
import { recoveryRouteActions } from '../constants/routeActions';
import { siteRouteMap } from '../constants/siteRoutes';
import { fallbackBackgroundImage } from '../data/photography';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { StaggerChildren, MotionItem, fadeIn } from '../motion';

export default function NotFound() {
  const location = useLocation();

  const recoveryActions = useMemo(
    () =>
      recoveryRouteActions.map((action) => ({
        ...action,
        routeStatusLabel: siteRouteMap[action.routeId].status?.label,
      })),
    []
  );

  const recoveryContext = useMemo(() => getRecoveryContext(location.pathname), [location.pathname]);

  useDocumentMetadata({
    ...siteRouteMap['not-found'],
    canonicalPath: '/',
    noIndex: true,
  });

  return (
    <BackgroundPaper image={fallbackBackgroundImage}>
      <StaggerChildren>
        <MotionItem>
          <Typography variant="h2" marginTop={3}>
            404 Not Found
          </Typography>
        </MotionItem>
        <MotionItem>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </Typography>
        </MotionItem>
        <MotionItem>
          <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 560, opacity: 0.78 }}>
            Use the command palette or the contextual suggestions below to recover without leaving the
            shared route and section registry.
          </Typography>
        </MotionItem>
        <MotionItem>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.62 }}>
            Press `/` or `Cmd+K` at any time to reopen the palette after dismissing it.
          </Typography>
        </MotionItem>
        <MotionItem variants={fadeIn}>
          <RouteRecoveryPanel
            attemptedPathLabel={recoveryContext.attemptedPathLabel}
            routeHintLabel={recoveryContext.routeHintLabel}
            contextualSuggestions={recoveryContext.contextualSuggestions}
            recoveryActions={recoveryActions}
            suggestedPaletteQuery={recoveryContext.suggestedPaletteQuery}
          />
        </MotionItem>
      </StaggerChildren>
    </BackgroundPaper>
  );
}
