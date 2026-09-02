import React, { useState } from 'react';
import { BookMarked, Search, Info } from 'lucide-react';

export default function Glosarium() {
  const [searchTerm, setSearchTerm] = useState('');

  const terms = [
    { term: 'Penyu Laut', desc: 'Reptil yang hidup di laut dan berkembang biak dengan bertelur di pantai.', icon: '🐢' },
    { term: 'Tukik', desc: 'Anak penyu yang baru menetas dari telur.', icon: '🥚' },
    { term: 'Karapas', desc: 'Cangkang bagian atas penyu yang melindungi organ dalam tubuhnya.', icon: '🛡️' },
    { term: 'Plastron', desc: 'Cangkang bagian bawah penyu.', icon: '📜' },
    { term: 'Lamun', desc: 'Tumbuhan berbunga yang hidup di dasar laut sebagai tempat mencari makan penyu hijau.', icon: '🌿' },
    { term: 'Terumbu Karang', desc: 'Kumpulan karang yang menjadi habitat berbagai hewan laut.', icon: '🪸' },
    { term: 'Habitat', desc: 'Tempat hidup suatu makhluk hidup.', icon: '📍' },
    { term: 'Ekosistem', desc: 'Hubungan timbal balik antara makhluk hidup dengan lingkungan di sekitarnya.', icon: '🌐' },
    { term: 'Konservasi', desc: 'Upaya melindungi dan melestarikan makhluk hidup serta lingkungannya.', icon: '💚' },
    { term: 'Terdampar', desc: 'Kondisi ketika penyu berada di pantai atau daratan dan tidak dapat kembali ke laut dengan normal.', icon: '🏖️' },
    { term: 'Ghost Fishing', desc: 'Jaring atau alat tangkap yang ditinggalkan di laut tetapi masih dapat melilit dan menangkap hewan laut.', icon: '🕸️' },
    { term: 'Migrasi', desc: 'Perpindahan penyu dari satu tempat ke tempat lain untuk mencari makan atau bertelur.', icon: '🧭' }
  ];

  const filteredTerms = terms.filter(t =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <BookMarked className="w-4 h-4 text-blue-400" />
          Modul 7: Glosarium Istilah
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Glosarium Kosakata</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Kamus lengkap istilah-istilah penting seputar ekologi, biologi, dan konservasi penyu laut.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari istilah atau kata kunci..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 shadow-xl"
        />
      </div>

      {/* TERMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((item, idx) => (
          <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 border border-blue-500/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  Istilah #{idx + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{item.term}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>SEATLE Marine Dictionary</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
