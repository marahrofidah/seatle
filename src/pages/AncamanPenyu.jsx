import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckSquare, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AncamanPenyu() {
  const [activeTab, setActiveTab] = useState('identifikasi');

  // STATE ISSUE IDENTIFICATION
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [identSubmitted, setIdentSubmitted] = useState(false);

  // STATE ISSUE ANALYSIS (PASANGAN)
  const [matchedPairs, setMatchedPairs] = useState({});
  const [analysisSubmitted, setAnalysisSubmitted] = useState(false);

  // STATE ACTION PLANNING (5 SOAL)
  const [actionAnswers, setActionAnswers] = useState({});
  const [actionSubmitted, setActionSubmitted] = useState(false);

  // DATA FACTORS IDENTIFICATION
  const factorsList = [
    { id: 'f1', text: 'Sampah plastik di perairan', isCorrect: true },
    { id: 'f2', text: 'Penyu terlilit jaring atau tali pancing', isCorrect: true },
    { id: 'f3', text: 'Penyu tertabrak kapal yang melintas', isCorrect: true },
    { id: 'f4', text: 'Laut yang tercemar limbah', isCorrect: true },
    { id: 'f5', text: 'Penyu mengalami penyakit atau cedera', isCorrect: true },
    { id: 'f6', text: 'Air laut terlalu dingin', isCorrect: false },
    { id: 'f7', text: 'Kehabisan tenaga setelah berenang jauh', isCorrect: false },
    { id: 'f8', text: 'Mengikuti sekumpulan ikan kecil', isCorrect: false },
    { id: 'f9', text: 'Mencari tempat beristirahat siang', isCorrect: false },
    { id: 'f10', text: 'Ombak laut sedang tinggi', isCorrect: false },
  ];

  // DATA PAIRS ANALYSIS
  const causes = [
    { id: 'A', text: 'A. Sampah plastik di laut', correctImpact: '2', explanation: 'A → 2 ✅ Benar. Kantong plastik sering dikira ubur-ubur sehingga dapat tertelan oleh penyu.' },
    { id: 'B', text: 'B. Jaring atau tali pancing (Ghost Net)', correctImpact: '1', explanation: 'B → 1 ✅ Benar. Jaring atau tali pancing dapat melilit tubuh penyu sehingga sulit berenang.' },
    { id: 'C', text: 'C. Tabrakan kapal melintas', correctImpact: '3', explanation: 'C → 3 ✅ Benar. Benturan baling-baling/lambung kapal menyebabkan luka patah tempurung.' },
    { id: 'D', text: 'D. Pencemaran minyak & kimia laut', correctImpact: '4', explanation: 'D → 4 ✅ Benar. Laut yang tercemar merusak habitat dan mengurangi sumber makanan penyu.' },
    { id: 'E', text: 'E. Penyakit (Fibropapillomatosis) / Cedera', correctImpact: '5', explanation: 'E → 5 ✅ Benar. Penyu yang sakit atau terluka menjadi sangat lemah dan akhirnya terdampar.' },
  ];

  const impacts = [
    { id: '1', text: '1. Penyu sulit berenang sehingga mudah terdampar' },
    { id: '2', text: '2. Penyu mengira plastik adalah ubur-ubur lalu memakannya' },
    { id: '3', text: '3. Tubuh penyu terluka atau mengalami patah tempurung' },
    { id: '4', text: '4. Habitat penyu rusak sehingga sumber makanan berkurang' },
    { id: '5', text: '5. Penyu menjadi lemah dan tidak mampu kembali ke laut' },
  ];

  // DATA ACTION PLANNING (5 SOAL)
  const actionQuestions = [
    {
      id: 1,
      scenario: '1. Saat berwisata ke pantai, kamu menemukan seekor penyu laut yang terdampar. Penyu masih hidup, tetapi tampak lemah dan sulit bergerak. Apa tindakan pertama yang paling tepat dilakukan?',
      options: [
        { key: 'A', text: 'Mengangkat penyu ke tempat yang teduh, kemudian segera menghubungi instansi yang berwenang agar penyu mendapatkan penanganan yang sesuai.', isCorrect: true },
        { key: 'B', text: 'Mengajak beberapa teman mendorong penyu kembali ke laut agar penyu dapat segera berenang dan tidak terlalu lama berada di pantai.', isCorrect: false },
        { key: 'C', text: 'Memindahkan penyu ke tempat yang lebih jauh dari ombak sambil menunggu hingga penyu dapat bergerak sendiri.', isCorrect: false },
        { key: 'D', text: 'Membawa penyu ke rumah untuk dirawat terlebih dahulu, kemudian mengembalikannya ke laut setelah kondisinya terlihat lebih baik.', isCorrect: false }
      ],
      feedback: '✅ Melaporkan kepada instansi berwenang merupakan tindakan yang paling tepat. Petugas memiliki pengetahuan dan peralatan yang diperlukan untuk menangani penyu dengan aman.'
    },
    {
      id: 2,
      scenario: '2. Pada malam hari, kamu melihat seekor penyu sedang bertelur di pantai. Apa tindakan yang paling tepat?',
      options: [
        { key: 'A', text: 'Menjaga jarak agar penyu tidak terganggu, mengingatkan orang lain untuk tidak mendekat, dan menghapus jejak penyu saat naik dan kembali ke laut.', isCorrect: true },
        { key: 'B', text: 'Mendekati penyu secara perlahan agar dapat mengambil foto tanpa menggunakan lampu kilat agar penyu tetap terlihat tenang.', isCorrect: false },
        { key: 'C', text: 'Membantu memindahkan beberapa telur ke tempat yang dianggap lebih aman agar telur tidak terkena ombak saat air pasang.', isCorrect: false },
        { key: 'D', text: 'Menunggu hingga penyu selesai bertelur, kemudian mengambil beberapa telur untuk diamankan agar tidak dimakan hewan lain.', isCorrect: false }
      ],
      feedback: '✅ Penyu yang sedang bertelur membutuhkan suasana yang tenang. Menjaga jarak membantu penyu menyelesaikan proses bertelur tanpa gangguan.'
    },
    {
      id: 3,
      scenario: '3. Ketika bermain di pantai, temanmu hendak membuang kantong plastik ke laut karena menganggap sampah tersebut akan terbawa ombak. Apa tindakan yang paling tepat?',
      options: [
        { key: 'A', text: 'Mengingatkan teman agar membuang sampah pada tempatnya, lalu bersama-sama membersihkan sampah di sekitar pantai.', isCorrect: true },
        { key: 'B', text: 'Meminta teman membuang plastik sedikit lebih jauh dari bibir pantai agar tidak terlihat oleh pengunjung.', isCorrect: false },
        { key: 'C', text: 'Membiarkan teman membuang sampah tersebut karena ombak diperkirakan akan membawa plastik ke laut lepas.', isCorrect: false },
        { key: 'D', text: 'Mengambil plastik tersebut, kemudian menguburnya di pasir pantai agar tidak lagi terlihat oleh orang lain.', isCorrect: false }
      ],
      feedback: '✅ Mengurangi sampah plastik merupakan salah satu cara sederhana untuk melindungi penyu laut dari bahaya tertelan plastik.'
    },
    {
      id: 4,
      scenario: '4. Saat berjalan di pantai, kamu menemukan jaring bekas yang tersangkut di bebatuan dekat laut. Apa tindakan yang paling tepat dilakukan?',
      options: [
        { key: 'A', text: 'Melaporkan keberadaan jaring kepada petugas atau membersihkannya bersama orang dewasa jika aman dilakukan agar tidak membahayakan penyu.', isCorrect: true },
        { key: 'B', text: 'Memindahkan jaring ke tempat yang lebih dekat dengan air laut agar tidak mengganggu pengunjung.', isCorrect: false },
        { key: 'C', text: 'Membiarkan jaring tetap berada di tempatnya karena kemungkinan masih akan digunakan oleh nelayan.', isCorrect: false },
        { key: 'D', text: 'Menyembunyikan jaring di balik bebatuan agar tidak terlihat oleh wisatawan.', isCorrect: false }
      ],
      feedback: '✅ Jaring bekas dapat melilit penyu dan hewan laut lainnya. Membersihkannya dengan aman atau melaporkannya kepada petugas merupakan tindakan yang tepat.'
    },
    {
      id: 5,
      scenario: '5. Sekolahmu akan mengadakan kegiatan peduli lingkungan sebagai bentuk dukungan terhadap konservasi penyu laut. Kegiatan manakah yang memberikan manfaat paling besar bagi kelestarian penyu?',
      options: [
        { key: 'A', text: 'Mengadakan aksi bersih pantai, mengurangi penggunaan plastik sekali pakai, serta mengajak warga menjaga kebersihan pantai.', isCorrect: true },
        { key: 'B', text: 'Membagikan hiasan berbentuk penyu kepada seluruh siswa agar mereka lebih mengenal berbagai jenis penyu.', isCorrect: false },
        { key: 'C', text: 'Mengadakan lomba membuat miniatur penyu dari berbagai bahan bekas sebagai bentuk kepedulian lingkungan.', isCorrect: false },
        { key: 'D', text: 'Mengumpulkan cangkang hewan laut yang ditemukan di pantai untuk dijadikan hiasan di lingkungan sekolah.', isCorrect: false }
      ],
      feedback: '✅ Membersihkan pantai dan mengurangi penggunaan plastik membantu menjaga habitat penyu tetap bersih dan aman.'
    }
  ];

  const handleToggleFactor = (id) => {
    if (identSubmitted) return;
    setSelectedFactors(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Modul 3: Aspek Keterampilan
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Ancaman Kelestarian Penyu</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Latih keterampilan analisis masalah, analisis hubungan penyebab-dampak, dan tentukan aksi pertolongan terbaik.
        </p>
      </div>

      {/* SUB-MODULE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 max-w-2xl mx-auto">
        {[
          { id: 'identifikasi', label: '1. Identifikasi Masalah' },
          { id: 'analisis', label: '2. Analisis Penyebab-Dampak' },
          { id: 'aksi', label: '3. Rencana Aksi (5 Soal)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ISSUE IDENTIFICATION */}
      {activeTab === 'identifikasi' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-amber-400" />
              Identifikasi Masalah (Issue Identification)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Berdasarkan studi kasus penyu terdampar, menurutmu faktor apa saja yang mungkin menyebabkan penyu tersebut terdampar? 
              <strong className="text-amber-400"> (Pilih beberapa jawaban yang tepat!)</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {factorsList.map(item => {
              const isChecked = selectedFactors.includes(item.id);
              let cardStyle = 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-amber-500/40';

              if (identSubmitted) {
                if (item.isCorrect) cardStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                else if (isChecked && !item.isCorrect) cardStyle = 'bg-rose-950 border-rose-500 text-rose-200';
              } else if (isChecked) {
                cardStyle = 'bg-amber-950 border-amber-400 text-amber-200 font-bold';
              }

              return (
                <button
                  key={item.id}
                  disabled={identSubmitted}
                  onClick={() => handleToggleFactor(item.id)}
                  className={`p-4 rounded-xl text-xs text-left transition-all flex items-center justify-between border ${cardStyle}`}
                >
                  <span>{item.text}</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-600'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                </button>
              );
            })}
          </div>

          {identSubmitted ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-2">
              <span className="font-bold text-emerald-400 block">💡 Hasil Identifikasi:</span>
              <p>Faktor utama terdamparnya penyu secara kritis meliputi: sampah plastik, terlilit jaring/tali pancing, tabrakan kapal, laut tercemar, dan penyakit/cedera.</p>
            </div>
          ) : (
            <button
              disabled={selectedFactors.length === 0}
              onClick={() => setIdentSubmitted(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              Evaluasi Identifikasi Masalah
            </button>
          )}
        </div>
      )}

      {/* TAB 2: ISSUE ANALYSIS (PASANGAN) */}
      {activeTab === 'analisis' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-400" />
              Analisis Hubungan Penyebab $\rightarrow$ Dampak
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Jodohkanlah setiap faktor Penyebab (A–E) dengan Dampak yang sesuai (1–5).
            </p>
          </div>

          <div className="space-y-4">
            {causes.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <span className="text-sm font-bold text-amber-300">{c.text}</span>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {impacts.map(imp => {
                    const isSelected = matchedPairs[c.id] === imp.id;
                    const isCorrect = c.correctImpact === imp.id;

                    let btnStyle = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
                    if (analysisSubmitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-950 border border-emerald-500 text-emerald-200 font-bold';
                      else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950 border border-rose-500 text-rose-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-950 border border-amber-400 text-amber-200 font-bold';
                    }

                    return (
                      <button
                        key={imp.id}
                        disabled={analysisSubmitted}
                        onClick={() => setMatchedPairs(prev => ({ ...prev, [c.id]: imp.id }))}
                        className={`p-2.5 rounded-xl text-[11px] text-center transition-all ${btnStyle}`}
                      >
                        Opsi {imp.id}
                      </button>
                    );
                  })}
                </div>

                {analysisSubmitted && (
                  <p className="text-xs text-emerald-300 italic pt-1">
                    {c.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!analysisSubmitted && (
            <button
              disabled={Object.keys(matchedPairs).length < 5}
              onClick={() => setAnalysisSubmitted(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              Cek Pasangan Penyebab-Dampak
            </button>
          )}
        </div>
      )}

      {/* TAB 3: ACTION PLANNING (5 SOAL STUDI KASUS) */}
      {activeTab === 'aksi' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-400" />
              Action Planning (Studi Kasus 5 Soal Aksi Pertolongan)
            </h2>

            <div className="space-y-8">
              {actionQuestions.map(q => (
                <div key={q.id} className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                  <h4 className="text-sm font-bold text-slate-100 leading-relaxed">{q.scenario}</h4>

                  <div className="space-y-2">
                    {q.options.map(opt => {
                      const isSelected = actionAnswers[q.id] === opt.key;
                      let btnStyle = 'bg-slate-800 border-white/5 text-slate-300 hover:border-amber-500/30';

                      if (actionSubmitted) {
                        if (opt.isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                        else if (isSelected && !opt.isCorrect) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-950 border-amber-400 text-amber-200 font-bold';
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={actionSubmitted}
                          onClick={() => setActionAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                          className={`w-full p-3.5 rounded-xl text-xs text-left transition-all border flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-bold text-amber-400 shrink-0">{opt.key}.</span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {actionSubmitted && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{q.feedback}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!actionSubmitted && (
              <button
                disabled={Object.keys(actionAnswers).length < 5}
                onClick={() => setActionSubmitted(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-amber-500/20"
              >
                Kirim Evaluasi Rencana Aksi
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
