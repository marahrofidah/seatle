import test from 'node:test';
import assert from 'node:assert/strict';
import { completedMissions, csvCell, mergeStudentReports, reportsCsv, studentIdentity } from './reportModel.js';

const row = (module, payload, extra = {}) => ({ id: 'one', student_name: 'PIDA', student_class: 'XII', module, payload, updated_at: '2026-09-25T10:00:00Z', ...extra });

test('repeated roster entries merge by normalized name and class', () => {
  const students = mergeStudentReports([{ nama: ' PIDA ', kelas: 'XII' }, { nama: 'pida', kelas: ' xii ' }], [row('refleksi', { submitted: true })]);
  assert.equal(students.length, 1);
  assert.equal(students[0].reports.refleksi.payload.submitted, true);
  assert.notEqual(studentIdentity('PIDA', 'XI'), students[0].key);
});

test('latest answer wins while other modules remain available', () => {
  const students = mergeStudentReports([], [row('refleksi', { entries: ['old'] }), row('mengenal-penyu', { entries: ['quiz'] }), row('refleksi', { entries: ['new'] }, { updated_at: '2026-09-26T10:00:00Z' })]);
  assert.deepEqual(students[0].reports.refleksi.payload.entries, ['new']);
  assert.deepEqual(students[0].reports['mengenal-penyu'].payload.entries, ['quiz']);
});

test('unsent newer answers remain visible when the server has an older copy', () => {
  const students = mergeStudentReports([], [row('refleksi', { submitted: false }, { id: 'new', pending: true, updated_at: '2026-09-26T10:00:00Z' }), row('refleksi', { submitted: true })]);
  assert.equal(students[0].reports.refleksi.pending, true);
  assert.equal(students[0].reports.refleksi.payload.submitted, false);
});

test('server acknowledgement clears the displayed pending flag for the same snapshot', () => {
  const students = mergeStudentReports([], [row('refleksi', {}, { pending: true }), row('refleksi', {})]);
  assert.equal(Boolean(students[0].reports.refleksi.pending), false);
});

test('partial responses do not count as completed missions', () => {
  const [student] = mergeStudentReports([], [row('mengenal-penyu', { submitted: true }), row('progress', { completed: ['ancaman-penyu', 'ancaman-penyu', 'refleksi'] })]);
  assert.equal(completedMissions(student), 1);
});

test('student without reports remains visible with zero completed missions', () => {
  const [student] = mergeStudentReports([{ nama: 'Naya', kelas: 'XI' }], []);
  assert.equal(completedMissions(student), 0);
  assert.deepEqual(student.reports, {});
});

test('CSV contains all five sections and escapes text and spreadsheet formulas', () => {
  const students = mergeStudentReports([], [row('refleksi', { entries: [{ question: 'Pendapat', answer: 'Setuju, "menarik"\nSekali' }] })]);
  const csv = reportsCsv(students);
  assert.match(csv, /Refleksi Website/);
  assert.match(csv, /Aksi Peduli/);
  assert.match(csv, /Belum ada jawaban tersimpan/);
  assert.ok(csv.includes('"Setuju, ""menarik""\nSekali"'));
  assert.equal(csvCell('=1+1'), '"\'=1+1"');
});
