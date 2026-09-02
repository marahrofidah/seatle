import React, { useState } from 'react';
import { 
  Heart, 
  Play, 
  Smile, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Send,
  ShieldCheck
} from 'lucide-react';
import { saveUserData } from '../lib/supabase';

export default function PeduliLingkungan() {
  const [activeTab, setActiveTab] = useState('video');

  // STATE VIDEO SIKAP (90 DETIK)
  const [sceneIndex, setSceneIndex] = useState(0);

  // STATE VERBAL COMMITMENT
  const [commitAction, setCommitAction] = useState('');
  const [commitGoal, setCommitGoal] = useState('');
  const [commitSaved, setCommitSaved] = useState(false);

  // STATE ENVIRONMENTAL SENSITIVITY
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [emojiReason, setEmojiReason] = useState('');
  const [sensitivitySaved, setSensitivitySaved] = useState(false);

  // STATE GENERAL ENVIRONMENTAL FEELINGS (5 LIKERT)
  const [likertAnswers, setLikertAnswers] = useState({});
  const [likertSubmitted, setLikertSubmitted] = useState(false);

  const videoScenes = [
    {
      time: '0 – 20 detik',
      title: 'Awal Perjalanan Tukik Menetas',
      visual: '🌅 Matahari terbit mewarnai cakrawala pantai. Telur penyu menetas di balik pasir. Tukik-tukik mungil keluar dan merangkak gigih menuju ombak laut.',
      narasi: 'Perjalanan seekor penyu dimulai dari dalam pasir. Setelah menetas, tukik harus berjalan menuju laut. Tidak semua tukik berhasil sampai ke laut. Sejak kecil, penyu sudah menghadapi banyak tantangan.',
      bg: 'from-amber-950/60 via-slate-900 to-cyan-950/60'
    },
    {
      time: '20 – 45 detik',
      title: 'Menjelajahi Lautan yang Indah',
      visual: '🪸 Penyu tumbuh menjadi remaja. Berenang anggun di padang lamun yang hijau, melewati terumbu karang penuh warna, dan berteman dengan ubur-ubur serta ikan.',
      narasi: 'Penyu tumbuh dan menjelajahi lautan. Penyu mencari makanan, berpindah tempat, dan membantu menjaga keseimbangan ekosistem laut. Laut yang bersih menjadi rumah yang aman bagi penyu dan berbagai makhluk hidup lainnya.',
      bg: 'from-teal-950/70 via-slate-900 to-emerald-950/60'
    },
    {
      time: '45 – 70 detik',
      title: 'Ancaman Sampah & Jaring Bekas',
      visual: '⚠️ Muncul kantong plastik melayang di laut. Jaring bekas terombang-ambing. Penyu hampir memakan plastik karena mengira ubur-ubur dan tersangkut tali pancing.',
      narasi: 'Namun, perjalanan penyu tidak selalu mudah. Sampah plastik, jaring bekas, dan aktivitas manusia dapat membahayakan kehidupan penyu. Banyak penyu terluka bahkan tidak dapat melanjutkan perjalanannya.',
      bg: 'from-rose-950/70 via-slate-900 to-slate-950'
    },
    {
      time: '70 – 90 detik',
      title: 'Aksi Bersama & Rumah yang Aman',
      visual: '✨ Anak-anak dan masyarakat pantai bergotong-royong membersihkan sampah. Penyu berenang gembira kembali ke laut yang bersih dan jernih.',
      narasi: 'Kita dapat membantu melindungi penyu dengan menjaga kebersihan pantai dan laut. Tindakan kecil yang kita lakukan hari ini dapat membantu penyu hidup lebih aman di masa depan. Laut yang bersih adalah rumah yang aman bagi penyu.',
      bg: 'from-cyan-950/80 via-teal-950 to-slate-900'
    }
  ];

  const emojis = [
    { code: '😢', label: 'Sedih' },
    { code: '😟', label: 'Prihatin' },
    { code: '😊', label: 'Senang ingin membantu' },
    { code: '💙', label: 'Peduli' },
    { code: '😲', label: 'Terkejut' }
  ];

  const likertQuestions = [
    { id: 1, text: '1. Saya merasa bertanggung jawab untuk menjaga kebersihan pantai dan laut.' },
    { id: 2, text: '2. Saya bersedia mengurangi penggunaan plastik sekali pakai untuk membantu melindungi penyu laut.' },
    { id: 3, text: '3. Saya akan mengingatkan orang lain agar tidak mengganggu penyu yang sedang bertelur.' },
    { id: 4, text: '4. Saya tertarik mengikuti kegiatan yang mendukung pelestarian penyu dan lingkungan laut.' },
    { id: 5, text: '5. Saya percaya bahwa tindakan kecil yang saya lakukan dapat membantu menjaga kelestarian penyu laut.' }
  ];

  const likertOptions = ['Sangat Setuju', 'Setuju', 'Kurang Setuju', 'Tidak Setuju'];

  const handleSaveCommitment = async (e) => {
    e.preventDefault();
    if (!commitAction.trim() || !commitGoal.trim()) return;
    const fullStatement = `Mulai hari ini saya berkomitmen untuk ${commitAction} agar ${commitGoal}`;
    await saveUserData('commitments', { statement: fullStatement, action: commitAction, goal: commitGoal });
    setCommitSaved(true);
  };

  const handleSaveSensitivity = async (e) => {
    e.preventDefault();
    if (!selectedEmoji || !emojiReason.trim()) return;
    await saveUserData('reflections', { emoji: selectedEmoji, reason: emojiReason });
    setSensitivitySaved(true);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          Modul 4: Aspek Sikap
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Peduli Lingkungan & Laut</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tumbuhkan kepekaan empati lingkungan melalui video cerita, buat komitmen diri, dan refleksikan sikap kepedulianmu.
        </p>
      </div>

      {/* SUB-MODULE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 max-w-3xl mx-auto">
        {[
          { id: 'video', label: '1. Video Sikap (90s)' },
          { id: 'komitmen', label: '2. Verbal Commitment' },
          { id: 'kepekaan', label: '3. Kepekaan Empati' },
          { id: 'survei', label: '4. Survei Refleksi Sikap' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-rose-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: VIDEO SIKAP (90 DETIK) */}
      {activeTab === 'video' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Play className="w-6 h-6 text-rose-400 fill-rose-400" />
                Video Sikap: "Perjalanan Seekor Penyu Laut"
              </h2>
              <p className="text-xs text-slate-400">Saksikan kisah perjalanan perjuangan penyu dari pasir hingga laut lepas.</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-white/10">
              {videoScenes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSceneIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    sceneIndex === idx ? 'bg-rose-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className={`min-h-[340px] rounded-2xl bg-gradient-to-b ${videoScenes[sceneIndex].bg} p-6 sm:p-10 border border-rose-500/30 flex flex-col justify-between space-y-6`}>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold w-fit">
              ⏱️ {videoScenes[sceneIndex].time} — {videoScenes[sceneIndex].title}
            </span>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {videoScenes[sceneIndex].visual}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">🎙️ Narasi:</span>
              <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
                "{videoScenes[sceneIndex].narasi}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                disabled={sceneIndex === 0}
                onClick={() => setSceneIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40"
              >
                Sebelumnnya
              </button>
              <button
                disabled={sceneIndex === videoScenes.length - 1}
                onClick={() => setSceneIndex(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERBAL COMMITMENT */}
      {activeTab === 'komitmen' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-rose-400" />
              Verbal Commitment (Komitmen Diri)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Setelah menonton video, tuliskan satu tindakan sederhana yang akan kamu lakukan untuk membantu menjaga penyu dan lingkungan laut.
            </p>
          </div>

          {!commitSaved ? (
            <form onSubmit={handleSaveCommitment} className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-200">Lengkapi Komitmen Diri Kamu:</p>
                
                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30">
                    <span className="font-bold text-rose-400">“Mulai hari ini saya berkomitmen untuk ...”</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Contoh: mengurangi penggunaan plastik sekali pakai dan membawa botol minum sendiri"
                    value={commitAction}
                    onChange={e => setCommitAction(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                  />

                  <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30">
                    <span className="font-bold text-rose-400">“... Agar ...”</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Contoh: laut tetap bersih dan penyu dapat hidup dengan aman”"
                    value={commitGoal}
                    onChange={e => setCommitGoal(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Simpan Komitmen Diri Saya
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Komitmen Berhasil Disimpan!
              </div>
              <p className="text-sm font-semibold text-slate-100 italic bg-slate-900 p-4 rounded-xl border border-white/10">
                “Mulai hari ini saya berkomitmen untuk <span className="text-rose-400 font-bold">{commitAction}</span> agar <span className="text-emerald-400 font-bold">{commitGoal}</span>”
              </p>
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>FEEDBACK:</strong> Terima kasih! Komitmen kecil yang dilakukan secara terus-menerus dapat memberikan manfaat besar bagi lingkungan.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ENVIRONMENTAL SENSITIVITY */}
      {activeTab === 'kepekaan' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Smile className="w-6 h-6 text-rose-400" />
              Kepekaan Empati Lingkungan (Environmental Sensitivity)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Bagaimana perasaanmu setelah melihat perjalanan hidup penyu laut? Pilih satu emoji dan berikan alasan dalam 1 kalimat.
            </p>
          </div>

          {!sensitivitySaved ? (
            <form onSubmit={handleSaveSensitivity} className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">Pilih Emoji Perasaanmu:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {emojis.map((e, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedEmoji(e.code)}
                      className={`p-4 rounded-2xl text-center border transition-all ${
                        selectedEmoji === e.code
                          ? 'bg-rose-950 border-rose-400 scale-105 shadow-md'
                          : 'bg-slate-950 border-white/10 hover:border-rose-500/40'
                      }`}
                    >
                      <span className="text-3xl block mb-1">{e.code}</span>
                      <span className="text-[11px] font-semibold text-slate-300">{e.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">Jelaskan alasanmu dalam 1 kalimat:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Saya merasa sedih karena banyak penyu terluka akibat sampah plastik di laut."
                  value={emojiReason}
                  onChange={e => setEmojiReason(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedEmoji || !emojiReason.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 shadow-lg shadow-rose-500/20"
              >
                Kirim Refleksi Perasaan
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Refleksi Perasaan Berhasil Dikirim!
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Perasaan: <span className="text-2xl ml-1">{selectedEmoji}</span>
              </p>
              <p className="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-xl">
                "{emojiReason}"
              </p>
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>FEEDBACK:</strong> Terima kasih sudah berbagi pendapatmu. Perasaan peduli adalah langkah awal untuk menjaga lingkungan. Semoga kepedulianmu dapat diwujudkan melalui tindakan nyata.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GENERAL ENVIRONMENTAL FEELINGS (5 LIKERT) */}
      {activeTab === 'survei' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-rose-400" />
              Survei Pendapat Sikap Lingkungan
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Berikan jawaban sesuai dengan pendapat dirimu sejujurnya.
            </p>
          </div>

          <div className="space-y-6">
            {likertQuestions.map(q => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-200">{q.text}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {likertOptions.map(opt => {
                    const isSelected = likertAnswers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        disabled={likertSubmitted}
                        onClick={() => setLikertAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                          isSelected
                            ? 'bg-rose-950 border-rose-400 text-rose-200 font-bold'
                            : 'bg-slate-950 border-white/5 text-slate-400 hover:border-rose-500/30'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!likertSubmitted ? (
            <button
              disabled={Object.keys(likertAnswers).length < 5}
              onClick={() => setLikertSubmitted(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 shadow-xl shadow-rose-500/20"
            >
              Simpan Survei Sikap
            </button>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">✨ FEEDBACK PENILAIAN SIKAP:</span>
              <p>
                Terima kasih telah mengisi refleksi sikapmu. Kepedulian terhadap lingkungan dimulai dari cara kita berpikir, kemudian diwujudkan melalui tindakan nyata. Semoga setelah pembelajaran ini kamu semakin peduli terhadap penyu laut dan lingkungan di sekitarmu!
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
