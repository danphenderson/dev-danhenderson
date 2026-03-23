import { lazy, useLayoutEffect, useMemo, useState } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  matchPath,
  useLocation,
  type Location,
} from 'react-router-dom';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import Footer from './components/Footer';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import Header from './components/Header';
import { CommonLinkTooltip } from './components/CommonLinkTooltip';
import { LoadingBars } from './components/LoadingBars';
import { PageTransition } from './components/PageTransition';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { isFeatureEnabled } from './constants/featureFlags';
import { siteRouteMap } from './constants/siteRoutes';

import { Box } from '@mui/material';
import { CommandPaletteProvider } from './CommandPaletteProvider';
import { cssDuration } from './motion/tokens';
import { routerFuture } from './routerFuture';
import { readPublicUrl } from './utils/appEnvironment';

type LazyRouteModule = {
  Component: LazyExoticComponent<ComponentType>;
  isLoaded: () => boolean;
  preload: () => Promise<void>;
};

const createLazyRouteModule = (importer: Parameters<typeof lazy>[0]): LazyRouteModule => {
  let hasLoaded = false;
  let pendingImport: ReturnType<typeof importer> | null = null;

  const load = () => {
    if (!pendingImport) {
      pendingImport = importer().then((module) => {
        hasLoaded = true;
        return module;
      });
    }

    return pendingImport;
  };

  return {
    Component: lazy(load),
    isLoaded: () => hasLoaded,
    preload: async () => {
      await load();
    },
  };
};

const homeRoute = createLazyRouteModule(() => import('./pages/Home'));
const photographyRoute = createLazyRouteModule(() => import('./pages/Photography'));
const photographyCategoryRoute = createLazyRouteModule(() => import('./pages/PhotographyCategory'));
const cvRoute = createLazyRouteModule(() => import('./pages/CV'));
const climbingRoute = createLazyRouteModule(() => import('./pages/Climbing'));
const blogRoute = createLazyRouteModule(() => import('./pages/Blog'));
const blogPostRoute = createLazyRouteModule(() => import('./pages/BlogPost'));
const notFoundRoute = createLazyRouteModule(() => import('./pages/NotFound'));

const resolveRouteModule = (pathname: string, isBlogEnabled: boolean) => {
  if (matchPath({ path: siteRouteMap.home.path, end: true }, pathname)) {
    return homeRoute;
  }

  if (matchPath({ path: siteRouteMap.cv.path, end: true }, pathname)) {
    return cvRoute;
  }

  if (matchPath({ path: siteRouteMap.climbing.path, end: true }, pathname)) {
    return climbingRoute;
  }

  if (matchPath({ path: siteRouteMap.photography.path, end: true }, pathname)) {
    return photographyRoute;
  }

  if (matchPath({ path: `${siteRouteMap.photography.path}/:slug`, end: true }, pathname)) {
    return photographyCategoryRoute;
  }

  if (isBlogEnabled && matchPath({ path: siteRouteMap.blog.path, end: true }, pathname)) {
    return blogRoute;
  }

  if (isBlogEnabled && matchPath({ path: `${siteRouteMap.blog.path}/:slug`, end: true }, pathname)) {
    return blogPostRoute;
  }

  return notFoundRoute;
};

const RouteLoadingFallback = () => (
  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
    <LoadingBars label="Loading route content" compact />
  </Box>
);

const skipLinkSx = {
  position: 'absolute',
  left: 16,
  top: -64,
  zIndex: 2000,
  px: 2,
  py: 1,
  borderRadius: 1,
  bgcolor: 'background.paper',
  color: 'text.primary',
  textDecoration: 'none',
  boxShadow: 4,
  transition: `top ${cssDuration.quick} ease`,
  '&:focus': {
    top: 16,
  },
} as const;

function AppContent() {
  const isBlogEnabled = isFeatureEnabled('blog');
  const location = useLocation();
  const activeRouteModule = useMemo(
    () => resolveRouteModule(location.pathname, isBlogEnabled),
    [isBlogEnabled, location.pathname]
  );
  const [displayLocation, setDisplayLocation] = useState<Location | null>(() =>
    activeRouteModule.isLoaded() ? location : null
  );

  useLayoutEffect(() => {
    let cancelled = false;

    if (activeRouteModule.isLoaded()) {
      setDisplayLocation(location);
    } else {
      void activeRouteModule
        .preload()
        .catch((error) => {
          console.error('Failed to preload route module.', error);
        })
        .finally(() => {
          if (!cancelled) {
            setDisplayLocation(location);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [activeRouteModule, location]);

  const renderedLocation = displayLocation ?? location;
  const isCvStoryRoute =
    renderedLocation.pathname === siteRouteMap.cv.path &&
    new URLSearchParams(renderedLocation.search).get('mode') === 'story';

  return (
    <CommandPaletteProvider>
      <Box>
        {!isCvStoryRoute && (
          <>
            <Box component="a" href="#main-content" sx={skipLinkSx}>
              Skip to main content
            </Box>
            <Box component="a" href="#site-navigation" sx={skipLinkSx}>
              Skip to site navigation
            </Box>
            <ScrollProgressBar />
            <Header />
          </>
        )}
        <Box component="main" id="main-content" tabIndex={-1}>
          {displayLocation ? (
            <PageTransition pathname={displayLocation.pathname}>
              <Routes location={displayLocation}>
                <Route path={siteRouteMap.home.path} element={<homeRoute.Component />} />
                <Route path={siteRouteMap.cv.path} element={<cvRoute.Component />} />
                <Route path={siteRouteMap.climbing.path} element={<climbingRoute.Component />} />
                <Route
                  path={siteRouteMap.photography.path}
                  element={<photographyRoute.Component />}
                />
                <Route
                  path={`${siteRouteMap.photography.path}/:slug`}
                  element={<photographyCategoryRoute.Component />}
                />
                {isBlogEnabled ? (
                  <Route path={siteRouteMap.blog.path} element={<blogRoute.Component />} />
                ) : null}
                {isBlogEnabled ? (
                  <Route
                    path={`${siteRouteMap.blog.path}/:slug`}
                    element={<blogPostRoute.Component />}
                  />
                ) : null}
                <Route path={siteRouteMap['not-found'].path} element={<notFoundRoute.Component />} />
              </Routes>
            </PageTransition>
          ) : (
            <RouteLoadingFallback />
          )}
        </Box>
        {!isCvStoryRoute && <Footer />}
        <CommonLinkTooltip />
        <GlobalCommandPalette />
      </Box>
    </CommandPaletteProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={readPublicUrl()} future={routerFuture}>
      <AppErrorBoundary>
        <AppContent />
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
