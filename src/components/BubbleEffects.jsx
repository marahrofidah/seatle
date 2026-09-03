import { useEffect, useRef, useState } from 'react';

const ambientBubbles = [
  { left: '6%', size: 14, duration: 8, delay: -2 },
  { left: '17%', size: 30, duration: 12, delay: -8 },
  { left: '31%', size: 18, duration: 9, delay: -4 },
  { left: '47%', size: 11, duration: 7, delay: -6 },
  { left: '62%', size: 34, duration: 13, delay: -10 },
  { left: '76%', size: 20, duration: 10, delay: -3 },
  { left: '89%', size: 26, duration: 11, delay: -7 },
  { left: '96%', size: 12, duration: 8, delay: -5 },
];

export default function BubbleEffects({ ambient = true }) {
  const [bursts, setBursts] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.button !== 0) return;
      if (event.target.closest('button, input, select, textarea, a, label, table, [data-no-bubbles]')) return;

      const id = nextId.current++;
      const particles = Array.from({ length: 12 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12 + (Math.random() - 0.5) * 0.3;
        const distance = 58 + Math.random() * 58;
        return {
          size: 10 + Math.random() * 24,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 42 - Math.random() * 38,
          delay: Math.random() * 110,
        };
      });
      const burst = { id, x: event.clientX, y: event.clientY, particles };

      setBursts((current) => [...current.slice(-7), burst]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== id));
      }, 1800);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes seatle-bubble-rise {
          0% { transform: translate3d(0, 12vh, 0) scale(.72); opacity: 0; }
          14%, 84% { opacity: .58; }
          50% { transform: translate3d(17px, -48vh, 0) scale(1); }
          100% { transform: translate3d(-10px, -112vh, 0) scale(1.08); opacity: 0; }
        }
        @keyframes seatle-bubble-burst {
          0% { transform: translate3d(-50%, -50%, 0) scale(.15); opacity: 0; }
          16% { opacity: 1; }
          72% { opacity: .85; }
          100% { transform: translate3d(calc(-50% + var(--bubble-x)), calc(-50% + var(--bubble-y)), 0) scale(1.12); opacity: 0; }
        }
        @keyframes seatle-water-ripple {
          0% { transform: translate(-50%, -50%) scale(.15); opacity: .9; border-width: 4px; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; border-width: 1px; }
        }
        @keyframes seatle-sparkle-pop {
          0%, 100% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
          35% { transform: translate(-50%, -50%) scale(1.2) rotate(35deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(.8) rotate(70deg); opacity: .7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .seatle-ambient-bubble { animation: none !important; }
          .seatle-click-burst { display: none; }
        }
      `}</style>

      {ambient && ambientBubbles.map((bubble, index) => (
        <span
          key={index}
          className="seatle-ambient-bubble absolute top-full rounded-full border border-white/70 bg-gradient-to-br from-white/40 via-cyan-100/10 to-transparent shadow-[inset_2px_2px_5px_rgba(255,255,255,.65),inset_-3px_-4px_7px_rgba(14,116,144,.13),0_0_10px_rgba(255,255,255,.2)]"
          style={{ left: bubble.left, width: bubble.size, height: bubble.size, animation: `seatle-bubble-rise ${bubble.duration}s linear ${bubble.delay}s infinite` }}
        />
      ))}

      {bursts.map((burst) => (
        <div key={burst.id} className="seatle-click-burst absolute" style={{ left: burst.x, top: burst.y }}>
          <span className="absolute h-16 w-16 rounded-full border-4 border-cyan-100/90 shadow-[0_0_24px_rgba(255,255,255,.75)]" style={{ animation: 'seatle-water-ripple .8s ease-out forwards' }} />
          <span className="absolute h-11 w-11 rounded-full border-2 border-white/80" style={{ animation: 'seatle-water-ripple .65s ease-out .1s forwards' }} />

          {burst.particles.map((bubble, index) => (
            <span
              key={index}
              className="absolute rounded-full border-2 border-white/90 bg-gradient-to-br from-white/45 via-cyan-100/20 to-sky-300/10 shadow-[inset_3px_3px_5px_rgba(255,255,255,.9),inset_-3px_-4px_7px_rgba(14,116,144,.2),0_0_13px_rgba(186,230,253,.8)]"
              style={{
                width: bubble.size,
                height: bubble.size,
                '--bubble-x': `${bubble.x}px`,
                '--bubble-y': `${bubble.y}px`,
                animation: `seatle-bubble-burst 1.35s cubic-bezier(.16,.8,.28,1) ${bubble.delay}ms forwards`,
              }}
            >
              <span className="absolute left-[20%] top-[16%] h-[24%] w-[24%] rounded-full bg-white/90" />
            </span>
          ))}

          <span className="absolute left-[-45px] top-[-54px] text-xl text-white drop-shadow-[0_0_7px_#fff]" style={{ animation: 'seatle-sparkle-pop .9s ease-out forwards' }}>✦</span>
          <span className="absolute left-[42px] top-[-28px] text-sm text-cyan-100 drop-shadow-[0_0_7px_#fff]" style={{ animation: 'seatle-sparkle-pop .8s ease-out .12s forwards' }}>✦</span>
          <span className="absolute left-[8px] top-[-82px] text-xs text-white drop-shadow-[0_0_6px_#fff]" style={{ animation: 'seatle-sparkle-pop .85s ease-out .2s forwards' }}>✦</span>
        </div>
      ))}
    </div>
  );
}
