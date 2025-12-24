import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Photography from './pages/Photography';
import PhotographyCategory from './pages/PhotographyCategory';
import CV from './pages/CV';
import Climbing from './pages/Climbing';
import NotFound from './pages/NotFound';

import { Box } from '@mui/material';

export default function App() {
  return (
    <BrowserRouter>
      <Box>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photography/:slug" element={<PhotographyCategory />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer/>
      </Box>
    </BrowserRouter>
  );
}
