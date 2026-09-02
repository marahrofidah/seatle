import React from 'react';
import { Waves, Heart, ShieldCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="glass-panel border-t border-cyan-500/20 pt-12 pb-8 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
                <Waves className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                SEATLE
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Platform pembelajaran interaktif konservasi penyu laut di Indonesia. 
              Melatih pengetahuan ekologi, keterampilan memecahkan ancaman laut, hingga komitmen serta aksi nyata peduli lingkungan.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Media Pembelajaran Edukasi Penyu Laut Indonesia
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4">Navigasi Modul</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setActivePage('tujuan')} className="hover:text-cyan-400 transition-colors">1. Tujuan Pembelajaran</button>
              </li>
              <li>
                <button onClick={() => setActivePage('pengetahuan')} className="hover:text-cyan-400 transition-colors">2. Mengenal Penyu</button>
              </li>
              <li>
                <button onClick={() => setActivePage('keterampilan')} className="hover:text-cyan-400 transition-colors">3. Ancaman Penyu</button>
              </li>
              <li>
                <button onClick={() => setActivePage('sikap')} className="hover:text-cyan-400 transition-colors">4. Peduli Lingkungan</button>
              </li>
              <li>
                <button onClick={() => setActivePage('perilaku')} className="hover:text-cyan-400 transition-colors">5. Aksi Peduli</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Evaluasi & Karya */}
          <div>
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4">Fitur Utama</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setActivePage('refleksi')} className="hover:text-cyan-400 transition-colors">6. Refleksi Pembelajaran</button>
              </li>
              <li>
                <button onClick={() => setActivePage('glosarium')} className="hover:text-cyan-400 transition-colors">7. Glosarium Istilah</button>
              </li>
              <li>
                <button onClick={() => setActivePage('gallery')} className="hover:text-cyan-400 transition-colors">8. Gallery Karya Sahabat Penyu</button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SEATLE. Developed for Educational Marine Conservation.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>untuk Kelestarian Penyu Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
