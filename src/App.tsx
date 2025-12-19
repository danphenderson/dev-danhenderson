import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Photography from './pages/Photography';
import CV from "./pages/CV";
import Climbing from "./pages/Climbing";
import NotFound from "./pages/NotFound";
import { QuiltedImageList } from "./components/PhotoAlbum";

import { Box } from "@mui/material";
import { useMemo } from "react";
import { usePhotographyData } from "./hooks/usePhotographyData";

export default function App() {
  const { categories } = usePhotographyData();

  const photoRoutes = useMemo(
    () =>
      categories.map((card) => (
        <Route
          path={`/photography/${card.slug}`}
          element={<QuiltedImageList ImageData={card.album} />}
          key={card.name}
        />
      )),
    [categories],
  );

  return (
    <BrowserRouter>
      <Box>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/photography" element={<Photography />} /> {photoRoutes}
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer/>
      </Box>
    </BrowserRouter>
  );
}
