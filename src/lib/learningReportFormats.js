import { statements, feelings } from './careReflection';
import { websiteStatements } from './websiteReflection';

export function careReport(data) {
  return { completed: data.finished === true, submitted: data.confirmed?.every(Boolean) || false, entries: [
    { question: 'Komitmen: tindakan yang ingin dilakukan', answer: data.action },
    { question: 'Tujuan komitmen', answer: data.purpose },
    { question: 'Perasaan terhadap kondisi penyu', answer: feelings.find(item => item.id === data.feeling)?.label || data.feeling },
    { question: 'Alasan perasaan', answer: data.reason },
    ...statements.map((question, index) => ({ question, answer: data.answers?.[index] || '' })),
  ] };
}

export function websiteReport(data) {
  return { submitted: data.submitted === true, entries: websiteStatements.map((question, index) => ({ question, answer: data.answers?.[index] || '' })) };
}

export function actionReport(data) {
  return { entries: [
    { question: 'Tantangan pilihan', answer: data.challenge },
    ...Array.from({ length: 7 }, (_, index) => {
      const entry = data.days?.[index + 1];
      return { question: `Dokumentasi hari ${index + 1}`, answer: entry?.caption || '', image: entry?.photo || '', date: entry?.savedOn || '' };
    }),
    { question: 'Poster kampanye', answer: data.poster ? `${data.poster.title} — ${data.poster.authors}` : '', image: data.poster?.image_url || '', note: data.poster?.syncStatus === 'pending' ? 'Pengiriman ke galeri online belum terkonfirmasi' : '' },
  ] };
}
