import { ArrowLeft } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.png';

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

function RoleCard({ role, description, tone, onClick }) {
  const isStudent = tone === 'student';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex h-[17rem] w-full max-w-[17rem] flex-col overflow-hidden rounded-[2rem] border-[3px] bg-white/80 p-3 shadow-[0_16px_35px_rgba(7,89,133,0.24)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/90 sm:h-[19rem] sm:max-w-[18rem] ${isStudent ? 'border-amber-300' : 'border-emerald-300'}`}
    >
      {/* Empty image slot — turtle artwork will be added later */}
      <div className={`relative min-h-0 flex-1 rounded-[1.5rem] ${isStudent ? 'bg-gradient-to-b from-amber-50/90 to-amber-100/60' : 'bg-gradient-to-b from-emerald-50/90 to-emerald-100/60'}`}>
        <span className="absolute left-5 top-5 h-3 w-3 rounded-full border border-white/90 opacity-70" />
        <span className="absolute right-7 top-10 h-5 w-5 rounded-full border border-white/90 opacity-60" />
      </div>

      <div className={`relative z-10 -mt-3 rounded-full px-5 py-3 font-brand text-xl font-black tracking-wide shadow-lg transition-transform duration-300 group-hover:scale-105 sm:text-2xl ${isStudent ? 'bg-gradient-to-b from-yellow-300 to-amber-400 text-amber-950' : 'bg-gradient-to-b from-emerald-300 to-emerald-500 text-emerald-950'}`}>
        {role}
      </div>
      <p className="px-3 pb-1 pt-3 text-sm font-extrabold leading-snug text-sky-950 sm:text-base">
        {description}
      </p>
    </button>
  );
}

export default function Login({ onBack, onSelectRole }) {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-sky-600 bg-cover bg-center bg-no-repeat px-4 py-5 sm:px-6"
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

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-4xl flex-col items-center justify-center text-center">
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

        <div className="relative mb-6 mt-5 w-full max-w-sm sm:mt-7">
          <div className="absolute inset-x-1 top-1 h-full rounded-lg bg-amber-950/80" />
          <div className="relative rounded-lg border-y-2 border-amber-200/30 bg-gradient-to-b from-amber-600 to-amber-800 px-6 py-2 text-lg font-black text-amber-50 shadow-[0_6px_12px_rgba(69,26,3,.3)] sm:text-xl">
            Login Sebagai
          </div>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:gap-7">
          <RoleCard
            role="MURID"
            description={<>Belajar dan<br />jelajahi dunia penyu</>}
            tone="student"
            onClick={() => onSelectRole?.('murid')}
          />
          <RoleCard
            role="GURU"
            description={<>Kelola kelas dan<br />pantau pembelajaran</>}
            tone="teacher"
            onClick={() => onSelectRole?.('guru')}
          />
        </div>
      </div>
    </main>
  );
}
