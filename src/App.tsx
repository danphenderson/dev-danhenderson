import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import Header from './components/Header';
import { CommonLinkTooltip } from './components/CommonLinkTooltip';
import { PageTransition } from './components/PageTransition';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import Home from './pages/Home';
import Photography from './pages/Photography';
import PhotographyCategory from './pages/PhotographyCategory';
import CV from './pages/CV';
import Climbing from './pages/Climbing';
import NotFound from './pages/NotFound';

import { Box } from '@mui/material';
import { CommandPaletteProvider } from './CommandPaletteProvider';
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
  transition: 'top 160ms ease',
  '&:focus': {
    top: 16,
  },
} as const;

function AppContent() {
  return (
    <CommandPaletteProvider>
      <Box>
        <Box component="a" href="#main-content" sx={skipLinkSx}>
          Skip to main content
        </Box>
        <Box component="a" href="#site-navigation" sx={skipLinkSx}>
          Skip to site navigation
        </Box>
        <ScrollProgressBar />
        <Header />
        <Box component="main" id="main-content" tabIndex={-1}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/climbing" element={<Climbing />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/photography/:slug" element={<PhotographyCategory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Box>
        <Footer />
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
