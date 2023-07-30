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
import SignIn from "./components/Login";
import SignUp from "./components/Register";

import data from './photography.json';
import { Box } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/photography" element={<Photography />} />
          {data.map((card) => (
            <Route path={"/photography/" + card.name.toLowerCase()} element={<QuiltedImageList ImageData={card.album}/> }/>
          ))}
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </Box>
  );
}