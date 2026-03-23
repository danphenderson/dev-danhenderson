import { recoveryRouteActions, sharedRouteActions } from '../../../src/constants/routeActions';
import { siteRoutes } from '../../../src/constants/siteRoutes';

describe('routeActions', () => {
  it('derives shared route actions from the canonical route registry', () => {
    const routesWithActions = siteRoutes.filter(
      (route) => route.action && route.action.includeInCommandPalette !== false
    );

    expect(sharedRouteActions).toHaveLength(routesWithActions.length);
    expect(sharedRouteActions.map((action) => action.id)).toEqual(
      routesWithActions.map((route) => `route-${route.id}`)
    );
  });

  it('merges route and action keywords into the shared action payload', () => {
    const homeRoute = siteRoutes.find((route) => route.id === 'home');
    const homeAction = sharedRouteActions.find((action) => action.id === 'route-home');

    expect(homeRoute?.action).toBeDefined();
    expect(homeAction).toMatchObject({
      label: homeRoute?.label,
      description: homeRoute?.action?.description,
      path: homeRoute?.path,
      keywords: [...(homeRoute?.action?.keywords ?? []), ...(homeRoute?.keywords ?? [])],
      recoveryPriority: homeRoute?.action?.recoveryPriority,
    });
  });

  it('sorts recovery route actions by ascending recovery priority', () => {
    expect(recoveryRouteActions).toEqual(
      [...sharedRouteActions].sort((left, right) => left.recoveryPriority - right.recoveryPriority)
    );
  });
});
