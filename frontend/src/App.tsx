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

const landscapePhotos = [  
  {
    img: `${require("./images/photography/six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/alki-beach.jpg")}`,
    title: "Alki Beach",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/iccle-creek.jpg")}`,
    title:  "Iccle Creek",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/ancestrial-pueblo.jpg")}`,
    title: "Ancestral Pueblo View",
    rows: 1,
    cols: 1,
  },

  {
    img: `${require("./images/photography/crow.jpg")}`,
    title: "Migration",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/rim-rock.jpg")}`,
    title: "Rim Rock Lake",                     
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/tieton-south-fork-1.jpg")}`,
    title:  "South Fork Tieton River",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/tieton-south-fork-2.jpg")}`,
    title: "Ancestral Pueblo View",
    rows: 1,
    cols: 1,
  },
] 

const actionPhotos =  [
  {
    img: `${require("./images/photography/six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/alki-beach.jpg")}`,
    title: "Alki Beach",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/iccle-creek.jpg")}`,
    title:  "Iccle Creek",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/ancestrial-pueblo.jpg")}`,
    title: "Ancestral Pueblo View",
    rows: 1,
    cols: 1,
  },

  {
    img: `${require("./images/photography/crow.jpg")}`,
    title: "Migration",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/rim-rock.jpg")}`,
    title: "Rim Rock Lake",                     
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/tieton-south-fork-1.jpg")}`,
    title:  "South Fork Tieton River",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/tieton-south-fork-2.jpg")}`,
    title: "Ancestral Pueblo View",
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
        <Route path="/photography/landscapes" element={<QuiltedImageList ImageData={landscapePhotos}/> }/>
        <Route path="/photography/action" element={<QuiltedImageList ImageData={actionPhotos}/> }/>
        <Route path="/photography" element={<Photography />} />
        <Route path="/climbing" element={<Climbing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}