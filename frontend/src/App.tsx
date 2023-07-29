import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Climbing from "./pages/Climbing";
import Photography from './pages/Photography';
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import { QuiltedImageList } from "./components/PhotoAlbum";
import { Typography } from "@mui/material";

const landscapePhotos =[
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-1.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-2.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-3.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
]

const actionPhotos = [
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-1.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-2.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-3.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
]

const portraitPhotos =[
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-1.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-2.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-3.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
]

const astronomyPhotos =  [
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-1.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-2.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-3.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
]

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/landscape" element={<QuiltedImageList ImageData={landscapePhotos}/> }/>
        <Route path="/photography/action" element={<QuiltedImageList ImageData={actionPhotos}/> }/>
        <Route path="/photography/astronomy" element={<QuiltedImageList ImageData={portraitPhotos}/> }/>
        <Route path="/photography/portrait" element={<QuiltedImageList ImageData={astronomyPhotos}/> }/>
        <Route path="/photography" element={<Photography />} />
        <Route path="/climbing" element={<Climbing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}