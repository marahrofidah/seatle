import test from 'node:test';
import assert from 'node:assert/strict';
import { classReports, reportsWorkbook } from './reportExcel.js';

test('class export includes every classmate and preserves answers in a real Excel workbook', async () => {
  const students = [
    { name: 'Siti', studentClass: '6A', reports: { refleksi: { payload: { submitted: true, entries: [{ question: 'Pendapat?', answer: '=1+1', note: 'Catatan lengkap' }] }, updated_at: '2026-09-27T00:00:00Z' } } },
    { name: 'Budi', studentClass: '6A', reports: {} },
    { name: 'Ayu', studentClass: '6B', reports: {} },
  ];
  const roster = classReports(students, '6A');
  assert.deepEqual(roster.map(student => student.name), ['Siti', 'Budi']);
  assert.equal(classReports(students, '').length, 3);
  const workbook = await reportsWorkbook(roster);
  const buffer = await workbook.xlsx.writeBuffer();
  assert.equal(buffer[0], 0x50);
  assert.equal(buffer[1], 0x4b);
  const { default: ExcelJS } = await import('exceljs');
  const restored = new ExcelJS.Workbook();
  await restored.xlsx.load(buffer);
  assert.equal(restored.worksheets.length, 6);
  assert.equal(restored.getWorksheet('Ringkasan kelas').rowCount, 3);
  assert.equal(restored.getWorksheet('Refleksi Website').getCell('E2').value, '=1+1');
  assert.equal(restored.getWorksheet('Refleksi Website').getCell('H2').value, 'Catatan lengkap');
  assert.equal(restored.getWorksheet('Mengenal Penyu').getCell('E3').value, 'Belum ada jawaban tersimpan');
});
