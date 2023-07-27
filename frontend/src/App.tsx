import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Photography from './pages/Photography';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/photography" element={<Photography />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}