import React, { useState, useEffect } from 'react';
import { Sparkles, Waves, Shield, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home({ onStart }) {
  const [bubbles, setBubbles] = useState([]);
  const [turtleMessage, setTurtleMessage] = useState('Halo Sahabat Penyu! Klik di sini!');

  const turtleDialogues = [
    "Selamat datang di media edukasi SEATLE!",
    "Mari jaga kebersihan lautan Indonesia bersama!",
    "Kurangi penggunaan plastik sekali pakai!",
    "Penyu mampu berenang melintasi samudra!",
    "Klik tombol Mulai untuk belajar!"
  ];

  useEffect(() => {
    const initialBubbles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: Math.random() * 85 + 5,
      size: Math.random() * 20 + 16,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 4,
    }));
    setBubbles(initialBubbles);
  }, []);

  const handleTurtleClick = (e) => {
    const randomMsg = turtleDialogues[Math.floor(Math.random() * turtleDialogues.length)];
    setTurtleMessage(randomMsg);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x, y },
      colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6']
    });
  };

  const handleBubbleClick = (id, e) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    
    setTimeout(() => {
      setBubbles(prev => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 85 + 5,
          size: Math.random() * 20 + 16,
          duration: Math.random() * 6 + 5,
          delay: 0,
        }
      ]);
    }, 2000);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({ particleCount: 15, spread: 40, origin: { x, y } });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden font-sans select-none bg-gradient-to-b from-sky-400 via-cyan-600 to-blue-950 px-4 py-6">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/25 via-cyan-400/20 to-transparent pointer-events-none z-0"></div>

      {/* FLOATING INTERACTIVE BUBBLES */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        {bubbles.map(b => (
          <button
            key={b.id}
            onClick={(e) => handleBubbleClick(b.id, e)}
            className="absolute rounded-full bg-white/25 border border-white/70 backdrop-blur-[1px] hover:scale-125 active:scale-75 transition-transform cursor-pointer animate-float"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              bottom: `-40px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              animationIterationCount: 'infinite'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/90 absolute top-1 left-1.5"></div>
          </button>
        ))}
      </div>

      {/* MOBILE-RESPONSIVE MASCOT GRAPHICS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        
        {/* SEA TURTLE VECTOR MASCOT RIGHT (RESPONSIVE HP) */}
        <div 
          onClick={handleTurtleClick}
          className="absolute right-3 sm:right-12 top-16 sm:top-1/4 pointer-events-auto cursor-pointer group transition-transform hover:scale-105 active:scale-95 duration-300"
        >
          <div className="relative">
            <div className="w-24 sm:w-44 h-24 sm:h-44 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm p-2 sm:p-4 flex flex-col items-center justify-center shadow-xl animate-float">
              <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 sm:w-12 sm:h-12 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <span className="text-[8px] sm:text-xs font-bold text-white uppercase tracking-wider mt-1 sm:mt-2">
                Sahabat Penyu
              </span>
            </div>

            {/* SPEECH BUBBLE (HP FRIENDLY) */}
            <div className="absolute -bottom-8 right-0 sm:bottom-auto sm:-top-12 sm:-left-24 bg-white/95 text-slate-800 text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-cyan-300 max-w-[150px] sm:max-w-[200px] text-center animate-bounce">
              {turtleMessage}
            </div>
          </div>
        </div>

        {/* BABY TURTLE VECTOR MASCOT LEFT */}
        <div 
          onClick={handleTurtleClick}
          className="absolute left-3 sm:left-16 bottom-16 sm:bottom-1/4 pointer-events-auto cursor-pointer group transition-transform hover:scale-105 duration-300"
        >
          <div className="relative animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm p-2 flex flex-col items-center justify-center shadow-md">
              <Compass className="w-6 h-6 text-cyan-300" />
              <span className="text-[8px] font-bold text-cyan-200 uppercase mt-0.5">Tukik</span>
            </div>
          </div>
        </div>

      </div>

      {/* CENTER HERO CONTENT: SEATLE BRAND & MULAI BUTTON (PERFECT FOR HP) */}
      <main className="relative z-20 max-w-xl mx-auto text-center space-y-5 my-auto py-8">
        
        {/* RESPONSIVE BADGE */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/90 text-cyan-950 text-[10px] sm:text-xs font-black shadow-md border border-cyan-200 uppercase tracking-wider">
          <Waves className="w-3.5 h-3.5 text-cyan-600" />
          Edukasi Penyu Laut Interaktif
        </div>

        {/* RESPONSIVE BRAND TITLE */}
        <h1 className="font-brand text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-wider drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] leading-none">
          SEATLE
        </h1>

        {/* RESPONSIVE TAGLINE */}
        <p className="text-base sm:text-2xl md:text-3xl text-white font-extrabold tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] px-2 leading-snug">
          Learn with Sea Turtles, Care for the Ocean
        </p>

        {/* RESPONSIVE MULAI BUTTON */}
        <div className="pt-4 sm:pt-6">
          <button
            onClick={(e) => {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              onStart();
            }}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-black text-xl sm:text-2xl px-12 py-3.5 sm:px-16 sm:py-4.5 rounded-full shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-3 border-amber-200/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Mulai
          </button>
        </div>

      </main>

      {/* FOOTER HINT (HP OPTIMIZED) */}
      <footer className="relative z-20 pb-2 text-center text-[10px] sm:text-xs text-white font-bold drop-shadow">
        Petunjuk: Klik pada gelembung atau karakter untuk interaksi.
      </footer>

    </div>
  );
}
