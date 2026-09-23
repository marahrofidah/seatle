import feelingImage0 from '../assets/images/sedih.png';
import feelingImage1 from '../assets/images/prihatin.png';
import feelingImage2 from '../assets/images/senang_ingin_membantu.png';
import feelingImage3 from '../assets/images/peduli.png';
import feelingImage4 from '../assets/images/terkejut.png';

export const feelings = [
  { id: 'sedih', image: feelingImage0, label: 'Sedih' },
  { id: 'prihatin', image: feelingImage1, label: 'Prihatin' },
  { id: 'senang', image: feelingImage2, label: 'Senang ingin membantu' },
  { id: 'peduli', image: feelingImage3, label: 'Peduli' },
  { id: 'terkejut', image: feelingImage4, label: 'Terkejut' },
];

export const statements = [
  'Saya merasa bertanggung jawab untuk menjaga kebersihan pantai dan laut.',
  'Saya bersedia mengurangi penggunaan plastik sekali pakai untuk membantu melindungi penyu laut.',
  'Saya akan mengingatkan orang lain agar tidak mengganggu penyu yang sedang bertelur.',
  'Saya tertarik mengikuti kegiatan yang mendukung pelestarian penyu dan lingkungan laut.',
  'Saya percaya bahwa tindakan kecil yang saya lakukan dapat membantu menjaga kelestarian penyu laut.',
];

export const agreementOptions = ['Sangat Setuju', 'Setuju', 'Kurang Setuju', 'Tidak Setuju'];
export const feedback = [
  'Terima kasih! Komitmen kecil yang dilakukan secara terus-menerus dapat memberikan manfaat besar bagi lingkungan.',
  'Terima kasih sudah berbagi pendapatmu. Perasaan peduli adalah langkah awal untuk menjaga lingkungan. Semoga kepedulianmu dapat diwujudkan melalui tindakan nyata.',
  'Terima kasih telah mengisi refleksi sikapmu. Kepedulian terhadap lingkungan dimulai dari cara kita berpikir, kemudian diwujudkan melalui tindakan nyata. Semoga setelah pembelajaran ini kamu semakin peduli terhadap penyu laut dan lingkungan di sekitarmu.',
];

export function emptyReflection() {
  return { action: '', purpose: '', feeling: '', reason: '', answers: {}, confirmed: [false, false, false], finished: false };
}

export function isStepComplete(data, step) {
  if (step === 0) return Boolean(data.action.trim() && data.purpose.trim());
  if (step === 1) return feelings.some(({ id }) => id === data.feeling) && Boolean(data.reason.trim());
  if (step === 2) return statements.every((_, index) => agreementOptions.includes(data.answers[index]));
  return false;
}

export function reflectionKey() {
  return `seatle_care_${JSON.stringify([
    sessionStorage.getItem('seatle_student_name') || 'Petualang',
    sessionStorage.getItem('seatle_student_class') || '-',
  ])}`;
}

export function loadReflection(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (!saved || saved.version !== 1) return emptyReflection();
    const result = emptyReflection();
    for (const field of ['action', 'purpose', 'feeling', 'reason']) {
      if (typeof saved[field] === 'string') result[field] = saved[field].slice(0, 400);
    }
    statements.forEach((_, index) => {
      if (agreementOptions.includes(saved.answers?.[index])) result.answers[index] = saved.answers[index];
    });
    result.confirmed = result.confirmed.map((_, index) => saved.confirmed?.[index] === true && isStepComplete(result, index));
    result.finished = saved.finished === true && result.confirmed.every(Boolean);
    return result;
  } catch {
    return emptyReflection();
  }
}
