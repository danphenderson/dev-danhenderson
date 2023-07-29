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
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-2.jpg")}`,
    title: "Missing",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tieton-south-fork-3.jpg")}`,
    title: "Missing",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/landscape/landscape-alki-beach.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-six-shooter-sunset.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-sunset.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-cotton-candy-rocks.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-hidden-valley-sunset.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-lime-kiln.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-sand-dunes.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-space-station.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-tumwater-canyon.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },

  {
    img: `${require("./images/photography/landscape/landscape-rim-rock.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-indian-creek-1.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/landscape/landscape-beef-basin-fin.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 2,
    cols: 2,
  },
];

const actionPhotos = [
  {
    img: `${require("./images/photography/action/action-bighorns.jpg")}`,
    title: "Missing",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/action/action-bouldering-pinheads.jpg")}`,
    title: "Pinhead boulder, Joshua Tree",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/action/action-city-photo-1.jpg")}`,
    title: "12a Sport Climbing, City Rock",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/action/action-city-photo-2.jpg")}`,
    title: "12a Sport Climbing, City Rock",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/action/action-eric-on.jpg")}`,
    title: "Eric Laabs, 5.11 Indian Creek Fingers; on!",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/action/action-eric-off.jpg")}`,
    title: "Eric Laabs, 5.11 Indian Creek Fingers; off!",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/action/action-flying-crow.jpg")}`,
    title: "En Route to Las Vegas",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/action/action-lucia-scarface.jpg")}`,
    title: "Lucia Li, Indian Creek Scarface Shilloette",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/action/action-lime-kiln.jpg")}`,
    title: "Ocean of Limeston, Lime Kiln",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/action/action-relaxing.jpg")}`,
    title: "Action Relaxing",
    rows: 2,
    cols: 2,
  },
];

const portraitPhotos =[
  {
    img: `${require("./images/photography/portrait/portrait-walter-1.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/portrait/portrait-sydney-iccle.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/portrait/portrait-sydney-tumwater.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/portrait/portrait-ancestrial-pueblo-view.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/portrait/portrait-cactus.jpg")}`,
    title: "",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/portrait/portrait-dangerous-jug.jpg")}`,
    title: "",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("./images/photography/portrait/portrait-lucia-pbj.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/portrait/portrait-nature.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
]

const astronomyPhotos =  [
  {
    img: `${require("./images/photography/astronomy/astronomy-arora-1.jpg")}`,
    title: "Arora",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-arora-2.jpg")}`,
    title: "Arora",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-arora-3.jpg")}`,
    title: "Arora",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-galaxy-1.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-galaxy-2.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-joshua-tree-1.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-joshua-tree-2.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-joshua-tree-3.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-arora-4.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-kolab-canyon-1.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("./images/photography/astronomy/astronomy-kolab-canyon-2.jpg")}`,
    title: "",
    rows: 2,
    cols: 2,
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
        <Route path="/photography/astronomy" element={<QuiltedImageList ImageData={astronomyPhotos}/> }/>
        <Route path="/photography/portrait" element={<QuiltedImageList ImageData={portraitPhotos}/> }/>
        <Route path="/photography" element={<Photography />} />
        <Route path="/climbing" element={<Climbing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}