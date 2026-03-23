import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BackgroundPaper from '../components/BackgroundPaper';
import { SectionHeading } from '../components/layout/SectionHeading';
import { RouteRecoveryPanel } from '../components/RouteRecoveryPanel';
import { Text } from '../components/text';
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
          <SectionHeading
            overline="Route recovery"
            title="404 Not Found"
            subtitle="The page you're looking for doesn't exist."
            sx={{ mt: 3, maxWidth: 560 }}
          />
        </MotionItem>
        <MotionItem>
          <Text role="bodyMuted" sx={{ maxWidth: 560, opacity: 0.78 }}>
            Use the command palette or the contextual suggestions below to recover without leaving
            the shared route and section registry.
          </Text>
        </MotionItem>
        <MotionItem>
          <Text role="caption" tone="muted" sx={{ display: 'block', maxWidth: 560, opacity: 0.62 }}>
            Press `/` or `Cmd+K` at any time to reopen the palette after dismissing it.
          </Text>
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
