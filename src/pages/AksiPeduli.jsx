import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, ExternalLink, ImagePlus, Sparkles, Waves } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.webp';
import turtle from '../assets/images/senang_ingin_membantu.png';
import example from '../assets/images/poster.jpg';
import { challenges, getPosters, journalKey, publishPoster, readImage, readRecord, writeRecord } from '../lib/actionJournal';
import { isSupabaseConfigured } from '../lib/supabase';
import { completeAspect } from '../lib/studentProgress';
import './AksiPeduli.css';

const emptyJournal = { challenge: '', days: {}, poster: null };
const tabs = [['journal', '01', 'Tantangan 7 hari'], ['campaign', '02', 'Kampanye'], ['gallery', '03', 'Galeri karya']];

function BeachJourney({ days, day, onSelect }) {
  const positions = [[12, 73], [25, 43], [39, 64], [51, 33], [65, 53], [77, 26], [90, 41]];
  const count = Object.keys(days).length;
  return <div className="beach-journey">
    <div className="beach-map-title"><span>EKSPEDISI 7 HARI</span><p>Setiap jejakmu membawa harapan.</p></div>
    <svg viewBox="0 0 1000 420" preserveAspectRatio="none" className="beach-terrain" aria-hidden="true">
      <path d="M0 0H1000V290 Q830 230 680 305T370 320T0 355Z" fill="#fcf0d5" />
      <path d="M0 345 Q180 290 370 315T680 300T1000 280" fill="none" stroke="#fff9e9" strokeWidth="28" />
      <path d="M0 375 Q180 320 370 350T680 335T1000 315" fill="none" stroke="#ffffff65" strokeWidth="3" />
      <path d="M120 307 C170 300 190 181 250 181 S340 270 390 269 S450 137 510 139 S600 223 650 223 S720 110 770 109 S860 172 900 172" fill="none" stroke="#bc9e68" strokeWidth="3" strokeDasharray="5 9" strokeLinecap="round" />
    </svg>
    <span className="beach-shell beach-shell-one" aria-hidden="true">✳</span><span className="beach-shell beach-shell-two" aria-hidden="true">✳</span><span className="beach-sea-label" aria-hidden="true">LAUT PENUH HARAPAN ~</span>
    <nav className="beach-stops" aria-label="Buka dokumentasi hari pilihanmu">{positions.map(([x, y], index) => {
      const number = index + 1;
      return <button key={number} style={{ '--x': `${x}%`, '--y': `${y}%`, '--tilt': `${index % 2 ? 7 : -7}deg` }} onClick={() => onSelect(number)} aria-label={`Hari ${number}${days[number] ? ', sudah tersimpan' : ', tambah dokumentasi'}`} aria-current={day === number ? 'step' : undefined} className={days[number] ? 'has-footprint' : ''}>
        <span className="beach-stop-photo">{days[number] ? <img src={days[number].photo} alt="" /> : <span>{String(number).padStart(2, '0')}</span>}{days[number] && <i><Check size={12} /></i>}</span><strong>Hari {number}</strong>
      </button>;
    })}</nav>
    <div className="beach-map-caption"><span>Klik jejak hari untuk membuka jurnalmu</span><strong>{count} dari 7 jejak terkumpul</strong></div>
  </div>;
}

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

  return <main className="action-ocean page-background" style={{ '--page-background': `url(${background})` }}><div className="action-container">
    <header className="action-header"><button onClick={onBack} aria-label="Kembali ke peta misi"><ArrowLeft size={20} /></button><span>Aksi Peduli</span><small>MISI 04 / ASPEK PERILAKU</small></header>
    <section className="action-hero"><div><p className="action-kicker">CATATAN PETUALANGAN / MISI 04</p><h1>Jadi sahabat.<br /><em>Tinggalkan jejak baik.</em></h1><p>Tujuh hari untuk membangun kebiasaan.<br />Satu karya untuk mengajak dunia peduli.</p></div><div className="action-mascot"><span className="action-sticker">AKSI KECIL<br /><strong>DAMPAK BESAR</strong></span><img src={turtle} alt="Penyu kecil siap menemani aksimu" /><span>Aku ikut petualanganmu!</span></div></section>
    <div className="action-book"><nav className="action-tabs" aria-label="Kegiatan misi empat">{tabs.map(([id, number, label]) => <button key={id} onClick={() => { setTab(id); setNotice(''); }} aria-current={tab === id ? 'page' : undefined}><span>{number}</span><strong>{label}</strong>{((id === 'journal' && count === 7) || (id === 'campaign' && data.poster)) && <Check size={16} />}</button>)}</nav>
    {error && <p role="alert" className="action-error">{error}</p>}{notice && <p role="status" className="action-notice"><Check size={18} />{notice}</p>}
    {loading ? <div className="action-panel" role="status">Menyiapkan paspor aksimu…</div> : <>
      {tab === 'journal' && <section className="action-panel action-journal-panel"><div className="action-panel-heading"><div><p className="action-kicker">01 / TANTANGAN SAHABAT PENYU</p><h2>Perjalanan baikmu dimulai di sini.</h2><p>Pilih satu aksi yang paling sering kamu lakukan. Ulangi selama 7 hari, lalu simpan foto dan cerita singkat di setiap jejak.</p></div><div className="action-counter"><strong>{count}<span>/7</span></strong><small>JEJAK BAIK</small></div></div>
        <div className="action-fieldbook"><aside className="action-mission-note"><span className="action-paperclip" aria-hidden="true" /><p className="action-kicker">BEKAL PETUALANGANKU</p><h3>Hai, {studentName}!</h3><p>Kebiasaan kecil yang kamu ulangi bisa membantu menjaga rumah penyu.</p><div className="action-selected-token"><span aria-hidden="true">{challenges.find(([, label]) => label === data.challenge)?.[0] || '🌱'}</span><strong>{data.challenge || 'Apa aksi andalanmu?'}</strong></div><details className="action-choice-drawer" open={!data.challenge || undefined}><summary>{data.challenge ? count ? 'Lihat 7 pilihan tantangan' : 'Ganti aksi pilihanmu' : 'Pilih tantanganmu'}<span>↓</span></summary><fieldset className="action-challenges" disabled={busy || count > 0}><legend className="sr-only">Pilih satu aksi andalanmu</legend><div>{challenges.map(([emoji, label]) => <label key={label}><input type="radio" name="challenge" value={label} checked={data.challenge === label} onChange={() => save({ ...data, challenge: label }, 'Bekal siap! Klik hari pada peta untuk menulis jejakmu.')} /><span><i aria-hidden="true">{emoji}</i>{label}{data.challenge === label && <Check size={16} />}</span></label>)}</div></fieldset></details><p className="action-note-footer">Satu pilihan. Tujuh hari.<br />Banyak kebaikan untuk laut.</p></aside><div className="action-expedition"><BeachJourney days={data.days} day={day} onSelect={number => { setDay(number); setNotice(''); journalDialog.current?.showModal(); }} /><div className="action-expedition-footer"><Waves size={26} /><p><strong>Pelan-pelan, jadi kebiasaan.</strong>Dokumentasikan aksi yang benar-benar kamu lakukan. Satu hari, satu cerita baru.</p><span className="action-stamp">SAHABAT<br />PENYU<span>SEATLE / 04</span></span></div></div></div>
        <dialog ref={journalDialog} className="action-journal-dialog" onCancel={event => { if (busy) event.preventDefault(); }}><div className="action-dialog-bar"><span>LEMBAR PETUALANGAN / HARI {day}</span><button type="button" disabled={busy} onClick={() => journalDialog.current.close()} aria-label="Tutup jurnal">×</button></div>{error && <p role="alert" className="action-error">{error}</p>}{data.challenge ? <><p className="action-dialog-challenge">{data.challenge}</p><DayForm key={`${day}-${data.days[day]?.caption || ''}`} day={day} entry={data.days[day]} busy={busy} onSave={entry => save({ ...data, days: { ...data.days, [day]: entry } }, `Jejak hari ke-${day} tersimpan. Fotomu sekarang ada di peta!`)} /></> : <div className="action-prompt"><Waves /><h3>Pilih bekal petualanganmu dulu.</h3><p>Tentukan satu tantangan di catatan sebelah peta sebelum menulis jurnal.</p><button className="action-primary" onClick={() => journalDialog.current.close()}>Pilih tantangan<ArrowLeft size={16} /></button></div>}</dialog>
        {count === 7 && <div className="action-celebration"><Sparkles /><div><h3>Selamat! Kamu telah menyelesaikan Tantangan Sahabat Penyu.</h3><p>Tujuh jejak baikmu sudah terkumpul. Teruskan kebiasaan baik ini!</p></div><button className="action-primary" onClick={() => setTab('campaign')}>Buat kampanye<ArrowRight size={17} /></button></div>}
        <p className="action-storage">Foto dan catatan harian tersimpan pada browser dan perangkat ini.</p>
      </section>}
      {tab === 'campaign' && <section className="action-panel action-campaign-panel"><div className="action-panel-heading"><div><p className="action-kicker">02 / KAMPANYE SAHABAT PENYU</p><h2>Meja kecil untuk ide-ide besar.</h2><p>Bersama satu temanmu, buat poster digital di Canva yang mengajak masyarakat menjaga penyu laut dan lingkungan sekitarnya.</p></div><span className="action-stamp">DIBUAT<br />BERDUA<span>UNTUK LAUT</span></span></div><div className="action-studio"><aside><a href={example} target="_blank" rel="noreferrer" className="action-example"><img src={example} alt="Contoh poster kampanye pelestarian penyu laut" /><span>Sedikit inspirasi untuk kalian <ExternalLink size={14} /></span></a><div className="action-recipe"><p className="action-kicker">CATATAN DARI PENYU</p><h3>Pesanmu mau bilang apa?</h3><ol><li>Tentukan satu ajakan yang jelas.</li><li>Padukan ilustrasi dan kalimat singkat.</li><li>Unduh dari Canva sebagai PNG atau JPG.</li><li>Unggah dan pamerkan karya kalian!</li></ol><a className="action-primary" href="https://www.canva.com/" target="_blank" rel="noreferrer">Buka Canva <ExternalLink size={16} /></a></div></aside>
          {data.poster ? <div className="action-published"><Check size={36} /><h3>Karya kalian sudah dipamerkan!</h3><img src={data.poster.image_url} alt={data.poster.title} /><p>{data.poster.title}</p><button className="action-primary" onClick={() => setTab('gallery')}>Lihat di galeri<ArrowRight size={16} /></button></div> : <form onSubmit={submitPoster} className="action-poster-form"><p className="action-kicker">MEJA KREASI KALIAN</p><h3>Siap menginspirasi?</h3><label>Judul poster<input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder="Laut bersih, penyu tersenyum" disabled={busy} /></label><div className="action-author"><span>Pembuat pertama<strong>{studentName}</strong></span><span aria-hidden="true">+</span><label>Nama satu temanmu<input required maxLength={80} value={friend} onChange={event => setFriend(event.target.value)} placeholder="Nama teman" disabled={busy} /></label></div><ImageUpload value={posterImage} onChange={setPosterImage} label="Unggah poster dari Canva" disabled={busy} /><p className="action-hint">{isSupabaseConfigured ? 'Judul, nama pembuat, dan poster akan tampil di galeri website.' : 'Poster akan tampil di galeri pada perangkat ini. Galeri online belum terhubung.'}</p><button className="action-primary" disabled={busy || !title.trim() || !friend.trim() || !posterImage}>{busy ? 'Mengirim karya…' : 'Pamerkan di galeri'}<ArrowRight size={17} /></button></form>}
        </div></section>}
      {tab === 'gallery' && <section className="action-panel action-gallery-panel"><div className="action-panel-heading"><div><p className="action-kicker">03 / GALLERY WEBSITE</p><h2>Pesan untuk laut, dari kita.</h2><p>Di tali ini, ide baik kalian bertemu. Klik poster untuk melihatnya lebih dekat.</p></div><button className="action-secondary" onClick={refreshGallery} disabled={galleryLoading}>{galleryLoading ? 'Memuat…' : 'Muat ulang'}</button></div><p className="action-hint">{isSupabaseConfigured ? 'Galeri bersama Sahabat Penyu' : 'Galeri perangkat ini · Karya tersimpan di browser yang kamu gunakan.'}</p>{galleryError && <p role="alert" className="action-error">{galleryError}</p>}<div className="action-gallery"><PosterCard poster={{ title: 'Lindungi penyu, jaga rumahnya', authors: 'Inspirasi untuk karya kalian', image_url: example }} exampleCard />{posters.map(poster => <PosterCard key={poster.id} poster={poster} />)}</div>{posters.length === 0 && !galleryError && <div className="action-prompt"><Sparkles /><p>Masih ada tempat untuk pesan kalian.</p><button className="action-secondary" onClick={() => setTab('campaign')}>Gantung karya pertamamu<ArrowRight size={16} /></button></div>}</section>}
      {count === 7 && data.poster && <section className="action-finish"><div><h3>{finished ? 'Misi 4 selesai. Kamu Sahabat Penyu!' : 'Jejak lengkap. Pesan baik sudah dibagikan.'}</h3><p>{finished ? 'Progres Aksi Peduli sudah tercatat di peta petualanganmu.' : 'Tujuh dokumentasi dan satu poster bersama sudah tersimpan.'}</p></div><button className="action-primary" onClick={finished ? onBack : finish}>{finished ? 'Kembali ke peta' : 'Tuntaskan misi'}<Check size={18} /></button></section>}
    </>}</div>
  </div></main>;
}

function PosterCard({ poster, exampleCard = false }) {
  const dialog = useRef(null);
  const image = /^(data:image\/(jpeg|png|webp);base64,|https?:\/|\/)/.test(poster.image_url) ? poster.image_url : '';
  return <article className="action-poster-card"><button onClick={() => dialog.current?.showModal()} aria-label={`Perbesar poster ${poster.title}`}><img src={image} alt={poster.title} loading="lazy" /><span>{exampleCard ? 'CONTOH POSTER' : 'KARYA SAHABAT PENYU'}</span></button><h3>{poster.title}</h3><p>{poster.authors}</p><dialog ref={dialog} className="action-lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button className="action-secondary" onClick={() => dialog.current.close()} autoFocus>Tutup poster ×</button><img src={image} alt={poster.title} /><h3>{poster.title}</h3><p>{poster.authors}</p></dialog></article>;
}
