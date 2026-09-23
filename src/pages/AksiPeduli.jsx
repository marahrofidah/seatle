import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, ExternalLink, ImagePlus, Sparkles, Waves } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.webp';
import ActionIsland from '../components/ActionIsland';
import example from '../assets/images/poster.jpg';
import { getPosters, journalKey, publishPoster, readImage, readRecord, writeRecord } from '../lib/actionJournal';
import { isSupabaseConfigured } from '../lib/supabase';
import { completeAspect } from '../lib/studentProgress';
import './AksiPeduli.css';
import './ActionIsland.css';

const emptyJournal = { challenge: '', days: {}, poster: null };
function ImageUpload({ value, onChange, label, disabled }) {
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);
  async function select(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setReading(true); setError('');
    try { onChange(await readImage(file)); } catch (err) { setError(err.message); }
    setReading(false); event.target.value = '';
  }
  return <div><label className={`action-upload ${value ? 'has-image' : ''}`}>
    {value ? <img src={value} alt={`Pratinjau ${label.toLowerCase()}`} /> : <><ImagePlus size={32} /><strong>{label}</strong><span>Pilih gambar dari perangkatmu</span></>}
    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={select} disabled={disabled || reading} aria-label={value ? `Ganti ${label.toLowerCase()}` : label} />
    {value && <span className="action-image-change">Ganti gambar</span>}
  </label><small className="action-hint">{reading ? 'Membaca gambar…' : 'JPG, PNG, atau WebP · Maks. 5 MB'}</small>{error && <p role="alert" className="action-error">{error}</p>}</div>;
}

function DayForm({ day, entry, onSave, busy }) {
  const [photo, setPhoto] = useState(entry?.photo || '');
  const [caption, setCaption] = useState(entry?.caption || '');
  return <form className="action-day-form" onSubmit={event => { event.preventDefault(); if (photo && caption.trim()) onSave({ photo, caption: caption.trim() }); }}>
    <div className="action-section-title"><span className="action-number">0{day}</span><div><p className="action-kicker">CATATAN AKSIKU</p><h3>Hari ke-{day}</h3><p>Satu foto, satu cerita baik untuk laut.</p></div>{entry && <span className="action-saved"><Check size={14} />Tersimpan</span>}</div>
    <div className="action-editor"><ImageUpload value={photo} onChange={setPhoto} label="Tambahkan foto aksimu" disabled={busy} /><div className="action-caption"><label htmlFor="daily-caption">Apa yang kamu lakukan hari ini?</label><textarea id="daily-caption" required maxLength={300} rows={4} value={caption} onChange={event => setCaption(event.target.value)} placeholder="Saya meminta minuman tanpa sedotan plastik." disabled={busy} /><small>{caption.length}/300 karakter</small><p>Dokumentasikan aksi yang benar-benar kamu lakukan. Kembali setiap hari untuk melanjutkan jejakmu.</p><button className="action-primary" disabled={busy || !photo || !caption.trim()}><Camera size={17} />{busy ? 'Menyimpan…' : entry ? 'Simpan perubahan' : 'Simpan jejak hari ini'}</button></div></div>
  </form>;
}

export default function AksiPeduli({ onBack, initialTab = 'journal' }) {
  const [key] = useState(journalKey);
  const [data, setData] = useState(emptyJournal);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(initialTab);
  const [day, setDay] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [posters, setPosters] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [title, setTitle] = useState('');
  const [friend, setFriend] = useState('');
  const [posterImage, setPosterImage] = useState('');
  const [finished, setFinished] = useState(false);
  const journalDialog = useRef(null);
  const posterId = useRef(null);
  const studentName = sessionStorage.getItem('seatle_student_name') || 'Petualang';
  const count = Object.keys(data.days).length;

  useEffect(() => {
    let active = true;
    readRecord(key).then(saved => {
      if (!active) return;
      if (saved) { setData(saved); setDay(Array.from({ length: 7 }, (_, i) => i + 1).find(i => !saved.days[i]) || 7); }
      setLoading(false);
    }).catch(err => { if (active) { setError(err.message); setLoading(false); } });
    return () => { active = false; };
  }, [key]);

  useEffect(() => {
    if (tab !== 'gallery') return;
    let active = true;
    getPosters().then(items => { if (active) { setPosters(items); setGalleryError(''); } }).catch(err => { if (active) setGalleryError(err.message); });
    return () => { active = false; };
  }, [tab]);

  async function refreshGallery() {
    setGalleryLoading(true);
    try { setPosters(await getPosters()); setGalleryError(''); } catch (err) { setGalleryError(err.message); }
    setGalleryLoading(false);
  }

  async function save(next, message) {
    setBusy(true); setError(''); setNotice('');
    try { await writeRecord(key, next); setData(next); setNotice(message); journalDialog.current?.close(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitPoster(event) {
    event.preventDefault();
    if (!title.trim() || !friend.trim() || !posterImage || busy) return;
    setBusy(true); setError(''); setNotice('');
    if (!posterId.current) posterId.current = crypto.randomUUID();
    const poster = { id: posterId.current, title: title.trim(), authors: `${studentName} & ${friend.trim()}`, image_url: posterImage, created_at: new Date().toISOString() };
    try {
      await publishPoster(poster);
      const next = { ...data, poster };
      await writeRecord(key, next); setData(next);
      setNotice(isSupabaseConfigured ? 'Poster kalian sudah tampil di galeri online!' : 'Poster kalian sudah tampil di galeri perangkat ini!');
      setTab('gallery');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function finish() {
    try { completeAspect('aksi-peduli'); setFinished(true); setError(''); }
    catch { setError('Progres belum tersimpan. Coba tuntaskan misi kembali.'); }
  }

  return <main className="action-ocean island-ocean page-background" style={{ '--page-background': `url(${background})` }}><div className="action-container">
    <header className="action-header"><button onClick={onBack} aria-label="Kembali ke peta misi"><ArrowLeft size={20} /></button><span>Aksi Peduli</span><small>MISI 04 / ASPEK PERILAKU</small></header>
    <div className="island-page-heading"><div><p className="action-kicker">ASPEK PERILAKU / PRO BEHAVIOUR</p><h1>Aksi kecilmu menghidupkan pulau ini.</h1></div></div>
    <div className="island-content"><nav className="island-navigation" aria-label="Jelajahi pulau">{[['journal', 'Pulau aksi'], ['campaign', 'Pondok kreativitas'], ['gallery', 'Papan kampanye']].map(([id, label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => { setTab(id); setNotice(''); }}>{id === 'journal' ? <Waves size={16} /> : id === 'campaign' ? <Sparkles size={16} /> : <ImagePlus size={16} />}{label}</button>)}</nav>
    {error && <p role="alert" className="action-error">{error}</p>}{notice && <p role="status" className="action-notice"><Check size={18} />{notice}</p>}
    {loading ? <div className="action-panel" role="status">Menyiapkan pulaumu…</div> : <>
      {tab === 'journal' && <section className="island-journal"><ActionIsland data={data} busy={busy} onChallenge={challenge => save({ ...data, challenge }, 'Tantangan dipilih! Sekarang lakukan aksimu dan dokumentasikan.')} onDay={number => { setDay(number); setNotice(''); journalDialog.current?.showModal(); }} onNavigate={setTab} />
        <dialog ref={journalDialog} className="action-journal-dialog" aria-label={`Dokumentasi hari ke-${day}`} onCancel={event => { if (busy) event.preventDefault(); }}><div className="action-dialog-bar"><span>DOKUMENTASI AKSI / HARI {day}</span><button type="button" disabled={busy} onClick={() => journalDialog.current.close()} aria-label="Tutup jurnal">×</button></div>{error && <p role="alert" className="action-error">{error}</p>}{data.challenge ? <><p className="action-dialog-challenge">{data.challenge}</p><DayForm key={`${day}-${data.days[day]?.caption || ''}`} day={day} entry={data.days[day]} busy={busy} onSave={entry => save({ ...data, days: { ...data.days, [day]: entry } }, `Jejak hari ke-${day} tersimpan. Pantaimu semakin bersih!`)} /></> : <div className="action-prompt"><Waves /><h3>Pilih tantanganmu dulu, yuk.</h3><p>Klik salah satu benda di pantai untuk memilih aksi yang ingin kamu lakukan selama tujuh hari.</p><button className="action-primary" onClick={() => journalDialog.current.close()}>Pilih tantangan<ArrowLeft size={16} /></button></div>}</dialog>
        {count === 7 && <div className="action-celebration"><Sparkles /><div><h3>Selamat! Kamu telah menyelesaikan Tantangan Sahabat Penyu.</h3><p>Tujuh jejak baikmu sudah terkumpul. Teruskan kebiasaan baik ini!</p></div><button className="action-primary" onClick={() => setTab('campaign')}>Buat kampanye<ArrowRight size={17} /></button></div>}
        <p className="action-storage">Foto dan catatan harian tersimpan pada browser dan perangkat ini.</p>
      </section>}
      {tab === 'campaign' && <section className="action-panel action-campaign-panel"><div className="action-panel-heading"><div><p className="action-kicker">02 / KAMPANYE SAHABAT PENYU</p><h2>Selamat datang di pondok kreativitas.</h2><p>Bersama satu temanmu, buat poster digital di Canva yang mengajak masyarakat menjaga penyu laut dan lingkungan sekitarnya.</p></div><span className="action-stamp">DIBUAT<br />BERDUA<span>UNTUK LAUT</span></span></div><div className="action-studio"><aside><a href={example} target="_blank" rel="noreferrer" className="action-example"><img src={example} alt="Contoh poster kampanye pelestarian penyu laut" /><span>Sedikit inspirasi untuk kalian <ExternalLink size={14} /></span></a><div className="action-recipe"><p className="action-kicker">CATATAN DARI PENYU</p><h3>Pesanmu mau bilang apa?</h3><ol><li>Tentukan satu ajakan yang jelas.</li><li>Padukan ilustrasi dan kalimat singkat.</li><li>Unduh dari Canva sebagai PNG atau JPG.</li><li>Unggah dan pamerkan karya kalian!</li></ol><a className="action-primary" href="https://www.canva.com/" target="_blank" rel="noreferrer">Buka Canva <ExternalLink size={16} /></a></div></aside>
          {data.poster ? <div className="action-published"><Check size={36} /><h3>Karya kalian sudah dipamerkan!</h3><img src={data.poster.image_url} alt={data.poster.title} /><p>{data.poster.title}</p><button className="action-primary" onClick={() => setTab('gallery')}>Lihat di galeri<ArrowRight size={16} /></button></div> : <form onSubmit={submitPoster} className="action-poster-form"><p className="action-kicker">MEJA KREASI KALIAN</p><h3>Siap menginspirasi?</h3><label>Judul poster<input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder="Laut bersih, penyu tersenyum" disabled={busy} /></label><div className="action-author"><span>Pembuat pertama<strong>{studentName}</strong></span><span aria-hidden="true">+</span><label>Nama satu temanmu<input required maxLength={80} value={friend} onChange={event => setFriend(event.target.value)} placeholder="Nama teman" disabled={busy} /></label></div><ImageUpload value={posterImage} onChange={setPosterImage} label="Unggah poster dari Canva" disabled={busy} /><p className="action-hint">{isSupabaseConfigured ? 'Judul, nama pembuat, dan poster akan tampil di galeri website.' : 'Poster akan tampil di galeri pada perangkat ini. Galeri online belum terhubung.'}</p><button className="action-primary" disabled={busy || !title.trim() || !friend.trim() || !posterImage}>{busy ? 'Mengirim karya…' : 'Pamerkan di galeri'}<ArrowRight size={17} /></button></form>}
        </div></section>}
      {tab === 'gallery' && <section className="action-panel action-gallery-panel"><div className="action-panel-heading"><div><p className="action-kicker">03 / GALLERY WEBSITE</p><h2>Pesan untuk laut, dari kita.</h2><p>Ajakan baik dari Sahabat Penyu, dipamerkan di papan kampanye pulau. Klik poster untuk melihatnya lebih dekat.</p></div><button className="action-secondary" onClick={refreshGallery} disabled={galleryLoading}>{galleryLoading ? 'Memuat…' : 'Muat ulang'}</button></div><p className="action-hint">{isSupabaseConfigured ? 'Galeri bersama Sahabat Penyu' : 'Galeri perangkat ini · Karya tersimpan di browser yang kamu gunakan.'}</p>{galleryError && <p role="alert" className="action-error">{galleryError}</p>}<div className="action-gallery"><PosterCard poster={{ title: 'Lindungi penyu, jaga rumahnya', authors: 'Inspirasi untuk karya kalian', image_url: example }} exampleCard />{posters.map(poster => <PosterCard key={poster.id} poster={poster} />)}</div>{posters.length === 0 && !galleryError && <div className="action-prompt"><Sparkles /><p>Masih ada tempat untuk pesan kalian.</p><button className="action-secondary" onClick={() => setTab('campaign')}>Pamerkan karya pertamamu<ArrowRight size={16} /></button></div>}</section>}
      {count === 7 && data.poster && <section className="action-finish"><div><h3>{finished ? 'Misi 4 selesai. Kamu Sahabat Penyu!' : 'Jejak lengkap. Pesan baik sudah dibagikan.'}</h3><p>{finished ? 'Progres Aksi Peduli sudah tercatat di peta petualanganmu.' : 'Tujuh dokumentasi dan satu poster bersama sudah tersimpan.'}</p></div><button className="action-primary" onClick={finished ? onBack : finish}>{finished ? 'Kembali ke peta' : 'Tuntaskan misi'}<Check size={18} /></button></section>}
    </>}</div>
  </div></main>;
}

function PosterCard({ poster, exampleCard = false }) {
  const dialog = useRef(null);
  const image = /^(data:image\/(jpeg|png|webp);base64,|https?:\/|\/)/.test(poster.image_url) ? poster.image_url : '';
  return <article className="action-poster-card"><button onClick={() => dialog.current?.showModal()} aria-label={`Perbesar poster ${poster.title}`}><img src={image} alt={poster.title} loading="lazy" /><span>{exampleCard ? 'CONTOH POSTER' : 'KARYA SAHABAT PENYU'}</span></button><h3>{poster.title}</h3><p>{poster.authors}</p><dialog ref={dialog} className="action-lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button className="action-secondary" onClick={() => dialog.current.close()} autoFocus>Tutup poster ×</button><img src={image} alt={poster.title} /><h3>{poster.title}</h3><p>{poster.authors}</p></dialog></article>;
}
