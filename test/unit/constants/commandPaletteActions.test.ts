import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
} from '../../../src/components/cv/cvSectionMetadata';
import { commandPaletteActions } from '../../../src/constants/commandPaletteActions';
import { recoveryRouteActions } from '../../../src/constants/routeActions';
import { primaryNavigationRoutes, siteRouteMap } from '../../../src/constants/siteRoutes';

describe('commandPaletteActions', () => {
  it('includes Home and all primary navigation routes from the shared route registry', () => {
    const routeActions = commandPaletteActions.filter((action) => action.id.startsWith('route-'));

    expect(routeActions.map((action) => action.label)).toEqual([
      siteRouteMap.home.label,
      ...primaryNavigationRoutes.map((route) => route.label),
    ]);

    expect(routeActions[0]).toMatchObject({
      description: siteRouteMap.home.action?.description,
      keywords: expect.arrayContaining(siteRouteMap.home.action?.keywords ?? []),
    });
  });

  it('includes the CV About section before the shared section navigation order', () => {
    const sectionActions = commandPaletteActions.filter((action) =>
      action.id.startsWith('cv-section-')
    );

    expect(sectionActions.map((action) => action.id)).toEqual([
      'cv-section-about',
      ...cvSectionNavigationOrder.map((sectionKey) => `cv-section-${sectionKey}`),
    ]);
    expect(sectionActions[0]).toMatchObject({
      label: `CV: ${cvSectionMetadata.about.navLabel}`,
      path: `${siteRouteMap.cv.path}#${cvSectionMetadata.about.id}`,
    });
  });

  it('derives recovery route actions from the canonical route registry in priority order', () => {
    expect(recoveryRouteActions.map((action) => action.id)).toEqual([
      'route-home',
      'route-cv',
      'route-climbing',
      'route-photography',
    ]);
  });
});
