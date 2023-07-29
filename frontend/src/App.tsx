import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Climbing from "./pages/Climbing";
import Photography from './pages/Photography';
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import { QuiltedImageList } from "./components/PhotoAlbum";

import data from './photography.json';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/photography" element={<Photography />} />
        {data.map((card) => (
          <Route path={"/photography/" + card.name.toLowerCase()} element={<QuiltedImageList ImageData={card.album}/> }/>
        ))}
        <Route path="/climbing" element={<Climbing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}