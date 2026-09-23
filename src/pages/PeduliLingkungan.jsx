import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Heart, Waves } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.webp';
import HoldCommitButton from '../components/HoldCommitButton';
import './PeduliLingkungan.css';
import { completeAspect } from '../lib/studentProgress';
import { agreementOptions, feedback, feelings, isStepComplete, loadReflection, reflectionKey, statements } from '../lib/careReflection';

const steps = [
  { title: 'Komitmen', subtitle: 'Satu tindakan yang ingin kamu mulai' },
  { title: 'Perasaan', subtitle: 'Dengarkan perasaanmu' },
  { title: 'Sikap', subtitle: 'Pendapatmu tentang lingkungan' },
];
const card = 'care-water-panel';
const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-white bg-amber-300 px-6 py-3 text-sm font-black text-amber-950 shadow-md transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500';
const input = 'care-answer mt-2 block w-full resize-y rounded-2xl border-2 border-sky-200 bg-white p-4 text-sm font-semibold leading-relaxed text-sky-950 placeholder:font-normal placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200';
const videoUrl = 'https://tbrbbmcsxtiwtwnlwtbz.supabase.co/storage/v1/object/public/video-pembelajaran/video_misi.mp4';

export default function PeduliLingkungan({ onBack }) {
  const [storageKey] = useState(reflectionKey);
  const [data, setData] = useState(() => loadReflection(storageKey));
  const [step, setStep] = useState(() => Math.max(0, data.confirmed.findIndex((value) => !value)));
  const [statementIndex, setStatementIndex] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [videoError, setVideoError] = useState(false);
  const heading = useRef(null);
  const swipeStart = useRef(null);
  const suppressSwipeClick = useRef(false);
  const studentName = sessionStorage.getItem('seatle_student_name') || 'Petualang';
  const selectedFeeling = feelings.find(({ id }) => id === data.feeling);
  const answeredCount = statements.filter((_, index) => agreementOptions.includes(data.answers[index])).length;
  const completedCount = data.confirmed.filter(Boolean).length;

  function update(fields) {
    const next = { ...data, ...fields, finished: false, confirmed: data.confirmed.map((value, index) => index === step ? false : value) };
    setData(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...next, version: 1 }));
      setSaveError('');
    } catch {
      setSaveError('Jawaban belum bisa disimpan di perangkat ini. Tetap di halaman ini dan coba simpan lagi.');
    }
  }

  function goToStep(next) {
    setStep(next);
    window.requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
  }

  function confirmStep(event) {
    event?.preventDefault();
    if (!isStepComplete(data, step)) return;
    const next = { ...data, confirmed: data.confirmed.map((value, index) => index === step ? true : value) };
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...next, version: 1 }));
      setData(next);
      setSaveError('');
    } catch {
      setSaveError('Jawaban belum bisa disimpan. Coba tekan tombol simpan kembali.');
    }
  }

  function endSwipe(event) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || !event.changedTouches[0]) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    suppressSwipeClick.current = true;
    setStatementIndex((current) => Math.max(0, Math.min(statements.length - 1, current + (dx < 0 ? 1 : -1))));
  }

  function finish() {
    if (!data.confirmed.every(Boolean) || !steps.every((_, index) => isStepComplete(data, index))) return;
    try {
      completeAspect('peduli-lingkungan');
      const next = { ...data, finished: true };
      localStorage.setItem(storageKey, JSON.stringify({ ...next, version: 1 }));
      setData(next);
      setSaveError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSaveError('Progres belum berhasil disimpan. Coba tuntaskan misi sekali lagi.');
    }
  }

  function downloadReflection() {
    const text = [
      'SEATLE — Jejak Kepedulianku', studentName, '',
      `Mulai hari ini saya berkomitmen untuk ${data.action.trim()}`, `Agar ${data.purpose.trim()}`, '',
      `Perasaanku: ${selectedFeeling?.label}`, data.reason.trim(), '',
      ...statements.map((statement, index) => `${index + 1}. ${statement}\n${data.answers[index]}`),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jejak-kepedulianku-seatle.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="care-ocean page-background relative min-h-screen overflow-x-hidden bg-sky-800 pb-16 text-sky-950" style={{ '--page-background': `url(${background})` }}>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="care-wavy-card" clipPathUnits="objectBoundingBox">
            <path d="M .03,.04 C .12,.005 .25,.03 .38,.01 C .51,-0.01 .64,.035 .77,.01 C .88,.005 .96,.025 .985,.07 C .995,.18 .975,.32 .99,.45 C 1.005,.58 .98,.72 .985,.85 C .975,.93 .93,.985 .84,.98 C .72,.995 .59,.965 .46,.99 C .33,.97 .21,.995 .09,.97 C .03,.96 .005,.915 .01,.82 C .02,.69 -.005,.55 .01,.42 C .025,.29 -.005,.16 .01,.08 C .015,.05 .025,.04 .03,.04 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-3 sm:px-6">
        <header className="flex items-center gap-3 py-4">
          <button type="button" onClick={onBack} aria-label="Kembali ke peta misi" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-300"><ArrowLeft className="h-5 w-5" /></button>
          <span className="rounded-full border border-white/70 bg-white/90 px-5 py-3 font-brand text-lg font-semibold shadow-lg">Peduli Lingkungan</span>
        </header>

        <div className="care-heading">
          <div><h1>Peduli dimulai dari diri sendiri.</h1><p>Luangkan waktu untuk memikirkan satu tindakan, perasaan, dan sikapmu terhadap laut.</p></div>
          <div className="care-completion" role="progressbar" aria-label="Bagian refleksi tersimpan" aria-valuemin={0} aria-valuemax={3} aria-valuenow={completedCount}><div className="care-progress-ring" style={{ '--care-progress': `${completedCount / 3 * 100}%` }}><strong>{completedCount}<span>/3</span></strong></div><small>bagian tersimpan</small></div>
        </div>

        {saveError && <p role="alert" className="mb-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm font-bold">{saveError}</p>}

        {data.finished ? (
          <section className={`${card} px-7 py-12 sm:px-14`}>
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700"><Check className="h-8 w-8" /></span>
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-sky-700">Tiga langkah kepedulian selesai</p>
              <h2 className="mt-2 font-brand text-3xl font-semibold sm:text-4xl">Jejak Kepedulianku</h2>
              <p className="mt-2 text-sm font-bold text-sky-700">{studentName}, simpan janjimu dan mulai wujudkan hari ini.</p>
            </div>
            <div className="mx-auto mt-7 max-w-2xl rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 sm:p-8">
              <div className="flex items-center justify-between text-sky-700"><span className="text-xs font-black uppercase tracking-widest">Janjiku untuk laut</span><Waves className="h-6 w-6" /></div>
              <p className="mt-4 break-words font-brand text-xl leading-relaxed">Mulai hari ini saya berkomitmen untuk {data.action.trim()}<br /><span className="text-sky-700">Agar {data.purpose.trim()}</span></p>
              <div className="mt-6 border-t border-sky-200 pt-5"><p className="font-black">{selectedFeeling && <img src={selectedFeeling.image} alt="" className="mr-2 inline-block h-10 w-10 object-contain" />}{selectedFeeling?.label}</p><p className="mt-2 break-words text-sm leading-relaxed">{data.reason}</p></div>
              <details className="mt-5 border-t border-sky-200 pt-4"><summary className="cursor-pointer text-sm font-black text-sky-800">Lihat 5 jawaban refleksi sikapku</summary><ol className="mt-4 space-y-4">{statements.map((statement, index) => <li key={statement} className="text-sm leading-relaxed"><p>{index + 1}. {statement}</p><p className="mt-1 font-black text-sky-700">{data.answers[index]}</p></li>)}</ol></details>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm font-bold leading-relaxed text-sky-700">{feedback[2]}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={downloadReflection} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-sky-200 bg-white px-5 py-3 text-sm font-black"><Download className="h-4 w-4" />Unduh catatan</button><button type="button" onClick={onBack} className={button}>Kembali ke peta<ArrowRight className="h-4 w-4" /></button></div>
            <button type="button" className="mx-auto mt-4 block min-h-11 px-4 text-sm font-bold text-sky-700 underline underline-offset-4" onClick={() => { setData({ ...data, finished: false }); goToStep(0); }}>Tinjau atau ubah jawabanku</button>
          </section>
        ) : (
          <div className="care-activity">
            <section className={`${card} care-activity-panel`}>
              <nav className="care-section-nav" aria-label="Bagian refleksi">
                {steps.map(({ title }, index) => <button type="button" key={title} aria-current={step === index ? 'step' : undefined} onClick={() => goToStep(index)} className={step === index ? 'is-active' : ''}><span>{data.confirmed[index] ? <Check className="h-3 w-3" /> : index + 1}</span>{title}</button>)}
              </nav>
              <div ref={heading} tabIndex={-1} className="care-section-heading scroll-mt-6 focus:outline-none">
                <span className="care-section-number" aria-hidden="true">0{step + 1}</span>
                <div><p className="care-section-kicker">{['SATU LANGKAH KECIL', 'RUANG UNTUK MERASA', 'PILIH SESUAI DIRIMU'][step]}</p><h2>{steps[step].title}</h2><p className="care-section-subtitle">{steps[step].subtitle}</p></div>
              </div>
              <form onSubmit={confirmStep} className="mt-5">
                {step === 0 && (
                  <>
                    <p className="text-sm font-bold leading-relaxed text-sky-800">Setelah menonton video, tuliskan satu tindakan sederhana yang akan kamu lakukan untuk membantu menjaga penyu dan lingkungan laut.</p>
                    <details className="my-5 rounded-2xl border border-sky-200 bg-sky-50 p-4"><summary className="cursor-pointer text-sm font-black text-sky-800">Tonton kembali video pengamatan penyu</summary><video controls playsInline preload="none" src={videoUrl} onError={() => setVideoError(true)} className="mt-4 aspect-video w-full rounded-xl bg-slate-950" aria-label="Video pengamatan penyu terdampar" />{videoError && <p role="alert" className="mt-3 text-sm">Video belum dapat diputar. Periksa koneksi atau <a className="font-bold underline" href={videoUrl} target="_blank" rel="noreferrer">buka video langsung</a>.</p>}</details>
                    <div className="care-commitment-grid">
                      <div className="space-y-5">
                        <label className="block text-sm font-black">Mulai hari ini saya berkomitmen untuk …<textarea required maxLength={400} rows={3} value={data.action} onChange={(event) => update({ action: event.target.value })} placeholder="Tuliskan satu tindakan sederhana pilihanmu" className={input} /></label>
                        <label className="block text-sm font-black">Agar …<textarea required maxLength={400} rows={3} value={data.purpose} onChange={(event) => update({ purpose: event.target.value })} placeholder="Apa manfaat yang kamu harapkan?" className={input} /></label>
                        <details className="text-sm leading-relaxed text-sky-700"><summary className="cursor-pointer font-black">Butuh inspirasi? Lihat contoh komitmen</summary><p className="mt-2 border-l-4 border-amber-300 pl-4">“Mulai hari ini saya berkomitmen untuk mengurangi penggunaan plastik sekali pakai agar laut tetap bersih dan penyu dapat hidup dengan aman.”</p></details>
                      </div>
                      <aside className={`care-promise-preview ${data.confirmed[0] ? 'is-saved' : ''}`} aria-label="Pratinjau komitmenmu">
                        <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sky-700"><Waves className="h-4 w-4" /> Komitmenmu</div>
                        <p className="break-words font-brand text-xl leading-relaxed sm:text-2xl">Mulai hari ini saya berkomitmen untuk <span className={data.action.trim() ? 'text-sky-700' : 'text-sky-400'}>{data.action.trim() || '…'}</span></p>
                        <p className="mt-4 break-words font-brand text-xl leading-relaxed sm:text-2xl">Agar <span className={data.purpose.trim() ? 'text-sky-700' : 'text-sky-400'}>{data.purpose.trim() || '…'}</span></p>
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-sky-200 pt-4"><span className="min-w-0 break-words text-sm font-black text-sky-800">Dari {studentName}, untuk laut</span><Waves className="h-7 w-7 shrink-0 text-sky-500" /></div>
                        <svg className="care-preview-waves" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 35 Q70 5 140 35 T280 35 T420 35 V80 H0Z" fill="currentColor" opacity=".1" /><path d="M0 55 Q90 20 180 55 T360 55 T540 55 V80 H0Z" fill="currentColor" opacity=".15" /></svg>
                        {data.confirmed[0] ? <div className="care-promise-saved"><Check className="h-4 w-4" />Komitmen tersimpan</div> : <HoldCommitButton key={`${data.action}\n${data.purpose}`} disabled={!isStepComplete(data, 0)} onConfirm={() => confirmStep()} />}
                      </aside>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <p className="text-base font-bold leading-relaxed">Bagaimana perasaanmu setelah melihat perjalanan hidup penyu laut?</p>
                    <div className="care-feeling-spotlight" aria-live="polite">
                      <div className="care-feeling-orbit" aria-hidden="true"><span key={data.feeling}>{selectedFeeling ? <img src={selectedFeeling.image} alt="" className="h-full w-full object-contain" /> : <Heart className="h-9 w-9" />}</span></div>
                      <div><p className="care-section-kicker">PERASAANKU SAAT INI</p><h3>{selectedFeeling?.label || 'Setiap perasaan berarti.'}</h3><p>{selectedFeeling ? 'Apa yang membuatmu merasa demikian? Ceritakan di bawah.' : 'Pilih yang paling dekat dengan perasaanmu. Tidak ada jawaban benar atau salah.'}</p></div>
                    </div>
                    <fieldset className="mt-5"><legend className="text-sm font-bold text-sky-700">Pilih satu gambar yang paling menggambarkan perasaanmu.</legend><div className="care-feelings">{feelings.map((feeling) => (
                      <label key={feeling.id} className="care-feeling relative cursor-pointer">
                        <input type="radio" name="feeling" value={feeling.id} required checked={data.feeling === feeling.id} onChange={() => update({ feeling: feeling.id })} className="peer sr-only" />
                        <span className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-sky-100 bg-white p-3 text-center transition hover:border-sky-300 peer-checked:border-sky-600 peer-checked:bg-sky-50 peer-checked:shadow-md peer-focus-visible:ring-4 peer-focus-visible:ring-sky-400"><span aria-hidden="true" className="shrink-0"><img src={feeling.image} alt="" className="h-12 w-12 object-contain" /></span><span className="text-sm font-black">{feeling.label}</span>{data.feeling === feeling.id && <Check aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 text-sky-700" />}</span>
                      </label>
                    ))}</div></fieldset>

                    <label className="block text-sm font-black" htmlFor="care-reason">Jelaskan alasanmu dalam satu kalimat.</label>
                    <textarea id="care-reason" required maxLength={400} rows={3} value={data.reason} onChange={(event) => update({ reason: event.target.value })} placeholder="Saya merasa … karena …" aria-describedby="care-reason-example" className={input} />
                    <p id="care-reason-example" className="mt-3 text-xs font-semibold leading-relaxed text-sky-700">Contoh: Saya merasa sedih karena banyak penyu terluka akibat sampah plastik di laut.</p>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-sm font-bold leading-relaxed text-sky-800">Berikan jawaban sesuai dengan pendapatmu. Semua pilihan diterima; pilih yang paling menggambarkan sikapmu saat ini.</p>
                    <div className="care-question-progress">
                      <p aria-live="polite">Pernyataan {statementIndex + 1} dari 5 <span> / {answeredCount} terisi</span></p>
                      <nav aria-label="Pilih pernyataan" className="care-question-dots">{statements.map((statement, index) => <button type="button" key={statement} onClick={() => setStatementIndex(index)} aria-label={`Pernyataan ${index + 1}${data.answers[index] ? ', sudah dijawab' : ''}`} aria-current={statementIndex === index ? 'step' : undefined} className={`${statementIndex === index ? 'is-current' : ''} ${data.answers[index] ? 'is-answered' : ''}`}>{data.answers[index] ? <Check className="h-3 w-3" /> : index + 1}</button>)}</nav>
                    </div>
                    <p className="care-swipe-hint">Geser kiri atau kanan untuk berpindah pernyataan.</p>
                    <fieldset key={statementIndex} className="care-statement care-swipe-card"
                      onTouchStart={(event) => {
                        suppressSwipeClick.current = false;
                        swipeStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
                      }}
                      onTouchEnd={endSwipe}
                      onTouchCancel={() => { swipeStart.current = null; }}
                      onClickCapture={(event) => {
                        if (suppressSwipeClick.current) { event.preventDefault(); event.stopPropagation(); suppressSwipeClick.current = false; }
                      }}
                    >
                      <legend><span className="care-statement-number" aria-hidden="true">0{statementIndex + 1}</span><span>{statements[statementIndex]}</span></legend>
                      <div className="care-agreement-options">{agreementOptions.map((option) => <label key={option} className="cursor-pointer"><input type="radio" name={`care-statement-${statementIndex}`} required value={option} checked={data.answers[statementIndex] === option} onChange={() => update({ answers: { ...data.answers, [statementIndex]: option } })} className="peer sr-only" /><span className="care-agreement-option"><span className="care-radio-mark" aria-hidden="true">{data.answers[statementIndex] === option && <Check className="h-3 w-3" />}</span>{option}</span></label>)}</div>
                    </fieldset>
                    <div className="care-question-controls"><button type="button" disabled={statementIndex === 0} onClick={() => setStatementIndex(statementIndex - 1)}><ArrowLeft className="h-4 w-4" /> Sebelumnya</button><button type="button" disabled={statementIndex === statements.length - 1} onClick={() => setStatementIndex(statementIndex + 1)}>Berikutnya <ArrowRight className="h-4 w-4" /></button></div>
                  </>
                )}

                {data.confirmed[step] && <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm font-bold leading-relaxed text-sky-900"><Check className="mt-0.5 h-5 w-5 shrink-0" /><p>{feedback[step]}</p></div>}
                <div className="care-step-actions mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-sky-100 pt-5">
                  {step > 0 ? <button type="button" onClick={() => goToStep(step - 1)} className="inline-flex min-h-12 items-center gap-2 text-sm font-black text-sky-700"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Bagian sebelumnya</span><span className="sm:hidden">Sebelumnya</span></button> : <span className="text-xs font-bold text-sky-600">Isi kedua bagian untuk menyimpan janjimu.</span>}
                  {!data.confirmed[step] ? <button type="submit" disabled={!isStepComplete(data, step)} className={button}>{['Simpan komitmenku', 'Simpan perasaanku', 'Simpan refleksiku'][step]}<Check className="h-4 w-4" /></button> : step < 2 ? <button type="button" className={button} onClick={() => goToStep(step + 1)}>Selanjutnya<ArrowRight className="h-4 w-4" /></button> : <button type="button" disabled={!data.confirmed.every(Boolean)} onClick={finish} className={button}>Tuntaskan misi<Check className="h-4 w-4" /></button>}
                </div>
                {step === 2 && data.confirmed[2] && !data.confirmed.every(Boolean) && <p className="mt-3 text-sm font-bold text-sky-700">Simpan juga komitmen dan perasaanmu pada langkah sebelumnya untuk menuntaskan misi.</p>}
              </form>

            </section>
          </div>
        )}
      </div>
    </main>
  );
}
