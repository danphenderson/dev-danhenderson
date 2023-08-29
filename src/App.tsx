import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Climbing from "./pages/Climbing";
import Photography from './pages/Photography';
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { QuiltedImageList } from "./components/PhotoAlbum";

import data from './photography.json';
import { Box } from "@mui/material";
import { useMemo } from "react";

export default function App() {
  const memoizedData = useMemo(() => data.map(card => (
    <Route path={"/photography/" + card.name.toLowerCase()} element={<QuiltedImageList ImageData={card.album}/> } key={card.name}/>
  )), [data]);

  return (
    <BrowserRouter>
      <Box>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/photography" element={<Photography />} />
          {memoizedData}
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Box>
      {/* Bug displaying CopyRight Footer */}
      {/* <Box sx={{ height: '100px' }} > <Footer /> </Box> */}
    </BrowserRouter>
  );
}