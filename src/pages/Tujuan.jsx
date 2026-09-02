import React, { useState } from 'react';
import { Target, Play, Pause, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export default function Tujuan({ setActivePage }) {
  // State untuk Video Simulator Awal (90 detik)
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenes = [
    {
      time: '0 - 20 detik',
      title: 'Penyu Laut Terdampar di Pantai',
      visual: '🌅 Pagi hari, seorang siswa berjalan menyusuri pantai yang tenang. Tiba-tiba di kejauhan ia melihat seekor penyu laut besar diam terdampar di atas pasir dan tak sanggup bergerak.',
      narasi: 'Suatu pagi, seorang siswa berjalan menyusuri pantai. Saat menikmati suasana pantai, ia melihat seekor penyu laut yang terdampar. Penyu itu tampak lemah dan tidak dapat kembali ke laut.',
      bg: 'from-amber-900/40 via-cyan-950/60 to-slate-900'
    },
    {
      time: '20 - 40 detik',
      title: 'Benda Sampah di Sekitar Penyu',
      visual: '🔍 Kamera mendekat ke arah penyu. Terlihat jelas kantong plastik, botol bekas, tali pancing yang kusut, serta jaring bekas (ghost net) tersangkut di sekitarnya.',
      narasi: 'Di sekitar penyu terdapat beberapa benda yang menarik perhatian. Ada sampah plastik, jaring bekas, dan tali pancing. Apakah benda-benda tersebut berhubungan dengan kondisi penyu? Atau ada penyebab lain yang belum kita ketahui?',
      bg: 'from-cyan-950/70 via-slate-900 to-emerald-950/50'
    },
    {
      time: '40 - 60 detik',
      title: 'Ancaman Alami & Aktivitas Manusia',
      visual: '❓ Siswa tampak bingung. Muncul ilustrasi melayang: Kapal melintas cepat, Ombak menggulung besar, Ubur-ubur berenang, dan Laut yang tercemar limbah.',
      narasi: 'Penyu dapat menghadapi berbagai ancaman selama hidupnya. Ada yang berasal dari aktivitas manusia, tetapi ada juga yang disebabkan oleh kondisi alam. Oleh karena itu, kita perlu memahami penyebabnya sebelum menentukan tindakan yang tepat.',
      bg: 'from-blue-950/70 via-slate-900 to-indigo-950/60'
    },
    {
      time: '60 - 80 detik',
      title: 'Dilema Pilihan Aksi Pertolongan',
      visual: '🤔 Siswa ingin membantu tetapi ragu. Di layarnya muncul 3 opsi tindakan pertolongan.',
      narasi: 'Jika kamu berada di tempat itu, apa yang akan kamu lakukan? Apakah semua tindakan dapat membantu penyu? Atau justru ada tindakan yang bisa membahayakan penyu?',
      bg: 'from-amber-950/60 via-slate-900 to-slate-950',
      isInteractive: true
    },
    {
      time: '80 - 90 detik',
      title: 'Misi Penyelamatan Penyu Dimulai',
      visual: '🐢 Logo Misi Penyelamatan Penyu menyala bioluminescent! Gelombang laut biru jernih mengalir menandai petualangan belajar Dimulai.',
      narasi: 'Untuk menemukan jawaban yang tepat, mari kita pelajari terlebih dahulu tentang penyu laut, habitatnya, serta perannya dalam menjaga keseimbangan ekosistem laut.',
      bg: 'from-teal-900/60 via-cyan-950 to-slate-900'
    }
  ];

  const objectives = [
    "Menjelaskan karakteristik, jenis, dan siklus hidup penyu laut di Indonesia.",
    "Menjelaskan peran penyu dalam menjaga keseimbangan ekosistem laut.",
    "Menganalisis penyebab, dampak, dan solusi terhadap permasalahan yang mengancam kelestarian penyu laut.",
    "Menunjukkan sikap peduli terhadap pelestarian penyu dan lingkungan laut.",
    "Melakukan tindakan sederhana sebagai bentuk partisipasi dalam upaya konservasi penyu laut."
  ];

  const actionChoices = [
    {
      id: 'A',
      text: 'Langsung mendorong penyu kembali ke laut',
      correct: false,
      feedback: '⚠️ Mendorong penyu yang lemah secara langsung tanpa pemeriksaan fisik dapat memperparah cidera atau membuat penyu tenggelam karena kehabisan napas.'
    },
    {
      id: 'B',
      text: 'Memanggil teman untuk memindahkan penyu',
      correct: false,
      feedback: '⚠️ Memindahkan penyu tanpa keahlian medis konservasi dapat memicu stres berat dan kerusakan cangkang/sirip.'
    },
    {
      id: 'C',
      text: 'Melaporkan segera kepada instansi berwenang/petugas pantai',
      correct: true,
      feedback: '✅ TEPAT SEKALI! Melaporkan kepada petugas/konservasi adalah langkah pertama terbaik agar penyu mendapatkan penanganan medis profesional.'
    }
  ];

  const handleNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setShowFeedback(false);
      setSelectedAction(null);
    }
  };

  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setShowFeedback(false);
      setSelectedAction(null);
    }
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Target className="w-4 h-4 text-cyan-400" />
          Modul 1: Tujuan & Video Stimulasi
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Tujuan Pembelajaran</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Pahami target capaian belajar dan saksikan simulasi video cerita penyu terdampar di pantai.
        </p>
      </div>

      {/* 5 TUJUAN PEMBELAJARAN CARDS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/20 shadow-xl">
        <h2 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          Setelah mempelajari website ini, peserta didik diharapkan mampu:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectives.map((obj, index) => (
            <div 
              key={index}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {obj}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO STIMULASI AWAL (90 DETIK) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Play className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              Video Awal (90 Detik) - Simulasi Pantai
            </h2>
            <p className="text-xs text-slate-400">Jelajahi alur adegan dan narasi penyu terdampar secara interaktif.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
            {scenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScene(idx);
                  setShowFeedback(false);
                  setSelectedAction(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentScene === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scene {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* PLAYER DISPLAY SCREEN */}
        <div className={`relative min-h-[380px] rounded-3xl bg-gradient-to-b ${scenes[currentScene].bg} p-6 sm:p-10 border border-cyan-500/30 shadow-2xl flex flex-col justify-between transition-all duration-500`}>
          
          {/* Top Bar Player */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
              ⏱️ Alokasi Waktu: {scenes[currentScene].time}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Adegan {currentScene + 1} / {scenes.length}
            </span>
          </div>

          {/* Visual Simulation Display */}
          <div className="my-6 space-y-4">
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-xs font-bold text-teal-300 uppercase tracking-wide">
              {scenes[currentScene].title}
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {scenes[currentScene].visual}
              </p>
            </div>

            {/* Interactive Dilemma Choice for Scene 4 */}
            {scenes[currentScene].isInteractive && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 animate-in fade-in duration-300">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Pilihan Aksi: Apa yang akan kamu lakukan jika menemukan penyu ini?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {actionChoices.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        setSelectedAction(act.id);
                        setShowFeedback(true);
                      }}
                      className={`p-3.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                        selectedAction === act.id
                          ? act.correct 
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200' 
                            : 'bg-rose-950 border-rose-500 text-rose-200'
                          : 'bg-slate-800 border-white/10 text-slate-300 hover:border-cyan-500/40'
                      }`}
                    >
                      <span className="font-bold text-cyan-400 block mb-1">Opsi {act.id}</span>
                      {act.text}
                    </button>
                  ))}
                </div>

                {showFeedback && selectedAction && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed animate-in slide-in-from-bottom duration-200">
                    {actionChoices.find(a => a.id === selectedAction)?.feedback}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subtitle / Narasi Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              🎙️ Narasi Video:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
              "{scenes[currentScene].narasi}"
            </p>
          </div>

          {/* Navigation Player Controls */}
          <div className="pt-6 flex items-center justify-between border-t border-white/10">
            <button
              onClick={handlePrevScene}
              disabled={currentScene === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Kembali
            </button>

            <span className="text-xs font-bold text-cyan-300">
              {currentScene === scenes.length - 1 ? '🎉 Selesai Simulasi Video' : 'Lanjutkan Simulasi'}
            </span>

            {currentScene < scenes.length - 1 ? (
              <button
                onClick={handleNextScene}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
              >
                Adegan Selanjutnya $\rightarrow$
              </button>
            ) : (
              <button
                onClick={() => setActivePage('pengetahuan')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>Masuk Modul Mengenal Penyu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
