import * as React from 'react';
import Container from '@mui/material/Container';
import ProTip from './components/ProTip';
import Footer from './components/Footer';
import Header from './components/Header';


export default function App() {
  return (
    <Container maxWidth="sm">
      <Header />
        <ProTip />
      <Footer />
    </Container>
  );
}