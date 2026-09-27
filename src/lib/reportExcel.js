import { completedMissions, reportModules } from './reportModel.js';

export function classReports(students, studentClass) {
  return students.filter(student => !studentClass || student.studentClass === studentClass);
}

export async function reportsWorkbook(students) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SEATLE';
  workbook.created = new Date();
  function sheet(name, headers, widths) {
    const page = workbook.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
    page.columns = headers.map((header, index) => ({ header, width: widths[index] || 24 }));
    page.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    page.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF075985' } };
    page.getRow(1).height = 30;
    page.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
    return page;
  }
  const overview = sheet('Ringkasan kelas', ['Nama murid', 'Kelas', 'Misi tuntas', ...reportModules.map(([, label]) => label)], [26, 14, 16]);
  const pages = reportModules.map(([, label]) => sheet(label,
    ['Nama murid', 'Kelas', 'Status bagian', 'Pertanyaan / aktivitas', 'Jawaban', 'Hasil', 'Tanggal dokumentasi', 'Catatan', 'Dokumentasi', 'Diperbarui', 'Sinkronisasi'],
    [26, 14, 20, 52, 64, 18, 22, 40, 40, 26, 28]));
  students.forEach(student => {
    const statuses = reportModules.map(([id]) => {
      const report = student.reports[id];
      return student.reports.progress?.payload?.completed?.includes(id) || report?.payload?.completed
        ? 'Tuntas' : report?.payload?.submitted ? 'Tersimpan' : report ? 'Dalam proses' : 'Belum ada data';
    });
    overview.addRow([student.name, student.studentClass, `${completedMissions(student)}/4`, ...statuses]);
    reportModules.forEach(([id], index) => {
      const report = student.reports[id];
      const entries = report?.payload?.entries?.length ? report.payload.entries : [{ question: '', answer: 'Belum ada jawaban tersimpan' }];
      entries.forEach(entry => pages[index].addRow([
        student.name, student.studentClass, statuses[index], entry.question || '', entry.answer || 'Belum dijawab',
        entry.correct === true ? 'Benar' : entry.correct === false ? 'Belum tepat' : '',
        entry.date || '', entry.note || '', entry.image ? (/^https?:\/\//.test(entry.image) ? entry.image : 'Tersedia di dashboard guru') : '',
        report?.updated_at || '', report ? (report.pending ? 'Belum tersinkron' : 'Tersinkron') : '',
      ]));
    });
  });
  workbook.eachSheet(page => page.eachRow((row, number) => {
    row.alignment = { vertical: 'top', wrapText: true };
    if (number > 1 && number % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF8FF' } };
  }));
  return workbook;
}
