import { websiteStatements as statements } from '../lib/websiteReflection';
import useStudentReport from '../lib/useStudentReport';
import { websiteReport } from '../lib/learningReportFormats';
import { useState } from 'react';
import { ArrowLeft, Check, Frown, Meh, Smile, SmilePlus } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.webp';
import BubbleEffects from '../components/BubbleEffects';
import './Refleksi.css';


const options = [
  { label: 'Sangat Setuju', Icon: SmilePlus },
  { label: 'Setuju', Icon: Smile },
  { label: 'Kurang Setuju', Icon: Meh },
  { label: 'Tidak Setuju', Icon: Frown },
];

function readAnswers(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    const answers = statements.map((_, index) => options.some(option => option.label === saved?.answers?.[index]) ? saved.answers[index] : '');
    return { answers, submitted: answers.every(Boolean) && saved?.submitted === true };
  } catch {
    return { answers: statements.map(() => ''), submitted: false };
  }
}

export default function Refleksi({ onBack }) {
  const [key] = useState(() => `seatle_website_reflection:${JSON.stringify([
    sessionStorage.getItem('seatle_student_name') || 'Petualang',
    sessionStorage.getItem('seatle_student_class') || '-',
  ])}`);
  const [data, setData] = useState(() => readAnswers(key));
  const [error, setError] = useState('');
  const count = data.answers.filter(Boolean).length;
  const reportError = useStudentReport('refleksi', websiteReport(data), count > 0);

  function choose(index, value) {
    const next = { answers: data.answers.map((answer, i) => i === index ? value : answer), submitted: false };
    setData(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setError('');
    } catch { setError('Jawaban belum tersimpan. Coba simpan kembali sebelum meninggalkan halaman.'); }
  }

  function submit(event) {
    event.preventDefault();
    if (count !== statements.length) return;
    const next = { ...data, submitted: true };
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setData(next);
      setError('');
    } catch { setError('Refleksi belum tersimpan. Periksa ruang penyimpanan perangkat lalu coba lagi.'); }
  }

  return <main className="website-reflection page-background" style={{ '--page-background': `url(${background})` }}>
    <BubbleEffects />
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="reflection-wavy-card" clipPathUnits="objectBoundingBox">
            <path d="M .03,.04 C .12,.005 .25,.03 .38,.01 C .51,-0.01 .64,.035 .77,.01 C .88,.005 .96,.025 .985,.07 C .995,.18 .975,.32 .99,.45 C 1.005,.58 .98,.72 .985,.85 C .975,.93 .93,.985 .84,.98 C .72,.995 .59,.965 .46,.99 C .33,.97 .21,.995 .09,.97 C .03,.96 .005,.915 .01,.82 C .02,.69 -.005,.55 .01,.42 C .025,.29 -.005,.16 .01,.08 C .015,.05 .025,.04 .03,.04 Z" />
          </clipPath>
        </defs>
      </svg>
    <div className="reflection-container">
      <button className="reflection-back" onClick={onBack}><ArrowLeft size={18} /> Kembali ke halaman utama</button>
      <section className="reflection-sheet" aria-labelledby="reflection-title">
        <header className="reflection-heading"><h1 id="reflection-title">REFLEKSI</h1><p>Yuk berikan pendapatmu setelah menggunakan website ini</p><span className="reflection-count" aria-live="polite">{count} dari 5 pernyataan terisi</span></header>
        <form onSubmit={submit}>
          <p className="reflection-instruction">Pilih satu jawaban yang paling sesuai dengan pendapatmu. Tidak ada jawaban benar atau salah.</p>
          <div className="reflection-questions">{statements.map((statement, index) => <fieldset key={statement} className="reflection-question">
            <legend><span className="reflection-number">{index + 1}</span>{statement}</legend>
            <div className="reflection-options">{options.map(({ label, Icon }) => <label key={label} className={`reflection-option ${data.answers[index] === label ? 'is-selected' : ''}`}>
              <input type="radio" name={`reflection-${index}`} value={label} checked={data.answers[index] === label} onChange={() => choose(index, label)} required />
              <Icon size={27} aria-hidden="true" /><span>{label}</span><Check className="reflection-option-check" size={15} aria-hidden="true" />
            </label>)}</div>
          </fieldset>)}</div>
          {reportError && <p className="reflection-error" role="alert">{reportError}</p>}{error && <p className="reflection-error" role="alert">{error}</p>}
          {data.submitted && <div className="reflection-success" role="status"><Check size={22} /><div><strong>Terima kasih sudah berbagi pendapat!</strong><p>Refleksimu sudah tersimpan.</p></div></div>}
          <footer className="reflection-footer"><p>{data.submitted ? 'Kamu bisa mengubah pilihan dan menyimpan kembali.' : 'Isi kelima pernyataan untuk menyimpan refleksimu.'}</p><button type="submit" disabled={count !== 5 || data.submitted}><Check size={18} />{data.submitted ? 'Refleksi tersimpan' : 'Simpan refleksi'}</button></footer>
        </form>
      </section>
    </div>
  </main>;
}
