export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function nextJournalDay(data) {
  return Array.from({ length: 7 }, (_, i) => i + 1).find(day => !data.days[day]);
}

export function canDocument(data, day, now = new Date()) {
  const today = localDate(now);
  return Boolean(data.challenge) && day === nextJournalDay(data)
    && Object.values(data.days).every(entry => entry.savedOn && entry.savedOn < today);
}

// Older journals have no date metadata. Preserve their entries and start the
// daily limit on the day they are first opened after this upgrade.
export function dateLegacyEntries(data, now = new Date()) {
  return { ...data, days: Object.fromEntries(Object.entries(data.days).map(([day, entry]) =>
    [day, entry.savedOn ? entry : { ...entry, savedOn: localDate(now) }])) };
}
