import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages Modules
import Home from './pages/Home';
import Tujuan from './pages/Tujuan';
import MengenalPenyu from './pages/MengenalPenyu';
import AncamanPenyu from './pages/AncamanPenyu';
import PeduliLingkungan from './pages/PeduliLingkungan';
import AksiPeduli from './pages/AksiPeduli';
import Refleksi from './pages/Refleksi';
import Glosarium from './pages/Glosarium';
import Gallery from './pages/Gallery';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'tujuan':
        return <Tujuan setActivePage={setActivePage} />;
      case 'pengetahuan':
        return <MengenalPenyu setActivePage={setActivePage} />;
      case 'keterampilan':
        return <AncamanPenyu setActivePage={setActivePage} />;
      case 'sikap':
        return <PeduliLingkungan setActivePage={setActivePage} />;
      case 'perilaku':
        return <AksiPeduli setActivePage={setActivePage} />;
      case 'refleksi':
        return <Refleksi setActivePage={setActivePage} />;
      case 'glosarium':
        return <Glosarium setActivePage={setActivePage} />;
      case 'gallery':
        return <Gallery setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Sticky Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Viewport */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderPage()}
      </main>

      {/* Oceanic Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
