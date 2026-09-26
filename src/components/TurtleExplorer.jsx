import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Search, Waves, X } from 'lucide-react';

export default function TurtleExplorer({ turtles }) {
  const [selected, setSelected] = useState(0);
  const [seen, setSeen] = useState([0]);
  const dialog = useRef(null);
  const picker = useRef(null);
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const [name, image] = turtles[selected];

  useLayoutEffect(() => {
    const list = picker.current;
    const button = list?.children[selected];
    if (!button || list.scrollWidth <= list.clientWidth) return;
    const offset = button.getBoundingClientRect().left - list.getBoundingClientRect().left;
    list.scrollTo({ left: list.scrollLeft + offset - (list.clientWidth - button.clientWidth) / 2, behavior: 'instant' });
  }, [selected]);

  function select(index) {
    const next = (index + turtles.length) % turtles.length;
    setSelected(next);
    setSeen(previous => previous.includes(next) ? previous : [...previous, next]);
  }

  return <div className="turtle-explorer">
    <div className="turtle-explorer-top"><span><Waves size={17} />Jelajahi sahabat laut</span><span>{seen.length}/{turtles.length} dilihat</span></div>
    <div className="turtle-stage" onTouchStart={event => {
      const touch = event.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      swiped.current = false;
    }} onTouchEnd={event => {
      const start = touchStart.current;
      touchStart.current = null;
      const touch = event.changedTouches[0];
      if (!start || !touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        swiped.current = true;
        select(selected + (dx < 0 ? 1 : -1));
      }
    }} onTouchCancel={() => { touchStart.current = null; }}>
      <span className="turtle-stage-ring" aria-hidden="true" />
      <span className="turtle-stage-number" aria-hidden="true">0{selected + 1}</span>
      <button className="turtle-stage-arrow turtle-stage-prev" onClick={() => select(selected - 1)} aria-label="Penyu sebelumnya"><ArrowLeft size={20} /></button>
      <button className="turtle-stage-image" aria-label={`Perbesar gambar ${name}`} onClick={() => {
        if (swiped.current) { swiped.current = false; return; }
        dialog.current?.showModal();
      }}><img key={image} src={image} alt={name} width="420" height="300" draggable="false" /><span><Search size={15} />Lihat lebih dekat</span></button>
      <button className="turtle-stage-arrow turtle-stage-next" onClick={() => select(selected + 1)} aria-label="Penyu berikutnya"><ArrowRight size={20} /></button>
      <div className="turtle-stage-title" aria-live="polite" aria-atomic="true"><span>PENYU {selected + 1} DARI {turtles.length}</span><h3>{name}</h3></div>
      <svg className="turtle-stage-wave" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 25Q75 0 150 25T300 25T450 25T600 25V60H0Z" fill="#ffffff55" /><path d="M0 45Q75 20 150 45T300 45T450 45T600 45V60H0Z" fill="#ffffff70" /></svg>
    </div>
    <p className="turtle-explorer-hint">Geser atau pilih penyu favoritmu.</p>
    <div ref={picker} className="turtle-picker" role="group" aria-label="Pilih jenis penyu">{turtles.map(([label, src], index) => <button key={label} className={selected === index ? 'is-selected' : ''} onClick={() => select(index)} aria-pressed={selected === index}>
      <img src={src} alt="" width="110" height="75" loading="lazy" />
      <span>{label}</span>{seen.includes(index) && <Check className="turtle-seen" size={13} aria-label="Sudah dilihat" />}
    </button>)}</div>
    <dialog ref={dialog} className="turtle-zoom" aria-label={`Gambar ${name}`} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <button onClick={() => dialog.current.close()} autoFocus aria-label="Tutup gambar"><X size={20} />Tutup</button><img src={image} alt={name} /><h3>{name}</h3>
    </dialog>
  </div>;
}
