import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Compass, 
  Thermometer, 
  Zap, 
  RefreshCw,
  Sun,
  Shield,
  Layers,
  Search,
  Sparkles,
  Info
} from 'lucide-react';

export default function MengenalPenyu() {
  const [activeTab, setActiveTab] = useState('anatomi');

  // State untuk Anatomi Interaktif
  const [selectedOrgan, setSelectedOrgan] = useState('karapas');

  // State untuk Kuis Biologi
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // State untuk Temperature Sex Calculator (Fun Facts)
  const [temp, setTemp] = useState(30);

  // State untuk Filter Species
  const [speciesSearch, setSpeciesSearch] = useState('');

  // DATA ANATOMI PENYU
  const anatomyData = {
    karapas: {
      title: 'Karapas (Cangkang Atas)',
      desc: 'Melindungi organ dalam sekaligus membuat bentuk tubuh streamline agar penyu lincah berenang di dalam air.',
      badge: 'Pelindung Utama'
    },
    plastron: {
      title: 'Plastron (Cangkang Bawah)',
      desc: 'Melindungi bagian perut. Berbeda dari penyu darat yang keras dan kaku, plastron penyu laut cenderung lebih tipis dan fleksibel untuk pernapasan.',
      badge: 'Pelindung Perut'
    },
    scutes: {
      title: 'Scutes (Sisik Cangkang)',
      desc: 'Lempengan keratin keras (seperti bahan kuku manusia) yang melapisi dan melindungi karapas dari kerusakan mekanis.',
      badge: 'Lapisan Keratin'
    },
    marginal: {
      title: 'Marginal & Inframarginal Scutes',
      desc: 'Sisik di sepanjang tepi cangkang yang memperkuat struktur tempurung dan memberikan batas yang kokoh.',
      badge: 'Sisik Pinggir'
    },
    sirip_depan: {
      title: 'Sirip Depan (Flippers)',
      desc: 'Berfungsi sebagai pendorong utama saat berenang, layaknya kepakan sayap burung di dalam air.',
      badge: 'Pendorong Utama'
    },
    sirip_belakang: {
      title: 'Sirip Belakang',
      desc: 'Berfungsi sebagai kemudi arah dan penyeimbang. Bagi penyu betina, sirip ini juga digunakan untuk menggali sarang di pasir.',
      badge: 'Kemudi & Penggali'
    },
    paruh: {
      title: 'Paruh (Beak)',
      desc: 'Pengganti gigi yang keras dan tajam untuk memotong serta merobek makanan seperti ubur-ubur, rumput laut, dan kepiting.',
      badge: 'Pemotong Makanan'
    },
    kelenjar_garam: {
      title: 'Kelenjar Garam',
      desc: 'Terletak di belakang mata untuk membuang kelebihan garam dari tubuh. Efek sekresinya membuat penyu tampak seperti "menangis" di darat.',
      badge: 'Osmoregulasi'
    },
    sisik_kuku: {
      title: 'Sisik Kepala & Kuku Sirip',
      desc: 'Sisik melindungi kulit kepala dan wajah, sedangkan kuku pada sirip membantu penyu merayap di darat dan menggali pasir saat bertelur.',
      badge: 'Perlindungan & Traksi'
    }
  };

  // DATA KUIS BIOLOGI (3 SOAL)
  const quizData = [
    {
      id: 1,
      question: '1. Perhatikan bagian cangkang atas penyu (Karapas). Apa fungsi utama bagian tersebut?',
      options: [
        'A. Membantu penyu menggali pasir',
        'B. Melindungi organ dalam tubuh',
        'C. Membantu penyu mencari makanan',
        'D. Mengeluarkan kelebihan garam'
      ],
      correct: 'B',
      explanation: 'B. Karapas berfungsi melindungi organ dalam tubuh penyu dari bahaya lingkungan dan predator.'
    },
    {
      id: 2,
      question: '2. Apa fungsi utama sirip depan pada penyu laut?',
      options: [
        'A. Untuk mengarahkan suara',
        'B. Untuk menggali pasir',
        'C. Untuk mendorong tubuh saat berenang',
        'D. Untuk melindungi bagian perut'
      ],
      correct: 'C',
      explanation: 'C. Sirip depan berbentuk seperti sayap yang membantu mendorong tubuh penyu saat berenang lincah di laut.'
    },
    {
      id: 3,
      question: '3. Mengapa penyu laut memiliki kelenjar garam di belakang matanya?',
      options: [
        'A. Untuk membuang kelebihan garam dari tubuh',
        'B. Untuk menyimpan air di dalam tubuh',
        'C. Untuk membantu penyu bernapas di dalam air',
        'D. Untuk membantu penyu memotong makanannya'
      ],
      correct: 'A',
      explanation: 'A. Kelenjar garam berfungsi penting membuang kelebihan kadar garam akibat minum air laut.'
    }
  ];

  // DATA 6 SPESIES PENYU
  const speciesList = [
    {
      name: 'Penyu Hijau',
      latin: 'Chelonia mydas',
      habitat: 'Perairan dangkal, padang lamun, dan terumbu karang.',
      food: 'Lamun, Alga, dan Rumput Laut',
      status: 'Risiko Rendah (Least Concern / LC)',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      region: 'Kepulauan Derawan, Raja Ampat, Wakatobi, Karimunjawa, Bali, Nusa Tenggara, Sulawesi, Maluku, hingga Papua'
    },
    {
      name: 'Penyu Pipih',
      latin: 'Natator depressus',
      habitat: 'Perairan dangkal berpasir di dekat pantai.',
      food: 'Ubur-ubur, Pena Laut, dan Teripang',
      status: 'Data Kurang (Data Deficient / DD)',
      statusColor: 'bg-slate-800 text-slate-300 border-slate-600',
      region: 'Di Indonesia hanya ditemukan di Laut Arafura dan pesisir selatan Papua'
    },
    {
      name: 'Penyu Belimbing',
      latin: 'Dermochelys coriacea',
      habitat: 'Laut lepas dan samudra terbuka.',
      food: 'Ubur-ubur dan hewan bertubuh lunak',
      status: 'Rentan (Vulnerable / VU)',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
      region: 'Tersebar di Papua, Maluku, Sulawesi, dan beberapa perairan Indonesia'
    },
    {
      name: 'Penyu Lekang',
      latin: 'Lepidochelys olivacea',
      habitat: 'Perairan pantai hingga laut lepas.',
      food: 'Alga, lobster, kepiting, tunikata, ubur-ubur, udang, ikan, dan telur ikan',
      status: 'Rentan (Vulnerable / VU)',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
      region: 'Pantai selatan Jawa, Bali, Nusa Tenggara, Sulawesi, Kalimantan, Sumatra, dan Papua'
    },
    {
      name: 'Penyu Tempayan',
      latin: 'Caretta caretta',
      habitat: 'Laut lepas dan perairan pesisir.',
      food: 'Spons, karang, landak laut, cumi-cumi, bintang laut, dan serangga',
      status: 'Rentan (Vulnerable / VU)',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
      region: 'Jarang ditemukan di Indonesia. Tercatat di Bali, Nusa Tenggara, Laut Banda, Sulawesi, dan Papua'
    },
    {
      name: 'Penyu Sisik',
      latin: 'Eretmochelys imbricata',
      habitat: 'Terumbu karang di perairan tropis.',
      food: 'Spons, anemon, karang lunak, landak laut, ubur-ubur, cumi-cumi, dan udang',
      status: 'Kritis (Critically Endangered / CR)',
      statusColor: 'bg-rose-950 text-rose-300 border-rose-500/40',
      region: 'Sumatra, Kepulauan Seribu, Karimunjawa, Bali, Nusa Tenggara, Sulawesi, Maluku, Raja Ampat, dan Papua'
    }
  ];

  // DATA SIKLUS HIDUP
  const lifeCycle = [
    {
      stage: 'TELUR',
      desc: 'Penyu betina naik ke pantai pada malam hari untuk membuat sarang dan bertelur di dalam pasir. Setelah selesai, induk kembali ke laut dan telur menetas sekitar 45–60 hari kemudian.',
      icon: '🪺'
    },
    {
      stage: 'TUKIK (BAYI PENYU)',
      desc: 'Tukik adalah penyu yang baru menetas dari telur. Setelah keluar dari sarang pasir, tukik akan merangkak secara alami menuju laut mengikuti pantulan cahaya di cakrawala.',
      icon: '🐢'
    },
    {
      stage: 'PENYU REMAJA (JUVENILE)',
      desc: 'Penyu remaja hidup di laut lepas selama bertahun-tahun. Pada tahap ini penyu tumbuh lebih besar, mencari makan sendiri, dan mulai berpindah-pindah mengikuti arus laut.',
      icon: '🌊'
    },
    {
      stage: 'PENYU DEWASA',
      desc: 'Setelah berumur sekitar 15–30 tahun (tergantung jenisnya), penyu menjadi dewasa dan dapat berkembang biak. Penyu betina akan kembali ke pantai tempat ia menetas untuk bertelur.',
      icon: '👑'
    }
  ];

  // DATA EKOSISTEM LAUT
  const ecosystemRoles = [
    { name: 'Matahari', role: 'Sumber energi utama bagi ekosistem laut untuk fotosintesis lamun & alga.', icon: '☀️' },
    { name: 'Penyu Laut', role: 'Menjaga keseimbangan ekosistem dengan mengendalikan populasi organisme.', icon: '🐢' },
    { name: 'Padang Lamun', role: 'Tempat hidup & makan penyu hijau. Lamun yang sehat menjaga oksigen laut.', icon: '🌿' },
    { name: 'Terumbu Karang', role: 'Rumah ikan. Penyu sisik menjaga terumbu karang dengan memakan spons laut.', icon: '🪸' },
    { name: 'Ubur-ubur', role: 'Makanan utama penyu belimbing agar jumlah ubur-ubur tidak berlebihan.', icon: '🪼' },
    { name: 'Hewan Dasar Laut', role: 'Kepiting & kerang dikonsumsi penyu lekang & tempayan agar seimbang.', icon: '🦀' },
    { name: 'Ikan', role: 'Tumbuh dan berkembang subur di lingkungan padang lamun & karang yang sehat.', icon: '🐟' }
  ];

  const filteredSpecies = speciesList.filter(s => 
    s.name.toLowerCase().includes(speciesSearch.toLowerCase()) ||
    s.latin.toLowerCase().includes(speciesSearch.toLowerCase()) ||
    s.region.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  const getSexPrediction = (t) => {
    if (t < 30) return { title: 'Lebih Banyak JANTAN ♂️', desc: 'Suhu dingin (26–29°C) menghasilkan dominansi tukik jantan.' };
    if (t === 30) return { title: 'JANTAN & BETINA SEIMBANG ⚖️', desc: 'Suhu ideal 30°C menghasilkan perbandingan rasio kelamin seimbang.' };
    return { title: 'Lebih Banyak BETINA ♀️', desc: 'Suhu hangat (31–34°C) menghasilkan dominansi tukik betina.' };
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-teal-400" />
          Modul 2: Aspek Pengetahuan
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Mengenal Penyu Laut</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Pelajari biologi anatomi, 6 spesies di Indonesia, siklus hidup, fun facts menarik, dan peran ekosistem laut.
        </p>
      </div>

      {/* SUB-MODULE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 max-w-4xl mx-auto">
        {[
          { id: 'anatomi', label: 'Anatomi & Kuis' },
          { id: 'spesies', label: '6 Spesies Indonesia' },
          { id: 'siklus', label: 'Siklus Hidup' },
          { id: 'funfact', label: 'Fun Facts' },
          { id: 'ekosistem', label: 'Peran Ekosistem' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ANATOMI & KUIS BIOLOGI */}
      {activeTab === 'anatomi' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* ANATOMI INTERAKTIF */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              Biologi Penyu Laut - Diagram Anatomi Interaktif
            </h2>
            <p className="text-xs text-slate-400 mb-6">Klik pada nama organ/bagian tubuh di bawah untuk melihat detail fungsi biolgisnya.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* ORGAN BUTTONS GRID */}
              <div className="space-y-2 lg:col-span-1">
                {Object.keys(anatomyData).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedOrgan(key)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                      selectedOrgan === key
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-cyan-500/30'
                    }`}
                  >
                    <span>{anatomyData[key].title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-400">
                      {anatomyData[key].badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* ORGAN DISPLAY CARD */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-8 border border-cyan-500/40 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Shield className="w-48 h-48 text-cyan-400" />
                </div>

                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                    {anatomyData[selectedOrgan].badge}
                  </span>
                  <h3 className="text-2xl font-black text-cyan-300">
                    {anatomyData[selectedOrgan].title}
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {anatomyData[selectedOrgan].desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Struktur morfologi ini beradaptasi penuh untuk kehidupan laut samudra.</span>
                </div>
              </div>

            </div>
          </div>

          {/* KUIS BIOLOGI (3 SOAL) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-teal-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-teal-400" />
                Kuis Uji Pemahaman Biologi Penyu
              </h2>
              {quizSubmitted && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ulangi Kuis
                </button>
              )}
            </div>

            <div className="space-y-6">
              {quizData.map(q => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100">{q.question}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map(opt => {
                      const optCode = opt.charAt(0);
                      const isSelected = quizAnswers[q.id] === optCode;
                      const isCorrect = optCode === q.correct;
                      
                      let btnStyle = 'bg-slate-800 border-white/5 text-slate-300 hover:border-cyan-500/30';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold';
                      }

                      return (
                        <button
                          key={optCode}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optCode }))}
                          className={`p-3 rounded-xl text-xs text-left transition-all border ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-500/30 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted && (
              <button
                disabled={Object.keys(quizAnswers).length < 3}
                onClick={() => setQuizSubmitted(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
              >
                Cek Jawaban Kuis
              </button>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: 6 SPESIES PENYU */}
      {activeTab === 'spesies' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">6 Spesies Penyu Laut di Indonesia</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari spesies atau wilayah..."
                value={speciesSearch}
                onChange={e => setSpeciesSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecies.map((s, idx) => (
              <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 space-y-4 border border-cyan-500/20 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">#0{idx + 1} Spesies</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{s.name}</h3>
                    <p className="text-xs italic text-teal-300 font-medium">{s.latin}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <p><strong className="text-slate-100">🌊 Habitat:</strong> {s.habitat}</p>
                    <p><strong className="text-slate-100">🌿 Makanan:</strong> {s.food}</p>
                    <p><strong className="text-slate-100">📍 Persebaran:</strong> {s.region}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                  Dilindungi UU No. 5 Tahun 1990
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: SIKLUS HIDUP */}
      {activeTab === 'siklus' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white">Siklus Hidup Penyu Laut</h2>
            <p className="text-xs text-slate-400">Perjalanan hidup penyu dari bertelur hingga dewasa dan kembali bertelur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifeCycle.map((stage, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 space-y-4 border border-cyan-500/20 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-2xl flex items-center justify-center shadow-lg">
                  {stage.icon}
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
                  Tahap {idx + 1}
                </span>

                <h3 className="text-lg font-bold text-white">{stage.stage}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FUN FACTS */}
      {activeTab === 'funfact' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* SIMULATOR SUHU PASIR */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">Simulator Suhu Pasir & Jenis Kelamin Tukik</h3>
                <p className="text-xs text-slate-400">Suhu eraman pasir saat telur berada di sarang menentukan jenis kelamin tukik!</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-300">Suhu Pasir Sarang:</span>
                  <span className="text-amber-400 text-lg">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="26"
                  max="34"
                  step="1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>26°C (Dingin)</span>
                  <span>30°C (Ideal)</span>
                  <span>34°C (Hangat)</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 text-center space-y-2">
                <span className="text-xl font-black text-amber-300 block">
                  {getSexPrediction(temp).title}
                </span>
                <p className="text-xs text-slate-300">
                  {getSexPrediction(temp).desc}
                </p>
              </div>
            </div>
          </div>

          {/* FUN FACTS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 space-y-3 border border-cyan-500/20">
              <span className="text-3xl">🪺</span>
              <h4 className="text-lg font-bold text-white">Banyaknya Telur</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dalam sekali bertelur, penyu menghasilkan 50–100 butir telur. Penyu lekang & hijau menghasilkan sekitar 100 butir.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3 border border-cyan-500/20">
              <span className="text-3xl">⏳</span>
              <h4 className="text-lg font-bold text-white">Frekuensi Bertelur</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sebagian besar penyu bertelur setiap 2–3 tahun sekali, sedangkan penyu belimbing bertelur setiap 8–12 tahun sekali.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3 border border-cyan-500/20">
              <span className="text-3xl">🧲</span>
              <h4 className="text-lg font-bold text-white">Penyu Selalu Pulang</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Penyu menggunakan medan magnet bumi sebagai "kompas" navigasi untuk kembali ke pantai tempat ia menetas bertahun-tahun lalu.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: PERAN EKOSISTEM */}
      {activeTab === 'ekosistem' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white">Peran Penyu dalam Ekosistem Laut</h2>
            <p className="text-xs text-slate-400">Setiap organisme di laut memiliki hubungan saling bergantung dalam menjaga keseimbangan samudra.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemRoles.map((role, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-emerald-500/20 space-y-3">
                <div className="text-3xl">{role.icon}</div>
                <h4 className="text-base font-bold text-emerald-300">{role.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{role.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
