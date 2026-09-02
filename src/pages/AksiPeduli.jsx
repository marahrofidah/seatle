import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Upload, 
  Calendar, 
  Image as ImageIcon, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  FileCheck, 
  Camera,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveUserData, fetchUserData } from '../lib/supabase';

export default function AksiPeduli({ setActivePage }) {
  const [activeTab, setActiveTab] = useState('tantangan');

  // STATE TANTANGAN 7 HARI
  const [challengeDay, setChallengeDay] = useState(1);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState('');
  const [caption, setCaption] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // STATE KAMPANYE POSTER
  const [posterTitle, setPosterTitle] = useState('');
  const [authorNames, setAuthorNames] = useState('');
  const [canvaUrl, setCanvaUrl] = useState('');
  const [posterPhotoPreview, setPosterPhotoPreview] = useState(null);
  const [posterSubmitted, setPosterSubmitted] = useState(false);

  const challengeOptions = [
    'Tidak menggunakan sedotan plastik',
    'Membawa botol minum sendiri',
    'Membawa tas belanja kain',
    'Membuang sampah pada tempatnya',
    'Mengurangi penggunaan plastik sekali pakai',
    'Mengajak keluarga memilah sampah',
    'Membersihkan lingkungan rumah'
  ];

  const rubric = [
    { name: 'Kesesuaian Isi', weight: 30, desc: 'Relevansi pesan poster dengan tema konservasi penyu laut.' },
    { name: 'Ketepatan Informasi', weight: 25, desc: 'Akurasi fakta biologi & ancaman penyu yang disampaikan.' },
    { name: 'Kreativitas', weight: 20, desc: 'Keindahan komposisi visual, warna, dan ilustrasi poster Canva.' },
    { name: 'Keterbacaan', weight: 15, desc: 'Kemudahan membaca judul, tipografi, dan hirarki teks.' },
    { name: 'Ajakan Konservasi', weight: 10, desc: 'Kekuatan kalimat persuasi aksi nyata untuk masyarakat.' }
  ];

  useEffect(() => {
    loadChallengeLogs();
  }, []);

  const loadChallengeLogs = async () => {
    const data = await fetchUserData('challenge_logs');
    setLogs(data || []);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();
    if (!selectedChallengeOption || !caption.trim()) return;

    setIsSubmittingLog(true);
    const newLog = {
      day: challengeDay,
      action: selectedChallengeOption,
      caption: caption,
      photo: photoPreview || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60'
    };

    await saveUserData('challenge_logs', newLog);
    await loadChallengeLogs();

    if (logs.length + 1 >= 7) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setIsSubmittingLog(false);
    setSelectedChallengeOption('');
    setCaption('');
    setPhotoPreview(null);
    if (challengeDay < 7) setChallengeDay(prev => prev + 1);
  };

  const handleSavePoster = async (e) => {
    e.preventDefault();
    if (!posterTitle.trim() || !authorNames.trim()) return;

    const posterData = {
      title: posterTitle,
      authors: authorNames,
      canva_url: canvaUrl,
      image_url: posterPhotoPreview || 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=500&auto=format&fit=crop&q=60'
    };

    await saveUserData('posters', posterData);
    confetti({ particleCount: 80, spread: 60 });
    setPosterSubmitted(true);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-400" />
          Modul 5: Aspek Perilaku
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Aksi Peduli Sahabat Penyu</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Wujudkan kepedulian melalui Tantangan 7 Hari Aksi Nyata dan Kampanye Poster Digital Canva.
        </p>
      </div>

      {/* SUB-MODULE NAVIGATION TABS */}
      <div className="flex items-center justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('tantangan')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tantangan'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg scale-105'
              : 'text-slate-300 hover:text-emerald-300'
          }`}
        >
          1. Tantangan 7 Hari (Tracker)
        </button>
        <button
          onClick={() => setActiveTab('kampanye')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'kampanye'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg scale-105'
              : 'text-slate-300 hover:text-emerald-300'
          }`}
        >
          2. Kampanye Poster Canva
        </button>
      </div>

      {/* TAB 1: TANTANGAN 7 HARI */}
      {activeTab === 'tantangan' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* PROGRESS BAR 7 HARI */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Progress Tantangan Sahabat Penyu (7 Hari)
                </h3>
                <p className="text-xs text-slate-400">Lakukan 1 aksi sederhana setiap hari dan dokumentasikan hasilnya.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                {logs.length} / 7 Hari Selesai
              </span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3.5 border border-white/10 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-500"
                style={{ width: `${Math.min((logs.length / 7) * 100, 100)}%` }}
              ></div>
            </div>

            {logs.length >= 7 && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">FEEDBACK: Selamat! Kamu telah menyelesaikan Tantangan Sahabat Penyu selama 7 Hari Penuh! 🎉</span>
              </div>
            )}
          </div>

          {/* FORM UPLOAD DOKUMENTASI HARIAN */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              Upload Dokumentasi Harian
            </h3>

            <form onSubmit={handleSaveLog} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* SELECT HARI KE- */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">Pilih Hari-Ke:</label>
                  <select
                    value={challengeDay}
                    onChange={e => setChallengeDay(Number(e.target.value))}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <option key={d} value={d}>Hari Ke-{d}</option>
                    ))}
                  </select>
                </div>

                {/* SELECT OPSI AKSIS */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">Aksi yang Dilakukan Hari Ini:</label>
                  <select
                    required
                    value={selectedChallengeOption}
                    onChange={e => setSelectedChallengeOption(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="">-- Pilih Jenis Aksi Nyata --</option>
                    {challengeOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>✅ {opt}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* CAPTION SINGKAT */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">Caption Singkat:</label>
                <input
                  type="text"
                  required
                  placeholder='Contoh: "Saya meminta minuman tanpa sedotan plastik saat di kantin"'
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* FOTO DOKUMENTASI UPLOAD */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">Upload Foto Kegiatan:</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-900/60 border-cyan-500/30 hover:border-emerald-400 transition-colors">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-full object-contain rounded-xl p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                        <p className="text-xs text-slate-300"><span className="font-bold text-cyan-400">Klik untuk upload foto</span> kegiatanmu</p>
                        <p className="text-[10px] text-slate-500">PNG, JPG, JPEG (Max 5MB)</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLog || !selectedChallengeOption || !caption.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Simpan Dokumentasi Harian
              </button>

            </form>
          </div>

          {/* RIWAYAT LOG HARIAN SAHABAT PENYU */}
          {logs.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Riwayat Aksi Sahabat Penyu Kamu:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {logs.map((log, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                        Hari Ke-{log.day}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.created_at || Date.now()).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="h-36 rounded-xl overflow-hidden bg-slate-950">
                      <img src={log.photo} alt={log.caption} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-teal-300 block">✅ {log.action}</span>
                      <p className="text-xs text-slate-300 italic mt-1 font-medium">"{log.caption}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: KAMPANYE POSTER CANVA */}
      {activeTab === 'kampanye' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* RUBRIK PENILAIAN CARD */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-cyan-400" />
              Rubrik Penilaian Kampanye Poster Sahabat Penyu
            </h3>
            <p className="text-xs text-slate-300">
              Poster dibuat berpasangan (2 siswa) menggunakan aplikasi Canva, kemudian diunggah ke website untuk dipamerkan di Gallery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {rubric.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                      {item.weight}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FORM UPLOAD POSTER */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              Unggah Poster Digital Canva Kamu
            </h3>

            {!posterSubmitted ? (
              <form onSubmit={handleSavePoster} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">Judul Poster:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jaga Penyu, Selamatkan Lautan Indonesia"
                      value={posterTitle}
                      onChange={e => setPosterTitle(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">Nama Anggota Kelompok (2 Orang):</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Prasetyo & Siti Rahma"
                      value={authorNames}
                      onChange={e => setAuthorNames(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">Link Canva (Opsional):</label>
                  <input
                    type="url"
                    placeholder="https://www.canva.com/design/..."
                    value={canvaUrl}
                    onChange={e => setCanvaUrl(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* UPLOAD FOTO POSTER */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">Upload Gambar Poster Hasil Canva:</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-900/60 border-cyan-500/30 hover:border-emerald-400 transition-colors">
                      {posterPhotoPreview ? (
                        <img src={posterPhotoPreview} alt="Preview Poster" className="h-full object-contain rounded-xl p-2" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                          <p className="text-xs text-slate-300"><span className="font-bold text-cyan-400">Klik untuk upload file gambar poster</span></p>
                          <p className="text-[10px] text-slate-500">PNG / JPG Export Canva</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!posterTitle.trim() || !authorNames.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 shadow-xl shadow-emerald-500/20"
                >
                  Unggah Poster ke Gallery Website
                </button>

              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-white">Poster Berhasil Diunggah!</h4>
                <p className="text-xs text-slate-300">
                  Karyamu bersama <strong className="text-emerald-400">{authorNames}</strong> telah berhasil dipublikasikan di Gallery Website SEATLE.
                </p>
                <button
                  onClick={() => setActivePage('gallery')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Lihat di Gallery Website</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
