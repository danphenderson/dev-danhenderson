import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
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
import { routerFuture } from './routerFuture';

function AppContent() {
  return (
    <Box>
      <ScrollProgressBar />
      <Header />
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
      <Footer />
      <CommonLinkTooltip />
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL} future={routerFuture}>
      <AppContent />
    </BrowserRouter>
  );
}
