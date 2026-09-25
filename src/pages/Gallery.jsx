import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { getPosters, journalKey } from '../lib/actionJournal';
import { isSupabaseConfigured } from '../lib/supabase';
import background from '../assets/images/tanpa_penyu.webp';
import example from '../assets/images/poster.jpg';
import './AksiPeduli.css';
import './ActionIsland.css';

export default function Gallery({ onBack, onCreate }) {
  const [key] = useState(journalKey);
  const [posters, setPosters] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryRefresh, setGalleryRefresh] = useState(0);
  const [galleryError, setGalleryError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (!active) return;
      setGalleryLoading(true);
      setGalleryError('');
      try {
        const { items, warning } = await getPosters(items => {
          if (active) setPosters(items);
        }, key);
        if (active) { setPosters(items); setGalleryError(warning); }
      } catch (err) {
        if (active) setGalleryError(err.message);
      } finally {
        if (active) setGalleryLoading(false);
      }
    });
    return () => { active = false; };
  }, [key, galleryRefresh]);

  function refreshGallery() {
    setGalleryLoading(true);
    setGalleryRefresh(value => value + 1);
  }

  return <main className="action-ocean island-ocean page-background" style={{ '--page-background': `url(${background})` }}>
    <div className="action-container">
      <header className="action-header"><button onClick={onBack} aria-label="Kembali ke halaman utama"><ArrowLeft size={20} /></button><span>Papan kampanye</span><small>GALERI KARYA</small></header>
      <div className="island-page-heading"><div><p className="action-kicker">GALERI SAHABAT PENYU</p><h1>Pesan baik untuk laut.</h1></div></div>
      <div className="island-content"><section className="action-panel action-gallery-panel"><div className="action-panel-heading"><div><h2>Pesan untuk laut, dari kita.</h2><p>Ajakan baik dari Sahabat Penyu, dipamerkan di papan kampanye pulau. Klik poster untuk melihatnya lebih dekat.</p></div><button className="action-secondary" onClick={refreshGallery} disabled={galleryLoading}>{galleryLoading ? 'Memuat…' : 'Muat ulang'}</button></div><p className="action-hint">{isSupabaseConfigured ? 'Galeri bersama Sahabat Penyu' : 'Galeri perangkat ini · Karya tersimpan di browser yang kamu gunakan.'}</p>{galleryError && <p role="alert" className="action-error">{galleryError}</p>}<div className="action-gallery"><PosterCard poster={{ title: 'Lindungi penyu, jaga rumahnya', authors: 'Inspirasi untuk karya kalian', image_url: example }} exampleCard />{posters.map(poster => <PosterCard key={poster.id} poster={poster} />)}</div>{galleryLoading && <p role="status" className="action-hint">Memuat poster dari galeri online...</p>}{posters.length === 0 && !galleryLoading && !galleryError && <div className="action-prompt"><Sparkles /><p>Masih ada tempat untuk pesan kalian.</p><button className="action-secondary" onClick={onCreate}>Pamerkan karya pertamamu<ArrowRight size={16} /></button></div>}</section></div>
    </div>
  </main>;
}

function PosterCard({ poster, exampleCard = false }) {
  const dialog = useRef(null);
  const image = /^(data:image\/(jpeg|png|webp);base64,|https?:\/|\/)/.test(poster.image_url) ? poster.image_url : '';
  return <article className="action-poster-card"><button onClick={() => dialog.current?.showModal()} aria-label={`Perbesar poster ${poster.title}`}><img src={image} alt={poster.title} loading="lazy" /><span>{exampleCard ? 'CONTOH POSTER' : 'KARYA SAHABAT PENYU'}</span></button><h3>{poster.title}</h3><p>{poster.authors}</p><dialog ref={dialog} className="action-lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button className="action-secondary" onClick={() => dialog.current.close()} autoFocus>Tutup poster ×</button><img src={image} alt={poster.title} /><h3>{poster.title}</h3><p>{poster.authors}</p></dialog></article>;
}
