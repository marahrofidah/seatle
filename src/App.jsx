import React, { useState } from 'react';
import Home from './pages/Home';

export default function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {!started ? (
        <Home onStart={handleStart} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center text-3xl font-bold">
            🐢
          </div>
          <h2 className="text-3xl font-black text-white">Menu Modul Pembelajaran SEATLE</h2>
          <p className="text-sm text-slate-300 max-w-md">
            Selamat datang di menu pembelajaran! Halaman utama (Landing Page) telah siap. Kita bisa mulai membuat modul pertama (**1. TUJUAN & Video Awal**) sekarang.
          </p>
          <button
            onClick={() => setStarted(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-cyan-400 text-xs font-semibold hover:bg-slate-700 transition-all"
          >
            ← Kembali ke Landing Page
          </button>
        </div>
      )}
    </div>
  );
}
