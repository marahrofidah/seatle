import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Compass, Download, FileText, LogOut, RefreshCw, Search, Trash2, Users, Waves, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { importExistingReports, purgeDeletedReports, localReports, remoteReports, syncStudentReports } from '../lib/studentReports';
import { completedMissions, mergeStudentReports, reportModules } from '../lib/reportModel';
import { deleteStudent, deletedIdentities, refreshDeletedStudents } from '../lib/studentDeletion';
import { classReports, reportsWorkbook } from '../lib/reportExcel';
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteNotice, setDeleteNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [query, setQuery] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModule, setSelectedModule] = useState(0);
  const [revision, setRevision] = useState(0);
  const [updated, setUpdated] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const detail = useRef(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const messages = [];
      try { await refreshDeletedStudents(); await purgeDeletedReports(); } catch (error) { messages.push(error.message); }
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
      setStudents(mergeStudentReports(roster, [...local, ...remote]).filter(student => !deletedIdentities().has(student.key)));
      setWarnings(messages);
      setUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
    void load().catch(() => {
      if (active) { setWarnings(['Rekap belum dapat dimuat. Silakan coba lagi.']); setLoading(false); }
    });
    return () => { active = false; };
  }, [revision]);

  // Refresh enrollment and report contents while the dashboard remains open.
  useEffect(() => {
    let active = true;
    let reading = false;
    async function refreshRoster() {
      if (reading || document.visibilityState === 'hidden') return;
      reading = true;
      try {
        const results = await Promise.allSettled([readStudents(), remoteReports()]);
        if (!active) return;
        const roster = results[0].status === 'fulfilled' ? results[0].value : null;
        const reports = results[1].status === 'fulfilled' ? results[1].value : [];
        setStudents(previous => mergeStudentReports(
          roster ?? previous.map(student => ({ nama: student.name, kelas: student.studentClass })),
          [...previous.flatMap(student => Object.values(student.reports)), ...reports],
        ).filter(student => !deletedIdentities().has(student.key)));
      } catch { /* The full dashboard loader displays connection errors. */ }
      finally { reading = false; }
    }
    void refreshRoster();
    const timer = window.setInterval(refreshRoster, 3000);
    window.addEventListener('focus', refreshRoster);
    window.addEventListener('online', refreshRoster);
    document.addEventListener('visibilitychange', refreshRoster);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshRoster);
      window.removeEventListener('online', refreshRoster);
      document.removeEventListener('visibilitychange', refreshRoster);
    };
  }, []);

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

  const exportStudents = classReports(students, studentClass);
  async function exportExcel() {
    setExporting(true);
    setExportError('');
    try {
      const workbook = await reportsWorkbook(exportStudents);
      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      const suffix = (studentClass || 'semua-kelas').replace(/[^a-zA-Z0-9_-]/g, '-');
      anchor.download = `rekap-seatle-${suffix}.xlsx`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError('File Excel belum berhasil dibuat. Silakan coba unduh lagi.');
    } finally {
      setExporting(false);
    }
  }

  function selectStudent(student, module = 0) {
    setSelected(student.key);
    setSelectedModule(module);
    requestAnimationFrame(() => { detail.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); detail.current?.focus({ preventScroll: true }); });
  }

  return <main className="teacher-page page-background" style={{ '--page-background': `url(${background})` }}>
    <BubbleEffects /><TeacherWave />
    {deleteTarget && <DeleteStudentDialog student={deleteTarget} busy={deleting} error={deleteError} onCancel={() => { if (!deleting) setDeleteTarget(null); }} onConfirm={async () => {
      setDeleting(true); setDeleteError('');
      try {
        await deleteStudent(deleteTarget.name, deleteTarget.studentClass);
        setStudents(previous => previous.filter(student => student.key !== deleteTarget.key));
        if (selected === deleteTarget.key) setSelected(null);
        setDeleteNotice(`Data ${deleteTarget.name}, kelas ${deleteTarget.studentClass}, telah dihapus.`);
        await purgeDeletedReports().catch(() => {});
        setDeleteTarget(null);
      } catch (error) { setDeleteError(error.message); }
      finally { setDeleting(false); }
    }} />}
    <div className="teacher-container">
      <div className="teacher-topline"><button className="teacher-button teacher-white" onClick={onExit}><LogOut size={17} />Keluar</button></div>
      <header className="teacher-header teacher-overview">
        <div className="teacher-hero-content"><div className="teacher-intro"><div className="teacher-title-row"><span className="teacher-account">Nama guru : <strong>{teacherName}</strong></span><h1>Ruang Guru</h1></div><p>Pantau progres dan jelajahi cerita belajar murid.</p></div>
          <div className="teacher-class-progress"><div className="teacher-ring" style={{ '--progress': `${average}%` }}><span><strong>{average}%</strong><small>rata-rata misi</small></span></div><div><strong>Perjalanan kelas</strong><p>{matching.length ? `${complete} dari ${matching.length} murid menuntaskan empat misi.` : 'Perjalanan dimulai saat data murid masuk.'}</p><span>Sesuai pencarian & kelas pilihan</span></div></div>
        </div>
        <div className="teacher-stats" aria-label="Saring murid berdasarkan status">{summaries.map(([id, Icon, count, label]) => <button key={id} aria-pressed={statusFilter === id} onClick={() => setStatusFilter(id)}><Icon size={20} /><strong>{count}</strong><span>{label}</span><ArrowUpRight className="teacher-stat-arrow" size={16} /></button>)}</div>
      </header>
      <section className="teacher-panel" aria-labelledby="teacher-roster-title">
        {deleteNotice && <p className="teacher-meta" role="status">{deleteNotice}</p>}
        <div className="teacher-panel-heading"><div><h2 id="teacher-roster-title">Jejak Belajar Murid</h2><p>Dari dugaan awal hingga aksi nyata dan refleksi akhir.</p></div><div className="teacher-actions"><button className="teacher-button teacher-white" disabled={loading} onClick={() => { setLoading(true); setRevision(value => value + 1); }}><RefreshCw size={16} />{loading ? 'Memuat...' : 'Muat ulang'}</button><button className="teacher-button" disabled={loading || exporting || !exportStudents.length} onClick={exportExcel}><Download size={16} />{exporting ? 'Menyiapkan Excel...' : 'Unduh Excel'}</button></div></div>
        <p className="teacher-meta">Excel berisi seluruh murid {studentClass ? `kelas ${studentClass}` : 'dari semua kelas'}, termasuk yang tidak tampil karena pencarian atau filter status.</p>
        {exportError && <p className="teacher-warning" role="alert">{exportError}</p>}
        {warnings.length > 0 && <div className="teacher-warning" role="status">{warnings.map(message => <p key={message}>{message}</p>)}<p>Data yang belum diterima tidak dianggap sebagai jawaban kosong dari murid.</p></div>}
        <div className="teacher-filters"><label><span>Cari murid</span><div className="teacher-search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nama atau kelas" /></div></label><ClassPicker classes={classes} selected={studentClass} onSelect={setStudentClass} /></div>
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
            <div className="teacher-delete-row"><button className="teacher-delete-button" disabled={loading || deleting} onClick={() => { setDeleteError(''); setDeleteTarget(student); }} aria-label={`Hapus data ${student.name}, kelas ${student.studentClass}`}><Trash2 size={15} />Hapus data murid</button></div>
          </article>;
        })}</div>
        {!loading && !filtered.length && <div className="teacher-empty"><Waves size={32} /><h3>{students.length ? 'Murid tidak ditemukan' : 'Belum ada data murid yang diterima'}</h3><p>{students.length ? 'Coba nama atau kelas lainnya.' : 'Murid akan tampil otomatis setelah berhasil masuk, meskipun belum mengerjakan misi.'}</p></div>}
      </section>
      {activeStudent && <section ref={detail} tabIndex={-1} className="teacher-panel teacher-detail" aria-labelledby="teacher-detail-title"><div className="teacher-panel-heading"><div><span className="teacher-eyebrow">RINCIAN JAWABAN</span><h2 id="teacher-detail-title">{activeStudent.name}</h2><p>Kelas {activeStudent.studentClass} · {completedMissions(activeStudent)}/4 misi tuntas</p></div><button className="teacher-button teacher-white" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: 'instant' }); document.body.scrollTo({ top: 0, behavior: 'instant' }); }}><ArrowLeft size={16} />Daftar murid</button></div>
        <div className="teacher-report-stream">
          <div className="teacher-section-picker">
            <div className="teacher-picker-top"><span><Compass size={17} /> JELAJAHI JAWABAN</span><span>{String(selectedModule + 1).padStart(2, '0')} / 05</span></div>
            <MissionPicker key={selected} selected={selectedModule} onSelect={setSelectedModule} />
            <div className="teacher-picker-bottom">
              <div className="teacher-section-markers" aria-label="Pilih nomor bagian">{reportModules.map(([id, label], index) => <button key={id} aria-label={`Buka ${label}`} aria-pressed={selectedModule === index} onClick={() => setSelectedModule(index)}>{index + 1}</button>)}</div>
              <div className="teacher-picker-arrows"><button aria-label="Bagian sebelumnya" disabled={selectedModule === 0} onClick={() => setSelectedModule(value => value - 1)}><ArrowLeft size={18} /></button><button aria-label="Bagian berikutnya" disabled={selectedModule === reportModules.length - 1} onClick={() => setSelectedModule(value => value + 1)}><ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button></div>
            </div>
          </div>
          <ModuleReport key={`${selected}:${selectedModule}`} report={activeStudent.reports[reportModules[selectedModule][0]]} label={reportModules[selectedModule][1]} completed={activeStudent.reports.progress?.payload?.completed?.includes(reportModules[selectedModule][0])} />
        </div>
      </section>}
    </div>
  </main>;
}

function DeleteStudentDialog({ student, busy, error, onCancel, onConfirm }) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="teacher-delete-dialog" aria-labelledby="delete-student-title" onCancel={event => { event.preventDefault(); onCancel(); }}>
    <h2 id="delete-student-title">Hapus data murid?</h2>
    <p className="teacher-delete-identity">{student.name}<span>Kelas {student.studentClass}</span></p>
    <p>Akun, progres, dan seluruh rekap jawaban murid ini akan dihapus permanen. Nama dan kelas ini tidak bisa digunakan kembali sampai diaktifkan oleh pengelola.</p>
    <p>Poster yang sudah dipublikasikan di galeri tidak ikut dihapus.</p>
    {error && <p role="alert" className="teacher-warning">{error}</p>}
    <div className="teacher-actions"><button autoFocus className="teacher-button teacher-white" disabled={busy} onClick={onCancel}>Batal</button><button className="teacher-button teacher-danger" disabled={busy} onClick={onConfirm}>{busy ? 'Menghapus...' : 'Ya, hapus data'}</button></div>
  </dialog>;
}

function ClassPicker({ classes, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const container = useRef(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!container.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);
  function close() { setOpen(false); trigger.current?.focus(); }
  return <div ref={container} className="teacher-class-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }}>
    <span id="teacher-class-label" className="teacher-class-label">Kelas</span>
    <button ref={trigger} className="teacher-mission-trigger" aria-labelledby="teacher-class-label teacher-class-value" aria-expanded={open} aria-controls="teacher-class-options" onClick={() => setOpen(value => !value)}><span id="teacher-class-value">{selected || 'Semua kelas'}</span><ChevronDown size={18} /></button>
    {open && <div id="teacher-class-options" className="teacher-mission-options" aria-label="Pilih kelas">{['', ...classes].map(value => <button key={value} aria-pressed={selected === value} onClick={() => { onSelect(value); close(); }}><span>{value || 'Semua kelas'}</span>{selected === value && <Check size={17} />}</button>)}</div>}
  </div>;
}

function MissionPicker({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const container = useRef(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!container.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);
  function close() { setOpen(false); trigger.current?.focus(); }
  return <div ref={container} className="teacher-mission-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }}>
    <button ref={trigger} className="teacher-mission-trigger" aria-expanded={open} aria-controls="teacher-mission-options" onClick={() => setOpen(value => !value)}><span>{reportModules[selected][1]}</span><ChevronDown size={18} /></button>
    {open && <div id="teacher-mission-options" className="teacher-mission-options" aria-label="Pilih bagian jawaban">{reportModules.map(([id, label], index) => <button key={id} aria-pressed={selected === index} onClick={() => { close(); onSelect(index); }}><span className="teacher-option-number">{String(index + 1).padStart(2, '0')}</span><span>{label}</span>{selected === index && <Check size={17} />}</button>)}</div>}
  </div>;
}

function reportStatus(report, completed) {
  return completed || report?.payload?.completed ? 'Tuntas' : report?.payload?.submitted ? 'Tersimpan' : report ? 'Dalam proses' : 'Belum ada data';
}

function ModuleReport({ report, label, completed }) {
  const payload = report?.payload;
  const status = reportStatus(report, completed);
  return <section className="teacher-module" aria-labelledby="teacher-chapter-title">
    <header className="teacher-chapter-heading"><h3 id="teacher-chapter-title">Catatan jawaban</h3><span className={`teacher-badge ${status === 'Tuntas' || status === 'Tersimpan' ? 'is-done' : ''}`}>{status}</span><span className="sr-only">{label}</span></header>
    <div className="teacher-module-body">{report ? <><p className="teacher-meta">{new Date(report.updated_at).toLocaleString('id-ID')}{report.pending ? ' · Salinan perangkat; belum tersinkron' : ' · Tersinkron'}</p><dl>{(payload.entries || []).map((entry, index) => <div className="teacher-answer" key={`${index}:${entry.question}`}><dt><span className="teacher-answer-number">{String(index + 1).padStart(2, '0')}</span><span>{entry.question}</span></dt><dd>{entry.answer || <span className="teacher-unanswered">Belum ada jawaban tersimpan</span>}{typeof entry.correct === 'boolean' && <span className={`teacher-result ${entry.correct ? 'is-correct' : ''}`}>{entry.correct ? 'Benar' : 'Belum tepat'}</span>}{entry.date && <small>Tanggal dokumentasi: {entry.date}</small>}{entry.note && <small>{entry.note}</small>}{entry.image && <ReportImage src={entry.image} label={entry.question} />}</dd></div>)}</dl></> : <div className="teacher-chapter-empty"><Waves size={36} /><h4>Belum ada jawaban di bagian ini</h4><p>Jawaban akan tampil setelah data murid diterima. Pilih bagian lain melalui menu di atas.</p></div>}</div>
  </section>;
}

function ReportImage({ src, label }) {
  const dialog = useRef(null);
  const valid = /^(data:image\/(jpeg|png|webp);base64,|https?:\/\/)/.test(src);
  if (!valid) return null;
  return <div className="teacher-photo"><button onClick={() => dialog.current.showModal()} aria-label={`Perbesar ${label}`}><img src={src} alt={label} loading="lazy" /><span>Lihat gambar</span></button><dialog ref={dialog} aria-label={label} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><button onClick={() => dialog.current.close()} autoFocus><X size={18} />Tutup</button><img src={src} alt={label} /></dialog></div>;
}
