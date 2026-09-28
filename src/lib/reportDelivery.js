import { studentIdentity } from './reportModel.js';

export async function deliverReport(module, payload, identity, { save, sync, read }) {
  await save(module, payload, identity);
  // An ongoing sync may have captured a draft before the final submission.
  await sync();
  await sync();
  const report = (await read()).find(row => row.module === module
    && studentIdentity(row.student_name, row.student_class) === studentIdentity(identity.name, identity.studentClass));
  if (!report || report.pending || JSON.stringify(report.payload) !== JSON.stringify(payload)) {
    throw new Error('Jawaban tersimpan di perangkat, tetapi belum terkirim ke guru. Coba kirim lagi.');
  }
}
