import { supabase } from './supabase';
import { withGalleryTimeout } from './galleryLoader';
import { studentIdentity } from './reportModel';
import { readActionJournals } from './actionJournal';
import { actionReport, careReport, websiteReport } from './learningReportFormats';

function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('seatle-learning-reports', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('reports');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Rekap belum tersimpan di perangkat.'));
  });
}

export function currentStudent() {
  return { name: sessionStorage.getItem('seatle_student_name'), studentClass: sessionStorage.getItem('seatle_student_class') };
}

export async function localReports() {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reports');
    const request = tx.objectStore('reports').getAll();
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onabort = tx.onerror = () => { db.close(); reject(new Error('Rekap perangkat belum dapat dibaca.')); };
  });
}

export async function saveStudentReport(module, payload, identity = currentStudent()) {
  if (!identity.name || !identity.studentClass) return;
  const key = `${studentIdentity(identity.name, identity.studentClass)}:${module}`;
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reports', 'readwrite');
    const store = tx.objectStore('reports');
    const request = store.get(key);
    request.onsuccess = () => {
      if (JSON.stringify(request.result?.payload) === JSON.stringify(payload)) return;
      store.put({ id: crypto.randomUUID(), student_name: identity.name, student_class: identity.studentClass, module, payload, updated_at: new Date().toISOString(), pending: true }, key);
    };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = tx.onerror = () => { db.close(); reject(new Error('Rekap jawaban belum tersimpan. Periksa ruang penyimpanan perangkat.')); };
  });
}

async function markSynced(row) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reports', 'readwrite');
    const store = tx.objectStore('reports');
    const key = `${studentIdentity(row.student_name, row.student_class)}:${row.module}`;
    const request = store.get(key);
    request.onsuccess = () => { if (request.result?.id === row.id) store.put({ ...row, pending: false }, key); };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = tx.onerror = () => { db.close(); reject(new Error('Status rekap belum tersimpan.')); };
  });
}

let syncing;
export function syncStudentReports() {
  if (!supabase) return Promise.resolve();
  if (syncing) return syncing;
  syncing = (async () => {
    const rows = await localReports();
    for (const row of rows.filter(item => item.pending)) {
      const record = { id: row.id, student_name: row.student_name, student_class: row.student_class, module: row.module, payload: row.payload, updated_at: row.updated_at };
      const { error } = await withGalleryTimeout(signal => supabase.from('student_learning_reports').insert(record).abortSignal(signal));
      // A timed-out successful insert may be retried with the same UUID.
      if (error && error.code !== '23505') throw new Error('Rekap tersimpan di perangkat. Sinkronisasi ke guru belum tersedia.');
      await markSynced(row);
    }
  })().finally(() => { syncing = undefined; });
  return syncing;
}

export async function remoteReports() {
  if (!supabase) throw new Error('Rekap online belum terhubung.');
  const access = await withGalleryTimeout(signal => supabase.from('seatle_teachers').select('user_id').limit(1).abortSignal(signal));
  if (access.error) throw new Error('Penyimpanan rekap guru belum siap. Jalankan berkas supabase/teacher_reports_setup.sql di SQL Editor Supabase.');
  if (!access.data.length) throw new Error('Akun ini belum diberi akses rekap. Daftarkan akun guru melalui berkas pengaturan Supabase.');
  const result = [];
  for (let start = 0; ; start += 100) {
    const { data, error } = await withGalleryTimeout(signal => supabase.from('latest_student_learning_reports')
      .select('*').order('student_name').order('student_class').order('module').range(start, start + 99).abortSignal(signal));
    if (error) throw new Error(['PGRST205', '42P01'].includes(error.code)
      ? 'Penyimpanan rekap online belum disiapkan. Jalankan berkas supabase/teacher_reports_setup.sql di SQL Editor Supabase.'
      : 'Rekap online belum dapat dibaca. Periksa koneksi dan akses akun guru.');
    result.push(...data);
    if (data.length < 100) return result;
  }
}

export async function importExistingReports() {
  const existing = await localReports();
  const imported = new Set(existing.map(row => `${studentIdentity(row.student_name, row.student_class)}:${row.module}`));
  async function importOne(identity, module, payload) {
    const key = `${studentIdentity(...identity)}:${module}`;
    if (imported.has(key)) return;
    await saveStudentReport(module, payload, { name: identity[0], studentClass: identity[1] });
    imported.add(key);
  }
  for (const key of Object.keys(localStorage)) {
    const format = [
      ['seatle_care_', 'peduli-lingkungan', careReport],
      ['seatle_website_reflection:', 'refleksi', websiteReport],
      ['seatle_progress_', 'progress', completed => ({ completed })],
    ].find(([prefix]) => key.startsWith(prefix));
    if (!format) continue;
    let identity, data;
    try { identity = JSON.parse(key.slice(format[0].length)); data = JSON.parse(localStorage.getItem(key)); }
    catch { continue; }
    if (!Array.isArray(identity) || identity.length !== 2 || !data) continue;
    await importOne(identity, format[1], format[2](data));
  }
  for (const journal of await readActionJournals()) {
    let identity;
    try { identity = JSON.parse(journal.key.slice('action:'.length)); } catch { continue; }
    if (Array.isArray(identity) && identity.length === 2 && journal.data) await importOne(identity, 'aksi-peduli', actionReport(journal.data));
  }
}
