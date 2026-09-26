export const reportModules = [
  ['mengenal-penyu', 'Mengenal Penyu'],
  ['ancaman-penyu', 'Ancaman Penyu'],
  ['peduli-lingkungan', 'Peduli Lingkungan'],
  ['aksi-peduli', 'Aksi Peduli'],
  ['refleksi', 'Refleksi Website'],
];

export function studentIdentity(name, studentClass) {
  return JSON.stringify([name, studentClass].map(value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('id')));
}

export function mergeStudentReports(students, reports) {
  const grouped = new Map();
  function student(name, studentClass) {
    const key = studentIdentity(name, studentClass);
    if (!grouped.has(key)) grouped.set(key, { key, name, studentClass, reports: {} });
    return grouped.get(key);
  }
  students.forEach(row => student(row.nama, row.kelas));
  reports.forEach(row => {
    const current = student(row.student_name, row.student_class);
    const previous = current.reports[row.module];
    if (!previous || row.updated_at > previous.updated_at || (row.id === previous.id && !row.pending)) current.reports[row.module] = row;
  });
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name, 'id'));
}

export function completedMissions(student) {
  const saved = student.reports.progress?.payload?.completed || [];
  return reportModules.slice(0, 4).filter(([id]) => saved.includes(id) || student.reports[id]?.payload?.completed).length;
}

export function csvCell(value) {
  const text = String(value ?? '');
  return `"${(/^[=+\-@\t\r]/.test(text) ? "'" : '') + text.replaceAll('"', '""')}"`;
}

export function reportsCsv(students) {
  const rows = [['Nama', 'Kelas', 'Bagian', 'Pertanyaan / aktivitas', 'Jawaban', 'Hasil', 'Diperbarui']];
  students.forEach(student => reportModules.forEach(([id, label]) => {
    const report = student.reports[id];
    const entries = report?.payload?.entries || [];
    if (!entries.length) rows.push([student.name, student.studentClass, label, '', 'Belum ada jawaban tersimpan', '', '']);
    entries.forEach(entry => rows.push([student.name, student.studentClass, label, entry.question, entry.answer || 'Belum dijawab', entry.correct === true ? 'Benar' : entry.correct === false ? 'Belum tepat' : '', report.updated_at]));
  }));
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
