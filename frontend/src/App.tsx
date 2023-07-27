import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Resume from './pages/Resume';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}