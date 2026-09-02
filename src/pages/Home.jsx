import React from 'react';
import { 
  ArrowRight, 
  Target, 
  BookOpen, 
  AlertTriangle, 
  Heart, 
  Award, 
  Sparkles, 
  BookMarked, 
  Image as ImageIcon,
  Waves,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function Home({ setActivePage }) {
  const modules = [
    {
      id: 'tujuan',
      num: '01',
      title: 'Tujuan Pembelajaran',
      desc: 'Capaian pembelajaran & Video Awal (90 detik) simulasi penyu terdampar.',
      icon: Target,
      color: 'from-cyan-500 to-blue-600',
      tag: 'Awal Pembelajaran'
    },
    {
      id: 'pengetahuan',
      num: '02',
      title: 'Mengenal Penyu',
      desc: 'Anatomi interaktif, Kuis Biologi, 6 Spesies Indonesia, Siklus Hidup, & Peran Ekosistem.',
      icon: BookOpen,
      color: 'from-teal-500 to-emerald-600',
      tag: 'Aspek Pengetahuan'
    },
    {
      id: 'keterampilan',
      num: '03',
      title: 'Ancaman Penyu',
      desc: 'Identifikasi ancaman, analisis penyebab-dampak, dan studi kasus aksi penyelamatan.',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
      tag: 'Aspek Keterampilan'
    },
    {
      id: 'sikap',
      num: '04',
      title: 'Peduli Lingkungan',
      desc: 'Video Sikap "Perjalanan Penyu", Form Komitmen Diri, Emoji Sensitivity, & Survei Sikap.',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      tag: 'Aspek Sikap'
    },
    {
      id: 'perilaku',
      num: '05',
      title: 'Aksi Peduli',
      desc: 'Tantangan Sahabat Penyu 7 Hari & Kampanye Poster Canva dengan Rubrik Penilaian.',
      icon: Award,
      color: 'from-emerald-500 to-cyan-600',
      tag: 'Aspek Perilaku'
    },
    {
      id: 'refleksi',
      num: '06',
      title: 'Refleksi Pembelajaran',
      desc: 'Berikan pendapatmu mengenai pengalaman belajar menggunakan website SEATLE.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      tag: 'Evaluasi'
    },
    {
      id: 'glosarium',
      num: '07',
      title: 'Glosarium Istilah',
      desc: 'Kamus interaktif 12 istilah penting ekologi dan konservasi penyu laut.',
      icon: BookMarked,
      color: 'from-blue-500 to-cyan-500',
      tag: 'Kamus Istilah'
    },
    {
      id: 'gallery',
      num: '08',
      title: 'Gallery Karya',
      desc: 'Showcase poster digital Canva & foto dokumentasi aksi nyata Sahabat Penyu.',
      icon: ImageIcon,
      color: 'from-teal-400 to-cyan-500',
      tag: 'Galeri Karya'
    },
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Waves className="w-4 h-4 text-cyan-400 animate-bounce" />
            Media Pembelajaran Konservasi Penyu Laut
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="block text-slate-100">SEATLE</span>
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              “LEARN WITH SEA TURTLE, CARE FOR THE OCEAN”
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Selamat datang di platform edukasi konservasi penyu laut! Mari jelajahi kehidupan 6 spesies penyu di Indonesia, pahami peran ekologisnya, pecahkan ancaman di lautan, dan tunjukkan aksi nyatamu untuk menjaga kelestarian samudra.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setActivePage('tujuan')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] transition-all flex items-center gap-3 group"
            >
              <span>Mulai Petualangan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('pengetahuan')}
              className="px-6 py-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Jelajahi Anatomi & Spesies</span>
            </button>
          </div>
        </div>

        {/* Floating Ocean Stats */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
            <span className="block text-2xl font-black text-cyan-400">6 Spesies</span>
            <span className="text-xs text-slate-400">Penyu Laut di Indonesia</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
            <span className="block text-2xl font-black text-teal-400">90 Detik</span>
            <span className="text-xs text-slate-400">Simulasi Video Cerita Interaktif</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
            <span className="block text-2xl font-black text-emerald-400">7 Hari</span>
            <span className="text-xs text-slate-400">Tantangan Aksi Sahabat Penyu</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
            <span className="block text-2xl font-black text-amber-400">100%</span>
            <span className="text-xs text-slate-400">Edukasi Peduli Ekosistem</span>
          </div>
        </div>
      </section>

      {/* MODULE CARDS GRID */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Delapan Modul Pembelajaran SEATLE</h2>
          <p className="text-slate-400 text-sm">
            Ikuti alur pembelajaran secara runtut untuk mendapatkan pengalaman belajar ekologi dan konservasi yang utuh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => setActivePage(m.id)}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      {m.tag}
                    </span>
                    <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-400/40 transition-colors">
                      {m.num}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${m.color} p-0.5 shadow-md flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-slate-950" />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-200">
                  <span>Buka Modul</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
