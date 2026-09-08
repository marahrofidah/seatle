import { useEffect, useRef, useState } from 'react';
import { causes, effects } from '../lib/threatActivities';

const compactEffects = [
  'Sulit berenang dan mudah terdampar.',
  'Menelan plastik yang dikira ubur-ubur.',
  'Luka atau patah tempurung.',
  'Habitat rusak, makanan berkurang.',
  'Lemah, tidak mampu kembali ke laut.',
];

export default function ThreatConnections({ matches, checked, locked, onChange, effectOrder }) {
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClick = useRef(false);
  const [selected, setSelected] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const board = boardRef.current;
    const measure = () => {
      const bounds = board.getBoundingClientRect();
      const points = (side) => Array.from(board.querySelectorAll(`[data-anchor="${side}"]`), (node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
      });
      setGeometry({ width: bounds.width, height: bounds.height, left: points('left'), right: Object.fromEntries(effectOrder.map((effect, position) => [effect, points('right')[position]])) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    measure();
    return () => observer.disconnect();
  }, [effectOrder]);

  function connect(cause, effect) {
    if (locked || cause === null) return;
    // Each effect can belong to only one cause. Reconnecting replaces the old line.
    const next = Object.fromEntries(Object.entries(matches).filter(([key, value]) => Number(key) !== cause && value !== effect));
    onChange({ ...next, [cause]: effect });
    setSelected(null);
  }

  function endDrag(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 6;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-effect]');
    if (moved && target && boardRef.current.contains(target)) connect(drag.cause, Number(target.dataset.effect));
    suppressClick.current = true;
    dragRef.current = null;
    setPointer(null);
  }

  const lineColor = (index) => checked ? matches[index] === causes[index].effect ? '#059669' : '#e11d48' : '#0284c7';
  const curve = (start, end) => {
    const bend = Math.max(20, Math.abs(end.x - start.x) * 0.45);
    return `M ${start.x} ${start.y} C ${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`;
  };

  return (
    <div className="mt-6">
      <p className="mb-5 text-sm font-bold text-sky-700">Tarik dari titik penyebab ke dampaknya, atau ketuk penyebab lalu dampak. Pilih ulang untuk mengganti pasangan.</p>
      <div className="mb-3 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 sm:grid-cols-2 text-xs font-black uppercase tracking-wide sm:tracking-widest text-sky-600 sm:gap-24"><span>Penyebab</span><span>Dampak</span></div>
      <div ref={boardRef} data-no-bubbles className="relative grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-8 sm:grid-cols-2 sm:gap-x-24">
        {geometry?.width > 0 && (
          <svg aria-hidden="true" width={geometry.width} height={geometry.height} className="pointer-events-none absolute inset-0 z-10 overflow-visible" viewBox={`0 0 ${geometry.width} ${geometry.height}`}>
            {Object.entries(matches).map(([cause, effect]) => geometry.left[cause] && geometry.right[effect] && (
              <path key={cause} d={curve(geometry.left[cause], geometry.right[effect])} fill="none" stroke={lineColor(Number(cause))} strokeWidth="4" strokeLinecap="round" />
            ))}
            {pointer && selected !== null && geometry.left[selected] && <path d={curve(geometry.left[selected], pointer)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />}
          </svg>
        )}
        <div className="grid auto-rows-fr gap-3 sm:gap-4">
          {causes.map((cause, index) => (
            <button key={cause.title} type="button" disabled={locked} aria-pressed={selected === index} aria-label={`${cause.title}${matches[index] !== undefined ? `, terhubung ke ${effects[matches[index]]}` : ', belum terhubung'}`} onClick={() => {
              if (suppressClick.current) { suppressClick.current = false; return; }
              setSelected(selected === index ? null : index);
            }} className={`relative min-h-28 min-w-0 rounded-xl border-2 px-2 py-3 text-left text-xs font-bold leading-snug sm:leading-relaxed focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400 sm:p-5 sm:text-sm ${selected === index ? 'border-amber-400 bg-amber-50' : 'border-sky-200 bg-sky-50'}`}>
              <span className="mb-1 block font-brand text-lg font-black text-sky-600">{String.fromCharCode(65 + index)}</span>{cause.title}
              <span data-anchor="left" onPointerDown={(event) => {
                if (locked || event.button !== 0) return;
                suppressClick.current = false;
                dragRef.current = { cause: index, x: event.clientX, y: event.clientY };
                setSelected(index);
                const rect = boardRef.current.getBoundingClientRect();
                setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                event.currentTarget.setPointerCapture(event.pointerId);
              }} onPointerMove={(event) => {
                if (!dragRef.current) return;
                const rect = boardRef.current.getBoundingClientRect();
                setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
              }} onPointerUp={endDrag} onPointerCancel={() => { dragRef.current = null; setPointer(null); }} className="absolute -right-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 touch-none items-center justify-center">
                <span className="h-5 w-5 rounded-full border-[3px] border-white shadow-md" style={{ backgroundColor: selected === index ? '#f59e0b' : matches[index] !== undefined ? lineColor(index) : '#0284c7' }} />
              </span>
            </button>
          ))}
        </div>
        <div className="grid auto-rows-fr gap-3 sm:gap-4">
          {effectOrder.map((index, position) => {
            const effect = effects[index];
            const owner = Object.keys(matches).find((key) => matches[key] === index);
            return (
              <button key={effect} type="button" data-effect={index} disabled={locked} aria-label={effect} onClick={() => connect(selected, index)} className="relative min-h-28 min-w-0 rounded-xl border-2 border-sky-200 bg-white px-2 py-3 text-left text-xs font-bold leading-snug sm:leading-relaxed focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400 sm:p-5 sm:text-sm">
                <span className="mb-1 block font-brand text-lg font-black text-sky-600">{position + 1}</span><span className="sm:hidden">{compactEffects[index]}</span><span className="hidden sm:inline">{effect}</span>
                <span data-anchor="right" className="absolute -left-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center"><span className="h-5 w-5 rounded-full border-[3px] border-white shadow-md" style={{ backgroundColor: owner !== undefined ? lineColor(Number(owner)) : '#94a3b8' }} /></span>
              </button>
            );
          })}
        </div>
      </div>
      <p aria-live="polite" className="mt-4 text-xs font-bold text-sky-700">{selected !== null ? `${causes[selected].title} dipilih. Pilih dampaknya di kanan.` : `${Object.keys(matches).length} dari 5 pasangan terhubung.`}</p>
      {checked && <div className="mt-5 space-y-3">{causes.map((cause, index) => <p key={cause.title} className={`border-l-4 p-3 text-sm font-bold ${matches[index] === cause.effect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-rose-400 bg-rose-50 text-rose-800'}`}>{String.fromCharCode(65 + index)}. {matches[index] === cause.effect ? `Benar. ${cause.explanation}` : 'Belum tepat. Coba hubungkan ke dampak yang lain.'}</p>)}</div>}
    </div>
  );
}
