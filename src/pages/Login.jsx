import { ArrowLeft } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.png';
import studentTurtle from '../assets/images/penyu_murid.png';
import teacherTurtle from '../assets/images/penyu_guru.png';
import BubbleEffects from '../components/BubbleEffects';

const bubbles = [
  { left: '7%', size: 18, duration: 8, delay: -3 },
  { left: '18%', size: 34, duration: 12, delay: -8 },
  { left: '34%', size: 14, duration: 9, delay: -5 },
  { left: '55%', size: 24, duration: 10, delay: -2 },
  { left: '72%', size: 38, duration: 13, delay: -10 },
  { left: '88%', size: 17, duration: 8, delay: -6 },
  { left: '96%', size: 27, duration: 11, delay: -4 },
];

const titleLetters = [
  { letter: 'S', color: '#fef08a', rotate: '-5deg' },
  { letter: 'E', color: '#ffffff', rotate: '3deg' },
  { letter: 'A', color: '#a7f3d0', rotate: '-2deg' },
  { letter: 'T', color: '#ffffff', rotate: '4deg' },
  { letter: 'L', color: '#bae6fd', rotate: '-4deg' },
  { letter: 'E', color: '#fef08a', rotate: '2deg' },
];

function RoleCard({ role, description, tone, image, onClick }) {
  const isStudent = tone === 'student';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full max-w-[19rem] rounded-[2.25rem] p-[3px] text-center shadow-[0_18px_38px_rgba(7,89,133,0.26)] transition-all duration-500 hover:-translate-y-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/90 ${isStudent ? 'bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-300 hover:-rotate-1' : 'bg-gradient-to-b from-emerald-200 via-emerald-400 to-cyan-300 hover:rotate-1'}`}
    >
      <BubbleEffects ambient={false} />
      {/* Empty image slot — turtle artwork will be added later */}
      <div className={`relative overflow-hidden rounded-[2.05rem] border-2 border-white/80 bg-white/90 pb-5 backdrop-blur-md ${isStudent ? 'shadow-[inset_0_0_30px_rgba(251,191,36,.12)]' : 'shadow-[inset_0_0_30px_rgba(52,211,153,.12)]'}`}>
        <div className={`relative m-2 h-[14rem] overflow-hidden rounded-[1.65rem] sm:h-[15rem] ${isStudent ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100' : 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-100'}`}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[18px] border-white/30" />
          <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full border-[20px] border-white/25" />
          <span className="absolute left-5 top-5 h-3 w-3 rounded-full border-2 border-white/90" />
          <span className="absolute right-6 top-12 h-5 w-5 rounded-full border-2 border-white/80" />
          <span className={`absolute bottom-0 left-1/2 h-32 w-40 -translate-x-1/2 rounded-full blur-2xl ${isStudent ? 'bg-yellow-300/30' : 'bg-emerald-300/30'}`} />
          <img src={image} alt={`Penyu ${role.toLowerCase()}`} className="absolute inset-x-0 -bottom-8 mx-auto h-[108%] w-[94%] object-contain object-bottom drop-shadow-[0_10px_8px_rgba(7,89,133,0.2)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105" />
        </div>

        <div className={`relative z-10 mx-3 -mt-7 overflow-hidden rounded-full border-2 border-white/80 px-5 py-3 font-brand text-2xl font-black tracking-[0.08em] shadow-[0_9px_16px_rgba(15,23,42,.18)] transition-transform duration-300 group-hover:scale-[1.04] ${isStudent ? 'bg-gradient-to-b from-yellow-300 via-amber-300 to-amber-400 text-amber-950' : 'bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 text-emerald-950'}`}>
          <span className="absolute inset-x-7 top-0 h-1/2 rounded-full bg-white/20" />
          <span className="relative">{role}</span>
        </div>
        <p className="px-5 pb-1 pt-4 text-sm font-extrabold leading-snug text-sky-950 sm:text-base">{description}</p>
      </div>
    </button>
  );
}

export default function Login({ onBack, onSelectRole }) {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden bg-sky-600 bg-cover bg-center bg-no-repeat px-4 py-5 sm:px-6"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-sky-950/10" />

      <style>{`
        @keyframes login-bubble-rise {
          0% { transform: translate3d(0, 15vh, 0) scale(.7); opacity: 0; }
          15%, 85% { opacity: .58; }
          50% { transform: translate3d(16px, -45vh, 0) scale(1); }
          100% { transform: translate3d(-8px, -105vh, 0) scale(.9); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-bubble { animation: none !important; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {bubbles.map((bubble, index) => (
          <span
            key={index}
            className="login-bubble absolute -bottom-12 rounded-full border border-white/70 bg-white/10 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.55),0_0_10px_rgba(186,230,253,0.3)]"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animation: `login-bubble-rise ${bubble.duration}s linear ${bubble.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/40 text-sky-950 shadow-lg backdrop-blur-md transition hover:-translate-x-1 hover:bg-white/65 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/80 sm:left-7 sm:top-6"
        aria-label="Kembali ke halaman utama"
      >
        <ArrowLeft className="h-6 w-6 stroke-[3]" />
      </button>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-4xl flex-col items-center justify-center py-5 text-center sm:py-3">
        <h1 aria-label="SEATLE" className="flex items-end justify-center font-brand leading-none">
          {titleLetters.map(({ letter, color, rotate }, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              className="inline-block text-5xl font-black sm:text-6xl md:text-7xl"
              style={{
                color,
                transform: `rotate(${rotate})`,
                WebkitTextStroke: '1.5px #075985',
                textShadow: '0 2px 0 #38bdf8, 0 5px 0 #0284c7, 0 8px 0 #075985, 0 12px 16px rgba(7,89,133,.3)',
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <div className="mt-4 sm:mt-5">
          <h2 className="font-brand text-base font-black tracking-wide text-sky-950 drop-shadow-sm sm:text-xl md:text-2xl">
            Learn with Sea Turtle, Care for the Ocean
          </h2>
          <p className="mt-1 text-xs font-bold text-sky-900 sm:text-sm md:text-base">
            Yuk kenali dan lindungi penyu laut bersama-sama
          </p>
        </div>

        <div className="relative mb-7 mt-5 w-full max-w-md sm:mt-7">
          <div className="absolute -bottom-2 inset-x-2 h-full rounded-xl bg-amber-950 shadow-[0_8px_16px_rgba(69,26,3,.35)]" />
          <div className="relative overflow-hidden rounded-xl border-x-2 border-t-2 border-amber-300/40 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 px-8 py-3 text-lg font-black text-amber-50 sm:text-xl">
            <span className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-950/45 shadow-inner" />
            <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-950/45 shadow-inner" />
            <span className="relative drop-shadow-sm">Login Sebagai</span>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-7 sm:flex-row sm:items-stretch sm:gap-5 md:gap-7">
          <RoleCard
            role="MURID"
            description={<>Belajar dan<br />jelajahi dunia penyu</>}
            tone="student"
            image={studentTurtle}
            onClick={() => onSelectRole?.('murid')}
          />
          <RoleCard
            role="GURU"
            description={<>Kelola kelas dan<br />pantau pembelajaran</>}
            tone="teacher"
            image={teacherTurtle}
            onClick={() => onSelectRole?.('guru')}
          />
        </div>
      </div>
    </main>
  );
}
