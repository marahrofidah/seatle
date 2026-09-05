import { useState } from 'react';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import dashboardBackground from '../assets/images/tanpa_penyu.png';
import mengenalPenyuImg from '../assets/images/mengenal_penyu.png';
import ancamanPenyuImg from '../assets/images/ancaman_penyu.png';
import peduliLingkunganImg from '../assets/images/peduli_lingkungan.png';
import aksiPeduliImg from '../assets/images/aksi_peduli.png';
import refleksiImg from '../assets/images/refleksi.png';
import glosariumImg from '../assets/images/glosarium.png';
import galleryImg from '../assets/images/gallery.png';
import BubbleEffects from '../components/BubbleEffects';

const logoLetters = [
  { letter: 'S', color: '#fef08a', rotate: '-5deg' },
  { letter: 'E', color: '#ffffff', rotate: '3deg' },
  { letter: 'A', color: '#a7f3d0', rotate: '-2deg' },
  { letter: 'T', color: '#ffffff', rotate: '4deg' },
  { letter: 'L', color: '#bae6fd', rotate: '-4deg' },
  { letter: 'E', color: '#fef08a', rotate: '2deg' },
];

// 5 POINT TUJUAN PEMBELAJARAN
const tujuanList = [
  'Menjelaskan karakteristik, jenis, dan siklus hidup penyu laut di Indonesia.',
  'Menjelaskan peran penyu dalam menjaga keseimbangan ekosistem laut.',
  'Menganalisis penyebab, dampak, dan solusi terhadap permasalahan yang mengancam kelestarian penyu laut.',
  'Menunjukkan sikap peduli terhadap pelestarian penyu dan lingkungan laut.',
  'Melakukan tindakan sederhana sebagai bentuk partisipasi dalam upaya konservasi penyu laut.',
];

// 4 MAP POINTS (POSISI MENEMPEL TEPAT PADA JALUR ALUR PETA)
const mapPoints = [
  { 
    number: 1, 
    title: 'Mengenal Penyu', 
    subtitle: 'Kenali jenis dan kehidupan penyu', 
    slug: 'mengenal-penyu', 
    position: 'left-[6%] top-[7.5%]',
    image: mengenalPenyuImg 
  },
  { 
    number: 2, 
    title: 'Ancaman Penyu', 
    subtitle: 'Cari tahu bahaya yang mereka hadapi', 
    slug: 'ancaman-penyu', 
    position: 'right-[6%] top-[28.5%]',
    image: ancamanPenyuImg 
  },
  { 
    number: 3, 
    title: 'Peduli Lingkungan', 
    subtitle: 'Belajar menjaga rumah para penyu', 
    slug: 'peduli-lingkungan', 
    position: 'left-[8%] top-[50%]',
    image: peduliLingkunganImg 
  },
  { 
    number: 4, 
    title: 'Aksi Peduli', 
    subtitle: 'Saatnya melakukan aksi nyata', 
    slug: 'aksi-peduli', 
    position: 'right-[8%] top-[71.5%]',
    image: aksiPeduliImg 
  },
];

// MENU DI BAWAH PETA
const extraMenus = [
  { 
    label: 'REFLEKSI', 
    description: 'Ceritakan hal baru yang telah kamu pelajari', 
    image: refleksiImg, 
    href: '#refleksi', 
  },
  { 
    label: 'GLOSARIUM', 
    description: 'Temukan daftar dan arti kata-kata penting', 
    image: glosariumImg, 
    href: '#glosarium', 
  },
  { 
    label: 'GALLERY', 
    description: 'Lihat koleksi foto keindahan dunia penyu', 
    image: galleryImg, 
    href: '#gallery', 
  },
];

export default function StudentDashboard({ onExit, onSelectModule }) {
  const [isTujuanOpen, setIsTujuanOpen] = useState(false);
  const studentName = sessionStorage.getItem('seatle_student_name') || 'Petualang';
  const studentClass = sessionStorage.getItem('seatle_student_class') || '-';

  return (
    <main 
      className="relative min-h-screen overflow-x-hidden bg-sky-700 bg-cover bg-center bg-fixed text-sky-950 font-sans selection:bg-sky-500 selection:text-white"
      style={{ backgroundImage: `url(${dashboardBackground})` }}
    >
      <BubbleEffects />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-sky-300/10 via-sky-700/10 to-sky-950/40" />

      {/* DEFINISI SVG CLIP-PATH GELOMBANG KARTU PERSIS SEPERTI CARD LOGIN */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="dashboard-wavy-card" clipPathUnits="objectBoundingBox">
            <path d="M .03,.04 C .12,.005 .25,.03 .38,.01 C .51,-0.01 .64,.035 .77,.01 C .88,.005 .96,.025 .985,.07 C .995,.18 .975,.32 .99,.45 C 1.005,.58 .98,.72 .985,.85 C .975,.93 .93,.985 .84,.98 C .72,.995 .59,.965 .46,.99 C .33,.97 .21,.995 .09,.97 C .03,.96 .005,.915 .01,.82 C .02,.69 -.005,.55 .01,.42 C .025,.29 -.005,.16 .01,.08 C .015,.05 .025,.04 .03,.04 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* HEADER SIMPEL & ELEGAN */}
      <header className="relative z-20 mx-auto flex w-full max-w-[96%] sm:max-w-7xl items-center justify-between px-2 py-4 sm:px-4">
        {/* LOGO SEATLE */}
        <div aria-label="SEATLE" className="flex items-end px-2 py-2 font-brand leading-none">
          {logoLetters.map(({ letter, color, rotate }, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              className="inline-block text-3xl font-black sm:text-4xl"
              style={{
                color,
                transform: `rotate(${rotate})`,
                WebkitTextStroke: '1px #075985',
                textShadow: '0 2px 0 #38bdf8, 0 4px 0 #0284c7, 0 7px 8px rgba(7,89,133,.3)',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* PROFILE BADGE DISAMPING NAMA & LOGOUT */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2.5 rounded-full border border-white/70 bg-white/85 px-4 py-2 shadow-lg backdrop-blur-md">
            <span className="text-xs sm:text-sm font-black text-sky-950 tracking-wide">{studentName}</span>
            <span className="text-[11px] font-extrabold text-sky-700 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200">
              Kelas {studentClass}
            </span>
          </div>

          <button 
            type="button" 
            onClick={onExit} 
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/85 text-sky-800 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-rose-600 cursor-pointer" 
            aria-label="Keluar"
            title="Keluar"
          >
            <LogOut className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* UTAMA CONTAINER */}
      <div className="relative z-10 mx-auto w-full max-w-[96%] sm:max-w-7xl px-2 pb-20 sm:px-4 space-y-10">
        
        {/* 1. KARTU TUJUAN PEMBELAJARAN */}
        <section 
          className="relative w-full mt-2 bg-white/85 text-sky-950 px-8 py-8 sm:px-14 sm:py-11 md:px-16 md:py-12 [clip-path:url(#dashboard-wavy-card)] [filter:drop-shadow(0_20px_30px_rgba(7,89,133,.3))] [backdrop-filter:blur(20px)_saturate(115%)]"
        >
          {/* HEADER DROPDOWN TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setIsTujuanOpen(!isTujuanOpen)}
            className="w-full flex items-center justify-between gap-4 cursor-pointer text-left focus:outline-none group py-1"
          >
            <h1 className="font-brand text-2xl font-black text-sky-950 sm:text-3xl group-hover:text-sky-700 transition-colors">
              Tujuan Pembelajaran
            </h1>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-sm border border-sky-200 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                {isTujuanOpen ? (
                  <ChevronUp className="h-6 w-6 stroke-[3]" />
                ) : (
                  <ChevronDown className="h-6 w-6 stroke-[3]" />
                )}
              </div>
            </div>
          </button>

          {/* CONTENT LIST DROPDOWN */}
          {isTujuanOpen && (
            <div className="space-y-4 pt-5 border-t border-sky-200/60 mt-4 pb-2">
              <p className="text-xs sm:text-sm font-bold text-sky-900 leading-relaxed">
                Setelah mempelajari website ini, peserta didik diharapkan mampu:
              </p>
              
              <ol className="space-y-3">
                {tujuanList.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 rounded-2xl bg-sky-50/90 p-3.5 sm:p-4 border border-sky-200/70 shadow-sm transition hover:bg-white">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white font-brand text-xs font-black shadow-sm mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-sky-950 leading-relaxed">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* 2. PETA POINT-TO-POINT (4 POIN JALUR PETUALANGAN) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-sm font-black tracking-wider text-sky-800 shadow-sm backdrop-blur-md font-heading">
              Jalur Petualangan
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-black text-white drop-shadow-md">
              Peta Dunia Penyu
            </h2>
          </div>

          {/* MAP CONTAINER */}
          <div 
            className="relative mx-auto h-[1050px] sm:h-[980px] w-full max-w-6xl bg-sky-900/30 p-6 sm:p-12 [clip-path:url(#dashboard-wavy-card)] [filter:drop-shadow(0_20px_40px_rgba(3,70,110,.4))] [backdrop-filter:blur(8px)] overflow-hidden"
          >
            
            {/* JALUR GARIS HUBUNG PETA (PERSISI MENGHUBUNGKAN DARI PENYU KE PENYU) */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="none" aria-hidden="true">
              <path 
                d="M 170 155 C 380 120, 630 200, 630 365 C 630 510, 210 430, 210 580 C 210 730, 610 650, 610 795" 
                fill="none" 
                stroke="rgba(255,255,255,.32)" 
                strokeWidth="16" 
                strokeLinecap="round" 
              />
              <path 
                d="M 170 155 C 380 120, 630 200, 630 365 C 630 510, 210 430, 210 580 C 210 730, 610 650, 610 795" 
                fill="none" 
                stroke="#fef08a" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
                strokeDasharray="6 14" 
              />
            </svg>

            {/* 4 MAP POINT NODES */}
            {mapPoints.map((point) => (
              <button 
                id={point.slug} 
                key={point.number} 
                type="button"
                onClick={() => {
                  if (onSelectModule) {
                    onSelectModule(point.slug);
                  }
                }}
                className={`group absolute z-20 flex w-[16rem] flex-col items-center transition-transform ${point.position} cursor-pointer focus:outline-none`}
              >
                {/* GAMBAR NODE IKON */}
                <div className="relative">
                  <div className="relative flex h-32 w-32 items-center justify-center transition duration-300 group-hover:-translate-y-2 group-hover:scale-110 sm:h-40 sm:w-40">
                    <img 
                      src={point.image} 
                      alt={point.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.4)]" 
                    />
                  </div>
                  {/* LENCANA ANGKA DENGAN JARAK PAS */}
                  <span className="absolute -right-2 -top-1 sm:-right-3 sm:-top-2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 font-brand text-base sm:text-xl font-black text-amber-950 shadow-[0_6px_14px_rgba(0,0,0,0.35)] border-3 border-white select-none transition duration-300 group-hover:scale-110">
                    {point.number}
                  </span>
                </div>

                {/* LABEL TEKS DENGAN WAVY CARD CLIP */}
                <div className="relative -mt-1 w-full bg-white/90 px-4 py-3 shadow-lg [clip-path:url(#dashboard-wavy-card)] [backdrop-filter:blur(10px)] transition group-hover:scale-105 text-center">
                  <h3 className="font-brand text-base font-black text-sky-950">{point.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-sky-700">{point.subtitle}</p>
                </div>
              </button>
            ))}

          </div>
        </section>

        {/* 3. MENU DI BAWAH: REFLEKSI, 7. GLOSARIUM, 8. GALLERY DENGAN TEPI GELOMBANG ORGANIK */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h2 className="font-brand text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              Sudut Eksplorasi
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {extraMenus.map(({ label, description, image, href }) => (
              <a 
                key={label} 
                href={href} 
                className="group relative flex flex-col items-center text-center overflow-hidden bg-white/85 px-6 py-8 shadow-lg [clip-path:url(#dashboard-wavy-card)] [filter:drop-shadow(0_12px_24px_rgba(7,89,133,.2))] [backdrop-filter:blur(15px)] transition duration-300 hover:-translate-y-1.5 hover:bg-white"
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center transition duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <img 
                    src={image} 
                    alt={label} 
                    className="h-full w-full object-contain filter drop-shadow-md" 
                  />
                </div>
                <h3 className="mt-4 font-brand text-lg sm:text-xl font-black text-sky-950">{label}</h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold leading-relaxed text-sky-800">{description}</p>
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
