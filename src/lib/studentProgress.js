export const learningAspects = [
  'mengenal-penyu',
  'ancaman-penyu',
  'peduli-lingkungan',
  'aksi-peduli',
];

function progressKey() {
  return `seatle_progress_${JSON.stringify([
    sessionStorage.getItem('seatle_student_name') || 'Petualang',
    sessionStorage.getItem('seatle_student_class') || '-',
  ])}`;
}

export function getCompletedAspects() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey()) || '[]');
    return Array.isArray(saved)
      ? learningAspects.filter((aspect) => saved.includes(aspect))
      : [];
  } catch {
    return [];
  }
}

export function completeAspect(aspect) {
  if (!learningAspects.includes(aspect)) return;
  const completed = [...new Set([...getCompletedAspects(), aspect])];
  localStorage.setItem(progressKey(), JSON.stringify(completed));
}
