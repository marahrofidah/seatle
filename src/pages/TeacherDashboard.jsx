import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Compass, Download, FileText, LogOut, RefreshCw, Search, Users, Waves, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { importExistingReports, localReports, remoteReports, syncStudentReports } from '../lib/studentReports';
import { completedMissions, mergeStudentReports, reportModules, reportsCsv } from '../lib/reportModel';
import { withGalleryTimeout } from '../lib/galleryLoader';
import BubbleEffects from '../components/BubbleEffects';
import TeacherWave from '../components/TeacherWave';
import background from '../assets/images/tanpa_penyu.webp';
import './TeacherDashboard.css';

async function readStudents() {
  if (!supabase) return [];
  const rows = [];
  for (let start = 0; ; start += 500) {
    const { data, error } = await withGalleryTimeout(signal => supabase.from('students')
      .select('id,nama,kelas').order('id').range(start, start + 499).abortSignal(signal));
    if (error) throw new Error('Daftar murid online belum dapat dimuat.');
    rows.push(...data);
    if (data.length < 500) return rows;
  }
}

export default function TeacherDashboard({ teacherName, onExit }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [query, setQuery] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModule, setSelectedModule] = useState(0);
  const [revision, setRevision] = useState(0);
  const [updated, setUpdated] = useState('');
  const detail = useRef(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const messages = [];
      try { await importExistingReports(); } catch { messages.push('Sebagian jawaban lama di perangkat belum dapat dibaca.'); }
      let local = [];
      try {
        local = await localReports();
        if (active) setStudents(previous => mergeStudentReports(previous.map(item => ({ nama: item.name, kelas: item.studentClass })), local));
      } catch { messages.push('Rekap perangkat belum dapat dibaca.'); }
      try { await syncStudentReports(); local = await localReports(); } catch { messages.push('Ada jawaban perangkat ini yang belum tersinkron ke server.'); }
      const results = await Promise.allSettled([readStudents(), remoteReports()]);
      const roster = results[0].status === 'fulfilled' ? results[0].value : [];
      const remote = results[1].status === 'fulfilled' ? results[1].value : [];
      results.forEach(result => { if (result.status === 'rejected') messages.push(result.reason.message); });
      if (!active) return;
      setStudents(mergeStudentReports(roster, [...local, ...remote]));
      setWarnings(messages);
      setUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
    void load().catch(() => {
      if (active) { setWarnings(['Rekap belum dapat dimuat. Silakan coba lagi.']); setLoading(false); }
    });
    return () => { active = false; };
  }, [revision]);

  const classes = [...new Set(students.map(student => student.studentClass))].sort();
  const matching = students.filter(student => (!studentClass || student.studentClass === studentClass)
    && `${student.name} ${student.studentClass}`.toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id')));
  const activeStudent = students.find(student => student.key === selected);
  const complete = matching.filter(student => completedMissions(student) === 4).length;
  const reflected = matching.filter(student => student.reports.refleksi?.payload?.submitted).length;
  const filtered = matching.filter(student => statusFilter === 'all'
    || (statusFilter === 'complete' && completedMissions(student) === 4)
    || (statusFilter === 'ongoing' && completedMissions(student) < 4)
    || (statusFilter === 'reflection' && student.reports.refleksi?.payload?.submitted));
  const average = matching.length ? Math.round(matching.reduce((sum, student) => sum + completedMissions(student), 0) / (matching.length * 4) * 100) : 0;
  const summaries = [['all', Users, matching.length, 'Semua murid'], ['ongoing', Compass, matching.length - complete, 'Belum tuntas'], ['complete', Check, complete, 'Tuntas 4 misi'], ['reflection', FileText, reflected, 'Refleksi terkirim']];

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([reportsCsv(filtered)], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'rekap-jawaban-seatle.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function selectStudent(student, module = 0) {
    setSelected(student.key);
    setSelectedModule(module);
    requestAnimationFrame(() => { detail.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); detail.current?.focus({ preventScroll: true }); });
  }

  return <main className="teacher-page page-background" style={{ '--page-background': `url(${background})` }}>
    <BubbleEffects /><TeacherWave />
    <div className="teacher-container">
      <header className="teacher-header teacher-overview">
        <div className="teacher-topline"><span className="teacher-account">Guru: {teacherName || 'Guru SEATLE'}</span><button className="teacher-button teacher-white" onClick={onExit}><LogOut size={17} />Keluar</button></div>
        <div className="teacher-hero-content"><div><span className="teacher-eyebrow">RUANG GURU / SEATLE</span><h1>Setiap langkah kecil,<br />cerita belajar yang berarti.</h1><p>Temani perjalanan murid mengenal penyu<br className="teacher-desktop-break" /> hingga mengambil aksi untuk laut kita.</p></div>
          <div className="teacher-class-progress"><div className="teacher-ring" style={{ '--progress': `${average}%` }}><span><strong>{average}%</strong><small>rata-rata misi</small></span></div><div><strong>Perjalanan kelas</strong><p>{matching.length ? `${complete} dari ${matching.length} murid menuntaskan empat misi.` : 'Perjalanan dimulai saat data murid masuk.'}</p><span>Sesuai pencarian & kelas pilihan</span></div></div>
        </div>
        <div className="teacher-stats" aria-label="Saring murid berdasarkan status">{summaries.map(([id, Icon, count, label]) => <button key={id} aria-pressed={statusFilter === id} onClick={() => setStatusFilter(id)}><Icon size={20} /><strong>{count}</strong><span>{label}</span><ArrowUpRight className="teacher-stat-arrow" size={16} /></button>)}</div>
      </header>
      <section className="teacher-panel" aria-labelledby="teacher-roster-title">
        <div className="teacher-panel-heading"><div><h2 id="teacher-roster-title">Jejak Belajar Murid</h2><p>Dari dugaan awal hingga aksi nyata dan refleksi akhir.</p></div><div className="teacher-actions"><button className="teacher-button teacher-white" disabled={loading} onClick={() => { setLoading(true); setRevision(value => value + 1); }}><RefreshCw size={16} />{loading ? 'Memuat...' : 'Muat ulang'}</button><button className="teacher-button" disabled={!filtered.length} onClick={exportCsv}><Download size={16} />Unduh CSV</button></div></div>
        {warnings.length > 0 && <div className="teacher-warning" role="status">{warnings.map(message => <p key={message}>{message}</p>)}<p>Data yang belum diterima tidak dianggap sebagai jawaban kosong dari murid.</p></div>}
        <div className="teacher-filters"><label><span>Cari murid</span><div className="teacher-search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nama atau kelas" /></div></label><label><span>Kelas</span><select value={studentClass} onChange={event => setStudentClass(event.target.value)}><option value="">Semua kelas</option>{classes.map(label => <option key={label}>{label}</option>)}</select></label></div>
        <p className="teacher-meta" role="status">{loading ? 'Memuat rekap murid...' : `${filtered.length} murid ditampilkan · Diperbarui ${updated}`}</p>
        <div className="teacher-roster-caption"><span><i /> Tuntas</span><span><i /> Dalam proses</span><span><i /> Belum ada data</span><p>Klik misi untuk membaca jawaban</p></div>
        <div className="teacher-student-grid">{filtered.map(student => {
          const progress = completedMissions(student);
          return <article key={student.key} className={`teacher-student-card ${selected === student.key ? 'is-selected' : ''}`}>
            <div className="teacher-student-heading"><span className="teacher-avatar" aria-hidden="true">{student.name.trim().slice(0, 1).toLocaleUpperCase('id')}</span><div><h3>{student.name}</h3><p>Kelas {student.studentClass}</p></div><span className="teacher-student-count">{progress}<small>/4 misi</small></span></div>
            <div className="teacher-mission-track">{reportModules.slice(0, 4).map(([id, label], index) => {
              const done = student.reports.progress?.payload?.completed?.includes(id) || student.reports[id]?.payload?.completed;
              const state = done ? 'done' : student.reports[id] ? 'started' : 'empty';
              return <button key={id} className={`is-${state}`} onClick={() => selectStudent(student, index)} aria-label={`${label}: ${done ? 'Tuntas' : state === 'started' ? 'Dalam proses' : 'Belum ada data'}. Lihat jawaban`}><span>{done ? <Check size={17} /> : `0${index + 1}`}</span><small>{['Mengenal', 'Ancaman', 'Peduli', 'Aksi'][index]}</small></button>;
            })}</div>
            <div className="teacher-student-footer"><button className="teacher-reflection" onClick={() => selectStudent(student, 4)}><FileText size={15} /><span>Refleksi<strong>{student.reports.refleksi?.payload?.submitted ? 'Terkirim' : student.reports.refleksi ? 'Masih draf' : 'Belum ada data'}</strong></span></button><button className="teacher-open" onClick={() => selectStudent(student)}>Lihat rekap <ArrowUpRight size={17} /></button></div>
          </article>;
        })}</div>
        {!loading && !filtered.length && <div className="teacher-empty"><Waves size={32} /><h3>{students.length ? 'Murid tidak ditemukan' : 'Belum ada data murid yang diterima'}</h3><p>{students.length ? 'Coba nama atau kelas lainnya.' : 'Rekap akan tampil setelah murid masuk dan jawaban tersimpan.'}</p></div>}
        <p className="teacher-meta">Satu rekap per nama dan kelas. Status tuntas mengikuti tombol penyelesaian misi, bukan sekadar jawaban yang terisi.</p>
      </section>
      {activeStudent && <section ref={detail} tabIndex={-1} className="teacher-panel teacher-detail" aria-labelledby="teacher-detail-title"><div className="teacher-panel-heading"><div><span className="teacher-eyebrow">RINCIAN JAWABAN</span><h2 id="teacher-detail-title">{activeStudent.name}</h2><p>Kelas {activeStudent.studentClass} · {completedMissions(activeStudent)}/4 misi tuntas</p></div><button className="teacher-button teacher-white" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: 'instant' }); document.body.scrollTo({ top: 0, behavior: 'instant' }); }}><ArrowLeft size={16} />Daftar murid</button></div>
        {reportModules.map(([id, label], index) => <ModuleReport key={`${selected}:${selectedModule}:${id}`} report={activeStudent.reports[id]} label={label} number={index + 1} initiallyOpen={selectedModule === index} completed={activeStudent.reports.progress?.payload?.completed?.includes(id)} />)}
      </section>}
    </div>
  </main>;
}

function ModuleReport({ report, label, number, completed, initiallyOpen }) {
  const payload = report?.payload;
  const status = completed || payload?.completed ? 'Tuntas' : payload?.submitted ? 'Tersimpan' : report ? 'Dalam proses' : 'Belum ada data';
  return <details className="teacher-module" open={initiallyOpen}>
    <summary><span className="teacher-module-number">0{number}</span><h3>{label}</h3><span className={`teacher-badge ${status === 'Tuntas' || status === 'Tersimpan' ? 'is-done' : ''}`}>{status}</span><ChevronDown size={18} /></summary>
    <div className="teacher-module-body">{report ? <><p className="teacher-meta">{new Date(report.updated_at).toLocaleString('id-ID')}{report.pending ? ' · Salinan perangkat; belum tersinkron' : ' · Tersinkron'}</p><dl>{(payload.entries || []).map((entry, index) => <div className="teacher-answer" key={`${index}:${entry.question}`}><dt>{entry.question}</dt><dd>{entry.answer || <span className="teacher-unanswered">Belum ada jawaban tersimpan</span>}{typeof entry.correct === 'boolean' && <span className={`teacher-result ${entry.correct ? 'is-correct' : ''}`}>{entry.correct ? 'Benar' : 'Belum tepat'}</span>}{entry.date && <small>Tanggal dokumentasi: {entry.date}</small>}{entry.note && <small>{entry.note}</small>}{entry.image && <ReportImage src={entry.image} label={entry.question} />}</dd></div>)}</dl></> : <p className="teacher-unanswered">Belum ada jawaban yang diterima untuk bagian ini. Jawaban lama yang tidak pernah disimpan tidak dapat ditampilkan.</p>}</div>
  </details>;
}

function ReportImage({ src, label }) {
  const dialog = useRef(null);
  const valid = /^(data:image\/(jpeg|png|webp);base64,|https?:\/\/)/.test(src);
  if (!valid) return null;
  return <div className="teacher-photo"><button onClick={() => dialog.current.showModal()} aria-label={`Perbesar ${label}`}><img src={src} alt={label} loading="lazy" /><span>Lihat gambar</span></button><dialog ref={dialog} aria-label={label} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button onClick={() => dialog.current.close()} autoFocus><X size={18} />Tutup</button><img src={src} alt={label} /></dialog></div>;
}
