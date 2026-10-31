import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Images, Sparkles } from 'lucide-react';
import { getPosterImage, getPosters, journalKey } from '../lib/actionJournal';
import { isSupabaseConfigured } from '../lib/supabase';
import background from '../assets/images/tanpa_penyu.webp';
import example from '../assets/images/poster.webp';
const importedImages = import.meta.glob('../assets/images/*.webp', { eager: true, query: '?url', import: 'default' });
const featuredImageNames = [
  'BERSIH BERSIH AREA KONSERVASI.webp', 'BSTC.webp', 'PELAPASAN TUKIK.webp',
  'PELEPASAN PENYU LEKANG.webp', 'PELEPASAN TUKIK.webp', 'PEMBERSIHAN KOLAM BUNDAR.webp',
  'PENANAMAN MANGROVE.webp', 'PENYU SEDANG BERTELUR.webp', 'TELUR PENYU LEKANG.webp',
  'TELUR TUKIK YANG MENETAS.webp', 'TUKIK DI KOLAM BUNDAR.webp',
  'TUKIK TERKENA PENYAKIT.webp', 'TUKIK_G.webp',
];
const featuredImages = featuredImageNames.map(name => ({
  id: `dokumentasi-${name}`,
  title: name === 'TUKIK_G.webp' ? 'Tukik' : name.replace(/\.webp$/i, '').replaceAll('_', ' ').toLowerCase().replace(/\b\p{L}/gu, letter => letter.toUpperCase()).replace(/^Bstc$/, 'BSTC'),
  image_url: importedImages[`../assets/images/${name}`],
})).filter(image => image.image_url);
import './AksiPeduli.css';
import './ActionIsland.css';
import './Gallery.css';

export default function Gallery({ onBack, onCreate }) {
  const [key] = useState(journalKey);
  const [posters, setPosters] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryRefresh, setGalleryRefresh] = useState(0);
  const [galleryError, setGalleryError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [board, setBoard] = useState('documentation');
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    Promise.resolve().then(async () => {
      if (!active) return;
      setGalleryLoading(true);
      setGalleryError('');
      try {
        const { items, warning, hasMore: more } = await getPosters(items => {
          if (active && items.length) setPosters(previous => mergePosters(previous, items));
        }, key, { page, signal: controller.signal });
        if (active) {
          setPosters(previous => page === 0 && !warning ? items : mergePosters(previous, items));
          setHasMore(more);
          setGalleryError(warning);
        }
      } catch (err) {
        if (active) setGalleryError(err.message);
      } finally {
        if (active) setGalleryLoading(false);
      }
    });
    return () => { active = false; controller.abort(); };
  }, [key, page, galleryRefresh]);

  function refreshGallery() {
    if (galleryLoading) return;
    setPage(0);
    setGalleryLoading(true);
    setGalleryRefresh(value => value + 1);
  }

  return <main className="action-ocean island-ocean gallery-page page-background" style={{ '--page-background': `url(${background})` }}>
    <div className="action-container">
      <header className="action-header"><button onClick={onBack} aria-label="Kembali ke halaman utama"><ArrowLeft size={20} /></button><span>Gallery Sahabat Penyu</span></header>
      <div className="island-content">
        <div className="gallery-board-tabs" role="tablist" aria-label="Pilih papan galeri">
          <button className={board === 'documentation' ? 'is-selected' : ''} type="button" role="tab" aria-selected={board === 'documentation'} onClick={() => setBoard('documentation')}>
            <span className="gallery-board-icon"><Camera size={23} /></span><span className="gallery-board-copy"><strong>Dokumentasi</strong><small>Keseruan kegiatan konservasi</small></span><span className="gallery-board-count">{featuredImages.length}</span>
          </button>
          <button className={board === 'posters' ? 'is-selected' : ''} type="button" role="tab" aria-selected={board === 'posters'} onClick={() => setBoard('posters')}>
            <span className="gallery-board-icon"><Images size={23} /></span><span className="gallery-board-copy"><strong>Poster kampanye</strong><small>Karya dan pesan para murid</small></span><span className="gallery-board-count">{posters.length}</span>
          </button>
        </div>
        <section className="action-panel action-gallery-panel" role="tabpanel">
          <div className="action-panel-heading"><div><h2>{board === 'documentation' ? 'Dokumentasi kegiatan' : 'Pesan untuk laut, dari kita.'}</h2><p>{board === 'documentation' ? 'Foto kegiatan konservasi penyu untuk dilihat bersama.' : 'Poster kampanye karya Sahabat Penyu. Klik poster untuk melihatnya lebih dekat.'}</p></div>{board === 'posters' && <button className="action-secondary" onClick={refreshGallery} disabled={galleryLoading}>{galleryLoading ? 'Memuat…' : 'Muat ulang'}</button>}</div>
          {board === 'posters' && <><p className="action-hint">{isSupabaseConfigured ? 'Galeri bersama Sahabat Penyu' : 'Karya tersimpan di browser yang kamu gunakan.'}</p>{galleryError && <p role="alert" className="action-error">{galleryError}</p>}</>}
          <div className={`action-gallery ${board === 'documentation' ? 'gallery-documentation' : 'gallery-posters'}`}>{board === 'documentation' ? featuredImages.map(image => <PosterCard key={image.id} poster={image} />) : <><PosterCard poster={{ title: 'Lindungi penyu, jaga rumahnya', authors: 'Inspirasi untuk karya kalian', image_url: example }} exampleCard />{posters.map(poster => <PosterCard key={poster.id} poster={poster} />)}</>}</div>
          {board === 'posters' && hasMore && !galleryError && <button className="action-secondary" disabled={galleryLoading} onClick={() => { setGalleryLoading(true); setPage(value => value + 1); }}>Lihat poster lainnya</button>}
          {board === 'posters' && galleryLoading && <p role="status" className="action-hint">Memuat poster dari galeri online...</p>}
          {board === 'posters' && posters.length === 0 && !galleryLoading && !galleryError && <div className="action-prompt"><Sparkles /><p>Masih ada tempat untuk pesan kalian.</p><button className="action-secondary" onClick={onCreate}>Pamerkan karya pertamamu<ArrowRight size={16} /></button></div>}
        </section>
      </div>
    </div>
  </main>;
}

function mergePosters(previous, next) {
  return [...new Map([...previous, ...next].map(poster => [poster.id, poster])).values()];
}

function safeImage(url) {
  return /^(data:image\/(jpeg|png|webp);base64,|https?:\/|\/)/.test(url || '') ? url : '';
}

function PosterCard({ poster, exampleCard = false }) {
  const dialog = useRef(null);
  const card = useRef(null);
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState('');
  const [imageError, setImageError] = useState('');
  const [retry, setRetry] = useState(0);
  const [open, setOpen] = useState(false);
  const image = safeImage(poster.image_url || source);

  useEffect(() => {
    if (!window.IntersectionObserver) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '100px' });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || poster.image_url) return;
    const controller = new AbortController();
    getPosterImage(poster.id, controller.signal).then(url => {
      if (controller.signal.aborted) return;
      if (!safeImage(url)) throw new Error('Format gambar tidak didukung.');
      setSource(url);
    }).catch(error => {
      if (!controller.signal.aborted) setImageError(error.message);
    });
    return () => controller.abort();
  }, [visible, poster.id, poster.image_url, retry]);

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  return <article ref={card} className="action-poster-card">
    <button onClick={() => setOpen(true)} disabled={!image || Boolean(imageError)} aria-label={`Perbesar poster ${poster.title}`}>
      {image && !imageError ? <img key={retry} src={image} alt={poster.title} loading="lazy" decoding="async" onError={() => setImageError('Gambar belum bisa dimuat.')} />
        : <div className="gallery-image-placeholder">{imageError ? 'Gambar belum termuat' : 'Memuat gambar...'}</div>}
      <span>{exampleCard ? 'Contoh poster' : poster.authors ? 'Karya Sahabat Penyu' : 'Dokumentasi'}</span>
    </button>
    <h3>{poster.title}</h3>{poster.authors && <p>{poster.authors}</p>}
    {imageError && <div className="gallery-image-error"><p role="status">{imageError}</p><button type="button" className="action-secondary" onClick={() => { setImageError(''); setRetry(value => value + 1); }}>Coba gambar lagi</button></div>}
    <dialog ref={dialog} className="action-lightbox" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <button className="action-secondary" onClick={() => dialog.current.close()} autoFocus>Tutup poster ?</button>
      {open && <img src={image} alt={poster.title} decoding="async" />}
      <h3>{poster.title}</h3>{poster.authors && <p>{poster.authors}</p>}
    </dialog>
  </article>;
}
