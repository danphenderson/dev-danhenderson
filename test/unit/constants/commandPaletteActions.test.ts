import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
} from '../../../src/components/cv/cvSectionMetadata';
import { commandPaletteActions } from '../../../src/constants/commandPaletteActions';
import { recoveryRouteActions } from '../../../src/constants/routeActions';
import { primaryNavigationRoutes, siteRouteMap } from '../../../src/constants/siteRoutes';

const loadCommandPaletteForEnv = (env: { REACT_APP_RUNTIME_ENV?: string; NODE_ENV?: string }) => {
  const previousRuntimeEnv = process.env.REACT_APP_RUNTIME_ENV;
  const previousNodeEnv = process.env.NODE_ENV;

  if (env.REACT_APP_RUNTIME_ENV === undefined) {
    delete process.env.REACT_APP_RUNTIME_ENV;
  } else {
    process.env.REACT_APP_RUNTIME_ENV = env.REACT_APP_RUNTIME_ENV;
  }

  if (env.NODE_ENV === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = env.NODE_ENV;
  }

  jest.resetModules();

  let commandPaletteModule!: typeof import('../../../src/constants/commandPaletteActions');
  let routeActionsModule!: typeof import('../../../src/constants/routeActions');

  jest.isolateModules(() => {
    commandPaletteModule =
      require('../../../src/constants/commandPaletteActions') as typeof import('../../../src/constants/commandPaletteActions');
    routeActionsModule =
      require('../../../src/constants/routeActions') as typeof import('../../../src/constants/routeActions');
  });

  if (previousRuntimeEnv === undefined) {
    delete process.env.REACT_APP_RUNTIME_ENV;
  } else {
    process.env.REACT_APP_RUNTIME_ENV = previousRuntimeEnv;
  }

  if (previousNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = previousNodeEnv;
  }

  jest.resetModules();

  return {
    commandPaletteActions: commandPaletteModule.commandPaletteActions,
    recoveryRouteActions: routeActionsModule.recoveryRouteActions,
  };
};

describe('commandPaletteActions', () => {
  it('includes Home and all primary navigation routes from the shared route registry', () => {
    const routeActions = commandPaletteActions.filter((action) => action.id.startsWith('route-'));

    expect(routeActions.map((action) => action.label)).toEqual([
      siteRouteMap.home.label,
      ...primaryNavigationRoutes.map((route) => route.label),
    ]);

    expect(routeActions[0]).toMatchObject({
      routeId: siteRouteMap.home.id,
      description: siteRouteMap.home.action?.description,
      keywords: expect.arrayContaining(siteRouteMap.home.action?.keywords ?? []),
    });
    expect(routeActions[0]).not.toHaveProperty('recoveryPriority');
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
      'route-blog',
    ]);
  });

  it('includes a CV story mode action with the query-param path', () => {
    const storyAction = commandPaletteActions.find((action) => action.id === 'cv-story-mode');

    expect(storyAction).toBeDefined();
    expect(storyAction).toMatchObject({
      label: 'CV: Story Mode',
      path: '/cv?mode=story',
      keywords: expect.arrayContaining(['story', 'narrative']),
      kind: 'route',
      routeId: 'cv',
    });
  });

  it('keeps blog actions in production-isolated imports', () => {
    const productionModules = loadCommandPaletteForEnv({
      REACT_APP_RUNTIME_ENV: 'production',
      NODE_ENV: 'production',
    });

    expect(
      productionModules.commandPaletteActions.some((action) => action.routeId === 'blog')
    ).toBe(true);
    expect(
      productionModules.commandPaletteActions.some((action) => action.path.startsWith('/blog'))
    ).toBe(true);
    expect(productionModules.recoveryRouteActions.some((action) => action.routeId === 'blog')).toBe(
      true
    );
  });
});
