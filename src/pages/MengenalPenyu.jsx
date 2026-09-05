import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Sparkles, 
  Waves, 
  Compass, 
  Shield, 
  Heart, 
  RotateCcw,
  Play,
  CircleAlert,
  Sun,
  Fish,
  Layers,
  Activity,
  Award
} from 'lucide-react';
import dashboardBackground from '../assets/images/tanpa_penyu.png';
import BubbleEffects from '../components/BubbleEffects';
import mengenalPenyuImg from '../assets/images/mengenal_penyu.png';

// Section Navigation Tabs
const SECTIONS = [
  { id: 'orientasi', title: '1. Orientasi Masalah' },
  { id: 'anatomi', title: '2. Anatomi Penyu' },
  { id: 'kuis', title: '3. Kuis Pemahaman' },
  { id: 'spesies', title: '4. 6 Spesies di Indonesia' },
  { id: 'siklus', title: '5. Siklus Hidup' },
  { id: 'funfact', title: '6. Fakta Unik' },
  { id: 'ekosistem', title: '7. Peran Ekosistem' },
];

// Opsi Hipotesis Masalah (Multi-select)
const HYPOTHESIS_OPTIONS = [
  'Sampah plastik di laut',
  'Terlilit jaring atau tali pancing',
  'Tertabrak kapal',
  'Laut yang tercemar',
  'Penyu sakit atau mengalami cedera',
  'Ombak besar',
  'Kehabisan tenaga setelah berenang jauh',
  'Belum tahu penyebabnya',
];

// Opsi Tindakan (Single select)
const ACTION_OPTIONS = [
  { 
    id: 'dorong', 
    text: 'Langsung mendorong penyu', 
    color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    dotColor: 'bg-emerald-400'
  },
  { 
    id: 'panggil', 
    text: 'Memanggil teman', 
    color: 'bg-amber-500 hover:bg-amber-600 text-white',
    dotColor: 'bg-amber-400'
  },
  { 
    id: 'lapor', 
    text: 'Melapor kepada petugas', 
    color: 'bg-sky-600 hover:bg-sky-700 text-white',
    dotColor: 'bg-sky-400'
  },
];

// Organ & Bagian Anatomi Penyu
const ORGANS = [
  {
    id: 'karapas',
    name: 'Karapas (Cangkang Atas)',
    description: 'Melindungi organ dalam sekaligus membuat bentuk tubuh streamline agar penyu lincah berenang di lautan.',
    badge: 'Pertahanan Utama'
  },
  {
    id: 'plastron',
    name: 'Plastron (Cangkang Bawah)',
    description: 'Melindungi bagian perut. Berbeda dari penyu darat yang keras dan kaku, plastron penyu laut cenderung lebih tipis dan fleksibel untuk memudahkan penyelaman.',
    badge: 'Pelindung Bawah'
  },
  {
    id: 'scutes',
    name: 'Scutes',
    description: 'Lempengan keratin keras yang melapisi dan melindungi karapas dari gesekan batu karang serta gigitan predator.',
    badge: 'Lapisan Keratin'
  },
  {
    id: 'marginal',
    name: 'Marginal & Inframarginal Scutes',
    description: 'Sisik di sepanjang tepi cangkang yang memperkuat dan mengunci struktur tempurung penyu.',
    badge: 'Tepi Cangkang'
  },
  {
    id: 'sirip_depan',
    name: 'Sirip Depan',
    description: 'Berfungsi sebagai pendorong utama saat berenang, layaknya kepakan sayap burung di dalam air laut.',
    badge: 'Propulsi Berenang'
  },
  {
    id: 'sirip_belakang',
    name: 'Sirip Belakang',
    description: 'Berfungsi sebagai kemudi arah dan penyeimbang saat berenang. Bagi penyu betina, sirip ini juga digunakan khusus untuk menggali lubang sarang telur di pasir pantai.',
    badge: 'Kemudi & Penggali'
  },
  {
    id: 'paruh',
    name: 'Paruh',
    description: 'Pengganti gigi yang keras dan tajam untuk memotong rumput laut, merobek ubur-ubur, kepiting, serta mengunyah makanan laut.',
    badge: 'Alat Makan'
  },
  {
    id: 'kelenjar_garam',
    name: 'Kelenjar Garam',
    description: 'Terletak di belakang mata untuk membuang kelebihan garam dari air laut yang tertelan. Efek sekresi garam ini membuat penyu tampak seperti sedang "menangis" saat bertelur di pantai.',
    badge: 'Osmoregulasi'
  },
  {
    id: 'sisik_kuku',
    name: 'Sisik & Kuku',
    description: 'Sisik melindungi kulit kepala dan wajah dari cedera, sedangkan kuku pada sirip membantu penyu merayap di darat saat bertelur dan mencengkeram pasir.',
    badge: 'Perlindungan & Cengkeram'
  },
];

// Soal Kuis Anatomi (3 Soal)
const QUIZ_QUESTIONS = [
  {
    id: 1,
    imageName: 'kuis_karapas.png',
    question: 'Perhatikan gambar! Bagian yang ditunjukkan adalah karapas. Apa fungsi bagian tersebut?',
    options: [
      { key: 'A', text: 'Membantu penyu menggali pasir' },
      { key: 'B', text: 'Melindungi organ dalam tubuh' },
      { key: 'C', text: 'Membantu penyu mencari makanan' },
      { key: 'D', text: 'Mengeluarkan kelebihan garam' },
    ],
    correctKey: 'B',
    explanation: 'Karapas adalah cangkang atas keras yang berfungsi melindungi organ dalam tubuh penyu dari ancaman pemangsa dan benturan.'
  },
  {
    id: 2,
    imageName: 'kuis_sirip_depan.png',
    question: 'Apa fungsi sirip depan pada penyu laut?',
    options: [
      { key: 'A', text: 'Untuk mengarahkan suara' },
      { key: 'B', text: 'Untuk menggali pasir' },
      { key: 'C', text: 'Untuk mendorong tubuh saat berenang' },
      { key: 'D', text: 'Untuk melindungi bagian perut' },
    ],
    correctKey: 'C',
    explanation: 'Sirip depan yang panjang dan kuat berfungsi sebagai pendorong utama (sayap renang) saat penyu menjelajahi samudera.'
  },
  {
    id: 3,
    imageName: 'kuis_kelenjar_garam.png',
    question: 'Mengapa penyu laut memiliki kelenjar garam?',
    options: [
      { key: 'A', text: 'Untuk membuang kelebihan garam dari tubuh' },
      { key: 'B', text: 'Untuk menyimpan air di dalam tubuh' },
      { key: 'C', text: 'Untuk membantu penyu bernapas di dalam air' },
      { key: 'D', text: 'Untuk membantu penyu memotong makanannya' },
    ],
    correctKey: 'A',
    explanation: 'Kelenjar garam di belakang mata membantu membuang kelebihan garam dari air laut agar tubuh penyu tidak mengalami dehidrasi osmotik.'
  },
];

// 6 Spesies Penyu di Indonesia
const TURTLE_SPECIES = [
  {
    number: 1,
    name: 'Penyu Hijau',
    latin: 'Chelonia mydas',
    imageName: 'penyu_hijau.png',
    habitat: 'Perairan dangkal, padang lamun, dan terumbu karang.',
    food: 'Lamun, Alga, dan Rumput Laut',
    status: 'Resiko Rendah (Least Concern/LC)',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    distribution: 'Kepulauan Derawan, Raja Ampat, Wakatobi, Karimunjawa, Bali, Nusa Tenggara, Sulawesi, Maluku, hingga Papua.'
  },
  {
    number: 2,
    name: 'Penyu Pipih',
    latin: 'Natator depressus',
    imageName: 'penyu_pipih.png',
    habitat: 'Perairan dangkal berpasir di dekat pantai.',
    food: 'Ubur-ubur, Pena Laut, dan Teripang',
    status: 'Data Kurang (Data Deficient/DD)',
    statusColor: 'bg-slate-100 text-slate-800 border-slate-300',
    distribution: 'Di Indonesia hanya ditemukan di perairan Laut Arafura dan pesisir selatan Papua.'
  },
  {
    number: 3,
    name: 'Penyu Belimbing',
    latin: 'Dermochelys coriacea',
    imageName: 'penyu_belimbing.png',
    habitat: 'Laut lepas dan samudra terbuka.',
    food: 'Ubur-ubur dan hewan bertubuh lunak',
    status: 'Rentan (Vulnerable/VU)',
    statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    distribution: 'Tersebar di Papua (Pantai Jamursba Medi), Maluku, Sulawesi, dan beberapa perairan Indonesia.'
  },
  {
    number: 4,
    name: 'Penyu Lekang',
    latin: 'Lepidochelys olivacea',
    imageName: 'penyu_lekang.png',
    habitat: 'Perairan pantai hingga laut lepas.',
    food: 'Alga, lobster, kepiting, tunikata, ubur-ubur, udang, ikan, dan telur ikan',
    status: 'Rentan (Vulnerable/VU)',
    statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    distribution: 'Pantai selatan Jawa, Bali, Nusa Tenggara, Sulawesi, Kalimantan, Sumatra, dan Papua.'
  },
  {
    number: 5,
    name: 'Penyu Tempayan',
    latin: 'Caretta caretta',
    imageName: 'penyu_tempayan.png',
    habitat: 'Laut lepas dan perairan pesisir.',
    food: 'Spons, karang, landak laut, cumi-cumi, bintang laut, dan bahkan serangga',
    status: 'Rentan (Vulnerable/VU)',
    statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    distribution: 'Jarang ditemukan di Indonesia. Tercatat di perairan Bali, Nusa Tenggara, Laut Banda, Sulawesi, dan Papua.'
  },
  {
    number: 6,
    name: 'Penyu Sisik',
    latin: 'Eretmochelys imbricata',
    imageName: 'penyu_sisik.png',
    habitat: 'Terumbu karang di perairan tropis.',
    food: 'Spons, anemon, karang lunak, landak laut, ubur-ubur, cumi-cumi, dan udang',
    status: 'Kritis (Critically Endangered/CR)',
    statusColor: 'bg-rose-100 text-rose-800 border-rose-300',
    distribution: 'Sumatra, Kepulauan Seribu, Karimunjawa, Bali, Nusa Tenggara, Sulawesi, Maluku, Raja Ampat, dan Papua.'
  },
];

// Siklus Hidup Penyu
const LIFE_CYCLES = [
  {
    stage: '1. TELUR',
    subtitle: 'Sarang di Pasir Pantai',
    imageName: 'siklus_telur.png',
    desc: 'Penyu betina naik ke pantai pada malam hari untuk membuat sarang dan bertelur di dalam pasir yang hangat. Setelah selesai menutup sarang, induk kembali ke laut dan telur akan menetas sekitar 45–60 hari kemudian.'
  },
  {
    stage: '2. TUKIK (BAYI PENYU)',
    subtitle: 'Menuju Samudera Luas',
    imageName: 'siklus_tukik.png',
    desc: 'Tukik adalah penyu yang baru menetas dari pasir. Setelah keluar dari sarang, tukik akan merangkak cepat menuju laut dengan mengikuti cahaya terang alami di cakrawala.'
  },
  {
    stage: '3. PENYU REMAJA (JUVENILE)',
    subtitle: 'Mengembara Mengikuti Arus',
    imageName: 'siklus_remaja.png',
    desc: 'Penyu remaja hidup di laut lepas selama bertahun-tahun (fase tahun-tahun yang hilang). Pada tahap ini penyu tumbuh lebih besar, mencari makan sendiri, dan mulai berpindah-pindah mengikuti arus samudera.'
  },
  {
    stage: '4. PENYU DEWASA',
    subtitle: 'Kematangan Reproduksi',
    imageName: 'siklus_dewasa.png',
    desc: 'Setelah berumur sekitar 15–30 tahun (tergantung jenisnya), penyu mencapai kematangan dan dapat berkembang biak. Penyu betina dewasa akan berenang kembali ke pantai tempat ia dulu menetas untuk bertelur.'
  },
];

// Fakta Unik
const FUN_FACTS = [
  {
    title: 'Berapa banyak telur yang dihasilkan?',
    content: 'Dalam satu kali bertelur, penyu dapat menghasilkan sekitar 50-100 butir telur, tergantung jenisnya. Penyu lekang dan penyu hijau biasanya menghasilkan sekitar 100 butir telur dalam satu sarang.'
  },
  {
    title: 'Seberapa sering penyu bertelur?',
    content: 'Sebagian besar spesies penyu bertelur setiap 2–3 tahun sekali. Khusus untuk penyu belimbing bertelur dalam interval yang lebih panjang yaitu setiap 8–12 tahun sekali.'
  },
  {
    title: 'Suhu Pasir Menentukan Jenis Kelamin',
    content: 'Jenis kelamin tukik dipengaruhi oleh suhu pasir saat telur dierami: suhu 26–29°C menghasilkan lebih banyak jantan, suhu 30°C jantan dan betina seimbang, sedangkan suhu 31–34°C menghasilkan lebih banyak betina.'
  },
  {
    title: 'Penyu Selalu Pulang ke Tempat Kelahiran',
    content: 'Penyu dewasa dapat kembali ke pantai tempat ia pertama kali menetas meski telah berenang ribuan kilometer. Penyu memiliki kemampuan mendeteksi medan magnet bumi sebagai "kompas alami" untuk menemukan jalan pulang.'
  },
];

// Peran dalam Ekosistem
const ECOSYSTEM_ROLES = [
  {
    title: '1. Matahari',
    imageName: 'ekosistem_matahari.png',
    desc: 'Matahari merupakan sumber energi utama bagi ekosistem laut. Cahaya matahari membantu lamun dan tumbuhan laut melakukan fotosintesis sehingga dapat tumbuh dengan baik.'
  },
  {
    title: '2. Penyu Laut',
    imageName: 'ekosistem_penyu.png',
    desc: 'Penyu laut berperan penting menjaga keseimbangan ekosistem laut. Setiap jenis penyu memiliki makanan berbeda sehingga membantu mengendalikan populasi berbagai organisme laut.'
  },
  {
    title: '3. Padang Lamun',
    imageName: 'ekosistem_lamun.png',
    desc: 'Padang lamun adalah tempat hidup dan mencari makan bagi banyak hewan laut, termasuk penyu hijau. Lamun yang dimakan dan dipangkas secara alami oleh penyu membuatnya tetap subur dan sehat.'
  },
  {
    title: '4. Terumbu Karang',
    imageName: 'ekosistem_karang.png',
    desc: 'Terumbu karang menjadi rumah bagi berbagai jenis ikan dan hewan laut. Penyu sisik membantu menjaga kesehatan terumbu karang dengan memakan spons laut yang dapat menutupi karang.'
  },
  {
    title: '5. Ubur-ubur',
    imageName: 'ekosistem_uburubur.png',
    desc: 'Ubur-ubur merupakan makanan utama penyu belimbing. Dengan memangsa ubur-ubur, penyu membantu mengontrol jumlah populasi ubur-ubur agar tidak memangsa larva ikan secara berlebihan.'
  },
  {
    title: '6. Hewan Dasar Laut',
    imageName: 'ekosistem_dasarlaut.png',
    desc: 'Kepiting, kerang, dan teripang hidup di dasar laut. Penyu lekang, penyu tempayan, dan penyu pipih memakan beberapa hewan dasar laut sehingga siklus rantai makanan dasar laut tetap seimbang.'
  },
  {
    title: '7. Ikan',
    imageName: 'ekosistem_ikan.png',
    desc: 'Banyak ikan hidup di sekitar padang lamun dan terumbu karang. Jika habitat lautnya terjaga sehat oleh kehadiran penyu, ikan dapat bertelur, tumbuh, dan berkembang biak dengan baik.'
  },
];

export default function MengenalPenyu({ onBack }) {
  // Navigation State
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Section 1 State: Video & Hypothesis
  const [selectedHypotheses, setSelectedHypotheses] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Section 2 State: Organ Exploration
  const [selectedOrganId, setSelectedOrganId] = useState(ORGANS[0].id);

  // Section 3 State: Quiz
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Toggle Hypothesis checkbox
  const toggleHypothesis = (option) => {
    if (selectedHypotheses.includes(option)) {
      setSelectedHypotheses(selectedHypotheses.filter((item) => item !== option));
    } else {
      setSelectedHypotheses([...selectedHypotheses, option]);
    }
  };

  // Handle Quiz Option Selection
  const handleSelectQuizOption = (questionId, optionKey) => {
    if (quizSubmitted) return;
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: optionKey,
    });
  };

  return (
    <main 
      className="relative min-h-screen overflow-x-hidden bg-sky-700 bg-cover bg-center bg-fixed text-sky-950 font-sans selection:bg-sky-500 selection:text-white pb-24"
      style={{ backgroundImage: `url(${dashboardBackground})` }}
    >
      <BubbleEffects />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-sky-300/10 via-sky-700/10 to-sky-950/40" />

      {/* DEFINISI SVG CLIP-PATH GELOMBANG ORGANIK RESMI SEATLE (SAMA DENGAN LOGIN & DASHBOARD) */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="mengenal-organic-wave" clipPathUnits="objectBoundingBox">
            <path d="M .075,.035 C .16,.005 .245,.075 .34,.045 C .43,.015 .515,.005 .605,.04 C .7,.075 .79,.005 .895,.03 C .96,.045 .99,.085 .985,.15 C .975,.225 1,.29 .985,.37 C .97,.45 1,.525 .985,.605 C .97,.69 1,.77 .975,.855 C .955,.925 .91,.97 .84,.975 C .755,.985 .68,.95 .59,.975 C .5,1 .42,.955 .33,.975 C .24,.995 .17,.955 .09,.97 C .035,.95 .015,.905 .02,.845 C .03,.77 .005,.7 .02,.62 C .035,.535 .005,.46 .02,.38 C .035,.295 .005,.225 .02,.145 C .025,.09 .045,.055 .075,.035 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* TOP HEADER */}
      <header className="relative z-20 mx-auto flex w-full max-w-[96%] sm:max-w-7xl items-center justify-between px-3 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-sky-900 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white cursor-pointer"
            aria-label="Kembali ke Dashboard"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          
          <div className="rounded-full border border-white/70 bg-white/85 px-7 py-3 shadow-lg backdrop-blur-md">
            <span className="font-brand text-lg sm:text-xl font-black text-sky-950 tracking-wide">
              Mengenal Penyu
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-white/70 bg-white/85 px-7 py-4 shadow-lg backdrop-blur-md">
          <span className="text-xs font-black text-sky-800">
            {activeSectionIndex + 1} / {SECTIONS.length}
          </span>
          <div className="h-4 w-28 rounded-full bg-sky-100 overflow-hidden border border-sky-200">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${((activeSectionIndex + 1) / SECTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>


      {/* MAIN CONTENT CONTAINER DENGAN PADDING LEGA */}
      <div className="relative z-10 mx-auto w-full max-w-[96%] sm:max-w-7xl px-3 sm:px-6">
        
        {/* ========================================================================= */}
        {/* 1. BAGIAN ORIENTASI & HIPOTESIS (VIDEO & REFLEKSI AWAL) */}
        {/* ========================================================================= */}
        {activeSectionIndex === 0 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Wavy Header Card */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4 py-2">
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Penyu Terdampar &amp; Pengamatan Awal
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed max-w-4xl">
                  Tontonlah video pengamatan berikut untuk mengamati kondisi penyu yang terdampar, lalu berikan hipotesismu mengenai penyebab serta tindakan yang tepat.
                </p>

                {/* VIDEO CONTAINER DENGAN GAP AMAN */}
                <div className="mt-6 overflow-hidden rounded-2xl border-4 border-sky-200 bg-slate-900 shadow-inner">
                  {videoUrl ? (
                    <div className="aspect-video w-full">
                      <iframe
                        src={videoUrl}
                        title="Video Penyu Terdampar"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative flex aspect-video w-full flex-col items-center justify-center p-8 text-center text-white bg-gradient-to-br from-sky-950 via-slate-900 to-sky-900">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/30 border-2 border-sky-400 text-sky-300 mb-3 shadow-lg">
                        <Play className="h-8 w-8 ml-1" />
                      </div>
                      <h2 className="font-brand text-lg sm:text-xl font-black text-sky-100">
                        Video Pembelajaran Penyu Terdampar
                      </h2>
                      <p className="mt-1 text-xs text-sky-300/90 max-w-md">
                        Area sematan video pembelajaran interaktif. Tautan video dapat disematkan di sini kapan saja.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* PERTANYAAN 1: HIPOTESIS PENYEBAB (MULTI-SELECT CHECKBOX) */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)] space-y-5">
              <div className="px-2 sm:px-4">
                <div className="flex items-start gap-3.5 mb-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-950 font-black font-brand text-base shadow-sm mt-0.5 border border-white">
                    1
                  </div>
                  <div>
                    <h2 className="font-brand text-base sm:text-lg md:text-xl font-black text-sky-950 leading-snug">
                      Kamu telah melihat kondisi penyu yang terdampar dan tampak lemah. Apa yang mungkin menyebabkan kondisi penyu tersebut?
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-sky-700 mt-1">
                      (Bisa pilih lebih dari satu jawaban - tidak ada benar atau salah karena masih tahap hipotesis)
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 pt-4 sm:grid-cols-2">
                  {HYPOTHESIS_OPTIONS.map((option, idx) => {
                    const isChecked = selectedHypotheses.includes(option);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleHypothesis(option)}
                        className={`flex items-center gap-3.5 rounded-2xl p-4 text-left text-xs sm:text-sm font-bold transition duration-200 cursor-pointer border ${
                          isChecked
                            ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-sm scale-[1.01]'
                            : 'bg-white/90 border-sky-200/80 text-sky-900 hover:bg-white shadow-sm'
                        }`}
                      >
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                          isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-sky-300 bg-white'
                        }`}>
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* PERTANYAAN 2: AKSI / TINDAKAN (SINGLE-SELECT) */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)] space-y-5">
              <div className="px-2 sm:px-4">
                <div className="flex items-start gap-3.5 mb-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-950 font-black font-brand text-base shadow-sm mt-0.5 border border-white">
                    2
                  </div>
                  <div>
                    <h2 className="font-brand text-base sm:text-lg md:text-xl font-black text-sky-950 leading-snug">
                      Jika kamu berada di tempat itu, apa yang akan kamu lakukan?
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-sky-700 mt-1">
                      Pilih satu respon tindakan yang menurutmu paling tepat.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3.5 pt-4 sm:grid-cols-3">
                  {ACTION_OPTIONS.map((action) => {
                    const isSelected = selectedAction === action.id;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => setSelectedAction(action.id)}
                        className={`flex flex-col items-center justify-center gap-2.5 rounded-2xl p-6 text-center transition duration-200 cursor-pointer border ${
                          isSelected
                            ? `${action.color} border-white shadow-lg scale-105`
                            : 'bg-white/90 border-sky-200 text-sky-950 hover:bg-white shadow-sm'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full ${action.dotColor} border border-white shadow-sm`} />
                        <span className="font-brand text-sm sm:text-base font-black leading-snug">{action.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback banner */}
                {(selectedHypotheses.length > 0 && selectedAction) && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5 text-emerald-950 mt-6 flex items-center gap-3.5 shadow-sm">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">
                      Bagus! Pilihan hipotesis dan tindakanmu telah tersimpan. Mari kita lanjutkan mempelajari struktur biologi dan organ tubuh penyu.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex(1)}
                    className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
                  >
                    <span>Lanjut: Biologi &amp; Anatomi Penyu</span>
                    <ArrowRight className="h-5 w-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. BAGIAN BIOLOGI & ANATOMI PENYU (INTERAKTIF ORGAN) */}
        {/* ========================================================================= */}
        {activeSectionIndex === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Pengetahuan Ekologi
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Biologi &amp; Anatomi Penyu Laut
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Pilih organ atau bagian tubuh penyu di bawah ini untuk mempelajari struktur serta fungsi luar biasanya.
                </p>
              </div>
            </section>

            {/* Interactive Anatomy Explorer */}
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              
              {/* Gambar Anatomi */}
              <section className="lg:col-span-6 relative bg-white/85 px-8 py-10 sm:px-10 sm:py-12 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)] flex flex-col items-center justify-center text-center">
                <div className="px-2 w-full flex flex-col items-center">
                  <span className="text-xs font-black uppercase text-sky-800 tracking-wider mb-3">
                    Struktur Anatomi Penyu Laut
                  </span>
                  
                  <div className="relative flex w-full items-center justify-center p-6 bg-sky-50/70 rounded-3xl border border-sky-200 shadow-inner">
                    <img 
                      src="/src/assets/images/anatomi_penyu.png" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = mengenalPenyuImg;
                      }}
                      alt="Anatomi Penyu Laut" 
                      className="max-h-80 w-full object-contain filter drop-shadow-md transition duration-300 hover:scale-105"
                    />
                  </div>

                  <p className="mt-4 text-xs font-bold text-sky-700">
                    Aset gambar: <code className="bg-sky-100 px-2 py-0.5 rounded text-sky-900 font-mono">anatomi_penyu.png</code>
                  </p>
                </div>
              </section>

              {/* Organ Selector & Detail Card */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Organ Selector Buttons */}
                <section className="relative bg-white/85 px-8 py-8 sm:px-10 sm:py-10 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
                  <div className="px-2">
                    <h2 className="font-brand text-sm sm:text-base font-black text-sky-950 mb-3">
                      Klik Bagian / Organ Penyu:
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {ORGANS.map((organ) => {
                        const isSelected = selectedOrganId === organ.id;
                        return (
                          <button
                            key={organ.id}
                            type="button"
                            onClick={() => setSelectedOrganId(organ.id)}
                            className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-black transition duration-200 cursor-pointer border ${
                              isSelected
                                ? 'bg-sky-600 border-sky-700 text-white shadow-md scale-105'
                                : 'bg-white border-sky-200 text-sky-900 hover:bg-sky-100'
                            }`}
                          >
                            {organ.name.split(' (')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Active Organ Explanation Card */}
                {(() => {
                  const organ = ORGANS.find((o) => o.id === selectedOrganId) || ORGANS[0];
                  return (
                    <section className="relative bg-gradient-to-br from-white via-sky-50 to-amber-50 px-8 py-10 sm:px-12 sm:py-12 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] border border-white">
                      <div className="px-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200 pb-3 mb-4">
                          <h2 className="font-brand text-lg sm:text-xl md:text-2xl font-black text-sky-950">
                            {organ.name}
                          </h2>
                          <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black text-sky-800 border border-sky-200 shrink-0">
                            {organ.badge}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base font-bold text-sky-900 leading-relaxed">
                          {organ.description}
                        </p>
                      </div>
                    </section>
                  );
                })()}

              </div>
            </div>

            {/* Navigasi Bawah */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(0)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionIndex(2)}
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
              >
                <span>Lanjut: Kuis Pemahaman Anatomi</span>
                <ArrowRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. BAGIAN KUIS ANATOMI (3 SOAL) */}
        {/* ========================================================================= */}
        {activeSectionIndex === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Wavy Card Header */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Uji Pemahaman
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Kuis Mengenal Organ Tubuh Penyu
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Pilihlah satu jawaban yang paling tepat untuk masing-masing soal di bawah ini.
                </p>
              </div>
            </section>

            {/* List 3 Soal */}
            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedKey = quizAnswers[q.id];
                const isCorrect = selectedKey === q.correctKey;

                return (
                  <section 
                    key={q.id}
                    className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)] space-y-4"
                  >
                    <div className="px-2 sm:px-4">
                      <div className="flex items-start gap-3.5 mb-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white font-brand text-base font-black shadow-sm mt-0.5 border border-white">
                          {qIndex + 1}
                        </span>
                        <h2 className="font-brand text-base sm:text-lg md:text-xl font-black text-sky-950 leading-snug">
                          {q.question}
                        </h2>
                      </div>

                      {/* Placeholder gambar kuis */}
                      {q.imageName && (
                        <div className="my-4 flex flex-col items-center justify-center rounded-2xl bg-sky-50/80 p-5 border border-dashed border-sky-300">
                          <img 
                            src={`/src/assets/images/${q.imageName}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = mengenalPenyuImg;
                            }}
                            alt={q.question}
                            className="h-36 sm:h-44 object-contain filter drop-shadow-sm"
                          />
                          <span className="mt-2 text-xs font-bold text-sky-700">
                            Nama file gambar: <code className="bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-mono">{q.imageName}</code>
                          </span>
                        </div>
                      )}

                      {/* Option Choices */}
                      <div className="grid gap-3 pt-2 sm:grid-cols-2">
                        {q.options.map((opt) => {
                          const isThisSelected = selectedKey === opt.key;
                          let optionStyle = 'bg-white/90 border-sky-200 text-sky-950 hover:bg-white shadow-sm';

                          if (quizSubmitted) {
                            if (opt.key === q.correctKey) {
                              optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-md';
                            } else if (isThisSelected && !isCorrect) {
                              optionStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                            }
                          } else if (isThisSelected) {
                            optionStyle = 'bg-sky-600 border-sky-700 text-white shadow-md scale-[1.01]';
                          }

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectQuizOption(q.id, opt.key)}
                              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left text-xs sm:text-sm font-bold transition duration-150 cursor-pointer border ${optionStyle}`}
                            >
                              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                isThisSelected && !quizSubmitted
                                  ? 'bg-white text-sky-900'
                                  : 'bg-sky-100 text-sky-800'
                              }`}>
                                {opt.key}
                              </span>
                              <span className="leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Penjelasan jika sudah disubmit */}
                      {quizSubmitted && (
                        <div className={`mt-5 rounded-2xl p-4 sm:p-5 border text-xs sm:text-sm font-bold ${
                          isCorrect 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}>
                          <p className="font-brand font-black text-sm mb-1">
                            {isCorrect ? 'Jawaban Benar!' : 'Kunci Jawaban & Penjelasan:'}
                          </p>
                          <p className="leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Tombol Periksa Jawaban / Lanjut */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(1)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-3">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                    className={`flex items-center gap-2 rounded-full px-8 py-3.5 font-brand text-sm sm:text-base font-black shadow-lg border-2 border-white transition cursor-pointer ${
                      Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Periksa Jawaban Kuis</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-white px-6 py-3 font-brand text-xs sm:text-sm font-black text-sky-800 shadow hover:bg-sky-50 cursor-pointer border border-sky-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Ulangi Kuis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSectionIndex(3)}
                      className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
                    >
                      <span>Lanjut: 6 Spesies Penyu Indonesia</span>
                      <ArrowRight className="h-5 w-5 stroke-[3]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BAGIAN 6 SPESIES PENYU LAUT DI INDONESIA */}
        {/* ========================================================================= */}
        {activeSectionIndex === 3 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Keanekaragaman Hayati
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  6 Spesies Penyu Laut di Indonesia
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Dari 7 spesies penyu laut yang ada di dunia, 6 di antaranya berenang, mencari makan, dan bertelur di perairan Nusantara Indonesia.
                </p>
              </div>
            </section>

            {/* 6 Grid Species Cards dengan padding lega */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TURTLE_SPECIES.map((turtle) => (
                <section 
                  key={turtle.number}
                  className="relative flex flex-col justify-between overflow-hidden bg-white/90 px-8 py-10 sm:px-9 sm:py-11 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_18px_32px_rgba(7,89,133,.2))] [backdrop-filter:blur(20px)] transition duration-300 hover:-translate-y-1.5"
                >
                  <div className="px-1">
                    {/* Gambar Spesies */}
                    <div className="relative mb-4 flex h-44 w-full items-center justify-center rounded-2xl bg-sky-50/80 p-4 border border-sky-100 shadow-inner">
                      <img 
                        src={`/src/assets/images/${turtle.imageName}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = mengenalPenyuImg;
                        }}
                        alt={turtle.name}
                        className="h-full object-contain filter drop-shadow-md transition duration-300 hover:scale-105"
                      />
                      <span className="absolute left-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-brand text-xs font-black text-amber-950 shadow-sm border border-white">
                        {turtle.number}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono font-bold text-sky-600 mb-2">
                      Aset: <code>{turtle.imageName}</code>
                    </p>

                    <h2 className="font-brand text-xl sm:text-2xl font-black text-sky-950">
                      {turtle.name}
                    </h2>
                    <p className="text-xs sm:text-sm italic font-bold text-sky-700 mb-4">
                      {turtle.latin}
                    </p>

                    <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-sky-900">
                      <div>
                        <span className="font-black text-sky-950">Habitat: </span>
                        {turtle.habitat}
                      </div>
                      <div>
                        <span className="font-black text-sky-950">Makanan: </span>
                        {turtle.food}
                      </div>
                      <div>
                        <span className="font-black text-sky-950">Persebaran: </span>
                        {turtle.distribution}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-sky-100 px-1">
                    <span className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-black border ${turtle.statusColor}`}>
                      Status: {turtle.status}
                    </span>
                  </div>
                </section>
              ))}
            </div>

            {/* Navigasi Bawah */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(2)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionIndex(4)}
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
              >
                <span>Lanjut: Siklus Hidup Penyu</span>
                <ArrowRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. BAGIAN SIKLUS HIDUP PENYU LAUT */}
        {/* ========================================================================= */}
        {activeSectionIndex === 4 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Daur Hidup
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Siklus Hidup Penyu Laut
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Penyu laut memiliki perjalanan hidup yang menakjubkan, mulai dari butiran telur di pasir pantai hingga dewasa dan berenang ribuan kilometer.
                </p>
              </div>
            </section>

            {/* 4 Tahap Siklus Hidup */}
            <div className="grid gap-6 md:grid-cols-2">
              {LIFE_CYCLES.map((cycle, idx) => (
                <section 
                  key={idx}
                  className="relative flex flex-col justify-between overflow-hidden bg-white/90 px-8 py-10 sm:px-10 sm:py-11 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_18px_32px_rgba(7,89,133,.2))] [backdrop-filter:blur(20px)]"
                >
                  <div className="px-1">
                    {/* Gambar Tahap */}
                    <div className="relative mb-4 flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-sky-50 to-amber-50 p-4 border border-sky-200 shadow-inner">
                      <img 
                        src={`/src/assets/images/${cycle.imageName}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = mengenalPenyuImg;
                        }}
                        alt={cycle.stage}
                        className="h-full object-contain filter drop-shadow-md transition duration-300 hover:scale-105"
                      />
                    </div>

                    <p className="text-[11px] font-mono font-bold text-sky-600 mb-2">
                      Aset gambar: <code>{cycle.imageName}</code>
                    </p>

                    <h2 className="font-brand text-xl sm:text-2xl font-black text-sky-950">
                      {cycle.stage}
                    </h2>
                    <span className="inline-block rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black text-sky-800 mt-1 mb-3 border border-sky-200">
                      {cycle.subtitle}
                    </span>

                    <p className="text-xs sm:text-sm font-bold text-sky-900 leading-relaxed">
                      {cycle.desc}
                    </p>
                  </div>
                </section>
              ))}
            </div>

            {/* Navigasi Bawah */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(3)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionIndex(5)}
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
              >
                <span>Lanjut: Fakta Unik Penyu</span>
                <ArrowRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. BAGIAN FUN FACT PENYU */}
        {/* ========================================================================= */}
        {activeSectionIndex === 5 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Tahukah Kamu?
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Fakta Unik Dunia Penyu
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Temukan keajaiban adaptasi dan perilaku unik yang dimiliki oleh penyu laut sepanjang hidupnya.
                </p>
              </div>
            </section>

            {/* 4 Cards Fun Fact */}
            <div className="grid gap-6 sm:grid-cols-2">
              {FUN_FACTS.map((fact, idx) => (
                <section 
                  key={idx}
                  className="relative overflow-hidden bg-white/90 px-8 py-10 sm:px-10 sm:py-11 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_18px_32px_rgba(7,89,133,.2))] [backdrop-filter:blur(20px)] space-y-3.5"
                >
                  <div className="px-1">
                    <div className="flex items-center gap-3.5 mb-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 font-brand text-lg font-black text-amber-950 shadow-sm border border-white">
                        {idx + 1}
                      </span>
                      <h2 className="font-brand text-base sm:text-lg font-black text-sky-950 leading-snug">
                        {fact.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-sky-900 leading-relaxed pl-1">
                      {fact.content}
                    </p>
                  </div>
                </section>
              ))}
            </div>

            {/* Navigasi Bawah */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(4)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSectionIndex(6)}
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
              >
                <span>Lanjut: Peran dalam Ekosistem</span>
                <ArrowRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. BAGIAN PERAN PENYU DALAM EKOSISTEM */}
        {/* ========================================================================= */}
        {activeSectionIndex === 6 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <section className="relative bg-white/85 px-8 py-10 sm:px-14 sm:py-12 md:px-16 md:py-14 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_20px_35px_rgba(7,89,133,.25))] [backdrop-filter:blur(20px)_saturate(115%)]">
              <div className="px-2 sm:px-4">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-wider mb-2">
                  Keseimbangan Samudra
                </span>
                <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black text-sky-950">
                  Peran Penyu dalam Ekosistem Laut
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-800 leading-relaxed">
                  Penyu adalah spesies kunci (keystone species) yang menghubungkan dan menjaga keseimbangan kehidupan di terumbu karang, padang lamun, dan lautan lepas.
                </p>
              </div>
            </section>

            {/* 7 Hubungan Ekosistem Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ECOSYSTEM_ROLES.map((item, idx) => (
                <section 
                  key={idx}
                  className="relative flex flex-col justify-between overflow-hidden bg-white/90 px-8 py-10 sm:px-9 sm:py-11 shadow-lg [clip-path:url(#mengenal-organic-wave)] [filter:drop-shadow(0_18px_32px_rgba(7,89,133,.2))] [backdrop-filter:blur(20px)]"
                >
                  <div className="px-1">
                    <div className="flex items-center gap-3.5 mb-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 font-brand text-xs font-black text-white shadow-sm border border-white">
                        {idx + 1}
                      </span>
                      <h2 className="font-brand text-base sm:text-lg font-black text-sky-950">
                        {item.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-sky-900 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-sky-100 text-[11px] font-mono text-sky-600 px-1">
                    Aset: <code>{item.imageName}</code>
                  </div>
                </section>
              ))}
            </div>

            {/* Selesai Modul Banner */}
            <section className="relative bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 px-8 py-12 sm:px-14 sm:py-14 text-white shadow-xl [clip-path:url(#mengenal-organic-wave)] text-center space-y-4">
              <div className="px-2 max-w-2xl mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 border-2 border-white backdrop-blur-md shadow-lg mb-2">
                  <Award className="h-8 w-8 text-amber-300" />
                </div>
                <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl font-black">
                  Selamat! Kamu Telah Menyelesaikan Modul Mengenal Penyu
                </h2>
                <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-sky-100 leading-relaxed">
                  Kamu telah mempelajari pengamatan, biologi, spesies, daur hidup, dan peran ekosistem penyu. Mari kembali ke peta petualangan untuk melanjutkan misi berikutnya!
                </p>
                
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={onBack}
                    className="rounded-full bg-yellow-400 px-9 py-4 font-brand text-sm sm:text-base font-black text-amber-950 shadow-lg border-2 border-white hover:scale-105 transition cursor-pointer"
                  >
                    Kembali ke Peta Petualangan
                  </button>
                </div>
              </div>
            </section>

            {/* Navigasi Bawah */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSectionIndex(5)}
                className="flex items-center gap-2 rounded-full bg-white/85 px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-white transition cursor-pointer border border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 rounded-full bg-white px-7 py-3 font-brand text-xs sm:text-sm font-black text-sky-900 shadow hover:bg-sky-50 transition cursor-pointer border border-sky-200"
              >
                <span>Kembali ke Dashboard</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
