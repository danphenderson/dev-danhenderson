import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

const Home = lazy(() => import('./pages/Home'));
const Photography = lazy(() => import('./pages/Photography'));
const PhotographyCategory = lazy(() => import('./pages/PhotographyCategory'));
const CV = lazy(() => import('./pages/CV'));
const Climbing = lazy(() => import('./pages/Climbing'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
  const isCvStoryRoute =
    location.pathname === siteRouteMap.cv.path &&
    new URLSearchParams(location.search).get('mode') === 'story';

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
          <PageTransition>
            <Suspense
              fallback={
                <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
                  <LoadingBars label="Loading route content" compact />
                </Box>
              }
            >
              <Routes location={location}>
                <Route path={siteRouteMap.home.path} element={<Home />} />
                <Route path={siteRouteMap.cv.path} element={<CV />} />
                <Route path={siteRouteMap.climbing.path} element={<Climbing />} />
                <Route path={siteRouteMap.photography.path} element={<Photography />} />
                <Route
                  path={`${siteRouteMap.photography.path}/:slug`}
                  element={<PhotographyCategory />}
                />
                {isBlogEnabled ? <Route path={siteRouteMap.blog.path} element={<Blog />} /> : null}
                {isBlogEnabled ? (
                  <Route path={`${siteRouteMap.blog.path}/:slug`} element={<BlogPost />} />
                ) : null}
                <Route path={siteRouteMap['not-found'].path} element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
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
