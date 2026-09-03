import { ArrowRight } from 'lucide-react';
import bgSeatle from '../assets/images/bg_seatle.png';

const titleLetters = [
  { letter: 'S', color: '#fef08a', rotate: '-6deg' },
  { letter: 'E', color: '#ffffff', rotate: '4deg' },
  { letter: 'A', color: '#a7f3d0', rotate: '-3deg' },
  { letter: 'T', color: '#ffffff', rotate: '5deg' },
  { letter: 'L', color: '#bae6fd', rotate: '-5deg' },
  { letter: 'E', color: '#fef08a', rotate: '3deg' },
];

const bubbles = [
  { left: '5%', size: 18, duration: 8, delay: -2 },
  { left: '13%', size: 34, duration: 11, delay: -7 },
  { left: '24%', size: 12, duration: 7, delay: -4 },
  { left: '38%', size: 24, duration: 10, delay: -1 },
  { left: '51%', size: 15, duration: 8, delay: -6 },
  { left: '64%', size: 38, duration: 12, delay: -9 },
  { left: '73%', size: 19, duration: 9, delay: -3 },
  { left: '84%', size: 28, duration: 10, delay: -8 },
  { left: '94%', size: 13, duration: 7, delay: -5 },
];

export default function Home({ onStart }) {
  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none bg-sky-600"
      style={{
        backgroundImage: `url(${bgSeatle})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* SOFT OVERLAY FOR OPTIMAL READABILITY */}
      <div className="absolute inset-0 bg-sky-900/10 pointer-events-none" />

      <style>{`
        @keyframes playful-float {
          0%, 100% { transform: translateY(0) rotate(var(--letter-rotate)); }
          50% { transform: translateY(-8px) rotate(calc(var(--letter-rotate) * -0.45)); }
        }
        @keyframes bubble-rise {
          0% { transform: translate3d(0, 12vh, 0) scale(0.75); opacity: 0; }
          12% { opacity: 0.65; }
          50% { transform: translate3d(18px, -50vh, 0) scale(1); }
          88% { opacity: 0.55; }
          100% { transform: translate3d(-12px, -115vh, 0) scale(1.12); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .playful-letter, .background-bubble { animation: none !important; }
        }
      `}</style>

      {/* SOFT FLOATING BUBBLES */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        {bubbles.map((bubble, index) => (
          <span
            key={index}
            className="background-bubble absolute top-full rounded-full border border-white/60 bg-gradient-to-br from-white/45 via-cyan-100/15 to-transparent shadow-[inset_-3px_-4px_8px_rgba(14,116,144,0.16),inset_3px_3px_6px_rgba(255,255,255,0.55),0_0_12px_rgba(255,255,255,0.18)] backdrop-blur-[1px]"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animation: `bubble-rise ${bubble.duration}s ease-in ${bubble.delay}s infinite`,
            }}
          >
            <span className="absolute left-[22%] top-[18%] h-[22%] w-[22%] rounded-full bg-white/80 blur-[0.5px]" />
          </span>
        ))}
      </div>

      {/* HERO CONTENT: CENTERED ON MOBILE, LEFT-BALANCED ON LARGE SCREENS */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-2 py-8 text-center md:-translate-x-16 lg:-translate-x-28">

        {/* 2. PLAYFUL BOUNCY TITLE */}
        <div className="relative mb-5 mt-4 sm:mb-7 sm:mt-5">
          <span aria-hidden="true" className="absolute -left-4 -top-3 rotate-[-18deg] text-2xl text-yellow-200 drop-shadow-md sm:-left-9 sm:text-4xl">✦</span>
          <span aria-hidden="true" className="absolute -right-3 top-0 rotate-12 text-xl text-white drop-shadow-md sm:-right-8 sm:text-3xl">✦</span>
          <span aria-hidden="true" className="absolute -right-5 bottom-2 h-3 w-3 rounded-full border-2 border-cyan-100 sm:-right-10 sm:h-5 sm:w-5" />

          <h1 aria-label="SEATLE" className="flex items-end justify-center font-brand leading-none">
            {titleLetters.map(({ letter, color, rotate }, index) => (
              <span
                key={`${letter}-${index}`}
                aria-hidden="true"
                className="playful-letter inline-block cursor-default text-[3.8rem] font-black transition-[filter] duration-300 hover:brightness-110 sm:text-[6rem] md:text-[7.6rem] lg:text-[8.7rem]"
                style={{
                  '--letter-rotate': rotate,
                  color,
                  animation: `playful-float 2.8s ease-in-out ${index * 0.12}s infinite`,
                  WebkitTextStroke: '2px #075985',
                  textShadow: '0 3px 0 #38bdf8, 0 7px 0 #0284c7, 0 11px 0 #075985, 0 17px 18px rgba(7, 89, 133, 0.35)',
                }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <div className="mx-auto mt-4 h-2 w-4/5 rounded-full bg-sky-950/20 blur-sm sm:mt-6" />
        </div>

        {/* 3. SUBTITLES */}
        <div className="space-y-1 rounded-2xl">
          <h2 className="text-sky-950 font-black text-base sm:text-xl md:text-2xl tracking-wide drop-shadow-sm font-heading">
            Learn with Sea Turtle, Care for the Ocean
          </h2>
          
          <p className="text-sky-900 font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 font-sans">
            <span>Yuk kenali dan lindungi penyu laut bersama-sama</span>
          </p>
        </div>

        {/* 4. INTERACTIVE GOLDEN START BUTTON */}
        <div className="pt-5 sm:pt-7">
          <button
            onClick={onStart}
            className="group relative bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-amber-950 font-brand font-black text-xl sm:text-2xl px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.5)] border-4 border-yellow-100 flex items-center justify-center gap-4 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="tracking-wider drop-shadow-sm pl-2">START</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
          </button>
        </div>

      </div>

    </div>
  );
}
