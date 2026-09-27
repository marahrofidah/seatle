import { supabase } from './supabase';
import { withGalleryTimeout } from './galleryLoader';
import { studentIdentity } from './reportModel';
import { deleteStudentJournal } from './actionJournal';

const cacheKey = 'seatle_deleted_students';
export function deletedIdentities() {
  try { return new Set(JSON.parse(localStorage.getItem(cacheKey) || '[]')); }
  catch { return new Set(); }
}
export function rememberDeleted(name, studentClass) {
  const keys = deletedIdentities();
  keys.add(studentIdentity(name, studentClass));
  localStorage.setItem(cacheKey, JSON.stringify([...keys]));
}
async function clearDeviceAnswers(name, studentClass) {
  const identity = studentIdentity(name, studentClass);
  for (const key of Object.keys(localStorage)) {
    const prefix = ['seatle_care_', 'seatle_website_reflection:', 'seatle_progress_', 'seatle_activity:', 'seatle_registered_student:'].find(value => key.startsWith(value));
    if (!prefix) continue;
    try {
      let raw = key.slice(prefix.length);
      if (prefix === 'seatle_activity:') raw = raw.slice(0, raw.lastIndexOf(':'));
      if (prefix === 'seatle_registered_student:') raw = raw.slice(raw.indexOf('['));
      const pair = JSON.parse(raw);
      if (studentIdentity(...pair) === identity) localStorage.removeItem(key);
    } catch { /* Keep unrelated storage entries. */ }
  }
  await deleteStudentJournal(name, studentClass);
}
export async function refreshDeletedStudents() {
  if (!supabase) return;
  const keys = deletedIdentities();
  for (let start = 0; ; start += 500) {
    const { data, error } = await withGalleryTimeout(signal => supabase.from('seatle_deleted_students').select('student_name,student_class').order('student_name').order('student_class').range(start, start + 499).abortSignal(signal));
    if (error) {
      if (['42P01', 'PGRST205'].includes(error.code)) return;
      throw new Error('Daftar penghapusan murid belum dapat diperiksa. Coba muat ulang.');
    }
    data.forEach(row => keys.add(studentIdentity(row.student_name, row.student_class)));
    if (data.length < 500) break;
  }
  localStorage.setItem(cacheKey, JSON.stringify([...keys]));
}
export async function deleteStudent(name, studentClass) {
  if (!supabase) throw new Error('Penghapusan memerlukan koneksi ke Supabase.');
  const { error } = await withGalleryTimeout(signal => supabase.rpc('teacher_delete_student', { p_name: name, p_class: studentClass }).abortSignal(signal));
  if (error) {
    if (['PGRST202', '42883'].includes(error.code)) throw new Error('Aktifkan fitur hapus dengan menjalankan supabase/teacher_delete_student.sql di SQL Editor Supabase.');
    throw new Error('Penghapusan belum terkonfirmasi. Periksa koneksi dan akses guru, lalu coba lagi.');
  }
  rememberDeleted(name, studentClass);
  await clearDeviceAnswers(name, studentClass);
}

export async function isStudentDeleted(name, studentClass) {
  if (!name || !studentClass) return false;
  if (deletedIdentities().has(studentIdentity(name, studentClass))) {
    await clearDeviceAnswers(name, studentClass);
    return true;
  }
  if (!supabase) return false;
  const { data, error } = await withGalleryTimeout(signal => supabase.rpc('seatle_student_deleted', { p_name: name, p_class: studentClass }).abortSignal(signal));
  if (error) {
    if (['PGRST202', '42883'].includes(error.code)) return false;
    throw new Error('Status akun belum dapat diperiksa. Periksa koneksi lalu coba lagi.');
  }
  if (data === true) {
    rememberDeleted(name, studentClass);
    await clearDeviceAnswers(name, studentClass);
  }
  return data === true;
}
