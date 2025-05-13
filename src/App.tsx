import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Fitur from './components/Fitur';
import Layanan from './components/Layanan';
import Testimoni from './components/Testimoni';
import Tentang from './components/Tentang';
import Kontak from './components/Kontak';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <main>
        <Hero />
        <Fitur />
        <Layanan />
        <Testimoni />
        <Tentang />
        <Kontak />
      </main>
      <Footer />
    </div>
  );
}

export default App;