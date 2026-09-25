import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, ExternalLink, ImagePlus, Sparkles, Waves } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.webp';
import ActionIsland from '../components/ActionIsland';
import example from '../assets/images/poster.jpg';
import { journalKey, publishPoster, readImage, readJournal, saveJournalDay, writeRecord } from '../lib/actionJournal';
import { isSupabaseConfigured } from '../lib/supabase';
import { completeAspect, getCompletedAspects } from '../lib/studentProgress';
import { canDocument, canFinishMission } from '../lib/actionSchedule';
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
    <div className="action-section-title"><span className="action-number">0{day}</span><div><h3>Hari ke-{day}</h3><p>Satu foto, satu cerita baik untuk laut.</p></div>{entry && <span className="action-saved"><Check size={14} />Tersimpan</span>}</div>
    <div className="action-editor"><ImageUpload value={photo} onChange={setPhoto} label="Tambahkan foto aksimu" disabled={busy} /><div className="action-caption"><label htmlFor="daily-caption">Apa yang kamu lakukan hari ini?</label><textarea id="daily-caption" required maxLength={300} rows={4} value={caption} onChange={event => setCaption(event.target.value)} placeholder="Saya meminta minuman tanpa sedotan plastik." disabled={busy} /><small>{caption.length}/300 karakter</small><p>Dokumentasikan aksi yang benar-benar kamu lakukan. Kembali setiap hari untuk melanjutkan jejakmu.</p><button className="action-primary" disabled={busy || !photo || !caption.trim()}><Camera size={17} />{busy ? 'Menyimpan…' : entry ? 'Simpan perubahan' : 'Simpan jejak hari ini'}</button></div></div>
  </form>;
}

export default function AksiPeduli({ onBack, onGallery, initialTab = 'journal' }) {
  const [key] = useState(journalKey);
  const [data, setData] = useState(emptyJournal);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(initialTab);
  const [day, setDay] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [title, setTitle] = useState('');
  const [friend, setFriend] = useState('');
  const [posterImage, setPosterImage] = useState('');
  const [finished, setFinished] = useState(() => getCompletedAspects().includes('aksi-peduli'));
  const journalDialog = useRef(null);
  const posterId = useRef(null);
  const studentName = sessionStorage.getItem('seatle_student_name') || 'Petualang';
  const count = Object.keys(data.days).length;
  const readyToFinish = canFinishMission(data);

  useEffect(() => {
    let active = true;
    readJournal(key).then(saved => {
      if (!active) return;
      if (saved) { setData(saved); setDay(Array.from({ length: 7 }, (_, i) => i + 1).find(i => !saved.days[i]) || 7); }
      setLoading(false);
    }).catch(err => { if (active) { setError(err.message); setLoading(false); } });
    return () => { active = false; };
  }, [key]);


  async function save(next, message) {
    setBusy(true); setError(''); setNotice('');
    try { await writeRecord(key, next); setData(next); setNotice(message); journalDialog.current?.close(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function openDay(number) {
    if (busy || (!data.days[number] && !canDocument(data, number))) return;
    setDay(number); setNotice(''); journalDialog.current?.showModal();
  }

  async function documentDay(entry) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const next = await saveJournalDay(key, day, entry);
      setData(next);
      setNotice(`Jejak hari ke-${day} tersimpan. Kembali besok untuk aksi berikutnya!`);
      journalDialog.current?.close();
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  }

  async function submitPoster(event) {
    event.preventDefault();
    if (busy || (!data.poster && (!title.trim() || !friend.trim() || !posterImage))) return;
    setBusy(true); setError(''); setNotice('');
    if (!posterId.current) posterId.current = crypto.randomUUID();
    const poster = data.poster || { id: posterId.current, title: title.trim(), authors: `${studentName} & ${friend.trim()}`, image_url: posterImage, created_at: new Date().toISOString() };
    try {
      const { journal, warning } = await publishPoster(poster, key, data);
      setData(journal);
      setError(warning);
      setNotice(warning ? 'Gambar tersimpan. Kamu tidak perlu mengunggah ulang; coba kirim online lagi dari Pondok kreativitas.' : isSupabaseConfigured ? 'Poster kalian sudah tampil di galeri online!' : 'Poster kalian sudah tampil di galeri perangkat ini!');
      if (!warning) onGallery();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function finish() {
    if (busy || !readyToFinish) return;
    try { completeAspect('aksi-peduli'); setFinished(true); setError(''); }
    catch { setError('Progres belum tersimpan. Coba tuntaskan misi kembali.'); }
  }

  return <main className="action-ocean island-ocean page-background" style={{ '--page-background': `url(${background})` }}><div className="action-container">
    <header className="action-header"><button onClick={onBack} aria-label="Kembali ke peta misi"><ArrowLeft size={20} /></button><span>Aksi Peduli</span><small>MISI 04 / ASPEK PERILAKU</small></header>
    <div className="island-page-heading"><div><p className="action-kicker">ASPEK PERILAKU / PRO BEHAVIOUR</p><h1>Aksi kecilmu menghidupkan pulau ini.</h1></div></div>
    <div className="island-content"><nav className="island-navigation" aria-label="Jelajahi pulau">{[['journal', 'Pulau aksi'], ['campaign', 'Pondok kreativitas']].map(([id, label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => { setTab(id); setNotice(''); }}>{id === 'journal' ? <Waves size={16} /> : id === 'campaign' ? <Sparkles size={16} /> : <ImagePlus size={16} />}<span className="island-navigation-label">{label.split(' ').map(word => <span key={word}>{word}</span>)}</span></button>)}</nav>
    {error && <p role="alert" className="action-error">{error}</p>}{notice && <p role="status" className="action-notice"><Check size={18} />{notice}</p>}
    {loading ? <div className="action-panel" role="status">Menyiapkan pulaumu…</div> : <>
      {tab === 'journal' && <section className="island-journal"><ActionIsland data={data} busy={busy} onChallenge={challenge => save({ ...data, challenge }, 'Tantangan dipilih! Sekarang lakukan aksimu dan dokumentasikan.')} onDay={openDay} onNavigate={destination => destination === 'gallery' ? onGallery() : setTab(destination)} />
        <dialog ref={journalDialog} className="action-journal-dialog" aria-label={`Dokumentasi hari ke-${day}`} onCancel={event => { if (busy) event.preventDefault(); }}><div className="action-dialog-bar"><span>DOKUMENTASI HARI Ke-{day}</span><button type="button" disabled={busy} onClick={() => journalDialog.current.close()} aria-label="Tutup jurnal">×</button></div>{error && <p role="alert" className="action-error">{error}</p>}{data.challenge ? <><p className="action-dialog-challenge">{data.challenge}</p>{data.days[day] ? <div className="action-day-form"><img src={data.days[day].photo} alt={`Dokumentasi hari ke-${day}`} /><p>{data.days[day].caption}</p><p className="action-hint">Dokumentasi tersimpan. Lanjutkan aksi berikutnya pada hari berikutnya.</p></div> : <DayForm key={day} day={day} busy={busy} onSave={documentDay} />}</> : <div className="action-prompt"><Waves /><h3>Pilih tantanganmu dulu, yuk.</h3><p>Klik salah satu benda di pantai untuk memilih aksi yang ingin kamu lakukan selama tujuh hari.</p><button className="action-primary" onClick={() => journalDialog.current.close()}>Pilih tantangan<ArrowLeft size={16} /></button></div>}</dialog>
        {count === 7 && <div className="action-celebration"><Sparkles /><div><h3>Selamat! Kamu telah menyelesaikan Tantangan Sahabat Penyu.</h3><p>Tujuh jejak baikmu sudah terkumpul. Teruskan kebiasaan baik ini!</p></div><button className="action-primary" onClick={() => setTab('campaign')}>Buat kampanye<ArrowRight size={17} /></button></div>}
        <p className="action-storage">Foto dan catatan harian tersimpan pada browser dan perangkat ini.</p>
      </section>}
      {tab === 'campaign' && <section className="action-panel action-campaign-panel"><div className="action-panel-heading"><div><h2>Selamat datang di pondok kreativitas.</h2><p>Bersama satu temanmu, buat poster digital di Canva yang mengajak masyarakat menjaga penyu laut dan lingkungan sekitarnya.</p></div></div><div className="action-studio"><aside><a href={example} target="_blank" rel="noreferrer" className="action-example"><img src={example} alt="Contoh poster kampanye pelestarian penyu laut" /><span>Sedikit inspirasi untuk kalian <ExternalLink size={14} /></span></a><div className="action-recipe"><p className="action-kicker">CATATAN DARI PENYU</p><h3>Pesanmu mau bilang apa?</h3><ol><li>Tentukan satu ajakan yang jelas.</li><li>Padukan ilustrasi dan kalimat singkat.</li><li>Unduh dari Canva sebagai PNG atau JPG.</li><li>Unggah dan pamerkan karya kalian!</li></ol><a className="action-primary" href="https://www.canva.com/" target="_blank" rel="noreferrer">Buka Canva <ExternalLink size={16} /></a></div></aside>
          {data.poster ? <div className="action-published"><Check size={36} /><h3>{data.poster.syncStatus === 'pending' ? 'Karya tersimpan, menunggu dikirim online.' : 'Karya kalian sudah dipamerkan!'}</h3><img src={data.poster.image_url} alt={data.poster.title} /><p>{data.poster.title}</p>{isSupabaseConfigured && ['pending', 'local'].includes(data.poster.syncStatus) && <button className="action-primary" disabled={busy} onClick={submitPoster}>{busy ? 'Mengirim karya...' : 'Coba kirim ke galeri online'}</button>}<button className="action-primary" onClick={onGallery}>Lihat di galeri<ArrowRight size={16} /></button></div> : <form onSubmit={submitPoster} className="action-poster-form"><p className="action-kicker">MEJA KREASI KALIAN</p><h3>Siap menginspirasi?</h3><label>Judul poster<input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder="Laut bersih, penyu tersenyum" disabled={busy} /></label><div className="action-author"><span>Pembuat pertama<strong>{studentName}</strong></span><span aria-hidden="true">+</span><label>Nama satu temanmu<input required maxLength={80} value={friend} onChange={event => setFriend(event.target.value)} placeholder="Nama teman" disabled={busy} /></label></div><ImageUpload value={posterImage} onChange={setPosterImage} label="Unggah poster dari Canva" disabled={busy} /><p className="action-hint">{isSupabaseConfigured ? 'Judul, nama pembuat, dan poster akan tampil di galeri website.' : 'Poster akan tampil di galeri pada perangkat ini. Galeri online belum terhubung.'}</p><button className="action-primary" disabled={busy || !title.trim() || !friend.trim() || !posterImage}>{busy ? 'Mengirim karya…' : 'Pamerkan di galeri'}<ArrowRight size={17} /></button></form>}
        </div></section>}

      <section className="action-finish"><div><h3>{finished && readyToFinish ? 'Misi 4 selesai. Kamu Sahabat Penyu!' : readyToFinish ? 'Jejak lengkap. Misi siap dituntaskan!' : 'Lengkapi misimu, satu hari satu aksi.'}</h3><p id="action-finish-progress">{finished && readyToFinish ? 'Progres Aksi Peduli sudah tercatat di peta petualanganmu.' : readyToFinish ? 'Tujuh dokumentasi dan satu poster bersama sudah tersimpan.' : `${count}/7 hari terdokumentasi. ${data.poster ? 'Poster sudah tersimpan.' : 'Poster belum tersimpan.'} Tombol tuntas terbuka setelah dokumentasi 7 hari dan poster lengkap.`}</p></div><button className="action-primary" disabled={busy || !readyToFinish} aria-describedby="action-finish-progress" onClick={finished && readyToFinish ? onBack : finish}>{finished && readyToFinish ? 'Kembali ke peta' : 'Tuntaskan misi'}<Check size={18} /></button></section>
    </>}</div>
  </div></main>;
}
