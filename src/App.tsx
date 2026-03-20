import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import Header from './components/Header';
import { CommonLinkTooltip } from './components/CommonLinkTooltip';
import { PageTransition } from './components/PageTransition';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { isFeatureEnabled } from './constants/featureFlags';
import { siteRouteMap } from './constants/siteRoutes';
import Home from './pages/Home';
import Photography from './pages/Photography';
import PhotographyCategory from './pages/PhotographyCategory';
import CV from './pages/CV';
import Climbing from './pages/Climbing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

import { Box } from '@mui/material';
import { CommandPaletteProvider } from './CommandPaletteProvider';
import { cssDuration } from './motion/tokens';
import { routerFuture } from './routerFuture';

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
            <Routes>
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
    <BrowserRouter basename={process.env.PUBLIC_URL} future={routerFuture}>
      <AppContent />
    </BrowserRouter>
  );
}
