import {
  siteRouteMap,
  siteRoutes,
  primaryNavigationRoutes,
  cvStoryModeMetadata,
  type SiteRouteId,
} from '../../../src/constants/siteRoutes';

const loadSiteRoutesForEnv = (env: { REACT_APP_RUNTIME_ENV?: string; NODE_ENV?: string }) => {
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

  let moduleUnderTest!: typeof import('../../../src/constants/siteRoutes');

  jest.isolateModules(() => {
    moduleUnderTest =
      require('../../../src/constants/siteRoutes') as typeof import('../../../src/constants/siteRoutes');
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

  return moduleUnderTest;
};

describe('siteRouteMap', () => {
  it('contains all expected route IDs', () => {
    const expectedIds: SiteRouteId[] = [
      'home',
      'cv',
      'climbing',
      'photography',
      'blog',
      'not-found',
    ];
    expect(Object.keys(siteRouteMap).sort()).toEqual([...expectedIds].sort());
  });

  it('every route has required fields', () => {
    for (const route of Object.values(siteRouteMap)) {
      expect(route.id).toBeTruthy();
      expect(route.label).toBeTruthy();
      expect(route.path).toBeTruthy();
      expect(route.title).toBeTruthy();
      expect(route.description).toBeTruthy();
      expect(route.image).toBeTruthy();
      expect(Array.isArray(route.keywords)).toBe(true);
      expect(route.keywords.length).toBeGreaterThan(0);
    }
  });

  it('home route uses root path "/"', () => {
    expect(siteRouteMap.home.path).toBe('/');
  });

  it('not-found route uses wildcard path "*"', () => {
    expect(siteRouteMap['not-found'].path).toBe('*');
  });

  it('navigable routes have action metadata', () => {
    const navigableIds: SiteRouteId[] = ['home', 'cv', 'climbing', 'photography', 'blog'];
    for (const id of navigableIds) {
      const route = siteRouteMap[id];
      expect(route.action).toBeDefined();
      expect(route.action!.description).toBeTruthy();
      expect(typeof route.action!.recoveryPriority).toBe('number');
    }
  });

  it('not-found route has no action metadata', () => {
    expect(siteRouteMap['not-found'].action).toBeUndefined();
  });

  it('marks the blog route with the blog feature flag', () => {
    expect(siteRouteMap.blog.featureFlag).toBe('blog');
  });
});

describe('siteRoutes', () => {
  it('is an array derived from siteRouteMap values', () => {
    expect(siteRoutes).toHaveLength(Object.keys(siteRouteMap).length);
    for (const route of siteRoutes) {
      expect(siteRouteMap[route.id]).toBe(route);
    }
  });
});

describe('primaryNavigationRoutes', () => {
  it('only includes routes with showInPrimaryNav set to true', () => {
    for (const route of primaryNavigationRoutes) {
      expect(route.showInPrimaryNav).toBe(true);
    }
  });

  it('excludes routes without showInPrimaryNav', () => {
    const excluded = siteRoutes.filter((r) => !r.showInPrimaryNav);
    for (const route of excluded) {
      expect(primaryNavigationRoutes).not.toContain(route);
    }
  });

  it('includes cv, climbing, photography, and blog', () => {
    const ids = primaryNavigationRoutes.map((r) => r.id);
    expect(ids).toContain('cv');
    expect(ids).toContain('climbing');
    expect(ids).toContain('photography');
    expect(ids).toContain('blog');
  });

  it('does not include home or not-found', () => {
    const ids = primaryNavigationRoutes.map((r) => r.id);
    expect(ids).not.toContain('home');
    expect(ids).not.toContain('not-found');
  });

  it('omits the blog from enabled routes in a production import', () => {
    const productionRoutes = loadSiteRoutesForEnv({
      REACT_APP_RUNTIME_ENV: 'production',
      NODE_ENV: 'production',
    });

    expect(Object.keys(productionRoutes.siteRouteMap)).toContain('blog');
    expect(productionRoutes.siteRoutes.map((route) => route.id)).not.toContain('blog');
    expect(productionRoutes.primaryNavigationRoutes.map((route) => route.id)).not.toContain('blog');
  });
});

describe('cvStoryModeMetadata', () => {
  it('has a title and description', () => {
    expect(cvStoryModeMetadata.title).toBeTruthy();
    expect(cvStoryModeMetadata.description).toBeTruthy();
  });

  it('title contains story-related content', () => {
    expect(cvStoryModeMetadata.title).toContain('Story');
  });
});
