import { siteRoutes } from './siteRoutes';

export type SharedRouteAction = {
  id: string;
  label: string;
  description: string;
  path: string;
  keywords: string[];
  recoveryPriority: number;
};

const routesWithActions = siteRoutes.filter(
  (
    route
  ): route is (typeof siteRoutes)[number] & {
    action: NonNullable<(typeof route)['action']>;
  } => Boolean(route.action)
);

export const sharedRouteActions: SharedRouteAction[] = routesWithActions
  .filter((route) => route.action.includeInCommandPalette !== false)
  .map((route) => ({
    id: `route-${route.id}`,
    label: route.label,
    description: route.action.description,
    path: route.path,
    keywords: [...route.action.keywords, ...route.keywords],
    recoveryPriority: route.action.recoveryPriority,
  }));

export const recoveryRouteActions: SharedRouteAction[] = [...sharedRouteActions].sort(
  (left, right) => left.recoveryPriority - right.recoveryPriority
);
